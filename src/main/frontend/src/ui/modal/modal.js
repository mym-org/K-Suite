/**
 * outside click 当点击目标点击后会立刻被移除，那么当click事件反馈到document时
 * this.modal.contains(e.target) 始终为 false
 * 那么改变 document  监听事件为 mousedown 则 outside click 触发时点击目标还没有被移除
 * 可以通过配置参数设置监听事件？
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './modal.css'
import position from './position'
import windowScroll from './windowScroll'
import Dialog from './dialog'
import Confirm from './confirm'
import Alert from './alert'

export default class Modal extends Component {
  static defaultProps = {
    children: <div />,
    show: false,
    focus: true,
    parent: document.body,
    parentScroll: false, // 是否需要父级别显示滚动条
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      zIndex: '1000',
      background: 'rgba(0,0,0,0.5)',
      outline: 'none',
    },
    hiddenStyle: {
      visibility: 'hidden',
    },
    outsideClick: {
      callback: () => {},
    },
  }

  static propTypes = {
    show: PropTypes.bool.isRequired,
    focus: PropTypes.bool.isRequired,
    outsideClick: PropTypes.shape({
      callback: PropTypes.func,
    }),
    children: PropTypes.element.isRequired,
  }

  constructor(props) {
    super(props)
    this.modal = document.createElement('div')
    this.modal.id = `modal${Math.random().toString().substring(2)}`
    this.modal.setAttribute('tabIndex', '-1')
    // eslint-disable-next-line
    this.props.parent.appendChild(this.modal)
    this.state = {
      isShow: props.show,
    }
  }

  componentDidMount() {
    if (this.props.show) {
      this.open()
    }
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.show && newProps.show) {
      this.open()
    } else if (this.props.show && !newProps.show) {
      this.close(newProps)
    } else if (newProps.show) {
      this.modalStatus = 'opening'
    } else if (!newProps.show) {
      this.modalStatus = 'closeing'
    }
  }

  componentDidUpdate() {
    this.setModal(this.props)
  }

  componentWillUnmount() {
    if (!this.modal) return
    document.removeEventListener('click', this.onModalClick, false)
    if (this.props.outsideClick && this.props.outsideClick.callback) {
      // 取消缓存回调函数
      this.outsideClickCallback = undefined
      document.removeEventListener('mousedown', this.onOutsideClick, false)
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer)
    }
    // eslint-disable-next-line
    this.props.parent.removeChild(this.modal)
  }

  // 模态框外面的点击事件
  onOutsideClick = (e) => {
    if (this.outsideClickCallback && !this.modal.contains(e.target)) {
      this.outsideClickCallback(e)
    }
  }

  // 如果点击的目标是modal的最外层，并且有onMask就关闭modal
  onModalClick = (e) => {
    const { modal, props } = this
    const { onMask } = props
    if (e.target === modal && onMask) {
      onMask()
    }
  }

  // 设置modal
  setModal = (props) => {
    this.setClassName(props) // 设置modal className
    this.setStyle(props) // 设置modal样式  如果有延迟那么就是延迟后设置
    this.outsideClick(props) // modal外面的点击事件
    document.addEventListener('click', this.onModalClick, false) // 监听modal最外层点击事件
  }

  // 设置modal样式
  // eslint-disable-next-line
  setStyle = (props) => {
    const { emit, style, hiddenStyle, replaceStyle, replaceHiddenStyle } = props
    const { isShow } = this.state
    const { modal } = this
    const newStyle = isShow ? style : hiddenStyle
    // 移除老样式
    modal.removeAttribute('style')
    // 设置新样式
    Object.keys(newStyle).forEach((key) => {
      modal.style[key] = newStyle[key]
    })
    // 设置替换样式
    if ((isShow && replaceStyle) || (!isShow && replaceHiddenStyle)) {
      const newReplaceStyle = isShow ? replaceStyle : replaceHiddenStyle
      Object.keys(newReplaceStyle).forEach((key) => {
        modal.style[key] = newReplaceStyle[key]
      })
    }
    // 设置body有滚动条的情况
    if (this.props.parentScroll === true || this.props.parent === document.body && !emit && (this.modalStatus === 'open' || this.modalStatus === 'opening')) {
      const winScroll = windowScroll()
      this.checkScrollbar()
      modal.style.top = `${parseInt(modal.style.top, 10) + winScroll.top}px`
      modal.style.left = `${parseInt(modal.style.left, 10) + winScroll.left}px`
      document.body.style.paddingRight = this.bodyIsOverflowing ? `${this.scrollbarWidth}px` : ''
      document.body.classList.add(`brick-modal-open-${modal.id}`) // class*="brick-modal-open" overflow: hidden;
    }

    // 设置指定位置
    if (isShow) {
      this.positionToEmit(props)
    }
  }

  // set modal class name
  setClassName = (props) => {
    const { modal } = this
    const { className } = props
    if (className) {
      modal.setAttribute('class', className)
    }
  }

  setFocus = () => {
    const { focus } = this.props
    if (focus) {
      this.preFocus = document.activeElement
      setTimeout(() => {
        this.modal.focus()
      }, 0)
    }
  }

  open = () => {
    this.setState({
      isShow: true,
    })
    this.modalStatus = 'open'
    this.closeTimer && clearTimeout(this.closeTimer) // 当延迟关闭时modal还未关闭，又被重新open，取消延迟关闭
    this.setFocus()
  }

  close = (newProps) => {
    if (newProps.closeDelay > 0) {
      this.closeTimer = setTimeout(() => {
        this.closeIng(newProps)
      }, newProps.closeDelay)
    } else {
      this.closeIng(newProps)
    }
  }

  closeIng = (newProps) => {
    this.setState({
      isShow: false,
    }, () => {
      // eslint-disable-next-line
      newProps.onAfterClose && newProps.onAfterClose()
    })
    this.modalStatus = 'close'
    document.body.classList.remove(`brick-modal-open-${this.modal.id}`)
    if (document.body.style.paddingRight) {
      document.body.style.paddingRight = ''
    }
    this.backFocus()
  }

  backFocus = () => {
    const { focus } = this.props
    if (focus) {
      const activeEle = document.activeElement
      const isFocus = (this.modal === activeEle) || this.modal.contains(activeEle)
      if (isFocus && this.preFocus) {
        setTimeout(() => {
          this.preFocus.focus()
        }, 0)
      }
    }
  }

  checkScrollbar = () => {
    let fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      const documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  measureScrollbar = () => {
    let scrollbarWidth = 0
    if (typeof document !== 'undefined') {
      const div = document.createElement('div')
      div.style.width = '100px'
      div.style.height = '100px'
      div.style.position = 'absolute'
      div.style.top = ' -9999'
      div.style.overflow = 'scroll'
      div.style.MsOverflowStyle = 'scrollbar'
      document.body.appendChild(div)
      scrollbarWidth = (div.offsetWidth - div.clientWidth)
      document.body.removeChild(div)
    }
    return scrollbarWidth
  }


  // 定位到指定到位置（一般是发射modal到位置）
  positionToEmit = (props) => {
    const { emit } = props
    if (!emit) {
      return
    }
    const { target = undefined, align = 'center', vertical = 'middle', offset = { x: 0, y: 0 } } = emit
    if (!target) {
      return
    }
    const { top, left } = position(target, this.modal, align, vertical, offset)
    this.modal.style.left = `${left}px`
    this.modal.style.top = `${top}px`
  }

  // 监听模态框外面的点击事件
  outsideClick = (props) => {
    const { outsideClick, show } = props
    if (!outsideClick) {
      return
    }
    const { callback, isCall = true } = outsideClick
    if (callback && isCall && show) {
      // 缓存回调函数
      this.outsideClickCallback = callback
      document.addEventListener('mousedown', this.onOutsideClick, false)
    } else if (callback && (!show || !isCall)) {
      // 取消缓存回调函数
      this.outsideClickCallback = undefined
      document.removeEventListener('mousedown', this.onOutsideClick, false)
    }
  }

  render() {
    const { children } = this.props
    const { isShow } = this.state
    const { modal } = this
    const child = isShow ? children : <div />

    return ReactDOM.createPortal(child, modal)
  }
}

export { Dialog, Confirm, Alert }
