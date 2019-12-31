// pages/user/info/index.js
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
        text: '个人信息'
      },
      left: {
        class: 'goback-black'
      }
    },
    identity: 1,
	infoData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const accountInfo = wx.getAccountInfoSync();
    console.log(accountInfo.miniProgram.appId) // 小程序 appId
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	let that = this
	const eventChannel = this.getOpenerEventChannel()
	eventChannel.on('acceptDataFromOpenerPage', function(data) {
	  console.log('index.wxml',data)
	  that.setData({infoData:data})
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