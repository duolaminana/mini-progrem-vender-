// pages/user/user.js
const {app,$,cusAppData} = require('../../utils/public.js')
const { returnMoney , queryPersonalInfo } = require('../../api/api.js')

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
    isGetgoods: false,
	WX_USERLOGIN_STATE: false,
	UserImg: '/static/img/user/user_img.png',
	UserName: '',
	UserAuth: '未实名认证',
	ajaxUserInfo: null,
	UserCashMoney: '-',
	UserIntegral: '-',
	UserOrderNO: [1]
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
	if(app.globalData.wxUserInfo){
		this.initUserInfo()
	}else{
		app.wxLoginGetMemberInfoResponseCallback = res => { // 未获取到会员用户信息/ app.js 获取会员响应回调
			this.initUserInfo()
		}
	}
  },

  initUserInfo (){
	this.WX_USERLOGIN_STATE = true
	returnMoney({orderId:this.data.orderId}).then(res=>{
		this.setData({
			UserIntegral: res.result * 100,
			UserCashMoney: res.result
		})
	})
	queryPersonalInfo().then(res=>{
		res = res.result
		this.setData({
			ajaxUserInfo: res,
			UserImg: res.memberImg,
			UserName: res.nickName,
			UserAuth: res.isAutonym==1?'已实名认证':'未实名认证',
		})
	})
  },
  
  gotoUserInfoPage(){
	wx.navigateTo({
		url: `/pages/user/info/index`,
		success: res => {
			// 通过eventChannel向被打开页面传送数据
			res.eventChannel.emit('acceptDataFromOpenerPage', this.data.ajaxUserInfo)
		}
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