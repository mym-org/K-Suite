import React from 'react'
import FormatJson from '../../common/formatJson'
import css from './index.module.scss'
import { message, Icon } from 'antd'
import PageTitleBar from "@/app/common/pageTitleBar";

export default class Info extends React.Component {
  state = {
    data: {},
    server: {}
  }

  componentDidMount() {
    this.getJson()
    this.getData()
  }

  getJson = () => {
    const { httpAgent } = this.props

    httpAgent.kong({
      adminApi: '/',
      httpMethod: "GET"
    }).then(res => {
      const { resultCode, resultMessage, data } = res
      if (resultCode === '000000') {
        this.setState({ data })
      } else {
        message.error(resultMessage)
      }
    })
  }

  getData = () => {
    const { httpAgent } = this.props

    httpAgent.kong({
      adminApi: '/status',
      httpMethod: "GET"
    }).then(res => {
      const { resultCode, resultMessage, data: { server } = {} } = res
      if (resultCode === '000000') {
        this.setState({ server })
      } else {
        message.error(resultMessage)
      }
    })
  }


  render() {
    const { data, server } = this.state
    const { connections_accepted, connections_active, connections_handled, connections_reading, connections_waiting, connections_writing, total_requests } = server
    return (
      <div>
          <PageTitleBar title='Node Info'
          desc={'Generic details about the node.'} />
        <div class={css.info}>
          <div class={css.title}>
            <span><Icon type="api" theme="filled" /> CONNECTIONS</span>
            <span>Total Requests: <strong>{total_requests}</strong></span>
          </div>
          <ul class={css.list}>
            <li>
              <span>ACTIVE</span>
              <p>{connections_active}</p>
            </li>
            <li>
              <span>READING</span>
              <p>{connections_reading}</p>
            </li>
            <li>
              <span>WRITING</span>
              <p>{connections_writing}</p>
            </li>
            <li>
              <span>WAITING</span>
              <p>{connections_waiting}</p>
            </li>
            <li>
              <span>ACCEPTED</span>
              <p>{connections_accepted}</p>
            </li>
            <li>
              <span>HANDLED</span>
              <p>{connections_handled}</p>
            </li>
          </ul>
          </div>
        

          <FormatJson result={data} />
       
      </div>)
  }
}
