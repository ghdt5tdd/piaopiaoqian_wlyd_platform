// pages/forwarder/forwarder.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    loadCompleted: false,
    forwarderList: []
  },

  bindQuery(e) {
    this.setData({
      query: e.detail.value
    })
  },

  //选中承运商
  toSend: function(e) {
    wx.navigateBack({ //返回
      delta: 1
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    var forwarderList = this.data.forwarderList
    var index = e.currentTarget.dataset.index
    var contact_man = forwarderList[index].contact_man
    var id = forwarderList[index].client_id

    prevPage.setData({
      carrier: {
        contact_man,
        id
      },
    })
  },

  //拨打电话
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  
  search(e) {
    this.setData({
      page: 1,
      forwarderList: [],
      loadCompleted: false
    }, () => {
      this.getBookingOrderCarrier()
    })
  },

  lower: function (e) {
    let page = this.data.page
    const pageSize = this.data.pageSize
    const loadCompleted = this.data.loadCompleted
    if (!loadCompleted) {
      wx.showLoading({
        title: '更多数据加载中...',
      })
      page++
      this.setData({
        page
      }, () => {
        this.getBookingOrderCarrier(() => {
          wx.hideLoading()
        })
      })
    } else {
      wx.showToast({
        title: '数据已全部加载完毕',
        duration: 1000
      })
    }
  },

  getBookingOrderCarrier() {
    wx.showLoading({
      title: '获取中...',
    })
    const query = this.data.query
    const page = this.data.page
    const pageSize = this.data.pageSize
    const params = {
      page,
      pageSize,
    }
    if (query) {
      params.name = query
    }
    ajax.getApi('mini/program/order/getBookingOrderCarrier', params, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        if (res.data.length > 0) {
          const forwarderList = this.data.forwarderList
          Array.prototype.push.apply(forwarderList, res.data)
          this.setData({
            forwarderList
          })
        } else {
          this.setData({
            loadCompleted: true
          })
          wx.showToast({
            title: '数据已全部加载完毕',
            duration: 1000
          })
        }
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
  onLoad: function(options) {
    this.getBookingOrderCarrier()
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