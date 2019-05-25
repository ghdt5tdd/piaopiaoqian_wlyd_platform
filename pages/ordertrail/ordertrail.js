// pages/point/point.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    truckTrail: [{
      'status': '在途中',
      'icon': 'icon-deliver',
      'detail': [{
        'location': '浙江丽水长深高速',
        'longitude': "119.65",
        'latitude': "29.08",
        'direction': "西北",
        'speed': "120",
        'date': '2018-11-29',
        'time': '22:36',
      }, {
        'location': '浙江温州锦绣中城大厦',
        'longitude': "120.70",
        'latitude': "28.01",
        'direction': "正北",
        'speed': "80",
        'date': '2018-11-28',
        'time': '13:56',
      }, ],
    }, {
      'status': '起点',
      'icon': 'icon-fold',
      'detail': [{
        'location': '浙江乐清物流网点发车',
        'longitude': "120.93",
        'latitude': "27.95",
        'direction': "西北",
        'speed': "80",
        'date': '2018-11-27',
        'time': '22:36',
      }, ],
    }],


  },

  //查看实时定位
  toLoaction: function(e) {
    wx.navigateTo({
      url: '../location/location'
    })
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