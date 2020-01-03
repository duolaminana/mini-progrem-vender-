// components/authorization/authorization.js
import { synMemberInfo } from '../../api/api.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	show:{
	  type: Boolean,
	  value: false,
	  observer(newVal,oldVal,path){
	    // console.log(newVal)
	  }
	},
  },

  /**
   * 组件的初始数据
   */
  data: {
	//判断小程序的API，回调，参数，组件等是否在当前版本可用。
	canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 组件的方法列表
   */
  methods: {
	bindGetUserInfo: function(e) { // 微信授权/同步后台会员/按钮
		if (e.detail.errMsg === 'getUserInfo:ok') {
			this.requestSynInfo(e.detail)
		}else{
			wx.showModal({
				title: '系统提示',
				content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进行!!!',
				showCancel: false,
				confirmText: '返回授权',
				success: function(res) {
					if (res.confirm) {
						// console.log('用户点击了“返回授权”');
					}
				}
			})
		}
	},
	requestSynInfo: function(setting){
		getApp().globalData.setting = setting
		synMemberInfo().then(res => {
			console.log('同步用户信息成功')
			getApp().globalData.isSyn = true
			wx.showToast({
				title: '系统已同步您的会员!',
				icon: 'none',
				duration: 1500
			})
			this.setData({show:false})
			this.triggerEvent('touch', { authorization: 'ok' })
		})
	},
	author (){ // 自动授权获取用户信息///授权失败再调用弹框手动授权
		console.log('检查用户信息授权')
		wx.getSetting({ // 查询微信授权
			success: res => {
				if (res.authSetting['scope.userInfo']) { // console.log('用户已授权!!')
					wx.getUserInfo({
						success: res => {
							this.requestSynInfo(res)
						},
						fail: res => {
							console.log('获取用户信息fail: ', res)
						}
					})
				}else{
					console.log('用户未授权!!')
					this.setData({
						show: true
					})
				}
			}
		})
	}
  },
  ready () {
	  
  }
})
