const {app,$,cusAppData} = require('../../../utils/public')

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: true
    },
 
    onLoad: function(options) {
		this.options = options.options
        // 获取用户信息
		console.log('author参数:',JSON.parse(options.options))
    },
 
    bindGetUserInfo: function(e) {
        if (e.detail.userInfo) {
			app.globalData.unauthorized = false
			app.globalData.setting = e.detail.setting
			wx.navigateBack({
				delta: 1
			})
        } else {
            wx.showModal({
                title: '系统提示',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                    if (res.confirm) {
                        // console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    }
})