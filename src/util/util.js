var Utils = {
  deepClone: function(obj) {
    const newObj = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
          newObj[key] =
            obj && typeof obj[key] === 'object'
              ? this.deepClone(obj[key])
              : obj[key];
        }
      }
    }
    return newObj;
  },
  objToList: function(obj, keyProp) {
    var list = [];
    Object.keys(obj).forEach(key => {
      var newObj = obj[key];
      newObj[keyProp] = key;
      list.push(newObj);
    });
    return list;
  },
  arrayKv: function(array, keyProp) {
    var result = [];
    array.forEach(item => {
      item.v[keyProp] = item.k;
      result.push(item.v);
    });
    return result.sort(function(a, b) {
      return a.name > b.name ? 1 : -1;
    });
  },
  deleteFn: function(_this, msg, url, queryFunction) {
    _this
      .$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        _this.$axios.delete(url).then(() => {
          _this.$message({
            type: 'success',
            message: '删除成功!'
          });
          queryFunction();
        });
      })
      .catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
  },
  /**
   *  调用运行的API.
   */
  runFn: function(_this, api, runSuccessCallback) {
    _this.$axios.post(api).then(res => {
      runSuccessCallback(res);
    });
  },
  stringFormat: function() {
    if (arguments.length == 0) return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
      str = str.replace(re, arguments[i]);
    }
    return str;
  }
};
export default Utils;
