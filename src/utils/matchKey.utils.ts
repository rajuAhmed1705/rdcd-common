// dataKeysArray is a array and reqKeys is need to be also a Array

export function isKeyExist(dataKeysArray: any, reqKeys: any) {
  let consistKeyExist;

  for (const element of reqKeys) {
    const bodyKeys = Object.keys(element);
    consistKeyExist = isMatch(dataKeysArray, bodyKeys);
    if (!consistKeyExist) {
      return false;
    }
  }
  return true;
}
function isMatch(dataKeys: string[], bodyKeys: any) {
  let returnValue = true;
  for (var i = 0; i < bodyKeys.length; i++) {
    let isKeyExist: boolean = dataKeys.includes(bodyKeys[i]);
    if (!isKeyExist) {
      console.log(bodyKeys[i]);
      returnValue = false;
      break;
    }
  }
  return returnValue;
}
