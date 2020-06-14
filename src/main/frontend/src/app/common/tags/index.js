/**
 * 
 * @param tags 初始值
 * @param onChange onChange(value) 回调，返回一个数组
 * 
 */
import React from 'react'
import { Input,Tag,Tooltip} from 'antd';
class Tags extends React.Component {
  state = {
    tags:this.props.tags?this.props.tags:[],
    inputValue: '',
  }

  saveInputRef = input => (this.input = input);
  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };
  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.props.onChange(tags)
    this.setState({
      tags,
      inputValue: '',
    });
  };
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.props.onChange(tags)
    this.setState({ tags });
  };

  render() {
    
    const { tags, inputValue, } = this.state;
    return (
      <div>
          {tags.map((tag) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              closable
              onClose={() => this.handleClose(tag)}
            >
              <span>
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
  
        <Input
          ref={this.saveInputRef}
          type="text"
          value={inputValue}
          onChange={this.handleInputChange}
          onBlur={this.handleInputConfirm}
          onPressEnter={this.handleInputConfirm}
        />
      
      </div>
    )
  }
}

export default Tags