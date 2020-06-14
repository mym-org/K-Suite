/**
 *
 * @param 1.visible 新增/编辑 Modal显示/隐藏
 * @param 2.modalConfig:模态窗配置信息
 * @param 3.rowData,修改必传
 * @param 4.close 关闭modal
 * @param 5.getData Function 刷新外层列表
 * @param 6.$scope_parent_entity_data  关联上级的数据
 *
 */

import React from 'react'
import css from './index.module.scss'
import {message, Modal, Form, Button, Icon, Col, Row} from 'antd'
import SelectComponents from '../selectComponents/selectComponents'
import {inject, observer} from 'mobx-react';
import TwoStairsLabel from "../twoStairsLabel";
import parsePathPram from "../funcs/parsePath";


@inject('commonStore')
@observer
class FormModal extends React.Component {
  state = {
    data: {},//form上要渲染的数据
    rowData: {},//当前操作的目标原数据
    loading: false,
    maxHeight: undefined,//弹窗最大高
  }

  componentDidMount() {
    //动态计算添加弹窗的固定高
    const clientHeight = document.body.clientHeight;
    this.setState({
      maxHeight: clientHeight - 200
    });

    const {modalConfig = {}} = this.props;
    modalConfig.config && modalConfig.config.editable ? this.getFormAndData() : this.getForm();
  }

  getForm = () => {
    const {modalConfig = {}} = this.props;
    const {httpAgent} = this.props.commonStore;
    const entityName = modalConfig.config && modalConfig.config.entityName;

    httpAgent.get(`/kong/suite/entity/model/${entityName}`).then(res => {
      const {resultCode, resultMessage, data = {}} = res;
      if (resultCode === '000000') {
        this.setState({data})
      } else {
        message.error(resultMessage)
      }
    })
  }

  //编辑时的弹窗
  getFormAndData = () => {
    const {
      modalConfig: {config = {}, config: {entityName = '', loadAPI = {url: ''}}},
      rowData
    } = this.props;
    const {httpAgent} = this.props.commonStore;

    Promise.all([
      httpAgent.get(`/kong/suite/entity/model/${entityName}`),
      httpAgent.kong({
        adminApi: parsePathPram({...config, ...rowData}, loadAPI.url),
        httpMethod: 'get',
      })
    ]).then(res => {
      if (res[0].resultCode === '000000' && res[1].resultCode === '000000') {
        if (typeof res[0].data !== 'undefined' && typeof res[1].data !== 'undefined') {

          res[0].data.fields && res[0].data.fields.map(item => {

            //处理多层数据回显
            const keyArr = item.name.split('.');
            let value = res[1].data;

            for (const i of keyArr) {
              value = value[i]
            }
            item.value = value
          });

          this.setState({
            data: res[0].data,
            rowData: res[1].data
          })
        }
      } else {
        message.error(res[0].resultCode !== '000000' ? res[0].resultMessage : res[1].resultMessage)
      }

    })
  }


  //获取Switch的值
  changeStatus = (prop, val) => {
    this.props.form.setFieldsValue({[prop]: val})
  }

  submit = () => {
    this.setState({loading: true});
    const {
      form: {getFieldsValue}, commonStore: {httpAgent}, keywords,
      modalConfig: {config: {entityName = '', editable}}
    } = this.props;

    const requestBody = getFieldsValue();

    //格式化值
    for (let key in requestBody) {
      if (typeof requestBody[key] === 'undefined' ||
        (typeof requestBody[key] === 'string' && !requestBody[key].trim()) ||
        (requestBody[key] && Object.keys(requestBody[key]).length === 0 && requestBody[key].constructor === Object)
      ) {
        requestBody[key] = null
      } else if ((requestBody[key] && requestBody[key].length === 0 && requestBody[key].constructor === Array)) {
        requestBody[key] = []
      }
    }

    //update plugin 老版本是 PATCH ，新版本是 PUT
    const {
      rowData, data: {
        methods: {
          add = {url: '', method: ''},
          update = {url: '', method: ''}
        }
      }
    } = this.state;

    let adminApi = parsePathPram({...this.props, ...rowData}, editable ? update.url : add.url);

    httpAgent.kong({
      adminApi: adminApi,
      httpMethod: editable ? update.method : add.method,
      requestBody
    }).then(res => {
      this.setState({loading: false});
      const {resultCode, resultMessage} = res;

      if (resultCode === '000000') {

        //用来特殊处理oauth2
        if (update.next && editable) {
          const {method = '', url = ''} = update.next;
          httpAgent.kong({
            adminApi: parsePathPram({...this.props, ...rowData}, url),
            httpMethod: method,
            requestBody
          }).then(res => {
            if (res.resultCode === '000000') {
            } else {
              message.error(res.resultMessage);
            }
          })
        }

        message.success('Successfully');
        this.props.getData && this.props.getData(keywords)
        this.props.close && this.props.close()
      } else {
        message.error(resultMessage)
      }
    })

  }

  normalizeValue = (value, prevValue, prevValues, format_empty) => {
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
    const {data, maxHeight} = this.state;
    const {
      visible, close, form: {getFieldDecorator}, onlyForm, hideTitle,
      modalConfig = {}
    } = this.props;
    const modalContent = <div className={css.editPlugins}>
      {
        data.description && !hideTitle ?
          <p className={css.desc} dangerouslySetInnerHTML={{__html: data.description}}></p> : null
      }

      <div className={css.form}>

        <Row gutter={24}>
          {
            data.fields && data.fields.map((item, key) => (
              item.component !== 'InputHidden' ?
                <Form.Item key={key}>
                  <Row gutter={24}>

                    <Col span={6}>
                      <TwoStairsLabel firstText={item.name} secondText={item.restrict}/>
                    </Col>

                    <Col span={18}>
                      {getFieldDecorator(item.name, {
                        initialValue: item.value
                      })(
                        <SelectComponents data={item}
                                          change={item.component === 'Switch' ?
                                            (value) => this.changeStatus(item.name, value) : null
                                          }
                        />
                      )}

                      <p className='grey-text' dangerouslySetInnerHTML={{__html: item.help}}></p>
                    </Col>
                  </Row>
                </Form.Item>
                :
                <Form.Item key={key}>
                  {getFieldDecorator(item.name, {
                    initialValue: item.value
                  })(
                    <SelectComponents data={item}/>
                  )}
                </Form.Item>

            ))
          }

          <Col span={18} push={6}>
            <Button onClick={this.submit} loading={this.state.loading}>
              <Icon type="check"/>
              {
                modalConfig.config && modalConfig.config.editable ?
                  'SUBMIT CHANGES' :
                  `ADD ${modalConfig.modalName && modalConfig.modalName.toUpperCase()}`
              }
            </Button>
          </Col>
        </Row>

      </div>

    </div>

    return (
      onlyForm ? modalContent :
        <Modal wrapClassName={css.pluginsModal}
               visible={visible}
               title={
                 <span style={{color: '#1abb9c'}}>
                {modalConfig.config && modalConfig.config.editable ? 'EDIT ' : 'ADD '}
                   {modalConfig.modalName && modalConfig.modalName.toUpperCase()}
               </span>
               }
               width={900}
               bodyStyle={{maxHeight: maxHeight, overflowY: 'scroll'}}
               footer={null}
               onCancel={close}
               destroyOnClose>
          {modalContent}
        </Modal>
    )
  }
}

export default Form.create()(FormModal)