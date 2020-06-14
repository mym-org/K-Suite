import './index.css'
export default function tost(info){
  let tost = document.querySelector('#ui-tost')
  const frame = document.getElementById('app') || document.body
  if(!tost) {
    tost = document.createElement('div')
    tost.id = 'ui-tost'
    tost.classList.add('ui-tost')
    frame.appendChild(tost)
  }

  const {karauiSetting:{tost:{className=null}={}}={}} = window
  if(className) {
    tost.classList.add(className)
  }

  let msg = ''
  let time = 2
  let type = 'success'
  let once = true
  let link = null
  if(typeof info === 'string') {
    msg = info
  }else{
    msg = info.msg
    time = info.time || time
    type = info.type || type
    once = info.once || once
    link = info.link || link
  }

  if(once) {
    const tostList = document.querySelectorAll('.ui-tost-item')
    for(const k of tostList) {
      const text = k.querySelector('span').textContent
      if(text === msg) {
        // 默认 同样的消息只展示一次
        return false
      }
    }
  }

  const item = document.createElement('div')
  const itemBg = document.createElement('i')
  const itemWrap = document.createElement('p')
  const itemText = document.createElement('span')
  itemWrap.appendChild(itemText)
  item.appendChild(itemBg)
  item.appendChild(itemWrap)
  item.classList.add('ui-tost-item')

  const msgNode = document.createTextNode(msg)
  itemText.appendChild(msgNode)
  item.classList.add(type)
  itemBg.classList.add(`s-bg-${type}`)

  if(link) {
    const itemLink = document.createElement('a')
    const linkNode = document.createTextNode(link.text)
    itemLink.setAttribute('href',link.href)
    itemLink.classList.add('s-warn')
    itemLink.appendChild(linkNode)
    itemWrap.appendChild(itemLink)
  }

  tost.appendChild(item)

  setTimeout(()=>{
    tost.removeChild(item)
    if(!tost.hasChildNodes()){
      frame.removeChild(tost)
    }
  },time*1000)
}
const typeTost = (info,type) => {
  let newInfo = {}
  if(typeof info === 'string') {
    newInfo = {
      type,
      msg: info,
    }
  }else{
    newInfo = {...info,type}
  }
  tost(newInfo)
}

const successTost = (info) => {
  typeTost(info,'success')
}

const errorTost = (info) => {
  typeTost(info,'error')
}

const warnTost = (info) => {
  typeTost(info,'warn')
}

const infoTost = (info) => {
  typeTost(info,'info')
}

export {successTost,errorTost, warnTost, infoTost}