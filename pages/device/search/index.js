// pages/device/info/search/index.js
const {app,$,cusAppData} = require('../../../utils/public')

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
	    }
	  },
	  content: {
	    text: '查找附近售卖机',
	    style: {
	    }
	  },
	  left: {
		  class: 'goback-black'
	  }
	},
	inputValue: '',
	history:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  console.log(options)
  },

  submit () {
	let value = $.trim(this.data.inputValue)
	if(value){
		app.searchvalue = value
		wx.switchTab({ url:'/pages/device/device' })
	}else{
		wx.showToast({
			title: '请输入要搜索的内容',
			icon: 'none',
		})
	}
  },
  
  btnsSubmit (e) {
	app.searchvalue = e.currentTarget.dataset.text
	wx.switchTab({ url:'/pages/device/device' })
  },

  inputedit(e){
	this.data.inputValue = e.detail.value
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
	wx.getStorage({
	  key: 'hyt_searchDevice',
	  success: (res)=> {
	    // console.log('getStorage打印:',res.data)
		if(res.data) this.setData({history:JSON.parse(res.data)})
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