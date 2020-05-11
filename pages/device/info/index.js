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
    thisGoods:[{
      categoryName: '全部'
    }]
  },

  barAir (e) { // 导航事件
    this.setData({
      barCurrent: e.currentTarget.dataset.type
    })
  },

  goThatAddress () {
    wx.openLocation({
      latitude:this.data.thisDeviceDetails.laytitude,
      longitude:this.data.thisDeviceDetails.longitude,
      name:'',
      address:this.data.thisDeviceDetails.positionAddress
    })
  },
  
  goSminfo () {
    wx.navigateTo({
      url: `/pages/device/sminfo/index?machineCode=${this.data.thisDeviceDetails.machineCode}&channelId=${this.data.thisDeviceDetails.channelId}`
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
		  this.setData({
			  thisGoods: this.data.thisGoods.concat(res.result)
		  })
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