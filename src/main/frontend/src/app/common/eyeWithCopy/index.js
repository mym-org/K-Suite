// 小眼睛弹窗，带复制按钮
import React from 'react'
import {Icon, Modal, Tooltip, message} from "antd";
import copy from "copy-to-clipboard";
import css from './index.module.scss'

export default class EyeWithCopy extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,//弹窗
      maxHeight: undefined
    }
  }

  componentDidMount() {

  }

  showModal = () => {
    //动态计算添加弹窗的固定高
    const clientHeight = document.body.clientHeight;
    this.setState({
      visible: true,
      maxHeight: clientHeight - 200
    })
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  clickCopy = (e) => {
    e.stopPropagation();
    const {data} = this.props;
    if (copy(JSON.stringify(data))) {
      message.success('Copied to clipboard')
    }
  }

  render() {
    const {data = {}} = this.props;
    const {visible, maxHeight} = this.state;

    const modalProps = {
      visible,
      onCancel: this.hideModal,
      footer: null,
      title: 'RAW VIEW',
      bodyStyle: {maxHeight: maxHeight, overflowY: 'scroll'}
    };

    return <div className='label-text'>
      <Tooltip title='RAW VIEW'>
        <Icon type="eye" style={{color: '#1abb9c', fontSize: '18px'}} onClick={() => this.showModal(data)}/>
      </Tooltip>


      {
        visible ?
          <Modal {...modalProps}>
            <Icon type="copy" onClick={(e) => this.clickCopy(e)} theme="twoTone"
                  style={{float: "right", fontSize: '20px'}}/>
            <div className={`jsonStyle ${css['view-code']}`}>{JSON.stringify(data, null, 10)}</div>
          </Modal> : null
      }


    </div>
  }
}