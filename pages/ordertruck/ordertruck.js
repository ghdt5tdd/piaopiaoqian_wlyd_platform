// pages/ordertruck/ordertruck.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
var plateli = [];
var QQMapWX = require('../qqmap/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: app.globalData.qqMapKey // 必填 换成自己申请到的
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstTruck: 0,
    shopOrderDetail:undefined,

    Rule: [{
      info: "您好！感谢您选择XXXX运输有限公司（以下简称我公司）。",
      indent: true,
    }, {
      info: "请您在使用货车定位查询功能前仔细阅读本服务条款，您阅读并确认后，说明：您同意遵守我公司公示的查询条款的相关内容，且愿意遵守或协同遵循一下条款的服务约定。",
      indent: true,
    }, {
      info: "1 货车定位查询费用"
    }, {
      info: "1.1货车定位查询功能按次数计费，一次0.1元"
    }, {
      info: "1.2同一车牌号查询时间不同，仍计入次数"
    }, {
      info: "1.3查询一次，可以看到货车从出发到当前位置所有轨迹图形及文字说明。"
    }, {
      info: "2 支付费用说明"
    }, {
      info: "2.1查询一次费用从账户余额扣除，使用此功能时请确保账户余额充足"
    }, {
      info: "2.2后续可能会添加包月功能，敬请期待"
    }, ],

    hideClear: true,
    placeholder: true,

    markers: [{
      id:"1",
      iconPath: '../../images/truck2.png',
      longitude: "119.65",
      latitude: "29.08",
      width: 30,
      height: 30,
      callout: {
        content: "车牌号码：沪C123456 \n当前车速：120km/h  \n位置信息：浙江丽水长深高速  \n经度纬度：119.65 29.08  \n行驶方向：西北  \n更新时间：2018-12-24 08:56:23  \n行驶轨迹 >>",
        fontSize: "16",
        borderRadius: "5",
        bgColor: "#ffffff",
        padding: "10",
        display: "ALWAYS",
        textAlign: "left" //左对齐
      },
    }],



    hideInfo: true,
    plates: "沪C123456",
    speed: "120",
    location: "浙江丽水长深高速",
    longitude: "119.65",
    latitude: "29.08",
    direction: "西北",
    time: "2018-12-24 08:56:23",

    hideTruck: true,
    truckOrder: 0,

  },


  //同意条款
  agreeRule: function(e) {
    this.setData({
      firstTruck: 1
    })
    wx.setStorageSync('firstTruck', 1)
  },



  //打开车牌号弹窗
  showTruck: function(e) {
    this.setData({
      hideTruck: false,
    })
  },

  //选择车牌号下一步
  nextPlate: function(e) {
    if (this.data.fristIndex != undefined && this.data.fristIndex != 99) {
      this.setData({
        truckOrder: 1
      })
    }
  },

  //选择车牌号剩余位数
  selectOther: function(e) {
    var index = e.currentTarget.dataset.index
    var name = this.data.plateOther[index].name
    plateli.push(name)
    var platetwo = plateli.join('')
    this.setData({
      platetwo: platetwo,
      plateli: plateli
    })
  },

  //删除
  deleteTruck: function(e) {
    if (this.data.truckOrder == 0) {
      this.setData({
        fristIndex: 99,
        plateone: '',
      })
    } else {
      var length = plateli.length
      plateli.splice(length - 1, 1);
      var platetwo = plateli.join('')
      this.setData({
        platetwo: platetwo,
        plateli: plateli
      })
    }

  },

  //关闭弹窗
  hide: function(e) {
    this.setData({
      hideTruck: true
    })
  },


  sureTruck: function(e) {
    this.setData({
      hideTruck: true,
      truckOrder: 0, //下次打开弹窗复位
    })
  },


  //车辆当前信息弹窗
  hideInfo: function(e) {
    this.setData({
      hideInfo: true
    })
  },

  showInfo: function(e) {
    this.setData({
      hideInfo: false
    })
  },

  //清空选择
  clearTruck: function(e) {
    plateli = [];
    this.setData({
      fristIndex: '99',
      plateone: '',
      platetwo: '',
      hideTruck: true,
      truckOrder: 0, //下次打开弹窗复位
      hideClear: true,
      placeholder: true
    })
  },



  //行驶轨迹
  truckcallout: function(e) {
    wx.navigateTo({
      url: '../ordertrail/ordertrail'
    })
  },

  getShopOrderRealTimeTrackingByShopOrderId(shopOrderId) {
    wx.showLoading({
      title: '加载中...',
    })

    ajax.getApi('mini/program/order/getShopOrderRealTimeTrackingByShopOrderId', {
      shopOrderId
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        const shopOrderDetail = res.data
        if (shopOrderDetail.gps) {
          const location = shopOrderDetail.gps.location
          if(location) {
            const lo = location.split(",")
            shopOrderDetail.gps.x = lo[0]
            shopOrderDetail.gps.y = lo[1]
          } else {
            wx.showToast({
              title: '暂无车辆定位',
            })
          }

          const province = shopOrderDetail.gps.province
          if (province) {
            shopOrderDetail.gps.markers = [{
              id: "1",
              iconPath: '../../images/truck2.png',
              longitude: "119.65",
              latitude: "29.08",
              width: 30,
              height: 30,
              callout: {
                content: "当前位置：" + location.gps.province + location.gps.city + location.gps.district,
                fontSize: "16",
                borderRadius: "5",
                bgColor: "#ffffff",
                padding: "10",
                display: "ALWAYS",
                textAlign: "left" //左对齐
              },
            }]
          }
        } else {
          wx.showToast({
            title: '暂无车辆定位',
          })
        }
        this.setData({
          shopOrderDetail
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
  onLoad: function(options) {
    const id = options.id 
    this.getShopOrderRealTimeTrackingByShopOrderId(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // var first = wx.getStorageSync('firstTruck')
    // this.setData({
    //   firstTruck: first,
    //   plateone: '',
    //   platetwo: '',
    // })
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