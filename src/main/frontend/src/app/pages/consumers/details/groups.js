import React from 'react';
import {Button, Icon, Card, Row, Col, message, Input, Modal} from 'antd';
import FormModal from "@/app/common/formModal";

const {Search} = Input;
const {confirm} = Modal;

export default class Groups extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      keywords: '',
      groupList: [],//groups列表
      total: 0,//总共条数
      pageNo: 1,
      pageSize: 20,
      spinning: false,//loading层

      visible: false,//新增组

    }
  }

  componentDidMount() {
    this.getGroups()
  }

  // 查询列表
  getGroups = (keywords) => {
    this.setState({spinning: true});
    const {httpAgent, match: {params: {id = ''}}} = this.props;

    const {pageSize, pageNo} = this.state;

    //pageNo要转码以后传给后台
    httpAgent.kong({
      adminApi: `/consumers/${id}/acls`, pageNo, pageSize, keywords,
      searchTarget: 'ACLS'
    }, 'query').then(res => {
      this.setState({spinning: false});
      const {resultCode = '', resultMessage = '获取groups列表出现错误', data = {}} = res
      if (resultCode === '000000') {
        this.setState({
          groupList: data.results,
          total: data.count
        })
      } else {
        message.error(resultMessage)
      }
    })
  }


  //显示弹窗
  showModal = () => {
    this.setState({
      visible: true
    })
  }

  //隐藏弹窗
  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  //点击删除组
  handleDel = (data) => {
    const {httpAgent, match: {params: {id = ''}}} = this.props;
    const {keywords} = this.state;
    const self = this;
    confirm({
      title: 'Do you want to delete this group?',
      onOk() {
        httpAgent.kong({
          adminApi: `/consumers/${id}/acls/${data.id}`,
          httpMethod: "DELETE"
        }).then((res) => {
          const {resultCode, resultMessage = ''} = res;
          if (resultCode === '000000') {
            message.success('Delete Success!');
            self.getGroups(keywords);
          } else {
            message.error(resultMessage)
          }
        })
      }
    });
  }

  keywordsChange = (val) => {
    this.setState({
      keywords: val.target.value
    })
  }


  onPageChange = (page, size) => {
    this.setState({pageNo: page}, () => {
      this.getConsumers()
    })
  }

  onPageSizeChange = (current, size) => {
    this.setState({pageNo: current, pageSize: size}, () => {
      this.getConsumers()
    })
  }


  render() {

    const {groupList, visible, pageNo, pageSize, total} = this.state;
    const {httpAgent, match: {params: {id = ''}}, $scope_parent_entity_data = {}} = this.props;

    const modalConfig = {
      "name": "entityCreateUpdateModal",
      "modalName": "group",
      "config": {
        "entityName": "acls"
      }
    }

    const pagination = {
      current: pageNo,
      pageSize: pageSize,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '50', '100'],
      total: total,
      showTotal: (total) => `共${total}条`,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange
    }
    return <div>

      <Row gutter={24}>
        <Col span={6} push={18}>
          <Search placeholder="search..." onSearch={value => this.getGroups(value)}
                  onChange={this.keywordsChange}/>
        </Col>
      </Row>

      <Row gutter={24} className='marT15'>

        {
          groupList.map((item, index) =>
            <Col span={6} key={index} className='marB15'>

              <Card size='small'>
                <Icon type='team' className='icon-size20'/>
                <span className='marl10'>{item.group}</span>
                <Icon type='close' className='icon-size20 flr clickAble' onClick={() => this.handleDel(item)}/>
              </Card>

            </Col>
          )
        }

        <Col span={6}>
          <Button type="dashed" size='large' onClick={this.showModal}
                  style={{width: '100%', height: '49px'}}>
            <Icon type="plus"/> Add a group
          </Button>
        </Col>

      </Row>

      {
        visible ?
          <FormModal getData={this.getGroups} visible={visible}
                     modalConfig={modalConfig} $scope_parent_entity_data={$scope_parent_entity_data}
                     close={this.hideModal}/> : null
      }
    </div>

  }
}
