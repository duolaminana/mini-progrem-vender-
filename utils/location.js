function wxSettingAuthor(callback){
	// 授权
	wx.getSetting({
		success: function (res) {
			if (!res.authSetting['scope.userLocation']) {
				wx.showModal({
					title: '是否授权当前位置',
					content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
					success: function (tip) {
						if (tip.confirm) {
							wx.openSetting({
								success: function (data) {
									if (data.authSetting["scope.userLocation"] === true) {
										wx.showToast({
											title: '授权成功',
											icon: 'success',
											duration: 1000
										})
										//授权成功之后，再调用chooseLocation选择地方
										callback()
									} else {
										wx.showToast({
											title: '授权失败',
											icon: 'success',
											duration: 1000
										})
									}
								}
							})
						}
					}
				})
			}
		},
		fail: function (res) {
			wx.showToast({
				title: '调用授权窗口失败',
				icon: 'success',
				duration: 1000
			})
		}
	})
}
/**
 * 获取定位
 * @return {Array} [维度,经度]
 * @return {Array}
 */
export function getLocation() {
	return new Promise((resolve, reject) => {
		wx.getLocation({
			type: 'gcj02',
			altitude: false, //高精度定位
			success: res=> {
				resolve(res)
			},
			fail (res) {
				if(res.errMsg === 'getLocation:fail auth deny'){
					wxSettingAuthor(()=>{
						getLocation()
					})
				}
				reject(res)
			}
		})
	}).then(res => { // 成功
		return [res.latitude,res.longitude]
	}, res => { // 失败
		return []
	})
}

/**
 * 检测是否有定位
 * @param {Array} getApp().globalData.myLocation
 */
export function checkLocation() {
    if(!getApp().globalData.myLocation || getApp().globalData.myLocation.length<=0)
        return false
    else
		return true
}

/**
 * 循环获取定位信息
 * *** 此方法中获取到的定位，会赋值全局托管
 * @param {Function} callback
 * @param {Array} getApp().globalData.myLocation
 */
export function loopLocation(callback) {
    if(!checkLocation()){
        if(callback && typeof callback === 'function'){
            wx.showLoading({
                title:"定位中",
                mask:true
            })
            getLocation().then(res=>{
                wx.hideLoading()
                if(res && res.length>0){
                    getApp().globalData.myLocation = res
                    callback(res)
                }else{
                    wx.showModal({
                        title: '系统提示',
                        content: '请在手机系统设置中打开定位服务!',
                        confirmText: '确定',
                        showCancel: false,
                        success: function (res) {
                            wx.showModal({
                                title: '',
                                content: '您确定打开手机定位服务了吗？',
                                success: function (res) {
                                    if(res.confirm){
                                        loopLocation(callback)
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    }else{
        callback(getApp().globalData.myLocation)
    }
}