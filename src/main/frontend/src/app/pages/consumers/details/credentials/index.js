import React from 'react';
import {Tabs} from "antd";
import PageMake from "../../../../common/pageMake";

const {TabPane} = Tabs;

export default class Credentials extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeKey: "BASIC"
    }
  }

  onChange = (key) => {
    this.setState({
      activeKey: key
    })
  }

  render() {
    const {activeKey} = this.state;
    return <Tabs activeKey={activeKey} onChange={this.onChange}
                 tabPosition='left' type='card'>

      {/*BASIC*/}
      <TabPane tab='BASIC' key="BASIC">
        {
          activeKey === 'BASIC' ? <PageMake {...this.props} entityName='basic-auth'/> : null
        }
      </TabPane>

      {/*API KEYS*/}
      <TabPane tab='API KEYS' key="APIKEYS">
        {
          activeKey === 'APIKEYS' ? <PageMake {...this.props} entityName='key-auth'/> : null
        }
      </TabPane>

      {/*OAUTH2*/}
      <TabPane tab='OAUTH2' key="OAUTH2">
        {
          activeKey === 'OAUTH2' ? <PageMake {...this.props} entityName='oauth2'/> : null
        }

      </TabPane>


    </Tabs>

  }
}
