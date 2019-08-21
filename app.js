//app.js
const ajax = require('utils/ajax.js')
const md5 = require('utils/md5.js')
App({
  onLaunch: function (e) {
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    console.log(extConfig)
    this.loadSettingParam(extConfig)
    this.setGlobalShareAppMessage()
    this.checkUpdate()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const openId = wx.getStorageSync('openId' + this.globalData.platformAppArea) || ''
    const unionId = wx.getStorageSync('unionId' + this.globalData.platformAppArea) || ''
    const sessionKey = wx.getStorageSync('sessionKey' + this.globalData.platformAppArea) || ''

    console.log(this.globalData)
    if (openId === '') {
      // 登录
      const app_area = this.globalData.platformAppArea
      wx.login({
        success: res => {
          console.log(res)
          ajax.getApi('third/platform/event/code2Session', {
            js_code: res.code,
            authorizer_appid: this.globalData.appId
          }, (err, rest) => {
            if (rest && rest.success) {
              console.log(rest.data)
              const result = rest.data
              this.globalData.openId = result.openid
              this.globalData.unionId = result.unionid
              this.globalData.sessionKey = result.session_key
              wx.setStorageSync('openId' + app_area, result.openid)
              wx.setStorageSync('unionId' + app_area, result.unionid)
              wx.setStorageSync('sessionKey' + app_area, result.session_key)
              this.getUserSetting()
            }
            if(rest && rest.text) {
              wx.showModal({
                title: '错误',
                content: rest.text,
              })
            }
          })
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        },
        fail: res => {
          console.log(res)
        }
      })
    } else {
      this.globalData.openId = openId
      this.globalData.unionId = unionId
      this.globalData.sessionKey = sessionKey
      this.getUserSetting()
    }

  },

  checkUpdate() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            wx.clearStorage()
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  },

  getUserSetting() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: 'zh_CN',
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.bindMember(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  bindMember(userInfo, callback) {
    if (this.globalData.memberInfo) {
      return;
    }
    ajax.getApi('mini/program/createMember', {
      ...userInfo,
      openId: this.globalData.openId,
      unionId: this.globalData.unionId,
      app_area: this.globalData.platformAppArea,
      // referrer_member_id: this.globalData.piaopiaoQianMemberId
    }, (err, res) => {
      if (res.success) {
        this.getMemberInfo(callback)
      } else {
        wx.showToast({
          title: '创建用户失败',
          mask: true
        })
      }
    })
  },

  getMemberInfo(callback) {
    const signature = md5.hexMD5(this.globalData.openId + this.globalData.appId)
    ajax.postApi('mini/program/member/miniLogin', {
      signature,
      openId: this.globalData.openId
    }, (err, res) => {
      if (res.success) {
        this.globalData.memberInfo = res.data
        if (res.data.phone) {
          this.globalData.isBindPhone = true
        }
        if (callback) {
          callback(res.data)
        }
      }
    })
  },

  loadSettingParam(config) {
    this.globalData.platformAppArea = config.PLATFORM_APP_AREA
    this.globalData.qqMapKey = config.QQ_Map_KEY
    this.globalData.appId = config.APP_ID
    this.globalData.appName = config.APP_NAME
    this.globalData.appModules = config.APP_MODULES
    this.globalData.shareSetting = config.SHARE_SETTING
    ajax._config.platformAppArea = config.PLATFORM_APP_AREA
  },

  setGlobalShareAppMessage() {
    const shareSetting = this.globalData.shareSetting
    const is_open_global = shareSetting.IS_OPEN_GLOBAL
    const default_setting = shareSetting.DEFAULT

    if (is_open_global == 1) {
      wx.onAppRoute(res => {
        //获取加载的页面
        const pages = getCurrentPages()
          //获取当前页面的对象
        const view = pages[pages.length - 1]
        if(view) {
          const route = view.route
          //onShareAppMessage()返回undefined说明此页面没有做特定分享操作，则统一使用默认分享
          if (view.onShareAppMessage() === undefined) {
            view.onShareAppMessage = function () {
              return default_setting
            }
          }
        }
      })
    }
  },

  globalData: {
    platformAppArea: '',
    qqMapKey: '',
    appId: '',
    appName: '',
    appModules: {},
    shareSetting: {},
    isBindPhone: false,
    openId: '',
    sessionKey: '',
    unionId: '',
    memberInfo: null,
    userInfo: null,
    jsSessionId: null,
  }
})