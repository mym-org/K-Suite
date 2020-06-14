import React from 'react'
import { Select } from 'antd'

const { Option } = Select;

export default class methodSelector extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            methods: ['GET', 'POST', 'OPTION']
        }
    }

    render () {

        return <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select methods"
            defaultValue={this.props.methods ? this.props.methods : []}
            onChange={this.props.onChange}
        >
            {this.state.methods.map((item, key) => {
                return <Option key={key} value={item}>{item}</Option>
            })}
        </Select>
    }
}