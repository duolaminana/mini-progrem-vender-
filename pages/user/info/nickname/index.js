// pages/user/info/nickname/nickname.js
const {app,$,cusAppData} = require('../../../../utils/public.js')
const { updateNickName } = require('../../../../api/api.js')

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
        text: '设置昵称'
      },
      left: {
        class: 'goback-black'
      }
    },
    fbData: { // fixedbottom数据
      text: '保存',
      click: 'air'
    },
	name: '',
	text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	this.setData({text: options.nickName})
  },

  submit () {
	wx.showLoading({title: '加载中'})
	updateNickName(this.data.name).then(res=>{
		wx.hideLoading()
		if(res.result){
			wx.switchTab({url:'/pages/user/user?rev=nickname'})
		}
	}).catch(res=>{
		wx.hideLoading()
		wx.showToast({
			title: res.message || res.msg || '网络错误!',
			icon: 'none',
			duration: 1500
		})
	})
  },

  inputName (e) {
	this.setData({name: e.detail.value})
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