
/**
 * @param yesContent 开关值为true的内容
 */

import React from 'react'
import css from './index.module.scss'

class Switch extends React.Component{
 changeSwitch = () => {
  const { value, change } = this.props
    change(!value)
  }
render(){
  const { value, yesContent='YES',noContent='NO' } = this.props
  return <div className={css.switch} onClick={() => this.changeSwitch()}>
    <div className={css.container} style={{ marginLeft: value ? 0 : '-43px' }}>
      <span className={css.yes}>{yesContent}</span>
      <span></span>
      <span className={css.no}>{noContent}</span>
    </div>
  </div>
}

  

}

export default Switch