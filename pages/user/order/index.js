// pages/user/order/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')
const { queryOrderDetailes } = require('../../../api/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...cusAppData,
    hdData: {
        ...cusAppData, // 头部数据
      warp: {
        style: {
          backgroundColor: 'white'
        }
      },
      content: {
        text: '购买记录'
      },
      left: {
        class: 'goback-black'
      }
    },
	thisList: []
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
	queryOrderDetailes().then(res=>{
		console.log('订单记录:', res)
		this.setData({thisList: res.result.list})
	})
  },
  
  toDevices(e){
  	let index = e.currentTarget.dataset.code
  	let data = this.data.thisList
  	wx.navigateTo({
  		url: `/pages/user/order/info/index`,
  		success: res => {
  			// 通过eventChannel向被打开页面传送数据
  			res.eventChannel.emit('acceptDataFromOpenerPage', $.getArrItemByIdx(data, index))
  		}
  	})
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