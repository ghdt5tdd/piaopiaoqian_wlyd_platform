// pages/share/share.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: "../../images/friend-banner.jpg",
    friendTotalman: 2,
    friendTotalnum: 50,
    friendList: [{
      'rank': 1,
      'avatar': '../../images/friend1.png',
      'name': '云悠悠',
      'time': '2018-08-09'
    }, {
      'rank': 2,
      'avatar': '../../images/friend3.png',
      'name': '蓝色的雨',
      'time': '2018-08-07'
    }],

    hideShadow:true,
    hideShare:true,

    userInfo: {},
    sharetip: "发现了一个好东西，与你分享",
    sharebanner:"../../images/share-banner.jpg"
    
  },

  //奖励账户
  toReward: function(e) {
    wx.navigateTo({
      url: '../reward/reward'
    })
  },

  //邀请好友
  showShare: function (e) {
    this.setData({
      hideShare: false,
      hideShadow: false
    })
  },

  //分享
  hideShare: function (e) {
    this.setData({
      hideShare: true,
      hideShadow: true
    })
  },

  hide: function (e) {
    this.setData({
      hideShare: true,
      hideShadow: true
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})