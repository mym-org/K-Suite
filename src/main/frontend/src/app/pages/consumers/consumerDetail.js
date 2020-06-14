import React from 'react'
import Details from './details'
import {inject, observer} from "mobx-react";

@inject('commonStore')
@observer
export default class ConsumerDetail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {

    const {systemInfo: {version = ''}} = this.props.commonStore;
    return <Details {...this.props} version={version}/>

  }
}
