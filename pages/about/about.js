// pages/about/about.js
// 引入SDK核心类
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const coordtransform = require('../../utils/coordtransform.js')
const app = getApp()
var QQMapWX = require('../qqmap/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: 'I5GBZ-ZQULP-6MTD5-L4RVA-XAPAJ-DKB4G' // 必填 换成自己申请到的
});


Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyInfo:undefined,
  },


  //地址导航
  networkMap: function (e) {
    const location = e.currentTarget.dataset.location
    const address = e.currentTarget.dataset.address
    if(location) {
      const longitude = Number(location.split(',')[0])
      const latitude = Number(location.split(',')[1])
      const tLocation = coordtransform.wgs84togcj02(longitude, latitude)
      wx.openLocation({
        latitude: tLocation[1],
        longitude: tLocation[0],
        address: address,
        scale: 28
      })
    }
  },


  //拨打电话
  bookTel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  getShopMessage() {
    const app_area = app.globalData.platformAppArea
    wx.showLoading({
      title: '请稍等...',
    })
    ajax.getApi('mini/program/member/getShopMessage', {
      app_area
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        this.setData({
          companyInfo: res.data
        })
        storage.put('companyInfo' + app_area, res.data, 60 * 60 *24)
      } else {
        if (res.text) {
          wx.showToast({
            title: res.text,
            duration: 1000
          })
        }
      }
    })	
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app_area = app.globalData.platformAppArea
    const companyInfo = storage.get('companyInfo' + app_area)
    if (companyInfo) {
      this.setData({
        companyInfo
      })
    } else {
      this.getShopMessage()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})