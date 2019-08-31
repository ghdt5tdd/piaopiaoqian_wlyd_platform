// pages/send/send.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WSend: true, //这里表示有设为默认的寄件地址
    WReceive: true,
    WCargo: true,
    WService: true,
    order_is_need_carrier: 1,
    order_is_need_receiver: 1,

    bookOrderId: undefined,  //修改订单ID

    sendAddr: undefined,  //寄件地址
    receiveAddr: undefined, //收件地址
    carrier: undefined, //承运商信息

    cargoType: undefined,
    cargoNum: undefined,  
    cargoPack: undefined,
    cargoVolumn: undefined,
    cargoWeight: undefined,
    cargoSelectMode: undefined,

    tServices: undefined,

    sendTime: "请选择提货时间",
    ruleStatus: false,
    ruleIcon: "../../images/uncheck.png",
    remark: '',
    hideShadow: true,
    hideTime: true,

    //预约时间
    calendar: [],
    width: 0,
    currentIndex: 0,
    currentTime: -1,
    timeArr: [{
      "timeEnd": "11:00",
      "overtime": false, //未超时可预约
    }, {
      "timeEnd": "13:00",
      "overtime": false,
    }, {
      "timeEnd": "15:00",
      "overtime": false,
    }, {
      "timeEnd": "17:00",
      "overtime": false,
    }, {
      "timeEnd": "19:00",
      "overtime": false,
    }, {
      "timeEnd": "21:00",
      "overtime": false,
    },],

    markFcous: false,

    hideRule: true,
    hideTip: true, //下单成功提示
    orderId: '',
    agreement: '',

  },

  bindInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },


  //寄件地址选择
  toSend: function (e) {
    wx.navigateTo({
      url: '../addSend/addSend?select=1'
    })
  },



  //收件地址选择
  toReceive: function (e) {
    wx.navigateTo({
      url: '../addSend/addSend?select=2'
    })
  },

  //货物信息
  toCargo: function (e) {
    const cargo = this.data.cargo

    if (cargo) {
      wx.navigateTo({
        url: '../cargo/cargo?cargo=' + JSON.stringify(cargo)
      })
    } else {
      wx.navigateTo({
        url: '../cargo/cargo'
      })
    }
  },

  //增值服务
  toService: function (e) {
    const tServices = this.data.tServices
    if (tServices) {
      wx.navigateTo({
        url: '../service/service?tServices=' + JSON.stringify(tServices)
      })
    } else {
      wx.navigateTo({
        url: '../service/service'
      })
    }

  },


  //承运商选择
  toforwarder: function (e) {
    wx.navigateTo({
      url: '../forwarder/forwarder'
    })
  },


  getDateStr(addDay) {
    var result_date = new Date();
    result_date.setDate(result_date.getDate() + addDay);//获取AddDayCount天后的日期
    var year = result_date.getFullYear();
    var month = result_date.getMonth() + 1;//获取当前月份的日期
    if (month < 10) {
      month = "0" + month
    }
    if (month > 11) {
      month = "0" + (month - 11)
    }
    var day = result_date.getDate();
    if (day < 10) {
      day = "0" + day
    }
    return year + "-" + month + "-" + day
  },

  getDateWeekStr(dateStr) {
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六']
    const date = new Date(dateStr)
    const now_date = new Date()
    const week_index = date.getDay()
    const week_str = weeks_ch[week_index]

    var timesDiff = Math.abs(date.getTime() - now_date.getTime());
    var diffDays = Math.round(timesDiff / (1000 * 60 * 60 * 24));
    
    if (diffDays == 0) {
      return "今天"
    } else if (diffDays == 1) {
      return "明天"
    }

    return '星期' + week_str
  },


  //预约时间
  showTime: function (e) {
    const calendar = this.data.calendar
    const today = this.getDateStr(0)
    const tomorrow = this.getDateStr(1)
    const after_tomorrow = this.getDateStr(2)

    calendar[0] = {
      date: today,
      week: this.getDateWeekStr(today)
    }
    calendar[1] = {
      date: tomorrow,
      week: this.getDateWeekStr(tomorrow)
    }
    calendar[2] = {
      date: after_tomorrow,
      week: this.getDateWeekStr(after_tomorrow)
    }

    this.setData({
      hideShadow: false,
      hideTime: false,
      markFcous: true,
      calendar
    })
    this.statusTime()
  },


  //超过时间变灰,除了今天都不会超时
  statusTime() {
    const date = new Date();
    const cur_hour = date.getHours() + ":" + date.getMinutes();
    let timeArr = this.data.timeArr
    for (var i = 0; i < timeArr.length; i++) {
      if (this.data.currentIndex == 0) {
        const c_h = date.getHours()
        const e_h = timeArr[i].timeEnd.slice(0, 2)
        if (c_h >= e_h) {
          timeArr[i].overtime = true
        }
      } else {
        timeArr[i].overtime = false
      }
    }
    this.setData({
      timeArr: timeArr
    })
  },


  //选择日期点击事件
  select: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    this.statusTime()
  },

  //选择时间点击事件
  selectTime: function (e) {
    let timeArr = this.data.timeArr
    let index = e.currentTarget.dataset.tindex
    if (timeArr[index].overtime == false) {
      this.setData({
        currentTime: e.currentTarget.dataset.tindex
      })
    } else {
      return false
    }
  },

  //选择预约日期时间
  chooseTime: function (e) {
    var chooseDate = this.data.currentIndex
    var chooseTime = this.data.currentTime
    if (chooseTime == -1) {
      wx.showToast({
        title: '请选择配送时间~',
        icon: 'none',
        duration: 2000,
      })
    } else {
      var chooseSendDate = this.data.calendar[chooseDate].date
      // var chooseSendTime = this.data.timeArr[chooseTime].timeBegin + "-" + this.data.timeArr[chooseTime].timeEnd
      var chooseSendTime = this.data.timeArr[chooseTime].timeEnd
      this.setData({
        sendDate: chooseSendDate,
        sendTime: chooseSendTime,
        hideShadow: true,
        hideTime: true,
        markFcous: false,
      })
    }

  },


  //关闭配送时间弹窗
  hideTime: function (e) {
    this.setData({
      hideShadow: true,
      hideTime: true,
      markFcous: false,
    })
  },


  //查询条款按钮
  ruleCheck: function (e) {
    if (this.data.ruleStatus == false) {
      this.setData({
        ruleIcon: "../../images/check.png",
        ruleStatus: true
      })
    } else {
      this.setData({
        ruleIcon: "../../images/uncheck.png",
        ruleStatus: false
      })
    }

  },


  //打开服务条款弹窗
  showRule: function (e) {
    this.setData({
      hideShadow: false,
      hideRule: false,
      markFcous: true,
    })
  },

  //同意条款
  agreeRule: function (e) {
    this.setData({
      ruleIcon: "../../images/check.png",
      ruleStatus: true,
      hideShadow: true,
      hideRule: true,
      markFcous: false,
    })
  },



  //关闭服务条款弹窗
  hideRule: function (e) {
    this.setData({
      hideShadow: true,
      hideRule: true,
      markFcous: false,
    })
  },


  //下单成功提示
  submitOrder: function (e) {
    if (this.data.WSend == true) {
      wx.showToast({
        title: '请选择寄件地址！',
        icon: 'none',
        duration: 3000,
      })
      return false;

    } 
    // else if (this.data.WReceive == true) {
    //   wx.showToast({
    //     title: '请选择收件地址！',
    //     icon: 'none',
    //     duration: 3000,
    //   })
    //   return false;

    // } 
    else if (this.data.WCargo == true) {
      wx.showToast({
        title: '请填写货物信息！',
        icon: 'none',
        duration: 3000,
      })
      return false;

    } else if (this.data.ruleStatus == false) {
      wx.showToast({
        title: '请查询并同意服务条款！',
        icon: 'none',
        duration: 3000,
      })
      return false;

    } 
    // else if (!this.data.sendDate) {
    //   wx.showToast({
    //     title: '请选择大概提货时间！',
    //     icon: 'none',
    //     duration: 3000,
    //   })
    //   return false;
    // } 
    else {
      wx.showLoading({
        title: '提交中...',
        mask: true
      })

      const cargo = this.data.cargo
      const tServices = this.data.tServices
      const sendAddr = this.data.sendAddr
      const receiveAddr = this.data.receiveAddr || {}
      const carrier = this.data.carrier
      const remark = this.data.remark

      const params = {
        goodsClassId: cargo.cargoType.id,

        consignerMan: sendAddr.sendName,
        consignerWay: sendAddr.sendTel,
        consignerProvince: sendAddr.sendProvince,
        consignerCity: sendAddr.sendCity,
        consignerDistrict: sendAddr.sendDistrict,
        consignerAddress: sendAddr.sendAddress,
        consigner_client_account: sendAddr.sendCode,
        consigner_name: sendAddr.sendCompany,

        consigneeMan: receiveAddr.receiveName,
        consigneeWay: receiveAddr.receiveTel,
        consigneeProvince: receiveAddr.receiveProvince,
        consigneeCity: receiveAddr.receiveCity,
        consigneeDistrict: receiveAddr.receiveDistrict,
        consigneeAddress: receiveAddr.receiveAddress,
        consignee_client_account: receiveAddr.receiveCode,
        consignee_name: receiveAddr.receiveCompany,

        volume: cargo.cargoVolumn,
        weight: cargo.cargoWeight,
        goodsPack: cargo.cargoPack,
        packingAmount: cargo.cargoNum,
        settlementMode: cargo.cargoSelectMode.itemKey,
        remark: remark,
      }

      if (tServices) {
        params.sendservice = JSON.stringify(tServices)
      }

      if (this.data.sendDate) {
        const bookingTime = this.data.sendDate + ' ' + this.data.sendTime
        params.bookingTime = bookingTime
      }

      if (carrier) {
        params.carrierId = carrier.id
      }

      const id = this.data.bookOrderId
      let postApi = 'mini/program/order/createBookingOrder'
      if (id) {
        postApi = 'mini/program/order/bookingOrderCommand'
        params.id = id
        params.command = 'update'
      }

      ajax.postApi(postApi, params, (err, res) => {
        wx.hideLoading()
        if (res && res.success) {
          wx.showToast({
            title: '下单成功',
            success: () => {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; //上一个页面
              prevPage.onLoad()
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          wx.showToast({
            title: res.text,
            duration: 1000
          })
        }
      })
    }
  },

  //再下一单
  hideTip: function (e) {
    this.setData({
      hideShadow: true,
      hideTip: true,
      markFcous: false,
    })
  },

  //查看订单
  toOrder: function (e) {
    this.setData({
      hideShadow: true,
      hideTip: true,
      markFcous: false,
    })
    //   wx.navigateTo({
    //     url: '../orderinfo/orderinfo?status=' + e.currentTarget.dataset.status + '&orderId=' + e.currentTarget.dataset.id + '&orderTime=' + e.currentTarget.dataset.time
    //   })
  },

  //关闭弹窗
  hide: function (e) {
    this.setData({
      hideShadow: true,
      hideTime: true,
      hideRule: true,
      hideTip: true,
      markFcous: false,
    })
  },

  getOrderAgreement() {
    ajax.getApi('mini/program/order/getOrderAgreement', {

    }, (err, res) => {
      if (res && res.success) {
        if (res.data.order_agreement) {
          this.setData({
            agreement: res.data.order_agreement
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

  getDefaultPubAddress() {
    ajax.getApi('mini/program/member/getDefaultPubAddress', {

    }, (err, res) => {
      if (res && res.success) {
        if (res.data.receiveAddress) {
          const data = res.data.receiveAddress
          this.setData({
            receiveAddr: {
              receiveName: data.contact_name,
              receiveTel: data.contact_way,
              receiveProvince: data.province_id,
              receiveCity: data.city_id,
              receiveDistrict: data.district_id,
              receiveAddress: data.address,
              receiveLocation: data.province + data.city + data.district + data.address
            },
            WReceive: false,
          })
        }
        if (res.data.sendAddress) {
          const data = res.data.sendAddress
          this.setData({
            sendAddr: {
              sendName: data.contact_name,
              sendTel: data.contact_way,
              sendProvince: data.province_id,
              sendCity: data.city_id,
              sendDistrict: data.district_id,
              sendAddress: data.address,
              sendLocation: data.province + data.city + data.district + data.address
            },
            WSend: false,
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

  loadBookOrder(id) {
    wx.showLoading({
      title: '订单加载中...',
    })

    ajax.getApi('mini/program/order/getBookingOrderById', {
      id
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        console.log(res.data)
        const data = res.data
        this.setData({
          bookOrderId: id,
          receiveAddr: {
            receiveName: data.consignee_man,
            receiveTel: data.consignee_phone,
            receiveProvince: data.consignee_province_id,
            receiveCity: data.consignee_city_id,
            receiveDistrict: data.consignee_district_id,
            receiveAddress: data.consignee_address,
            receiveLocation: data.consignee_province_name + data.consignee_city_name + data.consignee_district_name + data.consignee_address
          },
          sendAddr: {
            sendName: data.consigner_man,
            sendTel: data.consigner_phone,
            sendProvince: data.consigner_province_id,
            sendCity: data.consigner_city_id,
            sendDistrict: data.consigner_district_id,
            sendAddress: data.consigner_address,
            sendLocation: data.consigner_province_name + data.consigner_city_name + data.consigner_district_name + data.consigner_address
          },
          WReceive: false,
          WSend: false,
          WCargo: false,
          carrier: {
            contact_man: data.carrier_name,
            id: data.carrier_id
          },
          cargo: {
            cargoType: {
              id: data.goods_class_id,
              name: data.goods_class_name,
            },
            cargoNum: data.total_packing_quantity,
            cargoPack: data.pack,
            cargoVolumn: data.total_volume,
            cargoWeight: data.total_weight,
            cargoSelectMode: {
              itemKey: data.settlement_mode
            }
          },
          remark: data.remark,
          sendDate: data.booking_date,
          sendTime: data.booking_time2,
        })

        if (data.add_services) {
          const tServices = JSON.parse(data.add_services)
          this.setData({
            WService: false,
            tServices
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_is_need_carrier: app.globalData.appModules.ORDER_IS_NEED_CARRIER,
      order_is_need_receiver: app.globalData.appModules.ORDER_IS_NEED_RECEIVER,
    }, () => {
      console.log(this.data.order_is_need_carrier == 1)
      console.log(this.data.order_is_need_receiver == 1)
    })
 
    const bookOrderId = options.bookOrderId
    if(bookOrderId) {
      //加载要修改的订单信息
      this.loadBookOrder(bookOrderId)
    } else {
      //加载默认地址
      this.getDefaultPubAddress()
    }
    this.getOrderAgreement()
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