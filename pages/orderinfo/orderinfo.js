// pages/orderinfo/orderinfo.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideShadow: true,
    hideAbolish: true,

    abolish: [{
      pic: "../../images/uncheck.png",
      name: "重复下单/误操作"
    }, {
      pic: "../../images/uncheck.png",
      name: "地址错误"
    }, {
      pic: "../../images/uncheck.png",
      name: "报价不合理，有更优选择"
    }, {
      pic: "../../images/uncheck.png",
      name: "其他"
    }],
    selectabolish: '',
    bookingOrder: undefined

  },

  //拨打电话
  call: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },


  //取消下单
  cancel: function(e) {
    wx.showLoading({
      title: '取消中..',
      mask: true
    })

    ajax.postApi('mini/program/order/cancelBookingOrder', {
      id: this.data.bookingOrder.id
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        wx.navigateBack({ //返回上页
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.text,
          duration: 1000
        })
      }
    })

    // this.setData({
    //   hideShadow: false,
    //   hideAbolish: false,
    // })
  },

  //选择取消原因
  selectabolish: function(e) {
    var abolish = this.data.abolish
    var index = e.currentTarget.dataset.index
    for (var i = 0; i < abolish.length; i++) {
      abolish[i].pic = "../../images/uncheck.png"
    }
    abolish[index].pic = "../../images/check.png"
    var selectabolish = abolish[index].name

    this.setData({
      abolish: abolish,
      selectabolish: selectabolish
    })
  },

  //确认取消原因
  sure: function(e) {
    if (this.data.selectabolish == "") {
      wx.showToast({
        title: '请选择取消原因！',
        icon: 'none',
        duration: 3000,
      })
    } else {
      wx.showLoading({
        title: '取消中..',
        mask: true
      })

      ajax.postApi('mini/program/order/cancelBookingOrder', {
        id: this.data.bookingOrder.id
      }, (err, res) => {
        wx.hideLoading()
        if (res && res.success) {
          this.setData({
            hideShadow: true,
            hideAbolish: true,
            cancelReasons: this.data.selectabolish
          })
          wx.navigateBack({ //返回上页
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.text,
            duration: 1000
          })
        }
      })

    }

  },


  //关闭弹窗
  hide: function(e) {
    this.setData({
      hideShadow: true,
      hideAbolish: true,
    })
  },

  getBookingOrderById(id) {
    wx.showLoading({
      title: '加载中...',
    })

    ajax.getApi('mini/program/order/getBookingOrderById', {
      id
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        const bookingOrder = res.data
        const add_services = bookingOrder.add_services
        if (add_services) {
          bookingOrder.add_services = JSON.parse(add_services)
        }
        this.setData({
          bookingOrder
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const id = options.id
    this.getBookingOrderById(id)
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