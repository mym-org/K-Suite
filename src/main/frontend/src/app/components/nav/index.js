import React from 'react'
import {Layout, Menu, Icon, message} from 'antd'
import {Ico, Scroll} from '@/ui'
import {inject, observer} from 'mobx-react';
import css from './index.module.scss'
import Logo from '../../assets/img/logo.png'
import {withRouter} from "react-router-dom";

const {Sider} = Layout
const SubMenu = Menu.SubMenu;

@inject('commonStore')
@observer
export default class Nav extends React.Component {

  go = (e) => {
    this.props.history.push(`${e.key}`)
  }

  render() {
    const createStyle = {
      fontSize: '16px'
    }
    const {collapsed, commonStore: {menus = []}} = this.props;

    const LeftSider = withRouter(({history}) => {
      return (
        <Menu theme="dark" mode="inline"
              selectedKeys={[history.location.pathname,history.location.pathname.substring(0,history.location.pathname.lastIndexOf('/'))]}
              onClick={this.go}
              className={css.nav}>
          {
            menus.map((item) => {
              let ico = <Icon type={item.icon} style={createStyle}/>
              return <Menu.Item key={item.url}>
                {ico}
                <span>{item.name}</span>
              </Menu.Item>
            })
          }
        </Menu>

      );
    })
    return (<Sider
      id="app-aside"
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
    >
      <div className={css['sider-container']}>
        <div className={`${css.logo} ${collapsed ? '' : css.small}`}>
          <img src={Logo} alt="crm"/>
        </div>
        <div className={css['nav-container']}>
          <Scroll>
            <LeftSider/>
          </Scroll>
        </div>
      </div>
    </Sider>)
  }
}
