var Utils = {
  deepClone: function (obj) {
    let newObj = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
          newObj[key] = (obj && typeof obj[key] === 'object') ? this.deepClone(obj[key]) : obj[key];
        }
      }
    }
    return newObj;
  },
  objToList: function (obj, keyProp) {
    var list = [];
    Object.keys(obj).forEach(key => {
      var newObj = obj[key];
      newObj[keyProp] = key;
      list.push(newObj);
    });
    return list;
  },
  arrayKv: function (array, keyProp) {
    var result = [];
    array.forEach((item) => {
      item.v[keyProp] = item.k;
      result.push(item.v);
    });
    return result;
  }
}
export default Utils



