import React from 'react'
import {Layout, Icon} from "antd";
import {inject, observer} from 'mobx-react';
import css from './index.module.scss'
import User from './user'

const { Header } = Layout;
@inject('commonStore')
@observer
export default class Top extends  React.Component{
  render(){
    const {systemInfo} = this.props.commonStore
    const { toggleCollapsed, collapsed } = this.props
    return(<Header style={{ padding: 0 }}>
      <span className={css.collapsed}>
        <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={toggleCollapsed} />
      </span>
      <span className={css.ml20}>{systemInfo.name}</span>
      <span className={css.ml20}>Kong Version：{systemInfo.version}</span>
      <User/>
    </Header>)
  }
}