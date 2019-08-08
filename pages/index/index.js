// pages/index/index.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    select: 0,
    page: 1,
    pageSize: 10,
    count: 0,
    loadCompleted: false,
    bookingOrders: [],
    hideShadow: true,
    hideOrdering: true,
    hide: true,

  },

  bindSelectOrderInput(e) {
    const key = e.currentTarget.dataset.key
    const selectOrder = this.data.selectOrder
    selectOrder[key] = e.detail.value
    this.setData({
      selectOrder
    })
  },

  scanShopOrder() {
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先去个人中心绑定账号！',
        icon: 'none',
        duration: 3000,
      })
      return;
    }

    if (!app.globalData.memberInfo.phone) {
      wx.showToast({
        title: '请先去个人中心绑定手机号码！',
        icon: 'none',
        duration: 3000,
      })
      return;
    }

    wx.scanCode({
      success(res) {
        console.log(res)
        wx.navigateTo({
          url: '../trail/trail?shopOrderID=' + res.result
        })
      }
    })
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
    selectOrder.new_total_weight = selectOrder.total_weight
    selectOrder.new_total_volume = selectOrder.total_volume
    selectOrder.new_total_packing_quantity = selectOrder.total_packing_quantity
    selectOrder.new_remark = selectOrder.remark
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

  //输入订单查询
  confirmInput: function(e) {
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先去个人中心绑定账号！',
        icon: 'none',
        duration: 3000,
      })
      return;
    }

    if (!app.globalData.memberInfo.phone) {
      wx.showToast({
        title: '请先去个人中心绑定手机号码！',
        icon: 'none',
        duration: 3000,
      })
      return;
    }
    
    wx.navigateTo({
      url: '../trail/trail?shopOrderID=' + e.detail.value
    })
  },


  //跳转到订单详情
  toInfo: function (e) {
    wx.navigateTo({
      url: '../orderinfo/orderinfo?id=' + e.currentTarget.dataset.id
    })
  },

  //跳转到下单
  toSend: function(e) {
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先去个人中心授权账号！',
        icon: 'none',
        duration: 3000,
      })
      return;
    }

    // if (!app.globalData.memberInfo.phone) {
    //   wx.showToast({
    //     title: '请先去个人中心绑定手机号码！',
    //     icon: 'none',
    //     duration: 3000,
    //   })
    //   return;
    // }

    wx.navigateTo({
      url: '../send/send'
    })
  },

  //跳转到订单记录
  toOrder: function(e) {
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先去个人中心绑定账号！',
        icon: 'none',
        duration: 3000,
      })
      return;
    }
    wx.navigateTo({
      url: '../order/order'
    })
  },

  //跳转到地址
  toAdd: function(e) {
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先去个人中心绑定账号！',
        icon: 'none',
        duration: 3000,
      })
      return;
    }
    wx.navigateTo({
      url: '../addList/addList'
    })
  },

  //跳转到个人中心
  toMy: function(e) {
    wx.navigateTo({
      url: '../my/my'
    })
  },

  getListBookingOrder() {
    const page = this.data.page
    const pageSize = this.data.pageSize
    const state = this.data.select
    wx.showLoading({
      title: '查询中',
      mask: true
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
        mask: true
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

  setTitle() {
    const app_name = app.globalData.appName
      wx.setNavigationBarTitle({
        title: app_name
      })
  },

  refesh() {
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setTitle()
    this.setData({
      page: 1,
      loadCompleted: false,
      bookingOrders: []
    }, () => {
      util.callIf(() => {
        this.getListBookingOrder()
      }, () => {
        return app.globalData.memberInfo !== null
      })
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