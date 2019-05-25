// pages/addCreate/addCreate.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    tel: "",
    location: "浙江省温州市鹿城区",
    region: ['浙江省', '温州市', '鹿城区'],
    province: {
      value: '浙江省',
      code: 330000
    },
    city: {
      value: '温州市',
      code: 330300
    },
    district: {
      value: '鹿城区',
      code: 330302
    },
    door: "",
    address_id: undefined,
    send_place_type: undefined,
  },

  // 选择省市区函数
  changeRegin(e) {
    this.setData({
      region: e.detail.value,
      location: e.detail.value[0] + e.detail.value[1] + e.detail.value[2],
      province: {
        value: e.detail.value[0],
        code: e.detail.code[0]
      },
      city: {
        value: e.detail.value[1],
        code: e.detail.code[1]
      },
      district: {
        value: e.detail.value[2],
        code: e.detail.code[2]
      },
    });
  },

  //textare换行
  getInput: function (e) {
    this.setData({
      door: e.detail.value
    })
  },

  bindinput: function (e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },


  //地址定位
  location: function (e) {
    wx.navigateTo({
      url: '../mapLocation/mapLocation'
    })
  },




  //保存
  formSubmit: function (e) {
    const name = this.data.name
    const tel = this.data.tel
    const door = this.data.door
    const province = this.data.province
    const city = this.data.city
    const district = this.data.district
    const send_place_type = this.data.send_place_type
    const address_id = this.data.address_id
    const company_code = this.data.company_code
    const contact_company = this.data.contact_company

    if (!name) {
      wx.showToast({
        title: '请输入联系人姓名！',
        icon: 'none',
        duration: 3000,
      })

    } else if (!tel) {
      wx.showToast({
        title: '请输入联系人手机号！',
        icon: 'none',
        duration: 3000,
      })
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(tel))) {
      wx.showToast({
        title: '手机号格式不正确！',
        icon: 'none',
        duration: 3000,
      })
    } else if (!door) {
      wx.showToast({
        title: '请输入联系人详细地址！',
        icon: 'none',
        duration: 3000,
      })
    } else {
      wx.showLoading({
        title: '保存中...',
        mask: true
      })

      const params = {
        send_place_type,
        contact_name: name,
        contact_way: tel,
        province_id: province.code,
        province: province.value,
        city_id: city.code,
        city: city.value,
        district_id: district.code,
        district: district.value,
        address: door,
        company_code,
        contact_company
      }

      if (address_id) {
        params.id = address_id
      }

      ajax.postApi('mini/program/member/savePubAddress', params, (err, res) => {
        wx.hideLoading()
        if (res && res.success) {
          wx.showToast({
            title: '保存成功',
            success() {
              wx.navigateBack({ //返回
                delta: 1
              })
            },
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

  getAddressById() {
    const id = this.data.address_id
    wx.showLoading({
      title: '查询中...',
      mask: true
    })

    ajax.getApi('mini/program/member/getPubAddressById', {
      id
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        const address = res.data
        this.setData({
          name: address.contact_name,
          tel: address.contact_way,
          door: address.address,
          region: [address.province, address.city, address.district],
          company_code: address.company_code,
          contact_company: address.contact_company,
          province: {
            value: address.province,
            code: address.province_id
          },
          city: {
            value: address.city,
            code: address.city_id
          },
          district: {
            value: address.district,
            code: address.district_id
          },
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
  onLoad: function (options) {
    const send_place_type = options.send_place_type
    const address_id = options.address_id
    if (!send_place_type) {
      wx.showToast({
        title: 'error type',
        success() {
          wx.navigateBack({ //返回
            delta: 1
          })
        },
      })
    }

    this.setData({
      send_place_type
    })

    if (address_id) {
      this.setData({
        address_id
      }, () => {
        this.getAddressById()
      })
    }
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
    //接收从定位页面或者搜索定位页面传递的参数
    var that = this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    var sign = currPage.data.sign
    if (sign == '1') {
      that.setData({ //将携带的参数赋值
        // region: [currPage.data.province.value, currPage.data.city.value, currPage.data.district.value],
        // location: currPage.data.province + currPage.data.city + currPage.data.district,
        door: currPage.data.door,
      });
    } else {
      //如果是从选择地址页面跳转则不传参

    }

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