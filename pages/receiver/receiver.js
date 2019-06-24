// pages/receiver/receiver.js
const ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: [{
      name: "待支付",
      value: "0",
    }, {
      name: "待签收",
      value: "1",
    }, {
      name: "待评价",
      value: "2",
    }, {
      name: "已评价",
      value: "3",
    }, ],
    orderNo: '',
    selectStatus: 0,
    shopOrders: [],
    page: 1,
    pageSize: 10,
    count: 0,
    loadCompleted: false,
    timelyArray: [{
      text: "及时",
      img: "../../images/check.png",
      value: 1
    }, {
      text: "不及时",
      img: "../../images/uncheck.png",
      value: 0
    }],

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
      payStyle: "到付",
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
        info: "一键签收",
        open: "showSign",
      }, ],

    }, {
      id: "18352790280265",
      time: "2018-11-25 16:56",
      start: "浙江温州",
      end: "北京市",
      receive: "北京海淀雷蒙赛博机电技术有限公司",
      cargoName: '电子',
      cargoNum: '2',
      cargoPack: '纸箱',
      cargoWeight: '0.6',
      cargoCubage: '0.2',
      signpic: "https://img000.hc360.cn/y1/M02/DE/6A/wKhQc1SXrbeEdFP3AAAAAOl0pFk816.jpg", //签收回单
      status: "一键签收",
      btn: [{
        info: "查看回单",
        open: "showPaper",
      }, {
        info: "去评价",
        open: "showComment",
      }],

    }, {
      id: "18352790283072",
      time: "2018-01-01",
      start: "浙江温州",
      end: "湖北武汉",
      receive: "武汉恒望科技有限公司",
      cargoName: '电子',
      cargoNum: '5',
      cargoPack: '纸箱',
      cargoWeight: '1.8',
      cargoCubage: '0.3',
        signpic: "http://www.xiaohuilang.com/service/template/wof/2016/5/201654c4154329ib5.jpg", //签收回单      
      status: "已评价",
      btn: [{
        info: "查看回单",
        open: "showPaper",
      }],
    }, ],
    hide: true,
    hidePay: true,
    hideSign: true,
    hideReceipt: true,
    receiptPic: "../../images/picture2.png",
    hideComment: true,
    hideTip: true,

  },

  toShopOrderInfo(e) {
    wx.navigateTo({
      url: '../waybill/waybill?id=' + e.currentTarget.dataset.id
    })
  },

  confirmInput(e) {
    this.setData({
      page: 1,
      shopOrders: [],
      loadCompleted: false
    }, () => {
      this.getMiniShopOrderList()
    })
  },

  bindInput(e) {
    this.setData({
      orderNo: e.detail.value
    })
  },

  //关闭签收页面
  hideSign: function (e) {
    this.setData({
      hide: true,
      hideSign: true,
    })
  },

  inputComment: function (e) {
    const comment = e.detail.value
    this.setData({
      comment
    })
  },



  //选择状态
  selectStatus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      selectStatus: index,
      page: 1,
      shopOrders: [],
      loadCompleted: false
    }, () => {
      this.getMiniShopOrderList()
    })
  },

  //打开签收弹窗
  showSign: function (e) {
    const index = e.currentTarget.dataset.index

    this.setData({
      hide: false,
      hideSign: false,
      selectOrder: this.data.shopOrders[index],
      selectIndex: index,
      now: util.getFormatDate(1)
    }, () => {
      //有些运单没有预计到达时间，所以要判断，都改成及时
      let isTimely = 1
      if (this.data.selectOrder.estimated_arrive_date) {
        isTimely = util.compareDate(this.data.selectOrder.estimated_arrive_date, this.data.now)
      }
      this.setData({
        actualNumber: this.data.selectOrder.total_packing_quantity,
        actualDate: this.data.now.substring(0, 10),
        actualTime: this.data.now.substring(11, 16),
        timely: isTimely >= 0,
        isHideTimeLy: isTimely >= 0,
        timeliness: isTimely >= 0 ? 1 : 0,
        timelyIndex: isTimely >= 0 ? 0 : 1,
      })
    })
  },






  selectRadio: function (e) {
    if (e.currentTarget.dataset.index === 0) {
      const actualDate = this.data.selectOrder.estimated_arrive_date.substring(0, 10)
      const actualTime = this.data.selectOrder.estimated_arrive_date.substring(11)
      this.setData({
        actualDate,
        actualTime,
      })
    }
    this.setData({
      timely: e.currentTarget.dataset.index === 0 ? true : false,
      timelyIndex: e.currentTarget.dataset.index,
      timeliness: this.data.timelyArray[e.currentTarget.dataset.index].value
    })

  },

  //签收
  toSelect: function(e) {
    this.setData({
      hideSign: true,
      hide: false,
      hideTip: false,
      id: "18352790283072",
    })
  },

  //打开回单上传弹窗
  toReceipt: function(e) {
    this.setData({
      hideTip: true,
      hide: false,
      hideReceipt: false,
      //签收回单信息
      receiptName: "武汉恒望科技有限公司",
      receiptTel: "15622663527",
      receiptTime: "2018-11-30 17:03",
    })
  },


  //回单上传
  changeReceipt: function(e) {
    var _this = this // 不能直接用this，留坑
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 指定是原图还是压缩图
      sourceType: ['album', 'camera'], // 指定来源是相册还是相机
      success: function(res) {
        var tempFilePaths = res.tempFilePaths; //可以作为img标签的src属性显示图片
        _this.setData({
          receiptPic: tempFilePaths
        });
      }
    })
  },

  //关闭评价页面
  hideComment: function (e) {
    this.setData({
      hide: true,
      hideComment: true,
    })
  },

  //打开评价弹窗
  showComment: function (e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      hide: false,
      hideComment: false,
      selectIndex: index,
      selectOrder: this.data.orders[index],
      //评价星级
      commentStar: [{
        pic: '../../images/eva-on.png',
        index: '0',
        checked: false
      },
      {
        pic: '../../images/eva-on.png',
        index: '1',
        checked: false
      },
      {
        pic: '../../images/eva-on.png',
        index: '2',
        checked: false
      },
      {
        pic: '../../images/eva-on.png',
        index: '3',
        checked: false
      },
      {
        pic: '../../images/eva-on.png',
        index: '4',
        checked: true
      },
      ],

      commentRank: "非常好",
      comment: "",
      imgs: [],
      starSelect: 5,
    })
  },

  commitComment: function () {
    const id = this.data.selectOrder.id
    const comment_star = this.data.starSelect || 5
    const comment = this.data.comment
    const imgs = JSON.stringify(this.data.imgs)

    if (comment === '') {
      wx.showToast({
        title: '请进行评价',
      })
    }
    wx.showLoading({
      title: '评价提交中...',
      mask: true
    })
    ajax.postApi('mini/program/order/evaluateShopOrder', {
      id,
      comment_content: comment,
      comment_star,
      imgs
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        wx.showToast({
          title: '提交成功',
        })
        this.data.orders.splice(this.data.selectIndex, 1)
        this.setData({
          orders: this.data.orders,
          hide: true,
          hideComment: true,
        })
      } else {
        wx.showToast({
          title: res.text,
          duration: 1000
        })
      }
    })
  },


  //评价星级选择
  changeEva: function (e) {
    var commentStar = this.data.commentStar;
    var checkIndex = e.currentTarget.dataset.index

    for (var i = 0; i < commentStar.length; i++) {
      if (i <= checkIndex) {
        commentStar[i].pic = "../../images/eva-on.png"
      } else {
        commentStar[i].pic = "../../images/eva-e.png"
      }
    }
    this.setData({
      commentStar: commentStar,
      starSelect: checkIndex + 1,
    });


    if (checkIndex == 4) {
      this.setData({
        commentRank: "非常好",
      });
    } else if (checkIndex == 3) {
      this.setData({
        commentRank: "较好",
      });
    } else if (checkIndex == 2) {
      this.setData({
        commentRank: "一般",
      });
    } else {
      this.setData({
        commentRank: "差",
      });
    }

  },



  //选择评价
  chooseMark: function(e) {
    const index = e.currentTarget.dataset.index;
    let marks = this.data.marks;
    const choose = marks[index].choose;
    marks[index].choose = !choose;

    const checked = marks[index].checked;
    marks[index].checked = !checked;

    this.setData({
      marks: marks
    });

    let sumc = "";
    for (let i = 0; i < marks.length; i++) {
      if (marks[i].choose == true) {
        sumc += marks[i].value;
      }
    }
    this.setData({
      comment: sumc
    });

  },




  //上传图片
  changePic: function (e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        res.tempFilePaths.forEach(v => {
          util.ImgPathToBase64(v, base64 => {
            const imgs = this.data.imgs
            const img = 'data:image/png;base64,' + base64
            imgs.push(img)
            this.setData({
              imgs
            })
          })
        })
      }
    })

  },


  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs,
    });
  },

  //关闭弹窗
  hide: function(e) {
    this.setData({
      hide: true,
      hidePay: true,
      hideSign: true,
      hideReceipt: true,
      hideComment: true,
      hideTip: true,
    })
  },



  // //查看签收回单
  // showPaper: function(e) {
  //   var array = [];
  //   var index = e.currentTarget.dataset.index;
  //   var pic = this.data.orderTable[index].signpic

  //   array.push(pic)
  //   if (pic != '') {
  //     wx.previewImage({
  //       urls: array // 需要预览的图片http链接列表
  //     })
  //   }
  // },

  getMiniShopOrderList() {
    const page = this.data.page
    const pageSize = this.data.pageSize
    const state = this.data.selectStatus
    const type = this.data.type
    const orderNo = this.data.orderNo
    wx.showLoading({
      title: '查询中',
    })
    ajax.getApi('mini/program/order/getMiniShopOrderList', {
      page,
      pageSize,
      type,
      orderNo,
      state
    }, (err, res) => {
      wx.hideLoading()
      if (res && res.success) {
        if (res.data.orderList.length > 0) {
          const shopOrders = this.data.shopOrders
          const newShopOrders = res.data.orderList
          console.log(newShopOrders)
          Array.prototype.push.apply(shopOrders, newShopOrders)
          console.log(shopOrders)
          this.setData({
            shopOrders
          })
        } else {
          this.setData({
            loadCompleted: true
          })
          wx.showToast({
            title: '数据已全部加载完毕',
            duration: 1000
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

  lower: function (e) {
    let page = this.data.page
    const pageSize = this.data.pageSize
    const loadCompleted = this.data.loadCompleted
    if (!loadCompleted) {
      wx.showLoading({
        title: '更多数据加载中...',
      })
      page++
      this.setData({
        page
      }, () => {
        this.getMiniShopOrderList()
      })
    } else {
      wx.showToast({
        title: '数据已全部加载完毕',
        duration: 1000
      })
    }
  },

  setTitle(type) {
    console.log(type)
    switch(type) {
      case '0':
        wx.setNavigationBarTitle({
          title: '我是收货人'
        })
        break;
      case '1':
        wx.setNavigationBarTitle({
          title: '我是发货人'
        })
        break;
      default:
        wx.showToast({
          title: '页面参数错误',
        })
        break
    }
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const type = options.type 
    this.setNowDate()
    this.setTitle(type)
    this.setData({
      type
    }, () => {
      this.getMiniShopOrderList()
    })
  },

  //选择日期
  dateSelectAction: function (e) {
    const key = wx.getStorageSync('timeindex')
    var cur_day = e.currentTarget.dataset.idx;
    var cur_date = cur_day + 1;
    var cur_month = this.data.cur_month;
    var cur_year = this.data.cur_year;
    if (cur_date < 10) {
      cur_date = "0" + cur_date
    }
    if (cur_month < 10) {
      cur_month = "0" + cur_month
    }
    if (key === 'startDate' || key === 'endDate') {
      this.data.query[key] = cur_year + "-" + cur_month + "-" + cur_date

      this.setData({
        todayIndex: cur_day,
        showDate: false,
        query: this.data.query,
      })
    } else {
      this.data[key] = cur_year + "-" + cur_month + "-" + cur_date
      this.setData({
        todayIndex: cur_day,
        showDate: false,
        [key]: this.data[key]
      })

    }

    if (this.data.hideFilter == true) {
      this.setData({
        hide: true,
      })
    }

  },


  //构造日历插件
  setNowDate: function () {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_day = date.getDate();
    const todayIndex = date.getDate() - 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);

    this.setData({
      cur_year,
      cur_month,
      cur_day,
      weeks_ch,
      todayIndex,
    })
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
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