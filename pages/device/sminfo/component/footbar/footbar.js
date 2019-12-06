// pages/device/sminfo/component/footBar/footbar.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	touchcart: { // 
		type: Boolean,
		value: false,
		observer (newVal,oldVal,path) {
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
	totalActivityPrice: 0,
	totalPrice: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
	openComCart () { // 定义绑定在父页面调用该组件的属性
		this.triggerEvent('customopenCart', { click: true }) // 向父组件传递信息
	},
	goPayPage () {
		console.log(app.CartStockApi.say())
		this.triggerEvent('customgoPayPage', { categoryId: 'cartOut' })
	},
	totalCount () { // 价钱总和
		this.setData({
			totalActivityPrice: app.CartStockApi.totalActivityPrice,
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
