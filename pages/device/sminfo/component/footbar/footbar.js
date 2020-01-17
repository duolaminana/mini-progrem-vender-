// pages/device/sminfo/component/footBar/footbar.js
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
			this.setData({
				thisData: app.CartStockApi.say()
			})
			this.totalCount()
			
			if(newVal == 'showCompCart'){
				this.data.toCompCart = 'hideCompCart'
			}else if(newVal == 'hideCompCart'){
				this.data.toCompCart = 'showCompCart'
			}
		}
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	thisData: app.CartStockApi.say(),
	totalActivityPrice: 0,
	totalPrice: 0,
	totalArticle: 0,
	
	// 判断打开还是关闭\打开
	toCompCart: 'showCompCart'
  },

  /**
   * 组件的方法列表
   */
  methods: {
	showCompCart () { // 定义绑定在父页面调用该组件的属性
		this.triggerEvent('customTouchcart', { click: this.data.toCompCart }) // 向父组件传递信息
	},
	goPayPage () {
		this.triggerEvent('customgoPayPage', { click: 'footbar' })
	},
	totalCount () { // 价钱总和更换函数
		this.setData({
			totalActivityPrice: app.CartStockApi.totalActivityPrice,
			totalArticle: app.CartStockApi.totalCount,
			totalPrice: app.CartStockApi.totalPrice
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
  },
  detached () {
    // 组件移除执行
  },
  moved () {
    // 组件移动的时候执行
  }
})
