// component/getUserInfo/getUserInfo.js
const {app,$,cusAppData} = require('../../utils/public.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
	isGetUserInfo: app.globalData.isGetUserInfo,
	setting: null,
	userInfo: {},
	hasUserInfo: false,
	canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 组件的方法列表
   */
  methods: {
	autoGetUserInfo: function () { // 检查是否已经获取到用户信息，如果没有则再执行自动获取
		return new Promise((resolve, reject) => {
			if (this.data.isGetUserInfo) {
				if (app.globalData.setting) {
					resolve(app.globalData.setting)
				} else if (this.data.canIUse) {
					app.userInfoReadyCallback = res => {
						resolve(res)
					}
				} else {
					// 在没有 open-type=getUserInfo 版本的兼容处理
					wx.getUserInfo({
						success: res => {
							resolve(res)
						},
						fail () {
							reject({})
						}
					})
				}
			}
		}).then(res => {
			if (Object.getOwnPropertyNames(res).length != 0) {
				console.log('登录信息/用户信息 setting: ',res)
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true,
					setting: res
				})
				this.takeUserInfo()
			}
		})
	},
	getUserInfo: function (e) { // 手动获取用户信息回调函数
		console.log('登录信息/用户信息 setting: ',e.detail)
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true,
			setting: e.detail
		})
		app.globalData.setting = e.detail
		this.takeUserInfo()
	},
	takeUserInfo () {
		this.triggerEvent('customUserInfo', { getUserInfo: true }) // 向父组件传递信息
	}
  },
  created () {
    // 组件在内存中创建完毕执行
	this.autoGetUserInfo()
  },
  attached () {
    // 组件挂载之前执行
  },
  ready () {
    // 页面首次渲染完毕时执行
  },
  detached () {
    // 组件移除执行
  },
  moved () {
    // 组件移动的时候执行
  }
})
