const util = require('util.js')

const _config = {
  // serverUrl: 'https://fall.wlhn.com/fallapp-child-dlxapp-userlla/',
  serverUrl: 'https://fall.wlhn.com/fallapp-main-wlhn/',
  platformAppArea: ''
}

function getApi(apiName, params, cb, isOwnAddress) {
  if (params) {
    params = filterNull(params)
  }
  request({
    url: isOwnAddress ? apiName : _config.serverUrl + apiName,
    data: params,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8', // 默认值
      'Accept-Language': 'zh-CN,zh;q=0.8' // 默认值
    },
    success: function (res) {
      typeof cb == "function" && cb(null, res.data)
    },
    fail: function (err) {
      typeof cb == "function" && cb(err)
    }
  }) 
}

function postApi(apiName, params, cb, isOwnAddress) {
  if (params) {
    params = filterNull(params)
  }
  request({
    url: isOwnAddress ? apiName : _config.serverUrl + apiName,
    data: params,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8', // 默认值
      'Accept-Language': 'zh-CN,zh;q=0.8' // 默认值
    },
    success: function (res) {
      typeof cb == "function" && cb(null, res.data)
    },
    fail: function (err) {
      typeof cb == "function" && cb(err)
    }
  })
}

function request(requestSetting) {
  let JSSESSIONID = wx.getStorageSync('JSSESSIONID')
  if (JSSESSIONID === '') {
    JSSESSIONID = util.RandomUUID()
    wx.setStorageSync('JSSESSIONID', JSSESSIONID)
  }
  requestSetting.header['cookie'] = 'JSESSIONID=' + JSSESSIONID
  requestSetting.header['Platform-Area'] = _config.platformAppArea
  wx.request(requestSetting)
}

//自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull(o) {
  for (let key in o) {
    if (o[key] === null || o[key] === undefined) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
      if (o[key] === '') {
        delete o[key]
      }
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}


module.exports = {
  getApi,
  postApi,
  _config
}