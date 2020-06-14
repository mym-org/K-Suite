/**
 *
 * @param 1.editVisible 新增/编辑 Modal显示/隐藏
 * @param 2.close 关闭modal
 * @param 3.getData Function 刷新外层列表
 * @param 4.modalConfig:模态窗的配置，在修改时才会有
 * @param 5.pluginName 插件名称
 * @param 6.pluginId 插件关联id 修改必传
 * ---------------------
 * @param 7.type 新增/修改 add/edit 默认值edit
 * @param 8.version 插件版本 修改暂时不用传version
 *
 * 接口文档 https://note.youdao.com/ynoteshare1/index.html?id=97d3158de1a46a4bd5b1b5408fb7155d&type=note
 */

import React from 'react'
import css from './index.module.scss'
import {message, Modal, Form, Button, Icon, Input} from 'antd'
import SelectComponents from '../selectComponents/selectComponents'
import {inject, observer} from 'mobx-react';
import SelectConsumer from '../../common/selectConsumer';
import getDataWithKeys from "../funcs/getDataWithKeys";
import parsePathPram from "../funcs/parsePath";

const FormItem = Form.Item


@inject('commonStore')
@observer
class EditPlugin extends React.Component {
  state = {
    data: {}
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  componentDidMount() {
    const {pluginName, modalConfig, type, rowData} = this.props;
    const {httpAgent} = this.props.commonStore;

    type === 'add' ? this.getPlugin() :
      //修改需要走动态渲染表单接口 和 plugin详情接口 
      Promise.all([
        httpAgent.get(`/kong/suite/plugin/model/${pluginName}`),
        httpAgent.kong({
          adminApi: `/plugins/${getDataWithKeys(rowData, modalConfig.config && modalConfig.config.entityIdFieldName)}`,
          httpMethod: 'get',
        })
      ]).then(res => {
        res[1].data.config && res[0].data.fields.map(item => {
          //处理多层数据回显
          const keyArr = item.name.split('.');
          let value = res[1].data.config;

          if (keyArr.length === 1) {
            item.value = value[keyArr[0]]
          } else if (keyArr.length > 1) {
            for (const i of keyArr) {
              if (value[i] !== undefined) {
                value = value[i];
              } else {
                continue
              }
            }
            item.value = value;
          }

        })
        this.setState({
          data: {...res[0].data, ...res[1].data}
        })
      }).catch(err => {
        message.error(err)
      })
  }

  getPlugin = () => {
    const {pluginName} = this.props;
    const {httpAgent} = this.props.commonStore;

    httpAgent.get(`/kong/suite/plugin/model/${pluginName}`).then(res => {
      const {resultCode, resultMessage, data = {}} = res
      if (resultCode === '000000') {
        this.setState({data})
      } else {
        message.error(resultMessage)
      }
    })
  }


  //获取Switch的值
  changeStatus = (prop, val) => {
    this.props.form.setFieldsValue({[prop]: val})
  }
  submit = () => {
    const {
      form: {getFieldsValue}, getData, close, handleCancel,
      type = 'edit', pluginName, rowData, keywords
    } = this.props;

    const {
      methods: {
        add = {url: '', method: ''},
        update = {url: '', method: ''}
      }
    } = this.state.data;


    const {httpAgent} = this.props.commonStore;

    const requestBody = getFieldsValue();

    //处理数据
    for (let key in requestBody) {

      for (let k in requestBody[key]) {
        if (typeof requestBody[key][k] === 'undefined' ||
          (typeof requestBody[key][k] === 'string' && !requestBody[key][k].trim()) ||
          (requestBody[key][k] && Object.keys(requestBody[key][k]).length === 0 && requestBody[key][k].constructor === Object)
        ) {
          requestBody[key][k] = null
        } else if ((requestBody[key][k] && requestBody[key][k].length === 0 && requestBody[key][k].constructor === Array)) {
          requestBody[key][k] = []
        }
      }

      if (typeof requestBody[key] === 'undefined' ||
        (typeof requestBody[key] === 'string' && !requestBody[key].trim()) ||
        (requestBody[key] && Object.keys(requestBody[key]).length === 0 && requestBody[key].constructor === Object)
      ) {
        requestBody[key] = null
      } else if ((requestBody[key] && requestBody[key].length === 0 && requestBody[key].constructor === Array)) {
        requestBody[key] = []
      }
    }

    //特殊处理consumer
    if (requestBody.consumer && requestBody.consumer.id === null) {
      requestBody.consumer = null
    }

    const cb = () => {
      handleCancel && handleCancel()
      close && close()
      getData && getData(keywords)
    }
    //update plugin 老版本是 PATCH ，新版本是 PUT

    let adminApi = type === 'add' ? add.url : parsePathPram(rowData, update.url);

    httpAgent.kong({
      adminApi,
      httpMethod: type === 'edit' ? update.method : add.method,
      requestBody
    }).then(res => {
      const {resultCode, resultMessage} = res
      if (resultCode === '000000') {
        message.success(type === 'add' ? "Plugin added successfully" : 'Plugin updated successfully')
        cb()
      } else {
        message.error(resultMessage)
      }
    })

  }

  normalizeValue = (value, prevValue, prevValues, format_empty) => {
    // console.log(value, prevValue, prevValues, format_empty, '====')

    if (
      typeof value === 'undefined' ||
      (typeof value === 'string' && !value.trim()) ||
      (Object.keys(value).length === 0 && value.constructor === Object) ||
      (value && value.length === 0 && value.constructor === Array)
    ) {
      return format_empty === 'null' ? null :
        format_empty === 'empty_string' ? '' :
          format_empty === 'empty_array' ? [] :
            format_empty === 'remove_field' ? undefined : undefined
    }
    return value
  }

  render() {
    const {data} = this.state;

    const {
      editVisible, close, type, pluginName, form: {getFieldDecorator, setFieldsValue},
      modalConfig: {config = {}}, rowData, location: {pathname = ''}
    } = this.props;
    const formItemLayout = {
      style: {display: "flex", margin: '15px 0'},
      labelCol: {style: {width: "30%"}},
      wrapperCol: {style: {flex: 1}},
    };

    return (

      <Modal wrapClassName={css.pluginsModal}
             visible={editVisible}
             title={<span
               style={{color: '#1abb9c'}}>{type === 'add' ? 'ADD' : 'EDIT'} {pluginName.toUpperCase()}</span>}
             width={900}
             footer={null}
             onCancel={close}
             destroyOnClose
      >
        <div className={css.editPlugins}>
          {data.description ? <p className={css.desc} dangerouslySetInnerHTML={{__html: data.description}}></p> : null}

          <div className={css.form}>
            <FormItem>
              {
                getFieldDecorator('name', {
                  initialValue: pluginName,
                })(<Input type='hidden'/>)
              }
            </FormItem>

            {/*修改：consumers,services等下面的plugin时*/}
            {
              config && config.scopeToIdFieldName ?
                <FormItem>
                  {
                    getFieldDecorator(config.scopeToIdFieldName, {
                      initialValue: getDataWithKeys({...this.props, ...rowData}, config.id),
                    })(<Input type='hidden'/>)
                  }
                </FormItem> : null
            }


            {!data.no_consumer ? <FormItem
              {...formItemLayout}
              colon={false}
              label={<div style={{marginRight: 15}}>
                <strong style={{color: '#445862'}}>consumer</strong>
              </div>}
            >
              {
                getFieldDecorator(data.scopeToConsumerIdField ? data.scopeToConsumerIdField.name : 'consumer.id', {
                  initialValue: type === 'add' && pathname.indexOf('consumers') > -1 ?
                    getDataWithKeys({...this.props}, config.id) :
                    getDataWithKeys(data, data.scopeToConsumerIdField && data.scopeToConsumerIdField.name)
                })(<SelectConsumer {...this.props}/>)
              }

              <p style={{color: '#a6a6a6'}}>The CONSUMER ID that this plugin configuration will target. This value can
                only be used if authentication has been enabled so that the system can identify the user making the
                request. If left blank, the plugin will be applied to all consumers.</p>
            </FormItem> : null}


            {data.fields && data.fields.map(item => (
              <FormItem
                {...formItemLayout}
                colon={false}
                label={<div style={{marginRight: 15}}>
                  <strong style={{color: '#445862'}}>{item.name}</strong>
                  {item.restrict ? <p>({item.restrict})</p> : null}
                </div>}
                key={item.name}>
                {
                  getFieldDecorator('config.' + item.name, {
                    initialValue: item.value
                  })(
                    <SelectComponents data={item}
                                      change={item.component === 'Switch' ?
                                        (value) => this.changeStatus('config.' + item.name, value) :
                                        null}/>
                  )
                }
                <p style={{color: '#a6a6a6'}} dangerouslySetInnerHTML={{__html: item.help}}></p>
              </FormItem>


            ))}
            <FormItem {...formItemLayout} colon={false} label={<strong></strong>}>
              <Button onClick={this.submit}><Icon type="check"/> {type === 'add' ? 'ADD PLUGIN' : 'SUBMIT CHANGES'}
              </Button>
            </FormItem>

          </div>

        </div>


      </Modal>
    )
  }
}

export default Form.create()(EditPlugin)