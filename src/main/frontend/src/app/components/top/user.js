import React from 'react'
import {inject, observer} from 'mobx-react';
import css from './user.module.scss'
import user from '../../assets/img/user.png'

@inject('commonStore')
@observer
class User extends React.Component {
    render() {
        const {userInfo} = this.props.commonStore
        return (<div className={css.user}>
            <img src={userInfo.headIcon || 'data:image/png;base64,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'} alt="user"/>
            <span>Welcome,</span>
            <span>{userInfo.username}</span>
            <a href='/logout'>logout</a>
        </div>)
    }
}

export default User

