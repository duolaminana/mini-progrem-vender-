// pages/device/info/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')
const { getDeviceGoods, memberFindOrderByMachCode } = require('../../../api/api.js')

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
        text: '设备详情'
      },
      left: {
        class: 'goback-black'
      }
    },
    barCurrent: 0,
	thisDeviceDetails:{},
	thisGoods:[]
  },

  barAir (e) { // 导航事件
    this.setData({
      barCurrent: e.currentTarget.dataset.type
    })
  },

  goThatAddress () {
    // wx.chooseLocation({ // 用于搜索位置的地图
    //   success: function (res) {
    //   // success
    //   console.log(res,"location")
    //   console.log(res.name)
    //   console.log(res.latitude)
    //   console.log(res.longitude)
    //   },
    //   fail: function () {
    //   // fail
    //   },
    //   complete: function () {
    //   // complete
    //   }
    // })
    wx.openLocation({
        latitude:this.data.thisDeviceDetails.latitude,
        longitude:this.data.thisDeviceDetails.longitude
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
	let that = this
	const eventChannel = this.getOpenerEventChannel()
	eventChannel.on('acceptDataFromOpenerPage', function(data) {
	  console.log('index.wxml',data)
	  that.execThis(data)
	})
  },
  
  execThis(data){
	  this.setData({
	  	thisDeviceDetails: data
	  })
	  getDeviceGoods(data.machineCode).then(res=>{
		  console.log(res)
		  this.setData({thisGoods:res.result})
	  })
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