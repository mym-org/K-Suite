const setDataWithKeys = (data, keys, value) => {
  if (!data || !keys) {
    return ''
  }

  const keyArr = keys.split('.');
  let updateData = data;
  for (const i of keyArr) {
    updateData[i] = value
  }
  return updateData

};

export default setDataWithKeys;