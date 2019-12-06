//app.js
const host = require('./utils/config/host')
const request = require('./utils/request/request')
const CartStockApi = require('./lib/cartstock/api')

App({
  onLaunch: function () {
    // Do something initial when launch.
    // 登录
	wx.login({
		success: res => {
			// 发送 res.code 到后台换取 openId, sessionKey, unionId
			this.globalData.code = res.code

			/**
			 * 获取会员用户信息
			 * */
			request.getMask(`${host.host_order}getMemberInfo?jsCode=${res.code}`, (res)=> {
				// 网络异步请求,可用回调获取状态.获取微信会员请求响应回调
				if(this.wxLoginGetMemberInfoResponseCallback){
					this.wxLoginGetMemberInfoResponseCallback(res)
				}
			}).then((res) => {
				console.log('info',res)
				this.globalData.isSyn = res.isSyn
				this.globalData.isBindingPhone = res.isBindingPhone
				this.globalData.isBindingCard = res.isBindingCard
				this.globalData.wxUserInfo = res.data
			})
		}
	})
	
	this.CartStockApi = new CartStockApi() // 购物车仓库
  },
  onShow(options) {
	// Do something when show.
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg) {
    console.log(msg)
  },
  globalData: {
    code: undefined,
    setting: null,
	unauthorized: false, // 未授权
	
    myLocation: false, // 定位
	
    interval: 10, // display:none变成display:block时长 (毫秒)
    duration: 400, // 动画过渡时长 (毫秒)
	
	// 适配屏幕头部的高度=>获取微信右上角胶囊信息.根据胶囊位置与高度决定头部的高度等
    rectBottom: wx.getMenuButtonBoundingClientRect().bottom+8+'px',
    rectHeight: wx.getMenuButtonBoundingClientRect().height+16+'px',
	
	machineCode: '', // 设备编号(id)
	channelId: '',
	isSyn: false, // 用户是否进入过次小程序
	isBindingPhone: false, // 是否有手机号
	isBindingCard: false, // 是否有绑定身份证等
	wxUserInfo: null ,// 会员信息
  }
})