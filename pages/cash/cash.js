// pages/cash/cash.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: '168.50',
    pay: '0',

    hideRule: true,
    Rule: [{
      info: "您好！感谢您选择XXXX运输有限公司（以下简称我公司）。",
      indent: true,
    }, {
      info: "请您在托运货物前仔细阅读本服务条款，您阅读并确认后，说明：您同意遵守我公司公示的隐私政策及不定期修订的相关内容，并同意我公司按照法律法规和隐私政策处理您提供的运单信息，且愿意遵守或协同遵循一下条款的服务约定。",
      indent: true,
    }, {
      info: "1 共同遵守国家“实名制寄件制度"
    }, {
      info: "1.1根据《中华人民共和国反恐怖主义法》、《关于加强物流安全管理工作的若干意见》、《汽车货物运输规则》等法规要求，我公司采用“实名寄件”的形式受理您的托运需求，您必须有效配合。"
    }, {
      info: "1.2为保证托运货物安全送达，您必须如实提供您（发货人）的个人信息（包括身份信息和通信联络信息）及“收货人”的地址信息和联系电话等资料，以供登记和查验。"
    }, {
      info: "1.3您必须如实申报需要托运的货物的“名称”和货物的“性质”，并准确录入开票系统。"
    }, {
      info: "2 关于货物检视与禁运货物的申明"
    }, {
      info: "2.1为共同遵循《中华人民共和国反恐怖主义法》、《关于加强物流安全管理工作的若干意见》、《汽车货物运输规则》等禁止运输货物法律法规的规定，我公司有权依法对您托运的货物进行“检视”。"
    }, {
      info: "2.2禁止运输和限制运输的货物包括但不限于：易燃易爆、枪支弹药、民爆产品；有毒有害、放射源、危及人身健康、破坏生态环境的物品；宣传宗教极端思想、宣扬民族分裂思想、反党反社会主义言论等极端思想的宣传品等。"
    }, {
      info: "3 托运货物的保价与赔偿"
    }, {
      info: "3.1我公司建议，您在托运货物时如实按所托运的货物实际价值选择保价；在托运过程中发生的损失理赔时，按照我公司要求提供相关价值证明材料（如果您是代表单位、企业的，所提供的证明材料须加盖对应单位的公章）。"
    }, {
      info: "3.2如您未选择保价运输，当托运货物出现理赔情况时，我公司按“普通货物”的理赔标准进行处理，最高按当期票损失货物平均运价的五倍进行赔偿，货物实际价值小于“货物平均运价五倍”的，按实际价值进行赔偿。"
    }, {
      info: "3.3如您已经选择了保价运输，当托运货物出现理赔情况时，我公司按“保价货物”的理赔标准进行处置，实际价值大于或等于声明价值时，所托货物全部毁损或灭失，我公司按照保价声明价值予以赔偿；如所托货物部分损毁或内件短少，则按照声明价值和损失比例赔偿。实际价值小于声明价值时，所托货物全部毁损或灭失，按照实际价值赔偿；所托货物部分损毁或内件短少时，则按照实际损失赔偿。"
    }],
    hideRule:true,
    hidePassword: true,
    hideShadow: true,

    passwordTip: true,
    password: "请输入支付密码",
    password2: "请再次输入支付密码",
    isGet: false,
    sec: 60
  },

  countValue: function(e) {
    this.setData({
      countvalue: this.data.count
    })

  },


  //快件运单条约弹窗
  showRule: function(e) {
    this.setData({
      hideRule: false,
      hideShadow: false
    })
  },

  //快件运单条约关闭弹窗
  hideRule: function(e) {
    this.setData({
      hideRule: true,
      hideShadow: true,
    })
  },

  hide: function(e) {
    this.setData({
      hideRule: true,
      hidePassword: true,
      hideShadow: true,
    })
  },




  toPassword: function(e) {
    this.setData({
      hidePassword: false,
      hideShadow: false
    })
  },


  //获取用户输入的密码
  password: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  password2: function(e) {
    this.setData({
      password2: e.detail.value
    })
  },


  //获取验证码
  getCode() {
    var self = this
    self.setData({
      isGet: true
    })
    var remain = 60;
    var time = setInterval(function() {
      if (remain == 1) {
        clearInterval(time)
        self.setData({
          sec: 60,
          isGet: false
        })
        return false
      }
      remain--;
      self.setData({
        sec: remain
      })
    }, 1000)
  },



  hidePassword: function(e) {
    if (this.data.password == this.data.password2) {
      this.setData({
        hidePassword: true,
        hideShadow: true,
        passwordTip: true,
      })
    } else {
      this.setData({
        passwordTip: false
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