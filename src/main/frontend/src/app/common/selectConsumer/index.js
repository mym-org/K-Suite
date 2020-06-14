import React from 'react';
import {message, Select} from 'antd';
import commonStore from '../../stores/commonStore';

const {Option} = Select

export default class SelectConsumer extends React.Component {
  state = {
    consumers: []
  }

  componentDidMount() {
    this.getConsumers()
  }

  getConsumers = (keywords) => {
    const {httpAgent} = commonStore;

    httpAgent.kong({
      adminApi: '/consumers',
      pageNo: 1,
      pageSize: 20,
      keywords,
      searchTarget: 'CONSUMERS'
    }, 'query').then(res => {
      const {resultCode = '', resultMessage = 'Get list failed!', data: {results = []}} = res;
      if (resultCode === '000000') {
        this.setState({
          consumers: results,
        })
      } else {
        message.error(resultMessage)
      }
    })
  }

  render() {
    const {value} = this.props
    const optionDom = this.state.consumers.map(item => <Option key={item.id}>{item.username}</Option>)
    return <Select
      showSearch
      filterOption={false}
      onSearch={this.getConsumers}
      style={{width: "100%"}}
      notFoundContent={null}
      allowClear
      getPopupContainer={triggerNode => triggerNode.parentElement}
      value={value}
      onChange={this.props.onChange}
    >
      {optionDom}
    </Select>
  }


}

