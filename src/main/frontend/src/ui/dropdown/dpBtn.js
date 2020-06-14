/* eslint-disable */
import React from 'react'
import { Ico } from '../index'
import css from './dpBtn.css'


//  eslint-disable-next-line react/prefer-stateless-function
export default class Root extends React.Component {

  render() {
    const { className='', close=()=>false } = this.props
    return <span className={`${css.icon} ${className}`} onClick={(e)=>{
      close()
      e.stopPropagation()
    }}>
      <Ico type="triangle-curve" className={css.triangle} size="xs" />
      <Ico type="xx" className={css.close} size="xs" />
    </span>
  }
}
