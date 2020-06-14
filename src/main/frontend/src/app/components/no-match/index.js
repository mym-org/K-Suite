import React from 'react'
import {Link} from 'react-router-dom'
import css from './index.module.scss'

export default class NoAuth extends React.Component {
  render() {
    return(<div className={css.auth}>
      <div className={css.center}>
        <h1>404</h1>
        <Link to="/">返回首页</Link>
      </div>
    </div>)
  }


}