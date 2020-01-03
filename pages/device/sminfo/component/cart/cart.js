// pages/device/sminfo/component/cart/cart.js
const { app , $ } = require('../../../../../utils/public.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	touchcart: {
		type: String || Number || Boolean,
		value: false,
		observer (newVal,oldVal,path) {
			if(newVal.indexOf('synCount') == -1 && newVal == 'showCompCart'){
				this.setData({
					cus_layer_display: true
				}, () => {
					this.animation.translateY(0).step()
					this.setData({
						animationData: this.animation.export()
					})
					this.animationCusLayer.opacity(1).step()
					this.setData({
						animationCusLayer: this.animationCusLayer.export()
					})
				})
			}else if(newVal.indexOf('synCount') == -1 && (newVal == 'hideCompCart' || newVal == 'clearCompCart')){
				this.shopcart.boundingClientRect((rect)=> { // 获取元素的高度
					this.animation.translateY((rect.height + 500) +"px").step()
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
			if(newVal.indexOf('synCount') != -1){ // index页面改变同步购物车count
				newVal = JSON.parse(newVal)
				if(newVal.synCount){
					for(let item of newVal.synCount){
						for(let [idx, select] of this.data.thisData.entries()){
							if(item.productCode == select.productCode){
								if(item.count != 0)
								app.CartStockApi.rev({productCode: item.productCode}, {dev_custom_count: item.count})
								else
								app.CartStockApi.sub({productCode: item.productCode})
							}
						}
					}
				}
				// 此处添加改变购物车高度的操作会使体验性能下降.重复操作<><><><1.11>
				// this.shopcart.boundingClientRect((rect) => { // 获取元素的高度
				// 	this.setData({
				// 		shopcart_translateY_begin: rect.height +"px"
				// 	})
				// }).exec()
			}
			this.setData({
				thisData: app.CartStockApi.say()
			})
			this.totalCount()
		}
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	thisData: app.CartStockApi.say(),
	cus_layer_display: true,
	shopcart_translateY_begin: 0,
	totalSubPrice: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
	imagesOnload: $.ZOOM_IMG_FNC(),
	clearCartData () { // 清空购物车事件
		app.CartStockApi.subAll()
		this.triggerEvent('customTouchcart', { click: 'clearCompCart' })
	},
	closeCartComp () { // 关闭购物车
		this.triggerEvent('customTouchcart', { click: 'hideCompCart' })
	},
	customComputeCountFnc (e) { // 计算器更改count响应
		let arr = e.detail.ComponentTemporaryCountArray
		app.CartStockApi.rev({productCode: arr[0].productCode}, {dev_custom_count: arr[0].count})
		this.triggerEvent('customComputeCount', { ComponentTemporaryCountArray: arr })
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
	
	this.animation = wx.createAnimation({
		duration: app.globalData.duration,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
		timingFunction: 'ease',//动画的效果 默认值是linear
	})
	this.animationCusLayer = wx.createAnimation({
		duration: app.globalData.duration,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
		timingFunction: 'ease',//动画的效果 默认值是linear
	})
	
	// 进去页面加载组件
	this.shopcart.boundingClientRect((rect)=> { // 获取元素的高度
		this.animation.translateY((rect.height + 500) + "px").step() // 加500/消灭bug<><><><2.11>\替换/<><><><1.11>
		this.setData({
			animationData: this.animation.export()
		})
	}).exec()
	this.animationCusLayer.opacity(0).step()
	this.setData({
		animationCusLayer: this.animationCusLayer.export()
	})
	this.setData({
		cus_layer_display: false
	})
  },
  detached () {
    // 组件移除执行
  },
  moved () {
    // 组件移动的时候执行
	// 谁是我 我是谁
	// 时光变成了盗贼
	// 惊扰少年的英雄梦
	// 掠走天真和无畏
  }
})
