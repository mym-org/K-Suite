//上面图标，下面文字
import React from 'react';
import {Ico} from '@/ui'


export default class ImgAndText extends React.Component {

  render() {

    const {str, icoType} = this.props;
    return <div style={{textAlign: 'center', fontWeight: 700}}>
      <div><Ico type={icoType} style={{margin: 'auto', fontSize: '22px'}}/></div>
      <div>{str}</div>
    </div>

  }
}
