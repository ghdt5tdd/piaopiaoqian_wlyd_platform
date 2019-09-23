// pages/wallet/wallet.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: 0.0,
    page: 1,
    pageSize: 20,
    count: 0,
    loadCompleted: false,
    orderStatus: [{
      name: '全部',
      value: 0
    },
    {
      name: '收入',
      value: 1
    },
    {
      name: '支出',
      value: 2
    },
    ],
    firstStatus: 0,
    record: []

  },


  //选择状态
  selectStatus: function (e) {
    var index = parseInt(e.target.dataset.index);
    this.setData({
      firstStatus: index,
      page: 1,
      count: 0,
      record: [],
      loadCompleted: false
    }, () => {
      this.getRechargeLog()
    })
  },


  toRecharge: function (e) {
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },

  getRecharge() {
    ajax.getApi('mini/program/member/recharge/query', {

    }, (err, res) => {
      if (res && res.success) {
        this.setData({
          account: res.data.recharge
        })
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

  getRechargeLog() {
    const page = this.data.page
    const pageSize = this.data.pageSize
    const status = this.data.firstStatus
    wx.showLoading({
      title: '查询中',
    })
    ajax.getApi('mini/program/member/recharge/log', {
      page,
      pageSize,
      status
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        console.log(res.data)
        if (res.data.length > 0) {
          const record = this.data.record
          Array.prototype.push.apply(record, res.data)
          this.setData({
            record
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
        this.getRechargeLog(() => {
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

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {

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
    this.getRecharge()
    this.setData({
      page: 1,
      record: [],
      loadCompleted:false,
    }, ()=> {
      this.getRechargeLog()
    })
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