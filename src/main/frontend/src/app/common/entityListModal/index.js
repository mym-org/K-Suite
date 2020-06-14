import React from 'react'
import {Modal} from "antd";
import PageMake from "../pageMake";


export default class EntityListModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      maxHeight: undefined
    }
  }

  componentDidMount() {
    const clientHeight = document.body.clientHeight;
    this.setState({
      maxHeight: clientHeight - 200
    });

  }


  render() {
    const {visible, close, modalConfig: {config = {}}, rowData} = this.props;
    const {maxHeight} = this.state;
    const modalProps = {
      visible,
      onCancel: close,
      footer: null,
      title: config.pageModelName && config.pageModelName.toUpperCase(),
      width: 1100,
      bodyStyle: {maxHeight: maxHeight, overflowY: 'scroll'}
    };

    return <Modal {...modalProps}>
      <PageMake {...this.props} entityName={config.pageModelName} $scope_parent_entity_data={rowData}/>
    </Modal>
  }
}