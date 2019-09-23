// pages/addList/addList.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: [{
      name: '寄件地址',
      value: 1,
    }, {
      name: '收件地址',
      value: 2,
    }],
    query: '',
    select: 1,
    hasList: true,
    page: 1,
    pageSize: 20,
    loadCompleted: false,
    addressList: [],
  },

  //选择地址
  select: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      select: index,
      page: 1,
      addressList: [],
      loadCompleted: false
    }, () => {
      this.getAddressList()
    })
  },

  bindQuery(e) {
    this.setData({
      query: e.detail.value
    })
  },

  search(e) {
    this.setData({
      page: 1,
      addressList: [],
      loadCompleted: false
    }, () => {
      this.getAddressList()
    })
  },

  getAddressList() {
    const page = this.data.page
    const pageSize = this.data.pageSize
    const place_type = this.data.select
    const search = this.data.query
    const params = {
      page,
      pageSize,
      place_type,
    }
    if (search) {
      params.search = search
    }
    wx.showLoading({
      title: '查询中',
    })
    ajax.getApi('mini/program/member/getAllPubAddress', params, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        if (res.data.length > 0) {
          const addressList = this.data.addressList
          Array.prototype.push.apply(addressList, res.data)
          this.setData({
            addressList
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
        this.getAddressList(() => {
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


  //设为默认
  defaultSet: function (e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index

    wx.showLoading({
      title: '设置中...',
      mask: true
    })

    ajax.postApi('mini/program/member/setDefaultPubAddress', {
      id
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        const addressList = this.data.addressList
        addressList.forEach(v => {
          v.is_default = 0
        })
        addressList[index].is_default = 1
        this.setData({
          addressList
        })
      } else {
        wx.showToast({
          title: res.text,
          duration: 1000
        })
      }
    })

    this.setData({
      addressList: addressList
    })
  },


  //新增地址
  toCreate: function (e) {
    wx.navigateTo({
      url: '../addCreate/addCreate?send_place_type=' + this.data.select
    })
  },

  //编辑地址
  toEdit: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../addCreate/addCreate?send_place_type=' + this.data.select + '&address_id=' + id
    })
  },


  //删除地址
  delete: function (e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index

    wx.showLoading({
      title: '删除中...',
      mask: true
    })

    ajax.postApi('mini/program/member/delPubAddress', {
      id
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        const addressList = this.data.addressList
        addressList.splice(index, 1);
        this.setData({
          addressList: addressList
        })
      } else {
        wx.showToast({
          title: res.text,
          duration: 1000
        })
      }
    })


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
    this.setData({
      page: 1,
      addressList: [],
      loadCompleted: false
    }, () => {
      this.getAddressList()
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