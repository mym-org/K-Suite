/**
 * @param changeStatus 获取Switch的value
 */

import React from 'react'
import { Input, InputNumber, Select } from 'antd'
import Switch from '../switch'
import TagsInput from '../tagsInput'
import SelectConsumer from '../selectConsumer'
import SelectCertificates from "../selectCertificates";
import SelectAcls from "../selectAcls";
import JsonLint from '../jsonlintpro'
import SelectUpstream from "../selectUpstream";

const { Option } = Select
const { TextArea } = Input


export default class SelectComponents extends React.Component {

  //form组件有ref属性 使用函数组件会有警告
  render() {
    const { data: { component, options, name } = {} } = this.props
    switch (component) {
      case 'Input':
        return <Input {...this.props} />;
      case 'InputHidden':
        return <Input {...this.props} type='hidden' />;
      case 'InputMultiple':
        return <TagsInput {...this.props} />;
      case 'InputNumber':
        return <InputNumber {...this.props} style={{ width: '100%' }} />;
      case 'Select':
        return <div id={`${name}1`} style={{ position: 'relative' }}>
          <Select {...this.props} allowClear style={{ width: '100%' }} getPopupContainer={() => document.getElementById(`${name}1`)}>
            {options && options.map(item => {
              return <Option value={item} key={item}>{item}</Option>
            })}
          </Select>
        </div>;
      case 'SelectMultiple':
        return <div id={`${name}1`} style={{ position: 'relative' }}>
          <Select {...this.props}
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            getPopupContainer={() => document.getElementById(`${name}1`)}
          >
            {options && options.map(item => {
              return <Option value={item} key={item}>{item}</Option>
            })}
          </Select>
        </div>;
      case 'Switch':
        return <Switch {...this.props} />;
      case 'TextArea':
        return <TextArea {...this.props} style={{ width: '100%' }} />;
      case 'SelectConsumer':
        return <SelectConsumer {...this.props} />;
      case 'SelectCertificates':
        return <SelectCertificates {...this.props} />;
      case 'SelectMultipleAcls':
        return <SelectAcls {...this.props} />;
        case 'SelectUpstream':
        return <SelectUpstream {...this.props} />;
      case 'InputJSON':
        return <JsonLint {...this.props} />
      default:
        return <Input {...this.props} style={{ width: '100%' }} />;
    }
  }
}