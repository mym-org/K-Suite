//props onChange 可返回现在已有的值，需要同时传value
//Form中直接用就可以
import React from 'react'
import {Input, Tag} from 'antd';

export default class TagsInput extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      inputValue: ""
    }
  }

  //删除tag
  onClose = (index) => {
    let {value = []} = this.props;
    value = value ? value : [];
    value.splice(index, 1)
    this.props.onChange(value);
  }

  //输入框变化时
  inputOnChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  //按下回车键
  onPressEnter = (e) => {
    let {value} = this.props;
    //什么都不输入时按回车不操作
    value = value instanceof Array ? value : [];
    if (e.target.value) {
      value.push(e.target.value);
      this.props.onChange(value);
      this.setState({
        inputValue: ''
      })
    }
  }


  render() {
    const {value = []} = this.props;

    // 如果要放大标签
    // style={{marginBottom: '10px', padding: '8px 14px', borderRadius: '20px', fontSize: '14px'}}
    return <div>
      <div>
        {
          value instanceof Array && value.map((item, index) =>
            <Tag key={index} color='cyan' closable style={{marginBottom: '10px'}}
                 onClose={(e) => {
                   e.preventDefault();
                   this.onClose(index)
                 }}>{item}</Tag>)
        }
      </div>
      <Input onPressEnter={this.onPressEnter} onBlur={this.onPressEnter} value={this.state.inputValue}
             onChange={this.inputOnChange}/>
    </div>
  }
}