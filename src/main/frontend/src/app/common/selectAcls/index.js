import React from 'react'
import {message, Select} from 'antd';
import {inject, observer} from "mobx-react";


const {Option} = Select;

@inject('commonStore')
@observer
export default class SelectAcls extends React.Component {
  state = {
    acls: []
  }

  componentDidMount() {
    this.getAcls()
  }

  getAcls = (keywords) => {
    const {httpAgent} = this.props.commonStore;
    httpAgent.kong({
      adminApi: '/acls',
      pageNo: 1,
      pageSize: 20,
      keywords,
      searchTarget: 'ACLS'
    }, 'query').then(res => {
      const {resultCode = '', resultMessage = 'Get list failed!', data: {results = []}} = res;
      if (resultCode === '000000') {
        this.setState({
          acls: results,
        })
      } else {
        message.error(resultMessage)
      }
    })
  }

  render() {
    const {value} = this.props
    const optionDom = this.state.acls.map(item =>
      <Option key={item.id}>
        {item.group}
      </Option>
    )
    return <Select
      showSearch
      filterOption={false}
      onSearch={this.getAcls}
      style={{width: "100%"}}
      notFoundContent={null}
      allowClear
      getPopupContainer={triggerNode => triggerNode.parentElement}
      onChange={this.props.onChange}
      value={value}
    >
      {optionDom}
    </Select>
  }


}

