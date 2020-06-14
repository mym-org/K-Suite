import React from 'react'
import {message, Select} from 'antd';
import {inject, observer} from "mobx-react";


const {Option} = Select;

@inject('commonStore')
@observer
export default class SelectCertificates extends React.Component {
  state = {
    certificates: []
  }

  componentDidMount() {
    this.getCertificates()
  }

  getCertificates = (keywords) => {
    const {httpAgent} = this.props.commonStore;
    httpAgent.kong({
      adminApi: '/certificates',
      pageNo: 1,
      pageSize: 20,
      keywords,
      searchTarget: 'CERTIFICATES'
    }, 'query').then(res => {
      const {resultCode = '', resultMessage = 'Get list failed!', data: {results = []}} = res;
      if (resultCode === '000000') {
        this.setState({
          certificates: results,
        })
      } else {
        message.error(resultMessage)
      }
    })
  }

  render() {
    const {value} = this.props
    const optionDom = this.state.certificates.map(item =>
      <Option key={item.id}>
        {item.tags && item.tags.length > 0 ? item.tags.join(',') : item.id}
      </Option>
    )
    return <Select
      showSearch
      filterOption={false}
      onSearch={this.getCertificates}
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

