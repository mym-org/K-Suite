import React from 'react'
import {Table, Icon, message, Input, Row, Col, Spin, Button, Modal, Tooltip, Switch} from 'antd';
import moment from 'moment'
import AddPlugins from '@/app/common/addPlugin'
import {Ico} from '@/ui'
import EditPlugin from "@/app/common/addPlugin/editPlugin";
import EyeWithCopy from "@/app/common/eyeWithCopy";


const {Search} = Input;
const {confirm} = Modal;

export default class Plugins extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      consumersList: [],//consumers列表
      total: 0,//总共条数
      pageNo: 1,
      pageSize: 20,
      spinning: false,//loading层
      addPluginModalVisible: false,//新增弹窗
      editVisible: false,//编辑弹窗
    }
  }

  columns = [
    {
      key: 'icon', width: 30,
      render: (text, data) => {
        return <img style={{height: '42px'}}
                    src={data.name ? require(`@/app/assets/images/plugins/${data.name}.png`) :
                      require(`@/app/assets/img/logo.png`)}></img>

      }
    },
    {
      key: 'switch', width: 30, dataIndex: 'enabled',
      render: (text, data) => {
        return <Switch checked={text} onChange={(val) => this.switchChange(val, data)}/>

      }
    },
    {
      key: 'view', width: 30,
      render: (text, data) => {
        return <EyeWithCopy data={data}/>
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'left',
      render: (text, data, index) =>
        <span className='clickAble primaryBlue'
              onClick={() => this.showModal('editVisible', data)}>{text}</span>
    },
    {
      title: 'Created', dataIndex: 'created_at', align: 'left',
      render: (text) => {
        return text ? moment(text).format("YYYY-MM-DD hh:mm:ss") : ''
      }
    },
    {
      title: '', key: 'action',
      render: (text, data, index) => <Ico className='icon-size20 delete' type="lajitong"
                                          onClick={() => this.handleDel(data)}/>
    },
  ]

  componentDidMount() {
    this.getPlugins()
  }

    //启用or禁用
    switchChange = (checked, data) => {
      const {httpAgent} = this.props;
  
      httpAgent.kong({
        adminApi: `/plugins/${data.id}`,
        httpMethod: "PATCH",
        requestBody: {enabled: checked}
      }).then((res) => {
        const {resultCode, resultMessage = ''} = res;
        if (resultCode === '000000') {
          this.getPlugins()
        } else {
          message.error(resultMessage)
        }
      })
    }

  // 查询列表
  getPlugins = (keywords) => {
    this.setState({spinning: true});
    const {pageSize, pageNo} = this.state;
    const {httpAgent, id, type} = this.props;

    //pageNo要转码以后传给后台
    httpAgent.kong({
      adminApi: `/${type}/${id}/plugins`, pageNo, pageSize, keywords,
    }, 'query').then(res => {
      this.setState({spinning: false});
      const {resultCode = '', resultMessage = 'Get list failed!', data = {}} = res
      if (resultCode === '000000') {
        this.setState({
          consumersList: data.results,
          total: data.count
        })
      } else {
        message.error(resultMessage)
      }
    })
  }

  // 打开模态窗
  showModal = (type, data) => {
    this.setState({
      [type]: true,
      rowData: data
    })
  }

  //隐藏模态窗
  hideModal = (type) => {
    this.setState({
      [type]: false,
    })
  }

  handleCancel = () => {
    this.setState({
      addPluginModalVisible: false,
    })
  }
  handleEditCancel = () => {
    this.setState({
      editVisible: false,
    })
  }


  // delete
  handleDel = (data) => {
    const {httpAgent, type, del_key} = this.props;
    const self = this;
    confirm({
      title: 'Do you want to delete this plugin?',
      onOk() {
        httpAgent.kong({
          adminApi: `/plugins/${data.id}`,
          httpMethod: "DELETE"
        }).then((res) => {
          const {resultCode, resultMessage = ''} = res;
          if (resultCode === '000000') {
            message.success('Delete Success!')
            self.getPlugins()
          } else {
            message.error(resultMessage)
          }
        })
      }
    });
  }


  onPageChange = (page, size) => {
    this.setState({pageNo: page}, () => {
      this.getPlugins()
    })
  }

  onPageSizeChange = (current, size) => {
    this.setState({pageNo: current, pageSize: size}, () => {
      this.getPlugins()
    })
  }


  render() {
    const {
      addPluginModalVisible, editVisible, rowData, consumersList,
      total, pageSize, pageNo, spinning
    } = this.state;

    const {httpAgent, id} = this.props;
    const tableProps = {
      dataSource: consumersList,
      columns: this.columns,
      rowKey: 'id',
      pagination: {
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
    }


    return (
      <Spin tip="Loading..." spinning={spinning}>

        <Row gutter={24}>
          <Col span={18}>
            <Button type="primary" onClick={() => this.showModal('addPluginModalVisible')}>
              <Icon type="plus"/>
              ADD NEW PLUGIN
            </Button>
          </Col>

          <Col span={6}>
            <Search placeholder="search..." onSearch={value => this.getPlugins(value)}/>
          </Col>
        </Row>

        <Table className='marT15' {...tableProps} />


        {/*添加plugin*/}
        {
          addPluginModalVisible ?
            <AddPlugins httpAgent={httpAgent} visible={addPluginModalVisible} handleCancel={this.handleCancel}
                        menuItem={this.props.type} id={id} getData={this.getPlugins} type="add"/> : null
        }

        {
          editVisible ?
            <EditPlugin httpAgent={httpAgent} editVisible={editVisible} close={this.handleEditCancel}
                        menuItem={this.props.type} pluginId={rowData.id} id={id} pluginName={rowData.name}/> : null
        }


      </Spin>
    )
  }
}
