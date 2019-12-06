// pages/device/sminfo/component/detail/detail.js
const app = getApp()
const $productData = require('../../../../../lib/cartstock/data')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	byAnimation: {
		type: Boolean,
		value: false,
		observer (newVal,oldVal,path) {
			if(newVal){
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
	}
  },

  /**
   * 组件的方法列表
   */
  methods: {
	closeComDetail () { // 定义绑定在父页面调用该组件的属性 // 关闭详情
		this.triggerEvent('customcloseDetail', { click: true }) // 向父组件传递信息
	},
	goPayPage () { // 去支付
		this.triggerEvent('customgoPayPage', {
			categoryId: this.data.parentData.categoryId,
			productCode: this.data.parentData.productCode,
			option: this.data.parentData,
		})
	},
	addCartAir () { // 加入购物车
		if(!app.CartStockApi.add({productCode: this.data.parentData.productCode}, this.data.parentData)){
			app.CartStockApi.rev({productCode:this.data.parentData.productCode}, {dev_custom_count: this.data.parentData.dev_custom_count})
			wx.showToast({
				title: '购物车数量已更正',
				icon: 'none',
				duration: 2000
			})
		}else
		wx.showToast({
			title: '加入购物车成功',
			icon: 'none',
			duration: 2000
		})
		// app.CartStockApi.sub({productCode:'11111111111'})
		console.log('购物车', app.CartStockApi.say())
		this.triggerEvent('customTouchcart', { click: true })
	},
	setParentData (data) { // 在父级调用.设置详情数据
		for(let key in data){
			// 更正字段值
			data[key] = data[key] ? data[key] : $productData[key]
		}
		data.activityPrice = data.activityPrice ? data.activityPrice : data.salePrice // 矫正后台活动价格字段的不同跟有无
		this.setData({
			parentData: data
		})
	},
	customDevCountFnc (e) {
		/**海市蜃楼
		 * 海市蜃楼 // 每个加入该组件的页面都可以使用
		 * countKey [Component] 组件
		 * @属性触发
		 * @动态更改 [dev_custom_count] this.data.goodsList
		 * @param {Array}  ComponentTemporaryCountArray
		 * @param {String}  productCode 唯一标识
		 * @param {Number}  dev_custom_count 数值
		 * */
		this.data.parentData.dev_custom_count = e.detail.ComponentTemporaryCountArray[0].count
		this.triggerEvent('customDevCount', { ComponentTemporaryCountArray: [{
				productCode: this.data.parentData.productCode,
				count: e.detail.ComponentTemporaryCountArray[0].count
			}] })
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
