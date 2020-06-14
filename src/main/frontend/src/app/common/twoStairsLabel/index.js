//模态窗form表单的label样式：上下两层，下层灰色斜体
import React from 'react'

export default class TwoStairsLabel extends React.Component {

  render() {
    const {firstText = '', secondText = ''} = this.props;

    return <div className='label-text'>
      <div>{firstText}</div>
      <div className='grey-italic-text'>{secondText}</div>
    </div>
  }
}
