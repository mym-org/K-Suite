import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import {createHashHistory} from 'history';

import {ConfigProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import * as serviceWorker from '../serviceWorker';
import App from './pages'
import './assets/css/restyle.css'
import './assets/css/common.css'

const history = createHashHistory({
  basename: '/'
})


  ReactDOM.render(
    <ConfigProvider>
        <Router history={history}>
          <App/>
        </Router>
    </ConfigProvider>
    , document.getElementById('root')
  );


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
