import React from 'react'
import {Table, Icon, message, Input, Row, Col, Spin, Button, Modal, Switch} from 'antd';
import {inject, observer} from "mobx-react";
import {Link} from "react-router-dom";
import {Ico} from '@/ui';

import AddPlugin from '@/app/common/addPlugin';
import EditPlugin from "@/app/common/addPlugin/editPlugin";
import EyeWithCopy from "@/app/common/eyeWithCopy";
import PageTitleBar from "@/app/common/pageTitleBar";
import parsePathPram from "@/app/common/funcs/parsePath";
import getDataWithKeys from "@/app/common/funcs/getDataWithKeys";
import FormModal from "@/app/common/formModal";
import Funcs from './funcs'
import EntityListModal from "../entityListModal";

const {Search} = Input;
const {confirm} = Modal;

@inject('commonStore')
@observer
export default class PageMake extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],//列表
      keywords: '',//关键字

      total: 0,//总共条数
      pageNo: 1,
      pageSize: 20,
      spinning: false,//loading层

      pageData: {},//页面配置数据

      pluginsHubModal: false,//选择plugins的弹窗
      pluginUpModal: false,//编辑plugin时弹窗
      entityCreateUpdateModal: false,//普通的新增和修改

      modalConfig: {},//当前打开的模态窗的配置
      rowData: {},//当前操作行数据
    }
  }

  componentDidMount() {
    this.getPageConfig();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  //获取页面配置
  getPageConfig = () => {
    const {entityName = 'plugins'} = this.props;
    const {httpAgent} = this.props.commonStore;
    httpAgent.get(`/kong/suite/page/model/${entityName}`).then(res => {
      const {resultCode, resultMessage, data = {}} = res;
      if (resultCode === '000000') {
        this.setState({
          pageData: data
        }, () => {
          const {match={},match: {path = '', params: {id}}} = this.props;
          if (path.indexOf('apis') > 0 || path.indexOf('certificates') > 0) {
            this.getDataSource(id);
          } else {
            this.getDataSource();
          }

        });
        this.getColumns(data.columns)
      } else {
        message.error(resultMessage)
      }
    })
  }

  //处理列columns
  getColumns = (d = []) => {
    if (d.length === 0) {
      return
    }
    let columns = [];
    for (const row of d) {

      //一列的参数
      let obj = {
        title: row.title,
        align: row.align,
        width: row.width
      };

      //field该列只有一个数据，fields多多个数据，比如action，互斥存在
      if (row.field) {
        const self = this;
        //处理dataindex、单元格显示
        switch (row.field.type) {
          case 'normal':
            obj.dataIndex = row.field.fieldName;
            break;
          case 'icon':
            obj.key = 'icon';
            obj.render = function (text, rowData, index) {
              let imgPath = parsePathPram(rowData, row.field.config.src);
              return <img style={{height: row.field.config.height}}
                          src={imgPath ? require(`@/app/assets${imgPath}`) : require(`@/app/assets/img/logo.png`)}/>
            };
            break;
          case 'link':
            obj.dataIndex = row.field.fieldName;
            obj.render = function (text, rowData, index) {
              const linkUrl = parsePathPram(rowData, row.field.config.href);

              return text ? <Link to={linkUrl} target={row.field.config.target}>{text}</Link> :
                <span>{row.field.config.nullText || ''}</span>
            };
            break;
          case 'switch':
            obj.dataIndex = row.field.fieldName;
            obj.render = function (text, rowData, index) {
              return <Switch checked={text}
                             onChange={(val) =>
                               self.switchChange(val, rowData, row.field.config.action.url, row.field.config.action.method)
                             }/>
            };
            break;
          case 'format':
            obj.dataIndex = row.field.fieldName;
            obj.render = function (text, rowData, index) {
              return Funcs[row.field.config.method](rowData, row.field.fieldName)
            };
            break;
          case 'raw_view':
            obj.key = 'raw_view';
            obj.render = function (text, rowData, index) {
              return <EyeWithCopy data={rowData}/>
            };
            break;
          default:
            break;
        }

      } else if (row.fields) {
        //多存在于操作列
        const self = this;
        obj.key = 'action';
        obj.render = function (text, rowData, index) {

          return <div>
            {

              row.fields.map((item, key) => {

                if (item.type === 'action') {
                  //没有text就只显示图标
                  let btn;
                  switch (item.config.actionType) {
                    case "openModal":
                      btn = item.config.text ?
                        <span key={key} className='detail marR15'
                              onClick={() => self.showModal(item.config.modal, rowData)}>
                          <Ico type={item.config.icon}
                               className='detail icon-size20'/>{item.config.text.toUpperCase()}
                        </span> :
                        <Ico key={key} type={item.config.icon} className='detail marR15 icon-size20'
                             onClick={() => self.showModal(item.config.modal, rowData)}/>;
                      break;
                    case "callAPI":
                      btn = item.config.text ?
                        <span key={key} className='detail marR15'
                              onClick={() => self.callType(rowData, item.config.api.url, item.config.api.method, item.config.confirm)}>
                          <Ico className='icon-size20 delete' type={item.config.icon}/>{item.config.text.toUpperCase()}
                        </span> :
                        <Ico key={key} className='icon-size20 delete' type={item.config.icon}
                             onClick={() => self.callType(rowData, item.config.api.url, item.config.api.method, item.config.confirm)}/>
                      break;
                    default:
                      break;

                  }
                  return btn

                }

              })
            }
          </div>

        }


      }

      columns.push(obj);
    }

    return columns;
  };

  // 查询列表
  getDataSource = (keywords) => {
    this.setState({spinning: true});

    const {pageSize, pageNo, pageData: {listByPage: {url = '', searchTarget = ''}}} = this.state;

    const {httpAgent} = this.props.commonStore;
    //上级模块的数据
    // console.log(this.props, '接收的上级值');
    const api = parsePathPram(this.props, url) || url;

    //pageNo要转码以后传给后台
    httpAgent.kong({adminApi: api, pageNo, pageSize, keywords, searchTarget}, 'query')
      .then(res => {
        this.setState({spinning: false});
        const {resultCode = '', resultMessage = 'Get list failed!', data = {}} = res
        if (resultCode === '000000') {
          this.setState({
            dataSource: data.results,
            total: data.count
          })
        } else {
          message.error(resultMessage)
        }
      })
  }

  //启用or禁用
  switchChange = (checked, data, url, httpMethod) => {
    const {httpAgent} = this.props.commonStore;

    const api = parsePathPram(data, url);

    httpAgent.kong({
      adminApi: api,
      httpMethod,
      requestBody: {enabled: checked}
    }).then((res) => {
      const {resultCode, resultMessage = ''} = res;
      const {keywords}=this.state;
      if (resultCode === '000000') {
        this.getDataSource(keywords)
      } else {
        message.error(resultMessage)
      }
    })
  }

  // 打开模态窗
  showModal = (modalConfig, data) => {
    this.setState({
      [modalConfig.name]: true,
      modalConfig,
      rowData: data
    })
  }


  //关闭选择plugin的弹窗
  handleCancel = () => {
    this.setState({
      pluginsHubModal: false,
    })
  }

  //关闭编辑plugin的弹窗
  handleEditCancel = () => {
    this.setState({
      pluginUpModal: false,
    })
  }
  //关闭普通新增编辑弹窗
  hideCreateUpdateModal = () => {
    this.setState({
      entityCreateUpdateModal: false,
    })
  }
  //关闭普通新增编辑弹窗
  hideEntityListModal = () => {
    this.setState({
      entityListModal: false,
    })
  }


  // 点击按钮请求接口时的形式，是否需要弹窗
  callType = (data, url, method, confirmText) => {
    const self = this;
    confirmText ? confirm({
      title: confirmText,
      onOk() {
        self.callAPI(data, url, method)
      }
    }) : this.callAPI(data, url, method)
  }

  //请求接口
  callAPI = (data, url, method) => {
    const {httpAgent} = this.props.commonStore;
    const self = this;
    const adminApi = parsePathPram(data, url);
    const {keywords} = this.state;

    httpAgent.kong({
      adminApi,
      httpMethod: method
    }).then((res) => {
      const {resultCode, resultMessage = ''} = res;
      if (resultCode === '000000') {
        message.success('Success!')
        self.getDataSource(keywords);
      } else {
        message.error(resultMessage)
      }
    })
  }


  //查询关键字

  keywordsChange = (val) => {
    this.setState({
      keywords: val.target.value
    })
  }
  onPageChange = (page, size) => {
    const {keywords}=this.state;
    this.setState({pageNo: page}, () => {
      this.getDataSource(keywords)
    })
  }

  onPageSizeChange = (current, size) => {
    const {keywords}=this.state;
    this.setState({pageNo: current, pageSize: size}, () => {
      this.getDataSource(keywords)
    })
  }


  render() {
    const {
      pluginsHubModal, pluginUpModal, entityCreateUpdateModal, entityListModal, rowData, modalConfig,
      dataSource, total, pageSize, pageNo, spinning, pageData,keywords
    } = this.state;

    const {$scope_parent_entity_data} = this.props;

    const tableProps = {
      dataSource: dataSource,
      columns: this.getColumns(pageData.columns || []),
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
    };


    return (
      <Spin tip="Loading..." spinning={spinning}>

        {
          pageData.showPageTitleBar ?
            <PageTitleBar title={pageData.name} desc={pageData.description}/> : null
        }


        <Row gutter={24}>
          <Col span={18}>
            {
              pageData.buttons && pageData.buttons.map((item, key) => {
                let btn;
                const self = this;
                switch (item.actionType) {
                  case 'openModal':
                    btn = <Button key={key} type="primary" onClick={() => self.showModal(item.modal)}>
                      <Icon type={item.icon}/>{item.text}
                    </Button>;
                    break;
                  case 'openLink':
                    btn = <Link to={item.link.href} key={key} target={item.link.target}>
                      <Icon type={item.icon}/> {item.text.toUpperCase()}
                    </Link>;
                    break;
                  default:
                    break;
                }
                return btn;
              })

            }

          </Col>

          {
            pageData.listByPage && pageData.listByPage.showByKeywords ? <Col span={6}>
              <Search placeholder="search..." onSearch={value => this.getDataSource(value)}
                      onChange={this.keywordsChange}/>
            </Col> : null
          }

        </Row>

        <Table className='marT15' {...tableProps} />


        {/*添加plugin*/}
        {
          pluginsHubModal ?
            <AddPlugin {...this.props} visible={pluginsHubModal} handleCancel={this.handleCancel}
                       getData={this.getDataSource} keywords={keywords}
                       modalConfig={modalConfig}
                       type={modalConfig.config.editable ? 'edit' : 'add'}/> : null
        }

        {/*编辑plugin*/}
        {
          pluginUpModal ?
            <EditPlugin {...this.props} editVisible={pluginUpModal} close={this.handleEditCancel} modalConfig={modalConfig}
                        rowData={rowData} keywords={keywords}
                        getData={this.getDataSource}
                        pluginName={rowData.name}/> : null
        }

        {/* 普通的新增和修改*/}

        {
          entityCreateUpdateModal ?
            <FormModal visible={entityCreateUpdateModal}
                       modalConfig={modalConfig}
                       $scope_parent_entity_data={$scope_parent_entity_data}
                       rowData={rowData} keywords={keywords}
                       close={this.hideCreateUpdateModal}
                       getData={this.getDataSource}/> : null
        }
        {
          entityListModal ?
            <EntityListModal {...this.props} visible={entityListModal}
                             modalConfig={modalConfig}
                             $scope_parent_entity_data={$scope_parent_entity_data}
                             rowData={rowData} keywords={keywords}
                             close={this.hideEntityListModal}
                             getData={this.getDataSource}/> : null
        }


      </Spin>
    )
  }
}