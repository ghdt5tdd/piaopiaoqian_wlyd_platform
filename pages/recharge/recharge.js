// pages/recharge/recharge.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 50,
    paynum: [
      {
        "name": "50元",
        "amount": 50,
        "select": 0
      },
      {
        "name": "100元",
        "amount": 100,
        "select": 1
      },
      {
        "name": "200元",
        "amount": 200,
        "select": 2
      },
      {
        "name": "500元",
        "amount": 500,
        "select": 3
      },
      {
        "name": "1000元",
        "amount": 1000,
        "select": 4
      },
      {
        "name": "其他",
        "amount": 0,
        "select": 5
      }
    ],
    numSelect: 0,
    //默认选中的充值方式
    // pays: [
    // {
    //   "payName": "支付宝",
    //   "image": "../../images/zhifu2.jpg",
    //   "icon": "../../images/check.png",
    //   "select": 0
    // },
    // {
    //   "payName": "微信",
    //   "image": "../../images/zhifu3.png",
    //   "icon": "../../images/uncheck.png",
    //   "select": 1
    // }
    // ],
    // paySelect: 0,
  },

  bindAmount(e) {
    this.setData({
      amount: e.detail.value
    })
  },
  //选择支付金额
  chooseNum: function (data) {
    const index = data.currentTarget.dataset.select
    this.setData({
      amount: this.data.paynum[index].amount,
      numSelect: index
    })
  },

  recharge() {
    wx.showLoading({
      title: '正在发起支付请求...',
    })
    const id = this.data.orderId
    const app_id = app.globalData.appId
    const open_id = app.globalData.openId
    const amount = this.data.amount
    ajax.getApi('mini/program/member/recharge', {
      app_id,
      open_id,
      amount
    }, (err, res) => {
      if (res && res.success) {
        const data = res.data.payParameters
        wx.hideLoading()
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success: function (res) {
            console.log(res);
          },
          fail: function (res) {
            // fail
            console.log(res);
          },
          complete: function (res) {
            // complete
            console.log(res);
          }
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


  // //选择支付方式
  // choosePay: function (data) {
  //   var Index = data.currentTarget.dataset.select

  //   for (var i = 0; i < this.data.pays.length; i++) {

  //     var I = "pays[" + i + "].icon"
  //     if (i == Index) {
  //       this.setData({
  //         [I]: "../../images/check.png",
  //         paySelect: Index,
  //       })
  //     }
  //     else {
  //       this.setData({
  //         [I]: "../../images/uncheck.png",
  //         paySelect: Index,
  //       })
  //     }
  //   }
  // },



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