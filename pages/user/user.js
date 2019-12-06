// pages/user/user.js
const {app,$,cusAppData} = require('../../utils/public.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ...cusAppData,
    hdData: {
      ...cusAppData,
      content: {
        text: '我的',
        style: {
          color: 'white'
        }
      }
    },
    isGetgoods: false
  },

  gotoGetCodeCom () { // 去取货
    this.setData({
      isGetgoods: true
    })
  },
  
  takeUserInfo (e) { // 接收子组件
	console.log(123)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // wx.showToast()
    // wx.showModal()
    // wx.showLoading()
    // wx.showActionSheet()
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