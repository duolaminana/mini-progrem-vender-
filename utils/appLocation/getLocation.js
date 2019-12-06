const app = getApp()

function getLocation(isShowLocatModal, callback) {
	/**
	 * 获取定位
	 * Promise 异步操作
	 * @return {Array} [维度,经度]
	 * @return {Boolean} false 定位系统没有打开
	 */
	return new Promise((resolve, reject) => {
		wx.getLocation({
			type: 'gcj02',
			altitude: false, //高精度定位
			success: res=> {
				resolve(res)
			},
			fail (res) {
				reject(res)
			}
		})
	}).then(res => { // 成功
		return [res.latitude,res.longitude]
	}, res => { // 失败
		if(isShowLocatModal){
			wx.showModal({
				title: '',
				content: '请在系统设置中打开定位服务',
				confirmText: '确定',
				success: function (res) {
					if(res.confirm){
						if(callback) callback()
					}
				}
			})
		}
		return false
	})
}

function thisLocation(isOpenLocation) {
    /**
     * 检测是否有定位
     * 定位赋值
     * 是否要执行定位
     * 定义tpl_isLocation属性（定位值），用于wxml、js文件
     * @param {Boolean} isOpenLocation 是否要执行定位功能参数
     * @param app.globalData.myLocation
     * @param this.data.tpl_isLocation
     */
    if(!app.globalData.myLocation){
        if(isOpenLocation===true || typeof isOpenLocation == 'undefined' || typeof isOpenLocation == 'function'){
            wx.showLoading({
                title:"定位中",
                mask:true
            })
            getLocation(true,()=>{
                thisLocation.call(this, isOpenLocation)
            }).then(res=>{
                wx.hideLoading()
                if(res){
                    app.globalData.myLocation = res
                    this.setData({
                        tpl_isLocation: res
                    })
                    if(typeof isOpenLocation == 'function'){
                        isOpenLocation(res)
                    }
                }
            })
        }
    }else{
        this.setData({
            tpl_isLocation: app.globalData.myLocation
        })
		if(typeof isOpenLocation == 'function'){
		    isOpenLocation(app.globalData.myLocation)
		}
    }
}

module.exports = {
    getLocation:getLocation,
    thisLocation:thisLocation
}