/**
 *
 * @param visible Modal显示/隐藏
 * @param id 对应id
 * @param handleCancel 关闭Modal
 * @param modalConfig: {config = {}},
 * @param rowData: {config = {}},
 *
 */

import React from 'react'
import css from './index.module.scss'
import EditPlugin from './editPlugin'
import {message, Modal, Spin} from 'antd'
import {inject, observer} from "mobx-react";
import getDataWithKeys from "../funcs/getDataWithKeys";

@inject('commonStore')
@observer
export default class PluginsList extends React.Component {

  state = {
    list: [],//分类
    pluginsList: [],//当前分类列表
    current: {},//当前选择分类
    pluginName: '',//当前plugin名称
    version: '',//当前插件版本
  }

  componentDidMount() {
    this.getList()
  }

  // 1. 获取plugin分类  http://localhost:8080/api/v1.0.0/kong/suite/plugin/functionality/list
  // 2. 按分类获取Plugins:  http://localhost:8080/api/v1.0.0/kong/suite/plugin/list/{name} 

  getList = () => {
    const {httpAgent} = this.props.commonStore;

    httpAgent.get('/kong/suite/plugin/functionality/list').then(res => {
      const {resultCode, resultMessage, data = [{}]} = res
      if (resultCode === '000000') {
        this.setState({list: data, current: data[0]})
        this.getPlugins(data[0].name)
      } else {
        message.error(resultMessage)
      }
    })
  }

  getPlugins = (functionality) => {
    this.setState({loading: true})
    const {modalConfig: {config = {}}, rowData} = this.props;
    const {httpAgent} = this.props.commonStore;
    const id = getDataWithKeys({...this.props, ...rowData}, config.id)
    let body = {
      functionality,
      scope: config.scope,
      id,
    }
    functionality && httpAgent.post(`/kong/suite/plugin/list`, body).then(res => {
      this.setState({loading: false})
      const {resultCode, resultMessage, data = []} = res
      if (resultCode === '000000') {
        this.setState({pluginsList: data})
      } else {
        message.error(resultMessage)
      }
    })
  }
  changeCategory = current => {
    this.setState({current})
    this.getPlugins(current.name)
  }

  addPlugins = (pluginName, version) => {
    this.setState({pluginName, version, editVisible: true})

  }

  close = () => {
    this.setState({editVisible: false})
  }

  render() {
    const {visible, handleCancel} = this.props
    const {list, current: {name, desc} = {}, pluginsList, pluginName, version, editVisible, loading} = this.state
    return (
      <Modal wrapClassName={css.pluginsModal}
             visible={visible}
             title={<span style={{color: '#1abb9c'}}>ADD PLUGIN</span>}
             width={900}
             footer={null}
             onCancel={handleCancel}
             destroyOnClose
      >
        <div className={css.addPlugins}>
          <ul className={css.category}>
            {list.map(item =>
              <li
                className={name === item.name ? css.active : ''}
                onClick={() => this.changeCategory(item)}
                key={item.name}
              >
                {item.name}
              </li>
            )}
          </ul>
          <Spin spinning={loading}>
            <ul className={css.plugins}>
              <div className={css.info}>
                <h3>{name}</h3>
                {desc ? <p>{desc}</p> : null}
              </div>

              {pluginsList && pluginsList.length ? pluginsList.map(item =>
                <li key={item.name}>
                  <h4>{item.name}</h4>
                  <img
                    src={item.icon ? require(`../../../app/assets${item.icon}`) : require(`../../../app/assets/img/logo.png`)}></img>
                  <p title={item.hubDesc}>{item.hubDesc}</p>
                  <span onClick={() => this.addPlugins(item.name, item.version)}>ADD PLUGIN</span>
                </li>) : loading ? null :
                <div style={{padding: 10, color: 'red'}}>There are no plugins that can be added!</div>}
            </ul>
          </Spin>
        </div>
        {editVisible ? <EditPlugin
          {...this.props}
          type='add'
          editVisible={editVisible}
          pluginName={pluginName}
          version={version}
          close={this.close}
        /> : null}

      </Modal>
    )
  }
}
