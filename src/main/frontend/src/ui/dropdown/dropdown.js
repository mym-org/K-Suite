import React, { Component } from 'react';
import _ from 'lodash'
import css from  './dropdown.module.scss'
import VerticalOneLevel from './verticalOneLevel'
import Triangle from './triangle'
import Close from './close'
import DpBtn from './dpBtn'


export default class Dropdown extends Component {

  constructor(props) {
    super(props)
    console.log('props',props,props.initValue,_.find(props.data, function(o) { return o.value === props.initValue }))
    const selected =  props.initValue ? _.find(props.data, function(o) { return o.value === props.initValue }) : null
    this.state = {
      open: props.open || false,
      selected, // obj
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.childrenHidden, false)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.childrenHidden, false)
  }

  checkOnClick = () => {
    this.setState({open: true})
  }

  childrenHidden = (e) => {
    if(!this.dropdown.contains(e.target)) {
      this.setState({open: false})
    }
  }

  onCheck = (v) => {
    const { onCheck } = this.props
    this.setState({open: false, selected: v})
    onCheck(v)
  }


  render() {
    const { open=false, selected } = this.state
    const { LeftIcon=null, RightIcon=null, explain='', Children, data, onCheck, className='', style={} } = this.props
    return <div ref={ref=>this.dropdown = ref} className={`${css.dropdown} ${className} ${open ? 'open' : ''}`} style={style}>
      <div className={`${css.check} ${selected ? 'selected' : ''}`} onClick={this.checkOnClick}>
        {LeftIcon ? <LeftIcon /> : null}
        <div className={`${css.selected} ${LeftIcon ? css.left : ''} ${RightIcon ? css.right : ''}`}>{selected ? selected.text : explain}</div>
        {RightIcon ? <RightIcon className={css.rightIcon} /> : null}
      </div>
      <div className={`${css.children}`}>
        <Children data={data} onCheck={this.onCheck} />
      </div>
    </div>
  }
}

export {VerticalOneLevel, Triangle, Close, DpBtn}