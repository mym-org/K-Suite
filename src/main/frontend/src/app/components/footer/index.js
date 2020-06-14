import React from 'react'
import {Layout, Icon} from "antd";
import {Link} from "react-router-dom";

const {Footer} = Layout;

export default class Foot extends React.Component {
  render() {

    return (<Footer style={{padding: '10px 15px',background:'#fff',borderTop:'1px solid #eee'}}>
      <span className='primaryGreen marR15'>K-Suite Version: 1.0.0</span>

      <a href='https://github.com/mym-org/K-Suite' target='_blank' className='marR15 footerLink'>
        <Icon type="github"/> GitHub
      </a>

      <a href='https://github.com/mym-org/K-Suite/issues' target='_blank' className='marR15 footerLink'>
        <Icon type="github"/> Issues
      </a>

    </Footer>)
  }
}