/* eslint-disable */
import React from 'react'
import classnames from 'classnames'

//  eslint-disable-next-line react/prefer-stateless-function
export default class Root extends React.Component {

  render() {
    const { title, message, confirmButton = 'confirm', cancelButton = 'cancel', onConfirm, onCancel, className } = this.props
    return (<div className={classnames('brick-modal-confirm', className)}>
      {title ? <h3 className="brick-modal-title">{title}</h3> : null}
      {message ? <p className="brick-modal-message">{message}</p> : null}
      <div className="brick-modal-footer">
        <span>
          <button onClick={onCancel}>{cancelButton}</button>
        </span>
        <span>
          <button onClick={onConfirm}>{confirmButton}</button>
        </span>
      </div>
    </div>)
  }
}
