//1.2.x:plugins表格scope列特殊处理
import {Link} from "react-router-dom";
import moment from "moment";
import {Tag} from "antd";
import React from "react";

export default {
  _plugin_scope: (data) => {
    let tdShow = data['api_id'] ? 'api' :
      data.route && data.route.id ? 'routes' :
        data.service && data.service.id ? 'services' : 'global';
    return <span>{tdShow}</span>
  },

//1.2.x:plugins表格apply_to列特殊处理
  _plugin_apply_to: (data) => {

    return data['api_id'] ? <Link to={`/apis/${data['api_id']}`}>{data['api_id']}</Link> :
      data.route && data.route.id ? <span>{data.route.id}</span> :
        data.service && data.service.id ?
          <Link to={`/services/${data.service.id}`}>{data.service.id}</Link> :
          <span>All Entrypoints</span>
  },

//时间格式化
  _format_date: (data, fieldName) => {
    return data[fieldName] ? moment(data[fieldName]).format("YYYY-MM-DD hh:mm:ss") : ''
  },
//时间格式化
  _format_date2: (data, fieldName) => {
    return data[fieldName] ? moment(data[fieldName] * 1000).format("YYYY-MM-DD hh:mm:ss") : ''
  },

//标签格式化
  _format_tags: (data, fieldName) => {
    return data[fieldName] && data[fieldName].length > 0 ? data[fieldName].map((item, key) =>
      <Tag key={key} color='cyan'>{item}</Tag>) : null
  }
}
