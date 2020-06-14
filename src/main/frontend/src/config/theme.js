/*
  样式替换在webpack中进行，所以修改此文件后请重新 npm start
  ant 默认样式地址
  https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
 */
const theme = {
  "text-color": '#232322', // 字体颜色
  "primary-color": '#1abb9c', // 主色 凸显色
  "layout-header-background": "#fff", // 布局头部 和 侧栏 背景颜色
  "table-padding-vertical": "14px", // 表格padding
  "table-padding-horizontal": "4px", // 表格padding
  "table-header-bg": '#e3e3e2', // 表头颜色
  "table-selected-row-bg": '#bfeafa', // 选中的颜色
  "form-item-margin-bottom": '16px', // 表格 下 间距
  "input-height-base": '32px', // 表格 输入框 高度
}
module.exports = theme;