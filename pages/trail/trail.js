// pages/search/search.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const app_data = require('../../utils/app-data.js')
const storage = require('../../utils/storage.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopOrderID: '',
    trails: [],
    trail: [{
      'status': '已签收',
      'icon': 'icon-gou',
      'detail': [{
        'trailinfo': '[武汉市]已签收，签收人：李思',
        'trailtime': '2018-11-30 17:03',
      }],
    }, {
      'status': '派送中',
      'icon': 'icon-expressman',
      'detail': [{
        'trailinfo': '[武汉市]湖北武汉公司派件员 江夏区 15622553625 正在为您派件，请保持通话顺畅',
        'trailtime': '2018-11-30 09:45',
      }],
    }, {
      'status': '运输中',
      'icon': 'icon-deliver',
      'detail': [{
        'trailinfo': '[千一物流武汉分部]已收入',
        'trailtime': '2018-11-29 22:36',
      }, {
        'trailinfo': '由[千一物流杭州总部]发往[千一物流武汉分部]',
        'trailtime': '2018-11-28 13:56',
      }, {
        'trailinfo': '快件已到达[千一物流杭州总部]扫描员是[李潇潇]上一站是[千一物流温州分部]',
        'trailtime': '2018-11-28 08:12',
      }],
    }, {
      'status': '已揽件',
      'icon': 'icon-profile',
      'detail': [{
        'trailinfo': '[千一物流温州分部]的收件员[李思凡]已揽件',
        'trailtime': '2018-11-27 14:05',
      }],
    }, {
      'status': '已下单',
      'icon': 'icon-order',
      'detail': [{
        'trailinfo': '已下单成功，系统正在分配收货员，请耐心等待！',
        'trailtime': '2018-11-27 12:30',
      }],
    }]
  },

  search(e) {
    this.getTrails()
  },

  getTrails() {
    const shopOrderID = this.data.shopOrderID
    wx.showLoading({
      title: '查询中...',
    })
    ajax.getApi('mini/program/order/getNodeDataByShopOrder', {
      shopOrderNo: shopOrderID,
    }, (err, res) => {  
      wx.hideLoading()
      if (res && res.success) {
        if(res.data && res.data.length > 0) {
          const trails = res.data
          this.setData({
            trails
          })
        }else {
          wx.showToast({
            title: '暂无节点日志',
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

  
  bindShopOrder(e) {
    this.setData({
      shopOrderID: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const shopOrderID = options.shopOrderID
    this.setData({
      shopOrderID
    }, () => {
      this.getTrails()
    })
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