// mapLocation.js
// 引入SDK核心类
var QQMapWX = require('../qqmap/qqmap-wx-jssdk.js');
const app = getApp()
var demo = new QQMapWX({
  // key: 'I5GBZ-ZQULP-6MTD5-L4RVA-XAPAJ-DKB4G' // 必填 换成自己申请到的
  key: app.globalData.qqMapKey // 必填 换成自己申请到的
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    currentLat: '',
    currentLon: '',
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentLocation()
    // this.configMap()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  regionchange(e) {
    if (e.type === 'end') {
      const mapCtx = wx.createMapContext("myMap");
      mapCtx.getCenterLocation({
        success: (res) => {
          this.setData({
            markers: [{
              id: 0,
              iconPath: "../../images/marker.png",
              longitude: res.longitude,
              latitude: res.latitude,
              width: 20,
              height: 30
            }]
          })
          this.getPoiList(res.longitude, res.latitude)
        }
      })
    }
  },

  getPoiList(longitude, latitude) {
    demo.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      get_poi: 1,
      poi_options: 'policy=2;radius=3000;page_size=2;page_index=1',
      success: res => {
        const pois = res.result.pois
        this.setData({
          addressList: pois
        })
      }
    })
    
  },

  /**
   * 地图
   */
  getCurrentLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log('location', res)
        that.setData({
          currentLat: latitude,
          currentLon: longitude,
          markers: [{ latitude: latitude, longitude: longitude }]
        })
        // that.configMap();
      },
    })
  },

  configMap: function () {
    var that = this;

    var qqmapsdk = new QQMapWX({
      key: app.globalData.qqMapKey
    });
    // 调用接口
    qqmapsdk.search({
      keyword: '超市',
      location: {
        latitude: that.data.currentLat,
        longitude: that.data.currentLon
      },
      success: function (res) {
        console.log('qqmap_success', res);
      },
      fail: function (res) {
        console.log('qqmap_fail', res);
      },
      complete: function (res) {
        console.log('qqmap_complete', res);
        that.setData({
          addressList: res.data
        })
      }
    });


  },

  //点击地址
  didSelectCell: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    console.log('----event', that.data.addressList[index])
    var locationData = that.data.addressList[index]
    console.log('----', locationData.location)
    // var locationStr = locationData.location;
    var latitude = locationData.location.lat;//locationStr.split(',')[0]
    var longitude = locationData.location.lng;//locationStr.split(',')[1]
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    const province = locationData.ad_info.province || ''
    const city = locationData.ad_info.city || ''
    const district = locationData.ad_info.district || ''
    const title = locationData.title || ''
    let door = locationData.address.replace(province, '').replace(city, '').replace(district, '')
    door += title
    prevPage.setData({

      //将要传递给新增地址或者编辑地址页面的参数
      // province: locationData.ad_info.province,
      // city: locationData.ad_info.city,
      // district: locationData.ad_info.district,
      door: door,
      sign: 1,

      sendAddress: locationData.ad_info.province + ',' + locationData.ad_info.city + ',' + locationData.ad_info.district,
      address: locationData.ad_info.province + '/' + locationData.ad_info.city + '/' + locationData.ad_info.district,
      location: longitude + ',' + latitude
    })

    var locationDic = { 'latitude': latitude, 'longitude': longitude };
    wx.setStorage({
      key: 'map_Location',
      data: locationDic,
    })
    wx.navigateBack({
      //返回选择地址页面
      delta: 1
    })
  },

  // 点击搜索框
  bindSearchTap: function () {
    wx.navigateTo({
      url: 'searchMapLocation/searchMapLocation',
    })
  }

})