/* eslint-disable */
import React from 'react'
import {Scroll,toolTip} from '../index'
import css from './verticalOneLevel.module.scss'


//  eslint-disable-next-line react/prefer-stateless-function
export default class Root extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    }
  }

  onMouseEnter = (e,msg) => {
    if(e.target.offsetWidth < e.target.scrollWidth) {
      toolTip({e,msg,position: 'right'})
    }
  }

  getList = (data,  onCheck) => {
    const li = data.map((v,i)=>{
      return <li
        key={i}
        onClick={()=>{onCheck(v)}}
        onMouseEnter={(e)=>{this.onMouseEnter(e,v.text)}}
        onMouseLeave={()=>{toolTip({leave:true})}}
      >
        {v.text}
      </li>
    })
    return <ul>{li}</ul>
  }

  render() {
    const { data, onCheck, className='' } = this.props
    return <div className={`${css.list} ${className}`}>
      <Scroll>
        {this.getList(data, onCheck)}
      </Scroll>
    </div>
  }
}
