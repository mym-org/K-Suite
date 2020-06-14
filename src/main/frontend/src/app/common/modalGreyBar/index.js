//模态窗顶部灰色条
import React from 'react'

export default class ModalGreyBar extends React.Component {

  render() {
    const {str = ''} = this.props;

    return <div className='bg-light-grey'>{str}</div>
  }
}
