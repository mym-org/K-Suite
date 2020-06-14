import React from 'react'
import './index.css'

export default class Btn extends React.Component {
  render() {
    const {
      children='',
      type = 'primary',
      outline = false,
      ghost = false,
      icon = null,
      size = null,
      disable = false,
      onClick = () => {},
      className = '',
      style = {},
      component:Component,
      componentProps={},
    } = this.props

    if(Component){
      return (<Component
        className={`btn ${outline ? `btn-outline-${type}` : `btn-${type}`} ${ghost ? 'ghost' : ''} ${size ? `btn-${size}` : ''} ${className}`}
        style={style}
        {...componentProps}
      >
        {icon ? <i className={`crmico crmico-${icon}`}/> : null}
        {children}
      </Component>)
    } else if (typeof children === 'string') {
      return (<button
        className={`btn ${outline ? `btn-outline-${type}` : `btn-${type}`} ${ghost ? 'ghost' : ''} ${size ? `btn-${size}` : ''} ${className}`}
        style={style}
        disabled={disable}
        onClick={onClick}
      >
        {icon ? <i className={`crmico crmico-${icon}`}/> : null}
        {children}
      </button>)
    } else if (typeof children === 'object') {
      return children
    } else {
      return <button>未知类型</button>
    }
  }
}
