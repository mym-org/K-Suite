/* eslint-disable */
// FIXME

function getInnerHeight(el) {
  const { clientHeight } = el;
  const { paddingTop, paddingBottom } = getComputedStyle(el);
  return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}

function getInnerWidth(el) {
  const { clientWidth } = el;
  const { paddingRight, paddingLeft } = getComputedStyle(el);
  return clientWidth - parseFloat(paddingRight) - parseFloat(paddingLeft);
}

export default {
  width: getInnerWidth,
  height:getInnerHeight,
}