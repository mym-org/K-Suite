import React from 'react';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import {Layout, message} from 'antd';

import httpAgent from '../utils/httpAgent'

import Nav from '../components/nav'
import Top from '../components/top'
import ServicesDetails from "./services";
import Info from './info'
import NoMatch from '../components/no-match'
import commonStore from '../stores/commonStore'
import ENV from '../config/env'
import {Provider} from 'mobx-react'
import ConsumerDetails from "./consumers/consumerDetail";
import PageMake from "../common/pageMake";
import Footer from "../components/footer";

const {Content} = Layout;

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {}
    }
    this.agent = httpAgent(ENV.APIROOT, ENV.APIVERSION)
    commonStore.setHttpAgent(this.agent); // 把配置参数保存到 store
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  componentDidMount() {
    this.agent.get('/kong/suite/user/current').then(res => {
      const {resultCode = '', data = {}} = res
      if (resultCode === '000000') {
        commonStore.setUserInfo(data)
        this.setState({userInfo: data})
      }
    })
    this.agent.get('/kong/suite/system').then((res) => {
      const {resultCode = '', resultMessage = '', data = {}} = res
      if (resultCode === '000000') {
        commonStore.setSystemInfo(data)
      } else {
        message.error(resultMessage)
      }
    })

    this.agent.get('/kong/suite/menus').then((res) => {
      if (res.resultCode === "000000") {
        commonStore.setMenus(res.data)
      } else {
        message.error(res.resultMessage)
      }
    })
  }

  render() {
    //console.log('app index render',this, commonStore)
    const {toggleCollapsed, agent} = this
    const {collapsed, userInfo} = this.state
    const {history, basePath = '/'} = this.props

    // if(!commonStore.userInfo || !commonStore.userInfo.accountId) {
    //   return <Skeleton active avatar paragraph={{rows: 6}}/> // 没有登录
    // }


    return (<Provider {...{commonStore}}>
      <Layout style={{height: '100%'}}>
        <Nav httpAgent={agent} collapsed={collapsed} history={history} basePath={basePath}/>
        <Layout id="app-main">
          <Top toggleCollapsed={toggleCollapsed} collapsed={collapsed}/>
          <Content style={{margin: 15, padding: 15, background: '#ffffff', overflowY: 'scroll'}}>
            <Switch>
              <Route exact path="/" component={() => <Redirect to="/info"/>}/>

              <Route exact path="/consumers" component={(props) =>
                <PageMake {...props} entityName='consumers' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/consumers/:id" component={(props) =>
                <ConsumerDetails {...props} httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/plugins" component={(props) =>
                <PageMake {...props} entityName='plugins' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/upstreams" component={(props) =>
                <PageMake {...props} entityName='upstreams' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/services" component={(props) =>
                <PageMake {...props} entityName='services' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/services/:id" component={(props) =>
                <ServicesDetails {...props} httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/apis" component={(props) =>
                <PageMake {...props} entityName='apis' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/apis/:id" component={(props) =>
                <PageMake {...props} entityName='apis' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/info" component={(props) =>
                <Info {...props} httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/routes" component={(props) =>
                <PageMake {...props} entityName='routes' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/tags" component={(props) =>
                <PageMake {...props} entityName='tags' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/certificates" component={(props) =>
                <PageMake {...props} entityName='certificates' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/certificates/:id" component={(props) =>
                <PageMake {...props} entityName='certificates' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route exact path="/snis" component={(props) =>
                <PageMake {...props} entityName='snis' httpAgent={agent} userInfo={userInfo}/>}/>

              <Route component={NoMatch}/>
            </Switch>
          </Content>
          <Footer/>
        </Layout>
      </Layout>
    </Provider>)
  }
}

export default withRouter(App)
