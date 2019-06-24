// pages/cargo/cargo.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cargoList: [],
    select: 0,
    cargo: undefined,
    cargoName: "电子",
    settlementMode: undefined,

    cargoPay: [{
      pic: "../../images/check.png",
      name: "现付"
    }, {
      pic: "../../images/uncheck.png",
      name: "到付"
    }, {
      pic: "../../images/uncheck.png",
      name: "月结"
    }],

    count: undefined,
    volumn: undefined,
    packaged: undefined,
    weight: undefined,

  },

  bindInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },

  //商品名名称
  selectname: function (e) {
    var cargoList = this.data.cargoList
    var index = e.currentTarget.dataset.index
    // if (cargoList[index].name == '其他') {
    //   cargoList[index].input = true
    //   var cargoName = ''
    // } else {
    //   for (var i = 0; i < cargoList.length; i++) {
    //     cargoList[i].input = false
    //   }
    //   var cargoName = cargoList[index].name
    // }
    const cargo = cargoList[index]

    this.setData({
      cargo
      // select: index,
      // cargoList: cargoList,
      // cargoName: cargoName
    })

  },



  //结算方式
  selectpay: function (e) {
    var settlementMode = this.data.settlementMode
    var index = e.currentTarget.dataset.index

    this.setData({
      selectMode: settlementMode[index]
    })

  },


  //保存
  formSubmit: function (e) {
    const cargo = this.data.cargo
    const count = this.data.count
    const volumn = this.data.volumn || 0
    const packaged = this.data.packaged || ''
    const weight = this.data.weight || 0
    const selectMode = this.data.selectMode
    if (!cargo) {
      wx.showToast({
        title: '请选择货物类型！',
        icon: 'none',
        duration: 2000,
      })
    } else if (!count) {
      wx.showToast({
        title: '请输入货物件数！',
        icon: 'none',
        duration: 2000,
      })
    } else if (!selectMode) {
      wx.showToast({
        title: '请选择结算方式！',
        icon: 'none',
        duration: 2000,
      })
    } else {

      wx.navigateBack({ //返回
        delta: 1
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去


      // if (this.data.cargoName == '') { //货物名称是选择的还是自己写的
      //   var cargoName = e.detail.value.name
      // } else {
      //   var cargoName = this.data.cargoName
      // }

      // if (e.detail.value.weight != '') { //填了货物重量
      //   prevPage.setData({
      //     cargoWeight: e.detail.value.weight + 'kg',
      //   })
      // }

      // if (e.detail.value.cub != '') { //填了货物体积
      //   prevPage.setData({
      //     cargoCub: e.detail.value.cub + 'm³',
      //   })
      // }


      prevPage.setData({ //货物名称、件数、包装等信息
        WCargo: false,
        cargo: {
          cargoType: cargo,
          cargoNum: count,
          cargoPack: packaged,
          cargoVolumn: volumn,
          cargoWeight: weight,
          cargoSelectMode: selectMode,
        }
      })

    }

  },


  getGoodsClassList(cargo) {
    wx.showLoading({
      title: '获取中',
    })

    ajax.getApi('mini/program/order/getGoodsClassList', {

    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        if (res.data.length > 0) {
          if (cargo) {
            this.setData({
              cargoList: res.data,
              cargo: cargo.cargoType,
              count: cargo.cargoNum,
              packaged: cargo.cargoPack || '',
              volumn: cargo.cargoVolumn,
              weight: cargo.cargoWeight,
            })
          } else {
            this.setData({
              cargoList: res.data,
              cargo: res.data[0]
            })
          }

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

  getDic(cargo) {
    ajax.getApi('app/common/getDic', {
      dic_key: 'settlement_mode'
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        if (res.data.length > 0) {
          const settlementMode = res.data
          const selectMode = settlementMode[0]
          if (cargo) {
            this.setData({
              settlementMode,
              selectMode: cargo.cargoSelectMode
            })
          } else {
            this.setData({
              settlementMode,
              selectMode
            })
          }

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
    let cargo = options.cargo
    if (cargo) {
      cargo = JSON.parse(cargo)
    }
    this.getGoodsClassList(cargo)
    this.getDic(cargo)
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