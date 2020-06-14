import React, { Component } from 'react'
import TextArea from 'antd/lib/input/TextArea';
import JsonFormat from './js/jsonlint/jsl.format'
import JsonParse from './js/jsonlint/jsl.parser'
import { Modal } from 'antd';

export default class JsonLint extends Component {

  state = {
    value: typeof this.props.value === 'string' ? this.props.value : JsonFormat().formatJson(JSON.stringify(this.props.value))
  }

  change = () => {
    try {

      let jsonVal = JsonFormat().formatJson(this.state.value);
      this.setState({ value: jsonVal })
      this.props.onChange(JsonParse().parse(jsonVal))
    } catch (err) {
      this.props.onChange(this.state.value)
      Modal.error({
        title: 'SyntaxError',
        content: <div style={{ whiteSpace: 'break-spaces' }}>{err.toString()}</div>,
      })
    }

  }

  onChange = val => this.setState({ value: val.target.value })

  render() {
    return (
      <div>
        <TextArea onBlur={this.change} value={this.state.value} onChange={this.onChange} />
      </div>
    )
  }
}
