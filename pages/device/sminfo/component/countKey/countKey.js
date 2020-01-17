// pages/device/sminfo/component/countKey/countKey.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	stock: {
		type: Number,
		value: 0,
		observer (newVal,oldVal,path) {
			if(this.data.stock == 0)
			this.setData({
				addIconOk: false
			})
			else
			this.setData({
				addIconOk: true
			})
		}
	},
	result: {
		type: Number,
		value: 1,
		observer (newVal,oldVal,path) {}
	},
	productCode: {
		type: String,
		value: '',
		observer (newVal,oldVal,path) {}
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	addIconOk: true
  },
  
  ready () {
	if(this.data.stock == 0)
	this.setData({
		addIconOk: false
	})
	else
	this.setData({
		addIconOk: true
	})
  },

  /**
   * 组件的方法列表
   */
  methods: {
	sub () {
		let result = this.data.result - 1
		if(result < this.data.stock){
			this.setData({
				addIconOk: true
			})
		}
		this.setData({
			result: result
		})
		this.currCount()
	},
	add () {
		let result = this.data.result + 1
		if(result > this.data.stock){
			wx.showToast({
				title: '库存不足!',
				icon: 'none',
				duration: 500
			})
			return
		}else if(result == this.data.stock){
			this.setData({
				addIconOk: false
			})
		}
		this.setData({
			result: result
		})
		this.currCount()
	},
	currCount () { // 传出值
		if(this.temporaryCountArray){
			let have = false
			for(let val of this.temporaryCountArray){
				if(val.productCode == this.data.productCode){
					have = true
				}
			}
			if(have){
				for(let val of this.temporaryCountArray){
					if(val.productCode == this.data.productCode){
						val.count = this.data.result
					}
				}
			}else{
				this.temporaryCountArray.push({
					productCode: this.data.productCode,
					count: this.data.result
				})
			}
		}else{
			this.temporaryCountArray = [{
				productCode: this.data.productCode,
				count: this.data.result
			}]
		}
		this.triggerEvent('customComputeCount', { ComponentTemporaryCountArray: this.temporaryCountArray })
	}
  }
})
