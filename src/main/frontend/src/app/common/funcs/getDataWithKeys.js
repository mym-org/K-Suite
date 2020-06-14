const getDataWithKeys = (data, keys) => {
  if (!data || !keys) {
    return ''
  }

  const keyArr = keys.split('.');
  let value = data;
  for (const i of keyArr) {
    value = value[i] || ''
  }
  return value

};

export default getDataWithKeys;