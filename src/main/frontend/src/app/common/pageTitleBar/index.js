import React from 'react'
import css from "./index.module.scss";

export default class PageTitleBar extends React.Component {


  render() {
    const {title, desc} = this.props;
    return <div className={css.info}>
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{__html: desc}}></p>
    </div>
  }
}