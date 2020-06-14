import React from 'react'
import {Tabs, Icon, message} from 'antd';
import PageTitleBar from "@/app/common/pageTitleBar";
import css from './index.module.scss'
import PageMake from "@/app/common/pageMake";

const {TabPane} = Tabs;

export default class ServicesDetail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeKey: 'Routes',
      $scope_parent_entity_data: undefined
    }
  }

  componentDidMount() {
    const {id} = this.props.match.params
    this.props.httpAgent.kong({
      adminApi: `/services/${id}`,
      httpMethod: 'get',
    }).then(res => {
      const {resultCode, resultMessage, data} = res;
      if (resultCode === '000000') {
        this.setState({$scope_parent_entity_data: data})
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

    const {$scope_parent_entity_data, activeKey} = this.state;

    return (
      <div className={css.serviceTab}>
        <PageTitleBar title={`Services ${$scope_parent_entity_data && $scope_parent_entity_data.name}`}
                      desc={`<p><Link to='/services'>Service</Link> / show</p>`}/>
        <Tabs activeKey={activeKey} onChange={this.onChange} tabPosition="left">
          {/*ACCESSIBLE ROUTES*/}
          <TabPane tab={<span><Icon type="fork"/>Routes</span>} key="Routes">
            {
              activeKey === 'Routes' && $scope_parent_entity_data ?
                <PageMake {...this.props} entityName='service.routes'
                          $scope_parent_entity_data={$scope_parent_entity_data}/> : null
            }

          </TabPane>

          {/*PLUGINS*/}
          <TabPane tab={<span><Icon type="api"/>Plugins</span>} key="Plugins">
            {
              activeKey === 'Plugins' && $scope_parent_entity_data ?
                <PageMake {...this.props} entityName='service.plugins'
                          $scope_parent_entity_data={$scope_parent_entity_data}/> : null
            }

          </TabPane>

        </Tabs>
      </div>


    )
  }
}