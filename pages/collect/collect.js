// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realPicface: "../../images/picface.jpg",
    realPicback: "../../images/picback.jpg",
    realPicid1: "../../images/picid1.jpg",
    realPicid2: "../../images/picid2.jpg",
  },


  //上传身份证 银行卡
  changePicface: function(e) {
    var _this = this // 不能直接用this，留坑
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 指定是原图还是压缩图
      sourceType: ['album', 'camera'],  // 指定来源是相册还是相机
      success: function(res) {
        var tempFilePaths = res.tempFilePaths; //可以作为img标签的src属性显示图片
        _this.setData({
          realPicface: tempFilePaths
        });
      }
    })
  },

  changePicback: function(e) {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          realPicback: tempFilePaths
        });
      }
    })
  },


  changePicid1: function (e) {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          realPicid1: tempFilePaths
        });
      }
    })
  },


  changePicid2: function (e) {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          realPicid2: tempFilePaths
        });
      }
    })
  },
  

  //开通确认
  formSubmit: function(e) {
    wx.navigateBack({ //返回
      delta: 1
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    prevPage.setData({ //货物名称、件数、包装等信息
      collect: '待审核',
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