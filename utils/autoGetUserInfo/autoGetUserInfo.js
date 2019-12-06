const app = getApp()

module.exports = {
	// 检查是否已经获取到用户信息，如果没有则再执行自动获取
    autoGetUserInfo: function () {
		return new Promise((resolve, reject) => {
			if (app.globalData.setting) {
				resolve(app.globalData.setting)
			} else if (wx.canIUse('button.open-type.getUserInfo')) {
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
						resolve(false)
					}
				})
			}
		})
	}
}