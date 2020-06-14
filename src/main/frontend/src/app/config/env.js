function env(){
  if(process.env.REACT_APP_ENV === 'development'){
    // 开发
    return {
      APIROOT:'http://localhost:3000/api',
      APIVERSION: 'v1.0.0', // API version
    }
  } else if(process.env.REACT_APP_ENV === 'test'){
    // 测试
    return {
      APIROOT:'api',
      APIVERSION: 'v1.0.0', // API version
    }
  } else{
    // 生产 process.env.REACT_APP_ENV === 'production'
    return {
      APIROOT:'api',
      APIVERSION: 'v1.0.0', // API version
    }
  }
}

export default env()