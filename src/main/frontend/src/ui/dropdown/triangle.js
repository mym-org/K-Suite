/* eslint-disable */
import React from 'react'
import { Ico } from '../index'
import css from './triangle.css'


//  eslint-disable-next-line react/prefer-stateless-function
export default class Root extends React.Component {

  render() {
    const { className='' } = this.props
    return <span className={`${css.icon} ${className}`}>
      <Ico type="arrow-down" size="xs" />
    </span>
  }
}
