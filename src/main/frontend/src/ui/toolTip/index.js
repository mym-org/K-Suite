import "./index.css"

function getCssText(position, target, containerRect) {
  //console.log('css text',position,target,containerRect)

  const app = document.getElementById('app') || document.body
  const appRect = app.getBoundingClientRect()

  let top=0,left=0,iStyle=''
  const {p,a} = position // p 定位 a 对齐方式

  // 垂直位置
  if(p === 'top') {
    // 上定位
    top = target.top - containerRect.height - 6
  }else if(p === 'bottom') {
    // 下定位
    top = target.bottom + 6
  }else{
    // 左右定位 垂直对齐方式分 上中下 3种情况
    if(a === 'top') {
      top = target.top
      iStyle = `top: ${target.height/2 - 5}px;`
    }else if(a === 'bottom'){
      top = target.top - (containerRect.height - target.height)
      iStyle = `bottom: ${target.height/2 - 5}px;`
    }else{
      // 默认垂直居中
      top = target.top + (target.height - containerRect.height) / 2
      iStyle = `top: ${containerRect.height/2 - 5}px;`
    }
  }

  // 水平位置
  if(p === 'left') {
    // 左定位
    left = target.left - 6 - containerRect.width
  }else if(p === 'right') {
    // 右定位
    left = target.right + 6
  }else{
    // 上下定位 水平对齐方式分 左种右 3种情况
    if(a === 'left') {
      left = target.left
      iStyle = `left: ${target.width/2-5}px;`
    }else if(a === 'right'){
      left = target.right - containerRect.width
      iStyle = `right: ${target.width/2-5}px;`
    }else{
      // 默认居中对齐
      left = target.left + target.width / 2 - containerRect.width / 2
      iStyle = `left: ${containerRect.width/2-5}px;`
    }
  }

  return {
    container: `position: absolute; top: ${top}px; left: ${left}px;`,
    i:iStyle
  }

}

// 自动纠正 定位 如：目标元素在浏览器顶部，定位也是在元素顶部，那么纠正定位到元素底部
// 自动纠正 对齐 如：目标元素在浏览器右边，定位是上或下，对齐方式是居中，但是文案太长，自动纠正成右对齐
// position 定位
// align 对齐方式
function autoPosition(position, align, target, containerRect) {
  const app = document.getElementById('app') || document.body
  const appRect = app.getBoundingClientRect()
  let p = position,a = align

  // 定位
  if(p === 'top' && target.top - containerRect.height - 6 < appRect.top) {
    p = 'bottom'
  }
  if(p === 'bottom' && target.bottom + containerRect.height + 6 > appRect.bottom) {
    p = 'top'
  }
  if(p === 'left' && target.left - containerRect.width - 6 < appRect.left) {
    p = 'right'
  }
  if(p === 'right' && target.right + containerRect.width + 6 > appRect.right) {
    p = 'left'
  }

  // 对齐
  if(p === 'top' || p === 'bottom') {
    // 纠正右侧超出
    if(a === 'center' && target.right + (containerRect.width - target.width)/2 > appRect.right) {
      a = 'right'
    }
    if(a === 'left' && target.left + containerRect.width > appRect.right) {
      a = 'right'
    }
    // 纠正左侧超出
    if(a === 'center' && target.left - (containerRect.width - target.width)/2 < appRect.left) {
      a = 'left'
    }
    if(a === 'right' && target.left - (containerRect.width - target.width) < appRect.left) {
      a = 'left'
    }
  }else{
    // position left right
    // 纠正顶部超出
    if(a === 'center' && target.top - (containerRect.height - target.height)/2 < appRect.top) {
      a = 'top'
    }
    if(a === 'bottom' && target.top - (containerRect.height - target.height) < appRect.top) {
      a = 'top'
    }
    // 纠正底部超出
    if(a === 'center' && target.bottom + (containerRect.height - target.height)/2 > appRect.bottom) {
      a = 'bottom'
    }

    if(a === 'top' && target.bottom + (containerRect.height - target.height) > appRect.bottom) {
      a = 'bottom'
    }
  }
  return {p,a}
}

export default function (params) {
  const container = document.getElementById('tooltip')
  if (container) {
    document.body.removeChild(container) // 删除上一条tooltip
  }

  if (params.leave) {
    return // 当鼠标离开 不进行任何操作 只执行了删除上一条tooltip 间接起到删除效果
  }

  // e 触发当目标元素
  // msg 要提示的消息
  // position  消息的定位方式 默认 top
  // align 消息的对齐方式 默认 center
  // maxWidth 消息的最大宽带 默认 300px
  const {e, msg = 'react-tooltip-plugin', position = 'top', align = 'center', maxWidth = 300} = params
  const target = e.target

  const targetRect = target.getBoundingClientRect()

  const _container = document.createElement('div') // 创建tooltip
  _container.id = 'tooltip'
  _container.classList.add('tooltip')

  const _i = document.createElement('i') // 创建小箭头
  _container.appendChild(_i)

  const _p = document.createElement('p') // 创建文本信息
  _p.innerText = msg

  _container.appendChild(_p)
  _container.style.maxWidth = `${maxWidth}px` // 提前绑定宽带用于自动计算定位和对齐

  document.body.appendChild(_container) // 添加到 body

  const containerRect = _container.getBoundingClientRect()
  const newPosition = autoPosition(position, align, targetRect, containerRect) // 自动纠正定位和对齐方式
  const cssText = getCssText(newPosition, targetRect, containerRect) // 根据定位和对齐方式生成样式

  _container.classList.add(newPosition.p) // 定位的class name
  _container.style.cssText = cssText.container // 绑定样式
  _container.style.maxWidth = `${maxWidth}px` // 重新绑定被 cssText 替换掉的样式
  _i.style.cssText = cssText.i // 箭头绑定样式
  _container.style.opacity = '1' // 默认是 opacity 0 防止视觉抖动 当所以样式完成后 在显示tooltip

}