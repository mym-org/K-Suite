/* eslint-disable */
export default function windowScroll() {
  let t
  const target = (((t = document.documentElement) || (t = document.body.parentNode))
  && typeof t.scrollTop == 'number' ? t : document.body)
  return {top:target.scrollTop, left:target.scrollLeft}
}