import _ from 'loadsh';

const componentList = {
  consumerList: {
    lower: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '0.10', '0.11', '0.12', '0.13', '0.14', '1.0'],
    higher: ['1.1', '1.2', '1.3', '1.4', '1.5'],
    latest: ['2.0'],//latest一般只会有一个版本
  },
  basicAuth: {
    lower: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '0.10', '0.11', '0.12', '0.13', '0.14'],
    higher: ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5']
  },
  keyAuth: {
    lower: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '0.10', '0.11', '0.12', '0.13', '0.14'],
    higher: ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5']
  },
  oauth2: {
    lower: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '0.10', '0.11', '0.12', '0.13', '0.14'],
    higher: ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5']
  }

}

//version是commonStore中获取到的当前版本号
const versionStr = (name, version, com = componentList) => {
  const comConfig = com[name];
  // version=' 0.11.1'
  //  本想正则匹配，发现并无捷径，只能截取版本前两位再与数组匹配了
  //  这样写满足后台返回version为x.xx和x.xx.xx
  //将版本拆成数组
  const numArr = _.words(version);
  //拼装前两个
  let regStr = numArr[0] + '.' + numArr[1];

  let key = _.findKey(comConfig, function (o) {
    let index = _.findIndex(o, function (v) {
      return v === regStr;
    });
    if (index !== -1) {
      return o;
    }
  });

  //lower,higher,latest
  return key ? key : 'unsupported';

}
export default versionStr;