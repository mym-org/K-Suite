/* eslint-disable */
import React from 'react'
import { Ico } from '../index'
import css from './close.css'


//  eslint-disable-next-line react/prefer-stateless-function
export default class Root extends React.Component {

  render() {
    const { close=(e)=>{e.stopPropagation()}, className='' } = this.props
    return <span className={`${css.icon} ${className}`} onClick={(e)=>{
      close()
      e.stopPropagation()
    }}>
      <Ico type="dankuangguanbi" size="xs" />
    </span>
  }
}
