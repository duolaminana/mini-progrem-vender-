// pages/user/friends/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')
const { getFriendList } = require('../../../api/api.js')

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
        text: '好友列表'
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
	getFriendList().then(res=>{
		console.log('获取好友列表接口',res)
		this.setData({
      thisList : res.result || []
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