import React from 'react'
import {message, AutoComplete} from 'antd';
import {inject, observer} from "mobx-react";


const {Option} = AutoComplete;

@inject('commonStore')
@observer
export default class SelectUpstream extends React.Component {
  state = {
    upstreams: []
  }

  componentDidMount() {
    this.getUpstreams()
  }

  getUpstreams = (keywords) => {
    const {httpAgent} = this.props.commonStore;
    httpAgent.kong({
      adminApi: '/upstreams',
      pageNo: 1,
      pageSize: 20,
      keywords,
      searchTarget: 'UPSTREAMS'
    }, 'query').then(res => {
      const {resultCode = '', resultMessage = 'Get list failed!', data: {results = []}} = res;
      if (resultCode === '000000') {
        this.setState({
          upstreams: results,
        })
      } else {
        message.error(resultMessage)
      }
    })
  }

  render() {
    const {value} = this.props;
    const optionDom = this.state.upstreams.map(item =>
      <Option key={item.name}>
        {item.name}
      </Option>
    )
    return <AutoComplete
      onSearch={this.getUpstreams}
      style={{width: "100%"}}
      notFoundContent={null}
      allowClear
      getPopupContainer={triggerNode => triggerNode.parentElement}
      onChange={this.props.onChange}
      value={value}
    >
      {optionDom}
    </AutoComplete>

  }


}

