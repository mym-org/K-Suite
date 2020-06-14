import React from 'react';
import {message, Tabs} from 'antd';
import ImgAndText from "@/app/common/imgAndText";
import Groups from "./groups.js";
import Credentials from "./credentials";
import AccessibleRoutes from "./accessibleRoutes";
import PageTitleBar from "@/app/common/pageTitleBar";
import PageMake from "../../../common/pageMake";

const {TabPane} = Tabs;

export default class ConsumerDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeKey: "groups",
      $scope_parent_entity_data: '',//关联上级的数据
    }
  }

  componentDidMount() {
    this.getConsumerInfo()
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  getConsumerInfo = () => {
    const {httpAgent, match: {params: {id = ''}}} = this.props;

    httpAgent.kong({
      adminApi: `/consumers/${id}`,
      httpMethod: "GET",
    }).then(res => {
      const {resultCode = '', resultMessage = 'Failed', data = {}} = res
      if (resultCode === '000000') {
        this.setState({
          $scope_parent_entity_data: data
        })
      } else {
        message.error(resultMessage)
      }
    })
  }

  onChange = (key) => {
    this.setState({
      activeKey: key
    })
  }

  render() {
    const {activeKey, $scope_parent_entity_data} = this.state;

    return <div>
      <PageTitleBar title={`CONSUMER：${$scope_parent_entity_data.username}`}
                    desc={`<p><Link to='/consumers'>consumers </Link> / edit consumer</p>`}/>

      <Tabs activeKey={this.state.activeKey} onChange={this.onChange}>

        {/*GROUPS*/}
        <TabPane tab={<ImgAndText str='Groups' icoType='usergroup'/>} key="groups">
          {
            activeKey === 'groups' ?
              <Groups {...this.props} $scope_parent_entity_data={$scope_parent_entity_data}/> : null
          }
        </TabPane>

        {/*CREDENTIALS*/}
        <TabPane tab={<ImgAndText str='Credentials' icoType='dunpai'/>} key="credentials">
          {
            activeKey === 'credentials' ?
              <Credentials {...this.props} $scope_parent_entity_data={$scope_parent_entity_data}/> : null
          }
        </TabPane>

        {/*ACCESSIBLE ROUTES*/}
        {/* <TabPane tab={<ImgAndText str='Accessible Routes' icoType='yun'/>} key="routes">
          {
            activeKey === 'routes' ?
              <AccessibleRoutes {...this.props} $scope_parent_entity_data={$scope_parent_entity_data}/> : null
          }
        </TabPane> */}

        {/*PLUGINS*/}
        <TabPane tab={<ImgAndText str='Plugins' icoType='chatou'/>} key="plugins">
          {
            activeKey === 'plugins' ? <PageMake {...this.props} entityName='consumer.plugins'
                                                $scope_parent_entity_data={$scope_parent_entity_data}/> : null
          }
        </TabPane>

      </Tabs>
    </div>
  }
}
