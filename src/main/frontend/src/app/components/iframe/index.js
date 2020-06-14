import React from 'react'
import { Button } from 'antd';

export default class IFrame extends React.Component {

    render() {
        return (
            <div style={{height: '100%', position: 'relative'}}>
                <div style={{position: 'absolute', top: -15, left: 0}}>
                    <Button size="small" onClick={this.props.close}>返回</Button>
                </div>
                <iframe
                    ref="iframe"
                    src={this.props.iframeSrc}
                    width="100%"
                    height="100%"
                    frameborder="0"
                />
            </div>
        );
    }
}
