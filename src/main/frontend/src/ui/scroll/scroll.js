/* eslint-disable */
import React from 'react';
import getScrollbarWidth from './getScrollbarWidth';
import getInner from './getInner';
import {addClass, removeClass} from './classNames';
import getComputedStyle from './getComputedStyle';
import './scroll.css';

export default class scroll extends React.Component {
  constructor(props) {
    super(props);
    this.scroll = React.createRef();
    this.container = React.createRef();
    this.verticalBar = React.createRef();
    this.verticalThumb = React.createRef();
    this.horizontalBar = React.createRef();
    this.horizontalThumb = React.createRef();
  }


  componentDidMount() {
    this.setScroll();
    // 设置拖动事件
    this.verticalThumb.current.addEventListener('mousedown', this.handleVerticalThumbMouseDown);
    this.horizontalThumb.current.addEventListener('mousedown', this.handleHorizontalThumbMouseDown);
  }

  componentDidUpdate() {
    this.setScroll();
  }

  setScroll = () => {
    this.setMaxSize(); // 设置滚动条  max size
    this.getRatio(); // 获取内容和可视比例
    this.setVerticalThumbHeight(); // 设置垂直滚动条高度
    this.setHorizontalThumbWidth();// 设置横向滚动条宽度
  }

  setMaxSize = () => {
    const {autoHeight} = this.props
    if (autoHeight) {
      const childrenEles = this.container.current.childNodes
      if (!childrenEles || childrenEles.length === 0) {
        return false
      }
      let childernHeight = 0
      for (const ele of childrenEles) {
        if (ele.nodeType === 1) {
          childernHeight += ele.clientHeight
        }
      }
      const parentEle = this.scroll.current.parentNode
      const maxHeight = getComputedStyle(parentEle, 'max-height')
      const maxHeightValue = isNaN(parseInt(maxHeight, 10)) ? childernHeight : parseInt(maxHeight, 10)
      if (childernHeight <= maxHeightValue) {
        parentEle.style.height = `${childernHeight}px`
      } else {
        parentEle.style.height = maxHeight
      }
    }
  }

  // 获取内容和可视比例
  getRatio = () => {
    const container = this.container;

    this.contentHeight = container.current.scrollHeight; // 获取内容高度 (不包含滚动条)
    this.visibleHeight = container.current.clientHeight; // 获取可视高度 (不包含滚动条)
    this.scrollVerticalRatio = this.contentHeight ? this.visibleHeight / this.contentHeight : 1;

    this.contentWidth = container.current.scrollWidth; // 获取内容宽度 (不包含滚动条)
    this.visibleWidth = container.current.clientWidth; // 获取可视宽度(不包含滚动条)
    this.scrollHorizontalRatio = this.contentWidth ? this.visibleWidth / this.contentWidth : 1;

    this.barIsHidden(); // 获取比例后判断滚动条是否需要隐藏
  }

  // 滚动重新设置 滚动条高度比例
  resetRatio = () => {
    const {container, contentHeight, contentWidth, visibleHeight, visibleWidth} = this
    if (contentHeight !== container.current.scrollHeight || visibleHeight !== container.current.clientHeight) {
      // 内容高度有变化 || 可视高度有变化
      // console.log('内容高度有变化 || 可视高度有变化')
      this.getRatio()
      this.setVerticalThumbHeight()
    }
    if (contentWidth !== container.current.scrollWidth || visibleWidth !== container.current.clientWidth) {
      // 内容宽度有变化 || 可视宽度有变化
      // console.log('内容宽度有变化 || 可视宽度有变化')
      this.getRatio()
      this.setHorizontalThumbWidth()
    }
  }

  // 获取垂直滚动条高度
  getVerticalThumbHeight = () => {
    const verticalBar = this.verticalBar;
    const trackHeight = getInner.height(verticalBar.current);
    const height = this.scrollVerticalRatio * trackHeight;
    if (height < 30) {
      this.thumbShort = 30 - height
      return 30
    } else {
      return height
    }
  }

  // 设置滚动条高
  setVerticalThumbHeight = () => {
    this.verticalThumbHeight = this.getVerticalThumbHeight(); // 获取垂直滚动条高度 并保存到 this
    this.verticalThumb.current.style.height = `${this.verticalThumbHeight}px`;
  }

  // 获取滚动条宽度
  getHorizontalThumbWidth = () => {
    const horizontalBar = this.horizontalBar;
    const trackWidth = getInner.width(horizontalBar.current);
    const width = this.scrollHorizontalRatio * trackWidth
    if (width < 30) {
      this.horizontalThumbShort = 30 - width
      return 30
    } else {
      return width
    }
  }

  // 设置滚动条宽度
  setHorizontalThumbWidth = () => {
    this.horizontalThumbWidth = this.getHorizontalThumbWidth()
    this.horizontalThumb.current.style.width = `${this.horizontalThumbWidth}px`;
  }

  // container 滚动 设置滚动条Top
  setThumbVerticalTop = (containerScrollTop) => {
    if (this.drag === 'ing') {
      // 如果在拖动 thumb 不能重复设置 top
      return false
    }
    //console.log('this.scrollVerticalRatio',this.scrollVerticalRatio)
    const fixThumbShort = this.thumbShort ? this.thumbShort * (containerScrollTop / (this.contentHeight - this.visibleHeight)) : 0;
    const top = containerScrollTop * this.scrollVerticalRatio - fixThumbShort;
    this.verticalThumb.current.style.top = `${top}px`;
  }

  // 获取垂直滚动条top（拖动滚动条时）
  getVerticalThumbTop = (clientY) => {
    const {top: barTop} = this.verticalBar.current.getBoundingClientRect()
    let top = clientY - barTop - this.thumbClientYToTop
    const max = this.visibleHeight - this.verticalThumbHeight
    // console.log('this.visibleHeight',this.visibleHeight)
    if (top < 0) {
      return 0
    } else if (top > max) {
      // console.log('max',max)
      return max
    } else {
      // console.log('top',top)
      return top
    }
  }

  // 获取横向滚动条left (拖动滚动条时)
  getHorizontalThumbLeft = (clientX) => {
    const {left: barLeft} = this.horizontalBar.current.getBoundingClientRect()
    let left = clientX - barLeft - this.thumbClientXToLeft
    const max = this.visibleWidth - this.horizontalThumbWidth
    if (left < 0) {
      return 0
    } else if (left > max) {
      return max
    } else {
      return left
    }
  }

  // 设置 container scroll top
  setContainerScrollTop = (verticalThumbTop) => {
    const fixThumbShort = this.thumbShort ? this.thumbShort * (verticalThumbTop / (this.visibleHeight - 30)) : 0
    const scrollTop = (verticalThumbTop + fixThumbShort) / this.scrollVerticalRatio
    this.container.current.scrollTop = scrollTop
  }

  // 设置 container scroll left
  setContainerScrollLeft = (horizontalThumbLeft) => {
    const fixThumbShort = this.horizontalThumbShort ? this.horizontalThumbShort * (horizontalThumbLeft / (this.visibleWidth - 30)) : 0
    const scrollLeft = (horizontalThumbLeft + fixThumbShort) / this.scrollHorizontalRatio
    this.container.current.scrollLeft = scrollLeft
  }

  // 滚动条是否隐藏
  barIsHidden = () => {

    const { horizontalBarHidden } = this.props

    if (this.scrollVerticalRatio === 1) {
      addClass(this.verticalBar.current, 'hidden')
    } else {
      removeClass(this.verticalBar.current, 'hidden')
    }

    if (this.scrollHorizontalRatio === 1) {
      addClass(this.horizontalBar.current, 'hidden')
      horizontalBarHidden && horizontalBarHidden(true)
    } else {
      removeClass(this.horizontalBar.current, 'hidden')
      horizontalBarHidden && horizontalBarHidden(false)
    }
  }

  // 垂直滚动条 鼠标按下
  handleVerticalThumbMouseDown = (e) => {
    this.resetRatio();
    this.handleVerticalDragStart(e);
  }

  // 垂直开始拖动
  handleVerticalDragStart = (e) => {
    const {clientY} = e;
    const {top} = this.verticalThumb.current.getBoundingClientRect()
    this.thumbClientYToTop = clientY - top // 鼠标点击滚动条的点击位置 到 滚动条顶部到 距离
    this.drag = 'start'

    const verticalThumbTop = this.getVerticalThumbTop(clientY)
    this.verticalThumbTop = verticalThumbTop

    document.addEventListener('mousemove', this.handleVerticalDrag);
    document.addEventListener('mouseup', this.handleVerticalDragEnd);
    // 禁止选择
    addClass(document.getElementsByTagName('body')[0], 'noselect');
    // 添加clss name
    addClass(this.verticalBar.current, 'drag')
  }

  // 垂直拖动滚动条
  handleVerticalDrag = (e) => {
    const {clientY} = e;
    if (this.drag !== 'ing') {
      this.drag = 'ing'
    }
    const verticalThumbTop = this.getVerticalThumbTop(clientY)

    //this.onDragIngDirection(verticalThumbTop, this.verticalThumbTop) // 拖动滚动条时的方向 暂时没用
    //this.verticalThumbTop = verticalThumbTop // 缓存当前的数据

    this.verticalThumb.current.style.top = `${verticalThumbTop}px`;
    this.setContainerScrollTop(verticalThumbTop)
  }

  // 垂直拖动结束
  handleVerticalDragEnd = (e) => {
    //const {clientY} = e;
    this.drag = 'end'

    //const verticalThumbTop = this.getVerticalThumbTop(clientY);

    document.removeEventListener('mousemove', this.handleVerticalDrag);
    document.removeEventListener('mouseup', this.handleVerticalDragEnd);
    // 取消禁止选择
    removeClass(document.getElementsByTagName('body')[0], 'noselect');
    // 删除class name
    removeClass(this.verticalBar.current, 'drag')
    // 拖动结束 判断拖动位置
    this.onDragEndPosition()
  }


  // 横向滚动条 鼠标按下
  handleHorizontalThumbMouseDown = (e) => {
    this.resetRatio();
    this.handleHorizontalDragStart(e);
  }

  // 横向滚动条开始拖动
  handleHorizontalDragStart = (e) => {
    const {clientX} = e;
    const {left} = this.horizontalThumb.current.getBoundingClientRect()
    this.thumbClientXToLeft = clientX - left
    this.drag = 'start'

    document.addEventListener('mousemove', this.handleHorizontalDrag);
    document.addEventListener('mouseup', this.handleHorizontalDragEnd);
    // 禁止选择
    addClass(document.getElementsByTagName('body')[0], 'noselect');
    // 添加clss name
    addClass(this.horizontalBar.current, 'drag')
  }

  // 横向拖动滚动条
  handleHorizontalDrag = (e) => {
    const {clientX} = e;
    if (this.drag !== 'ing') {
      this.drag = 'ing'
    }
    const horizontalThumbLeft = this.getHorizontalThumbLeft(clientX)
    this.horizontalThumb.current.style.left = `${horizontalThumbLeft}px`;
    this.setContainerScrollLeft(horizontalThumbLeft)
  }

  // 横向拖动结束
  handleHorizontalDragEnd = () => {
    this.drag = 'end'
    document.removeEventListener('mousemove', this.handleHorizontalDrag);
    document.removeEventListener('mouseup', this.handleHorizontalDragEnd);
    // 取消禁止选择
    removeClass(document.getElementsByTagName('body')[0], 'noselect');
    // 删除class name
    removeClass(this.horizontalBar.current, 'drag')
  }

  // 滚动时监听位置
  onPosition = (type, scrollTop, deltaY) => {
    // scroll 事件是 滚动条事件 如果滚动条滚不动了 就不好触发
    if (type === 'scroll') {
      const {onScrollTop, onScrollBottom} = this.props // scroll 事件 滚动到 顶部 底部
      if (onScrollTop && scrollTop <= 0) {
        onScrollTop()
      } else if (onScrollBottom && scrollTop + 2 >= this.contentHeight - this.visibleHeight) {
        onScrollBottom()
      }
    } else {
      // wheel  事件是 鼠标滚轮事件 可以一直触发
      const {onWheelTop, onWheelBottom} = this.props // wheel 事件 滚动到 顶部 底部
      if (onWheelTop && scrollTop <= 0 && deltaY < 0) {
        // 截流
        if (!this.onWheelTopTimer || this.onWheelTopTimer + 500 < new Date().getTime()) {
          this.onWheelTopTimer = new Date().getTime();
          onWheelTop();
        }
      } else if (onWheelBottom && scrollTop + 2 >= this.contentHeight - this.visibleHeight && deltaY > 0) {
        if (!this.onWheelBottomTimer || this.onWheelBottomTimer + 500 < new Date().getTime()) {
          this.onWheelBottomTimer = new Date().getTime();
          onWheelBottom();
        }
      }
    }
  }

  // 监听拖动ing
  onDragIngDirection = (thisTop, prevTop) => {
    if (thisTop < prevTop || thisTop <= 0) {
      //console.log('正在向上',thisTop,prevTop)
    } else {
      //console.log('正在向下',thisTop,prevTop)
    }
  }

  // 监听拖动end 滚动条位置
  onDragEndPosition = () => {
    const {onDraglEndTop, onDragEndBottom} = this.props // 拖动到 结束 顶部 底部
    if (this.container.current.scrollTop <= 0) {
      onDraglEndTop && onDraglEndTop();
    }
    if (this.container.current.scrollTop + this.container.current.clientHeight >= this.container.current.scrollHeight) {
      onDragEndBottom && onDragEndBottom();
    }
  }

  // container on scroll
  onScroll = (e) => {
    //console.log('on scroll',e.currentTarget.scrollTop, this.contentHeight, this.visibleHeight)
    this.resetRatio();
    this.setThumbVerticalTop(e.currentTarget.scrollTop); // container 滚动 设置滚动条Top
    this.onPosition('scroll', e.currentTarget.scrollTop)
  }

  onWheel = (e) => {
    const {onWheel} = this.props
    onWheel && onWheel(this);
    //console.log('on wheel',e,e.currentTarget.scrollTop, this.contentHeight, this.visibleHeight)
    //this.resetRatio();
    //this.setThumbVerticalTop(e.currentTarget.scrollTop); // container 滚动 设置滚动条Top
    this.onPosition('wheel', e.currentTarget.scrollTop, e.deltaY)
  }

  // 滚动到指定元素的上一个元素的顶部
  scrollToPrevElementTop = (id) => {
    const child = document.getElementById(id);
    let top = 0
    if (child && child.previousSibling) {
      top = child.previousSibling.offsetTop
    }
    this.container.current.scrollTop = top
  }

  // 滚动到指定元素的底部
  scrollToElementBottom = (id) => {
    const child = document.getElementById(id);
    if (child) {
      const top = child.offsetTop + child.offsetHeight - this.visibleHeight
      this.container.current.scrollTop = top
    }
  }

  // 滚动到顶部
  scrollTo = (px) => {
    this.container.current.scrollTop = px
  }

  // 滚动到顶部
  scrollToTop = () => {
    this.container.current.scrollTop = 0
  }

  // 滚动到底部
  scrollToBottom = () => {
    this.container.current.scrollTop = this.contentHeight - this.visibleHeight
  }

  // 滚动条是否在底部
  scrollIsBottom = () => {
    return !(this.contentHeight > this.container.current.scrollTop + this.visibleHeight)
  }

  render() {
    const {children, className = ''} = this.props

    const scrollbarWidth = getScrollbarWidth(); // 获取滚动条宽度

    const containerStyle = scrollbarWidth ?
      {right: -scrollbarWidth, bottom: -scrollbarWidth, paddingRight: 0, paddingBottom: 0} :
      {right: -20, bottom: -20, paddingRight: 20, paddingBottom: 20}


    return <div
      className={`scroll ${className}`}
      ref={this.scroll}
    >
      <div className='vertical-bar' ref={this.verticalBar}>
        <i ref={this.verticalThumb}/>
      </div>
      <div className='horizontal-bar' ref={this.horizontalBar}>
        <i ref={this.horizontalThumb}/>
      </div>
      <div
        className='container'
        style={containerStyle}
        ref={this.container}
        onScroll={this.onScroll}
        onWheel={this.onWheel}
      >
        {children}
      </div>
    </div>
  }
}
