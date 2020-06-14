/* eslint-disable */
import React from 'react'
import classnames from 'classnames'

//  eslint-disable-next-line react/prefer-stateless-function
export default class Root extends React.Component {

  render() {
    const { size = 'medium', width = null, height = null, style = null , className = null} = this.props
    let dialogStyle = {}
    if(style) {
      dialogStyle = style
    }
    if(width) {
      dialogStyle.width = width
    }
    if(height) {
      dialogStyle.height = height
    }

    return (<div className={classnames('brick-modal-dialog', size, className)} style={dialogStyle}>
      {this.props.children}
    </div>)
  }
}
