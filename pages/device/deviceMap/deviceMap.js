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
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  setLocation () { // 设置定位
    this.setData({
        latitude: app.globalData.User_location[0],
        longitude: app.globalData.User_location[1],
        markers: this.data.markers
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
	let that = this
	const eventChannel = this.getOpenerEventChannel()
	eventChannel.on('acceptDataFromOpenerPage', function(data) {
	  console.log('index.wxml',data)
	  that.execThis(data)
	})
  },
  
  execThis(data){
	  for(let item of data){
		this.data.markers.push({
			latitude: item.laytitude,
			longitude: item.longitude,
				callout:{
					content: item.positionAddress,
					padding:10,
					display:'BYCLICK',
					textAlign:'center',
					borderRadius: 10
				}
		})
	  }
	  if(app.globalData.User_location)
	  this.setLocation()
	  else{
		wx.showLoading({
			title:"定位中",
			mask:true
		})
	  	loopLocation(res=>{
	  		wx.hideLoading()
	  		this.setLocation()
	  	})
	  }
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