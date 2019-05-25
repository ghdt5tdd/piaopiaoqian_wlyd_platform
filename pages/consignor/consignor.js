// pages/consignor/consignor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: [{
      name: "待支付",
      num: "1",
    }, {
      name: "待揽件",
      num: "2",
    }, {
      name: "已完成",
      num: "1",
    }, ],
    selectStatus: 0,

    orderTable: [{
      id: "18352790280265",
      time: "2018-11-27 08:30",
      start: "浙江温州",
      end: "湖北武汉",
      receive: "李思",
      cargoName: '电子',
      cargoNum: '5',
      cargoPack: '纸箱',
      cargoWeight: '1.8',
      cargoCubage: '0.3',
      payStyle: "现付",
      payAmount: "20.00",
      btn: [{
        info: "在线支付",
        open: "showPay",
      }, ],

    }, {
      id: "18352790283072",
      time: "2018-01-01",
      start: "浙江温州",
      end: "湖北武汉",
      receive: "武汉恒望科技有限公司",
      cargoName: '图书',
      cargoNum: '16',
      cargoPack: '纸箱',
      cargoWeight: '1.8',
      cargoCubage: '0.5',
      status: "面单生成",
      btn: [{
        info: "上门揽件",
        open: "showPack",
      }, ],


    }, ],
    hide: true,
    hidePay: true,
    hidePack: true,
  },


  //选择我的订单状态
  selectStatus: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      selectStatus: index
    })
  },


  //打开在线支付弹窗
  showPay: function(e) {
    this.setData({
      hide: false,
      hidePay: false,
      //支付数据
      payAmount: "20.00",
      pays: [{
          "payName": "余额",
          "image": "../../images/zhifu1.png",
          "icon": "../../images/uncheck.png",
          "select": 0
        },
        {
          "payName": "支付宝",
          "image": "../../images/zhifu2.jpg",
          "icon": "../../images/check.png",
          "select": 1
        },
        {
          "payName": "微信",
          "image": "../../images/zhifu3.png",
          "icon": "../../images/uncheck.png",
          "select": 2
        },
      ],
      paySelect: 1,
    })
  },


  //选择支付方式
  choosePay: function(e) {
    var index = e.currentTarget.dataset.select
    var pays = this.data.pays
    for (var i = 0; i < pays.length; i++) {
      pays[i].icon = "../../images/uncheck.png"
    }
    pays[index].icon = "../../images/check.png"
    this.setData({
      paySelect: index,
      pays: pays
    })
  },

  //上门揽件
  showPack: function(e) {
    this.setData({
      hide: false,
      hidePack: false,
      //上门揽件数据
      id: "18352790283072",
      time: "2018-01-10",
      start: "浙江温州",
      end: "湖北武汉",
      dispatch: "黄晓克",
      dispatchTel: "13355888988",
      receive: "武汉恒望科技有限公司",
      receiveTel: "15622663527",
      cargoName: '图书',
      cargoNum: '16',
      cargoPack: '纸箱',
      cargoWeight: '1.8',
      cargoCubage: '0.5',
      actualNum: "210",
      operatingTime: "2018-11-30 17:03", //操作时间 
    })
  },



  //关闭弹窗
  hide: function(e) {
    this.setData({
      hide: true,
      hidePay: true,
      hidePack: true,
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