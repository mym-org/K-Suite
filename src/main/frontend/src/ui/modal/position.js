/* eslint-disable */
import windowScroll from './windowScroll'
export default function position(target, modal, align, vertical, offset) {
  const {x = 0, y = 0} = offset
  const targetRect = target.getBoundingClientRect()
  const modalRect = modal.getBoundingClientRect()
  const position = {}

  const top = targetRect.top + windowScroll().top
  const right = targetRect.right + windowScroll().left
  const bottom = targetRect.bottom  + windowScroll().top
  const left = targetRect.left + windowScroll().left

  if(align === 'l2l' || align === 'left') {
    position.left = left + x
  }else if(align === 'l2c') {
    position.left = left + targetRect.width / 2 + x
  }else if(align === 'l2r') {
    position.left = right + x
  }else if(align === 'c2l') {
    position.left = left - modalRect.width / 2 + x
  }else if(align === 'c2r') {
    position.left = right - modalRect.width / 2 + x
  }else if(align === 'r2l') {
    position.left = left - modalRect.width + x
  }else if(align === 'r2c'){
    position.left = left + targetRect.width / 2 - modalRect.width + x
  }else if(align === 'r2r' || align === 'right') {
    position.left = right - modalRect.width + x
  }else{
    // modal center to target center
    position.left = left + targetRect.width/2 - modalRect.width/2 + x
  }

  if(vertical === 't2t' || vertical === 'top') {
    position.top = top + y
  }else if(vertical === 't2m'){
    position.top = top  + targetRect.height / 2 + y
  }else if(vertical === 't2b'){
    position.top = bottom + y
  }else if(vertical === 'm2t'){
    position.top = top - modalRect.height / 2 + y
  }else if(vertical === 'm2b'){
    position.top = bottom - modalRect.height / 2 + y
  }else if(vertical === 'b2t'){
    position.top = top - modalRect.height + y
  }else if(vertical === 'b2m'){
    position.top = top + targetRect.height / 2 - modalRect.height + y
  }else if(vertical === 'b2b' || vertical === 'bottom'){
    position.top = bottom - modalRect.height + y
  }else{
    // modal middle to target middle
    position.top = top + targetRect.height/2 - modalRect.height/2 + y
  }

  return position
}
