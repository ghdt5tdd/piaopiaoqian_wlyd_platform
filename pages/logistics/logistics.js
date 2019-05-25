// pages/logistics/logistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    logistics: [{
      'status': '已签收',
      'icon': 'icon-gou',
      'detail': [{
        'info': '[武汉市]已签收，签收人：李思',
        'date': '2018-11-30',
        'time': '17:03',
      }],
    }, {
      'status': '派送中',
      'icon': 'icon-expressman',
      'detail': [{
        'info': '[武汉市]湖北武汉公司派件员 江夏区 15622553625 正在为您派件，请保持通话顺畅',
        'date': '2018-11-30',
        'time': '09:45',
      }],
    }, {
      'status': '在途中',
      'icon': 'icon-deliver',
      'detail': [{
        'info': '预计到达时间：剩余5小时',
        'date': '2018-11-29',
        'time': '22:21',
      }, {
        'info': '[千一物流武汉分部]已收入',
        'date': '2018-11-29',
        'time': '16:36',
      }, {
        'info': '由[千一物流杭州总部]发往[千一物流武汉分部]',
        'date': '2018-11-28',
        'time': '13:56',
      }, {
        'info': '快件已到达[千一物流杭州总部]扫描员是[李潇潇]上一站是[千一物流温州分部]',
        'date': '2018-11-28',
        'time': '08:12',
      }],
    }, {
      'status': '已发货',
      'icon': 'icon-profile',
      'detail': [{
        'info': '您的货物已出库',
        'date': '2018-11-27',
        'time': '22:05',
      }, {
        'info': '您的货物已到达[千一物流温州分部]仓库',
        'date': '2018-11-27',
        'time': '16:05',
      }, {
        'info': '[千一物流温州分部]的收件员[李思凡]已上门揽件',
        'date': '2018-11-27',
        'time': '14:05',
      }],
    }, {
      'status': '已接单',
      'icon': 'icon-order',
      'detail': [{
        'info': '已接单，系统正在分配收货员',
        'date': '2018-11-27',
        'time': '10:30',
      }],
    }, {
      'status': '已下单',
      'icon': 'icon-order',
      'detail': [{
        'info': '已下单成功，正在等待物流商接单，请耐心等待！',
        'date': '2018-11-27',
        'time': '08:30',
      }],
    },],

    signPic: "https://img000.hc360.cn/y1/M02/DE/6A/wKhQc1SXrbeEdFP3AAAAAOl0pFk816.jpg" //签收回单图片

  },

  //查看实时定位
  toLoaction: function(e) {
    wx.navigateTo({
      url: '../ordertruck/ordertruck'
    })
  },


  //放大预览签收回单
  aspect: function(e) {
    var array = [];
    var pic = this.data.signPic
    array.push(pic)
    if (pic != '') {
      wx.previewImage({
        urls: array // 需要预览的图片http链接列表
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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