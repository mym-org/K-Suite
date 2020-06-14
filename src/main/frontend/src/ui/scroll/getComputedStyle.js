/* eslint-disable */
export default (obj, style) => {
  var oStyle = obj.currentStyle? obj.currentStyle : window.getComputedStyle(obj, null);
  if (oStyle.getPropertyValue) {
    return oStyle.getPropertyValue(style)
  } else {
    return oStyle.getAttribute(style)
  }
}
