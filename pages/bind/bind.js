// pages/bind/bind.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: "",
    code: "",
    true_name: "",
    codename: "获取验证码",
  },

  getPhoneNumber(e) {
    const encryptedData = e.detail.encryptedData
    const iv = e.detail.iv
    const _this = this
    if (encryptedData) {
      wx.checkSession({
        success() {
          console.log("session exist")
          // session_key 未过期，并且在本生命周期一直有效
          ajax.getApi('mini/program/encryptUserPhone', {
            encryptedData: encodeURIComponent(encryptedData),
            iv,
            sessionKey: app.globalData.sessionKey
          }, (err, res) => {
            if (res && res.success) {
              _this.setData({
                tel: res.data.phoneNumber
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
        fail() {
          console.log("session don't exist")
          // session_key 已经失效，需要重新执行登录流程
          wx.login({
            success: res => {
              ajax.getApi('mini/program/code2Session', {
                app_area: app.globalData.platformAppArea,
                js_code: res.code,
                app_id: app.globalData.appId
              }, (err, rest) => {
                if (rest && rest.success) {
                  const result = rest.data
                  app.globalData.openId = result.openid
                  app.globalData.unionId = result.unionid
                  app.globalData.sessionKey = result.session_key
                  wx.setStorageSync('openId' + app.globalData.platformAppArea, result.openid)
                  wx.setStorageSync('unionId' + app.globalData.platformAppArea, result.unionid)
                  wx.setStorageSync('sessionKey' + app.globalData.platformAppArea, result.session_key)
                  ajax.getApi('mini/program/encryptUserPhone', {
                    encryptedData: encodeURIComponent(encryptedData),
                    iv,
                    sessionKey: result.session_key
                  }, (err, res) => {
                    if (res && res.success) {
                      _this.setData({
                        tel: res.data.phoneNumber
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
                }
              })

            }
          })
        }
      })
    }
  },

  //获取input输入框的值  
  getPhoneValue: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getTrueName: function (e) {
    this.setData({
      true_name: e.detail.value
    })
  },


  //获取验证码  
  getVerificationCode(e) {
    const phone = this.data.tel
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (phone == "请输入手机号") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.showLoading({
        title: '发送中..',
        mask: true
      })

      ajax.getApi('mini/program/member/sendSMS', {
        phone,
        mToken: 'bindMemberToken'
      }, (err, res) => {
        wx.hideLoading()
        if (res && res.success) {
          let num = 60
          var timer = setInterval(() => {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              this.setData({
                codename: '重新发送',
                disabled: false,
              })
            } else {
              this.setData({
                codename: num + "s",
                disabled: true
              })
            }
          }, 1000)
          wx.showToast({
            title: '发送成功',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.text,
            duration: 1000
          })
        }
      })

    }

    this.setData({
      disabled: true
    })
  },


  bindPhone(callback = () => 1) {
    const phone = this.data.tel
    const code = this.data.code
    const true_name = this.data.true_name
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (phone === "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (true_name === "") {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (code === "") {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.showLoading({
        title: '绑定中...',
        mask: true
      })
      ajax.postApi('mini/program/member/bindPhone', {
        phone,
        mCode: code,
        trueName: true_name,
        mToken: 'bindMemberToken',
      }, (err, res) => {
        wx.hideLoading()
        if (res && res.success) {
          app.globalData.memberInfo.phone = phone
          app.globalData.isBindPhone = true
          callback()
          // var pages = getCurrentPages();
          // var prevPage = pages[pages.length - 2]; //上一个页面
          // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

          // prevPage.setData({
          //   first: false,
          // })
        } else {
          wx.showToast({
            title: res.text,
            duration: 1000
          })
        }
      })
    }
  },

  //确认绑定
  toFirst: function (e) {
    this.bindPhone(() => {
      wx.navigateBack({ //返回
        delta: 1
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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