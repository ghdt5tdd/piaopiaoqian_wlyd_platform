// pages/order/order.js
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
      name: '待发布',
      value: 1
    }, {
      name: '待接单',
      value: 2
    }, {
      name: '待取货',
      value: 3
    }, {
      name: '待收货',
      value: 4
    }, {
      name: '待评价',
      value: 5
    }, {
      name: '全部',
      value: 0
    }],
    page: 1,
    pageSize: 10,
    count: 0,
    loadCompleted: false,
    select: 1,
    bookingOrders: [],
    hideShadow: true,
    hideOrdering: true,
    hide: true,

    order: []

  },


  handCommand(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const code = e.currentTarget.dataset.code
    const command = e.currentTarget.dataset.command
    const commandText = e.currentTarget.dataset.commandText
    const _this = this

    // if (command === 'order') {
    //   this.order(index)
    //   return;
    // } else
     if (command === 'update') {
      wx.navigateTo({
        url: '../send/send?bookOrderId=' + id,
      })
      return;
    } else {
      wx.showModal({
        title: '操作确认',
        content: '您确定要对此订单进行' + commandText + '吗?(订单号:' + code + ')',
        success(res) {
          if (res.confirm) {
            _this.postCommand(id, command)
          }
        },
      })
    }
  },

  postCommand(id, command) {
    wx.showLoading({
      title: '操作中...',
      mask: true
    })
    ajax.postApi('mini/program/order/bookingOrderCommand', {
      id,
      command
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        wx.showToast({
          title: '操作成功',
        })
        this.setData({
          page: 1,
          bookingOrders: [],
          loadCompleted: false
        }, () => {
          this.getListBookingOrder()
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

  hide: function (e) {
    this.setData({
      hideShadow: true,
      hidePickup: true,
      hideOrdering: true,
    })
  },

  //弹出订单信息窗口
  order(index) {
    const selectOrder = this.data.bookingOrders[index]
    this.setData({
      hideShadow: false,
      hideOrdering: false,
      selectOrder,
    })
  },

  sureOrder() {
    const id = this.data.selectOrder.id
    this.setData({
      hideShadow: true,
      hideOrdering: true,
    })
    this.postCommand(id, 'order')
  },

  //更多按钮
  optmore: function (e) {
    const index = e.currentTarget.dataset.index
    const bookingOrders = this.data.bookingOrders
    const order = bookingOrders[index]

    if (order.showMore) {
      order.showMore = !order.showMore
    } else {
      order.showMore = true
    }

    this.setData({
      bookingOrders,
    });
  },

  //跳转到订单详情
  toInfo: function (e) {
    wx.navigateTo({
      url: '../orderinfo/orderinfo?id=' + e.currentTarget.dataset.id
    })
  },

  //选择状态
  selectStatus: function (e) {
    var index = parseInt(e.target.dataset.value)
    this.setData({
      select: index,
      page: 1,
      bookingOrders: [],
      loadCompleted: false
    }, () => {
      this.getListBookingOrder()
    })
  },

  getListBookingOrder() {
    const page = this.data.page
    const pageSize = this.data.pageSize
    const state = this.data.select
    wx.showLoading({
      title: '查询中',
    })
    ajax.getApi('mini/program/order/listBookingOrder', {
      page,
      pageSize,
      state
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        if (res.data.length > 0) {
          const bookingOrders = this.data.bookingOrders
          const newBookingOrders = res.data

          newBookingOrders.forEach(v => {
            const command_list = v.command_list
            if (command_list instanceof Array && command_list.length > 0) {
              let hide_command_list, show_command_list
              if (command_list.length > 3) {
                show_command_list = command_list.slice(0, 3)
                hide_command_list = command_list.slice(3)
              } else {
                show_command_list = command_list
                hide_command_list = []
              }
              v.hide_command_list = hide_command_list
              v.show_command_list = show_command_list
            }
          })
          Array.prototype.push.apply(bookingOrders, newBookingOrders)
          this.setData({
            bookingOrders
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
        this.getListBookingOrder(() => {
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
    this.getListBookingOrder()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    let query = wx.createSelectorQuery()
    var statusWidth = 0

    query.selectAll('.order-status-items').boundingClientRect(function (rect) {
      for (var i = 0; i < that.data.status.length; i++) {
        statusWidth += (rect[i].width + 40 / 750 * wx.getSystemInfoSync().windowWidth)
      }

      that.setData({
        statusWidth: statusWidth
      })
    }).exec()
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