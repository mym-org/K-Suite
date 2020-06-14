const textLine = (text,width,fontSize,line) => {
  let textArrs = text.split('')
  const container = document.createElement('span')
  container.style.fontSize = `${fontSize}px`
  document.body.appendChild(container)
  const lines = []
  const getLine = (textArr) => {
    let a = textArr
    let thisLineText = ''
    let hasShort = true
    for(const v of a) {
      thisLineText+=v
      if(lines.length === line-1) {
        container.innerText = thisLineText+'...'
      }else{
        container.innerText = thisLineText
      }
      if(container.offsetWidth >= width) {
        thisLineText = thisLineText.slice(0,-1)
        if(lines.length === line-1) {
          lines.push(thisLineText+'...')
        }else{
          lines.push(thisLineText)
        }
        a = a.slice(thisLineText.length)
        hasShort = false
        break;
      }
    }
    if(hasShort) {
      lines.push(text.slice(-a.length))
      return lines
    }
    if(lines.length === line) {
      return lines
    }
    return getLine(a)
  }
  const res = getLine(textArrs)
  document.body.removeChild(container)
  return res
}
export default textLine