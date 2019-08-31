// pages/service/service.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCollect: false, //为true的时候可以填写代收货款
    array: ['无需回单', '原单返回'],
    index: 0,
    bill: '无需回单',
    myServices: []
  },

  //单选框
  selectRadio: function (e) {
    var value = e.detail.value
    var index = e.currentTarget.dataset.index
    // var text = e.currentTarget.dataset.text
    const myServices = this.data.myServices
    myServices[index].value = myServices[index].html_items_dic[e.detail.value].itemKey
    myServices[index].text = myServices[index].html_items_dic[e.detail.value].itemText
    myServices[index].index = e.detail.value
    this.setData({
      myServices
    })
  },

  //输入框
  bindInput(e) {
    const value = e.detail.value
    var index = e.currentTarget.dataset.index
    const myServices = this.data.myServices
    myServices[index].value = value
    this.setData({
      myServices
    })
  },



  //保存
  formSubmit: function (e) {
    wx.navigateBack({ //返回
      delta: 1
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    const myServices = this.data.myServices

    const tServices = myServices.filter(v => {
      return v.value
    })

    console.log(tServices)

    prevPage.setData({ //货物名称、件数、包装等信息
      WService: false,
      tServices: tServices,
    })
  },

  getHedgingService(tServices) {
    wx.showLoading({
      title: '读取中...',
    })
    ajax.getApi('mini/program/order/hedgingService', {

    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        const myServices = res.data

        //单选框默认值
        myServices.forEach(v => {
          if (v.html_items === 'radio') {
            v.text = '请选择'
          }
        })

        //将已有值的选项填充
        if (tServices) {
          console.log(tServices)
          myServices.forEach(v => {
            tServices.forEach(t => {
              if (t.set_id === v.set_id) {
                v.value = t.value
                if (t.html_items === 'radio') {
                  v.text = t.text
                }
              }
            })
          })
        }
        this.setData({
          myServices: myServices
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
  onLoad: function (options) {
    let tServices = options.tServices
    if (tServices) {
      tServices = JSON.parse(tServices)
    }
    this.getHedgingService(tServices)
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