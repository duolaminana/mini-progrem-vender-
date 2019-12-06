// pages/device/deviceMap/deviceMap.js
const {app,$,cusAppData} = require('../../../utils/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...cusAppData,
    hdData: {
        ...cusAppData,
      warp: {
        style: {
          backgroundColor: 'white'
        }
      },
      content: {
        text: '附近售烟机'
      },
      left: {
        class: 'goback-black'
      }
    },
    latitude: null,
    longitude: null,
    markers: [
      // {
      //   latitude: 24.4455700000,
      //   longitude: 118.0824000000,
      //   callout:{
      //     content: " 厦门思明区政府",
      //     padding:10,
      //     display:'ALWAYS',
      //     textAlign:'center',
      //     borderRadius: 10
      //   }
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.myLocation)
    this.setLocation(app.globalData.myLocation)
    else{
        wx.showLoading({
            title:"定位中",
            mask:true
        })
        $.getLocation(true).then(res => {
            if(res){
                this.setLocation(res)
            }else{
                let timer = setInterval(() => { // 自定义监听用户打开定位系统
                    $.getLocation().then(res => {
                        if(res){
                            wx.hideLoading()
                            this.setLocation(res)
                            clearInterval(timer)
                        }
                    })
                }, 1000);
            }
        })
    }
  },

  setLocation (res) { // 设置定位
    this.setData({
        latitude: res[0],
        longitude: res[1],
        markers: [
            {
                id: 1,
                latitude: res[0]+0.001,
                longitude: res[1]+0.001,
                callout:{
                    content: "厦门思明区政府",
                    padding:10,
                    display:'BYCLICK',
                    textAlign:'center',
                    borderRadius: 10
                }
            }
        ]
    })
  },

  markerAir (e) { // 点击打开标记位置去导航地图
    let lat,lon
    this.data.markers.map(now=>{
      if(now.id == e.markerId){
        lat = now.latitude
        lon = now.longitude
      }
    })
    wx.openLocation({
      latitude:lat,
      longitude:lon
    })
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