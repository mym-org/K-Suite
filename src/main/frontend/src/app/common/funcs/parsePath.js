const parsePathPram = (data, path) => {
  // console.log(data, path, '解析path');

  if (!data) {
    return ''
  }
  let api = path;

  let regex = new RegExp("{([\\s\\S]+?)}", "g");
  //遍历path中的{变量}
  try {
    let result;
    while ((result = regex.exec(path)) != null) {
      //支持xx_xx,xx.xx:result[0]="{id}",result[1]='id'

      const keyArr = result[1].split('.');
      let id = data;
      for (const i of keyArr) {
        id = id[i]
      }
      //替换成实例对应的值
      api = api.replace(result[0], id);
    }
  } catch (err) {
    return null;
  }
  return api

};

export default parsePathPram;