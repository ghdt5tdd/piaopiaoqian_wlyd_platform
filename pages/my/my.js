//index.js
//获取应用实例
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()


Page({
  data: {
    click_clearStorage: 0,
    memberIsLoad: false,
    phone: undefined,
    bind: false,
    collect: "未开通",
    hideShadow: true,
    hideUntying: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //拨打电话
  bookTel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  
  //微信账号授权
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.userInfo == undefined) {
      wx.showToast({
        title: '登录账号获取更优服务',
        icon: 'none',
        duration: 3000,
        mask: true
      })
    } else {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },

  //登录
  getUserInfo: function (e) {
    const userInfo = e.detail.userInfo
    if (userInfo == undefined) {
      wx.showToast({
        title: '请先登录账号',
        icon: 'none',
        duration: 3000,
        mask: true
      })
    } else {
      app.globalData.userInfo = userInfo
      app.bindMember(userInfo, () => {
        this.setData({
          bind: app.globalData.isBindPhone,
          memberIsLoad: true,
          phone: app.globalData.memberInfo.phone
        })
      })

      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })

    }
  },

  showClearStorage(e) {
    let click_clearStorage = this.data.click_clearStorage
    if (click_clearStorage < 8) {
      click_clearStorage ++
      this.setData({
        click_clearStorage
      })
    }
  },

  clearStorage(){
    wx.showModal({
      title: '警告',
      content: '是否确定清除本地缓存?（清除后必须重启小程序）',
      success: function () {
        wx.clearStorage()
      },
    })
  },

  toShopOrder(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../receiver/receiver?type=' + type,
    })
  },


  //用户解除绑定
  untying: function(e) {
    this.setData({
      hideShadow: false,
      hideUntying: false
    })
  },

  sure: function(e) {
    this.setData({
      hideShadow: true,
      hideUntying: true,
      bind: false
    })
  },


  //关闭弹窗
  hide: function(e) {
    this.setData({
      hideShadow: true,
      hideUntying: true
    })
  },


  loadUserInfo(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onLoad: function() {
    util.callIf(() => {
      this.setData({
        memberIsLoad: true
      })
    }, () => {
      return app.globalData.memberInfo !== null
    })
    this.loadUserInfo()
  },

  onShow: function() {
    util.callIf(() => {
      this.setData({
        bind: app.globalData.isBindPhone,
        phone: app.globalData.memberInfo.phone
      })
    }, () => {
      return app.globalData.memberInfo !== null
    })
  },

    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})