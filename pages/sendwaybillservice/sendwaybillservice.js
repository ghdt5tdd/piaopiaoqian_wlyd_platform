// pages/sendwaybillservice/sendwaybillservice.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    myServices: [],
    whether: [{
      text: '否',
      value: 0
    }, {
      text: '是',
      value: 1
    }],
    signorders: undefined,

    tServices: {
      is_sms: {
        value:0,
        valueText: '否',
        text:'是否短信通知'
      },
      is_konghuo: {
        value: 0,
        valueText: '否',
        text: '是否控货'
      },
      is_signorder: {
        value: 0,
        valueText: '无',
        text: '回单要求'
      },
      collect_amount: {
        value: 0,
        valueText: '0',
        text: '代收货款'
      },
      insured_amount: {
        value:0,
        valueText: '0',
        text: '保价金额'
      }
    }
  },

  //单选框
  selectRadio: function (e) {
    const value = e.detail.value
    const key = e.currentTarget.dataset.key 

    const tServices = this.data.tServices
    tServices[key].value = value
    tServices[key].valueText = value === '0'? '否': '是'
    this.setData({
      tServices
    })
  },

  //单选框
  selectRadioItem: function (e) {
    const value = e.detail.value
    const key = e.currentTarget.dataset.key 
    const array = e.currentTarget.dataset.array 

    const tServices = this.data.tServices
    tServices[key].value = value
    tServices[key].valueText = this.data[array][value].itemText
    this.setData({
      tServices
    })
  },

  //输入框
  bindInput(e) {
    const value = e.detail.value
    var key = e.currentTarget.dataset.key 
    const tServices = this.data.tServices
    tServices[key].value = value
    tServices[key].valueText = value
    this.setData({
      tServices
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

    const tServices = this.data.tServices
    prevPage.setData({ //货物名称、件数、包装等信息
      WService: false,
      tServices: tServices,
    })
  },

  getDic(myServices) {
    wx.showLoading({
      title: '读取中...',
    })
    ajax.getApi('app/common/getDic', {
      dic_key: 'slip_type'
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        const signorders = res.data
        // //将已有值的选项填充
        let tServices = this.data.tServices
        if (myServices) {
          tServices = myServices
        }
        this.setData({
          tServices,
          signorders
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
    this.getDic(tServices)
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