//app.js // version 9.3.1
const host = require('./utils/config/host')
const request = require('./utils/request/request')
const CartStockApi = require('./lib/cartstock/api')
import { HTTP_REQUEST_URL } from './config.js';
import { getMemberInfo } from './api/api.js';
import appGetMemberInfo from './utils/getMemberInfo.js'

App({
  onLaunch: function (option) {
	var that = this;
	if (option.query.hasOwnProperty('scene')){
	  switch (option.scene) {
	    //扫描小程序码
	    case 1047:
	      that.globalData.scene = option.scene;
	      break;
	    //长按图片识别小程序码
	    case 1048:
	      that.globalData.scene = option.scene;
	      break;
	    //手机相册选取小程序码
	    case 1049:
	      that.globalData.scene = option.scene;
	      break;
	    //直接进入小程序
	    case 1001:
	      that.globalData.scene = option.scene;
	      break;
	  }
	}
	wx.login({
		success: res => {
			// 发送 res.code 到后台换取 openId, sessionKey, unionId
			that.globalData.code = res.code
			appGetMemberInfo(function(res){
				console.log('用户信息:', res)
				if(that.wxLoginGetMemberInfoResponseCallback){
					that.wxLoginGetMemberInfoResponseCallback(res)
				}
			})
		}
	})
	
	that.CartStockApi = new CartStockApi() // 购物车仓库
	that.CartStockApi_Dummy = new CartStockApi() // 虚拟购物车仓库
  },
  onShow(options) {
	// Do something when show.
	console.log('------------------\n app.js=>noShow \n------------------')
  },
  onHide() {
	console.log('------------------\n app.js=>onHide \n------------------')
    // Do something when hide.
  },
  onError(msg) {
    console.log(msg)
  },
  globalData: {
	url: HTTP_REQUEST_URL,
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
	isSyn: false, // 是否同步过小程序
	isBindingPhone: false, // 是否有手机号
	isBindingCard: false, // 是否有绑定身份证等
	wxUserInfo: null ,// 会员信息
	orderNO: [],
	shippingWay: null
  }
})