/* eslint-disable */
// FIXME

const hasClass = (obj, cls) => {
  return obj.className ? obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')) : false;
}

const addClass = (obj, cls) => {
  if (!hasClass(obj, cls)) obj.className += " " + cls;
}

const removeClass = (obj, cls) => {
  if (hasClass(obj, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    obj.className = obj.className.replace(reg, ' ');
  }
}

const toggleClass = (obj,cls) => {
  if(hasClass(obj,cls)){
    removeClass(obj, cls);
  }else{
    addClass(obj, cls);
  }
}

export {hasClass, addClass, removeClass, toggleClass}