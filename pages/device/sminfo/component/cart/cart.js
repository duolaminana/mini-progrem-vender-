// pages/device/sminfo/component/cart/cart.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	byAnimation: {
		type: Boolean,
		value: false,
		observer (newVal,oldVal,path) {
			if(!this.data.cus_layer_display){
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
			}else{
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
			}
		}
	},
	touchcart: {
		type: Boolean,
		value: false,
		observer (newVal,oldVal,path) {
			this.setData({
				thisData: app.CartStockApi.say()
			})
			this.totalCount()
			// 重新定位效果
			this.animationCusLayer.opacity(0).step()
			this.setData({
				animationCusLayer: this.animationCusLayer.export()
			})
			this.shopcart.boundingClientRect((rect)=> { // 获取元素的高度
				this.animation.translateY(rect.height +"px").step()
				this.setData({
					animationData: this.animation.export()
				})
			}).exec()
			setTimeout(() => {
				this.setData({
					cus_layer_display: false
				})
			}, app.globalData.duration)
		}
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	thisData: app.CartStockApi.say(),
	cus_layer_display: false,
	shopcart_translateY_begin: 0,
	totalSubPrice: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
	clearCartData () { // 清空购物车事件
		app.CartStockApi.subAll()
		this.triggerEvent('customTouchcart', { click: true }) // 用于在其他页面触发
	},
	customDevCountFnc (e) { // 计算器更改count
		let arr = e.detail.ComponentTemporaryCountArray
		app.CartStockApi.rev({productCode: arr[0].productCode}, {dev_custom_count: arr[0].count})
		this.triggerEvent('customTouchcart', { click: true }) // 用于在其他页面触发
	},
	totalCount () { // 价钱总和
		this.setData({
			totalSubPrice: app.CartStockApi.totalSubPrice
		})
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
	this.totalCount()
	this.shopcart = wx.createSelectorQuery().in(this).select('#com-shopcart')
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
