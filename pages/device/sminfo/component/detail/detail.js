// pages/device/sminfo/component/detail/detail.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	touchcart: {
		type: String || Number || Boolean,
		value: false,
		observer (newVal,oldVal,path) {
			if(newVal == this.data.close){
				this.shopcart.boundingClientRect((rect)=> { // 获取元素的高度
					this.animation.translateY(rect.height +"px").step()
					this.setData({
						animationData: this.animation.export()
					})
				}).exec()
				this.animationCusLayer.opacity(0).step()
				this.setData({
					animationCusLayer: this.animationCusLayer.export()
				})
				setTimeout(() => {
					this.setData({
						cus_layer_display: false
					})
				}, app.globalData.duration)
			}else if(newVal == 'open'){
				this.animation.translateY(0).step()
				this.setData({
					animationData: this.animation.export()
				})
				this.setData({
					cus_layer_display: true
				}, () => {
					this.animationCusLayer.opacity(1).step()
					this.setData({
						animationCusLayer: this.animationCusLayer.export()
					})
				})
			}
		}
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	cus_layer_display_begin: false,
	shopcart_translateY_begin: 0,
	parentData: {
		productName: '',
		stock: 0,
		dictUnitName: '',
		imageAddress: '',
		actualPrice: 0
	},
	
	// 描绘\非整数/设置关闭按钮的关闭
	close: 0.1314,
	hideCart: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
	imagesOnload(e){
		this.data.imgScaleCC = this.data.imgScaleCC || {}
		this.data.imgScaleCC[e.currentTarget.dataset.scale] = (e.detail.width / e.detail.height * e.currentTarget.dataset.height) + 'rpx'
		this.setData({
			imgScaleCC: this.data.imgScaleCC
		})
	},
	hideCartAir () { // 加入购物车按钮是否隐藏
		if(this.data.parentData.categoryId == 182)
		this.setData({
			hideCart: true
		})
		else
		this.setData({
			hideCart: false
		})
	},
	closeThisComp () { // 定义绑定在父页面调用该组件的属性 // 关闭详情
		this.triggerEvent('customTouchcart', { click: ++this.data.close })
	},
	goPayPage () { // 去支付
		if(!this.judgeModuls()){
			return
		}
		this.triggerEvent('customgoPayPage', {
			categoryId: this.data.parentData.categoryId,
			productCode: this.data.parentData.productCode,
			option: this.data.parentData
		})
	},
	addCartAir () { // 加入购物车
		if(!this.judgeModuls()){
			return
		}
		if(!app.CartStockApi.add({productCode: this.data.parentData.productCode}, this.data.parentData)){
			app.CartStockApi.rev({productCode:this.data.parentData.productCode}, {dev_custom_count: this.data.parentData.dev_custom_count})
			wx.showToast({
				title: '购物车数量已更正',
				icon: 'none',
				duration: 2000
			})
		}else{
			wx.showToast({
				title: '加入购物车成功',
				icon: 'none',
				duration: 2000
			})
		}
		this.triggerEvent('customTouchcart', { click: ++this.data.close })
	},
	setParentData (data) { // 在父级调用.设置详情数据
		this.setData({
			parentData: data
		})
		this.hideCartAir()
	},
	customComputeCountFnc (e) {
		this.data.parentData.dev_custom_count = e.detail.ComponentTemporaryCountArray[0].count
		this.triggerEvent('customComputeCount', { ComponentTemporaryCountArray: [{
				productCode: this.data.parentData.productCode,
				count: e.detail.ComponentTemporaryCountArray[0].count
			}] })
	},
	judgeModuls () {
		if(!this.data.parentData.stock || this.data.parentData.stock <= 0){ // 库存不足
			wx.showModal({
				title: '提示',
				content: '该商品已售罄!',
				showCancel: false,
				success (res) {
					if (res.confirm) {
						console.log('用户点击确定')
					}
				}
			})
			return false
		}
		if(this.data.parentData.dev_custom_count == 0){ // 没添加数量
			wx.showToast({
				title: '请先点击添加数量!',
				icon: 'none',
				duration: 2000
			})
			return false
		}
		return true
	}
  },
  created () {
    // 组件在内存中创建完毕执行
  },
  attached () {
    // 组件挂载之前执行
  },
  ready () {
    // 页面首次渲染完毕时执行
	this.shopcart = wx.createSelectorQuery().in(this).select('#com-goodsdetail')
	this.shopcart.boundingClientRect((rect)=> { // 获取元素的高度
		this.setData({
			shopcart_translateY_begin: rect.height +"px"
		})
	}).exec()
	
	this.animation = wx.createAnimation({
		duration: app.globalData.duration,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
		timingFunction: 'ease',//动画的效果 默认值是linear
	})
	this.animationCusLayer = wx.createAnimation({
		duration: app.globalData.duration,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
		timingFunction: 'ease',//动画的效果 默认值是linear
	})
  },
  detached () {
    // 组件移除执行
  },
  moved () {
    // 组件移动的时候执行
  }
})
