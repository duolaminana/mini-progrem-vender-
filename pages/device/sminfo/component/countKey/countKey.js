// pages/device/sminfo/component/countKey/countKey.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	stock: {
		type: Number,
		value: 0,
		observer (newVal,oldVal,path) {}
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
	
  },

  /**
   * 组件的方法列表
   */
  methods: {
	sub () {
		this.setData({
			result: this.data.result != 0 ? --this.data.result : 0
		})
		this.currCount(this.data.result)
	},
	add () {
		this.setData({
			result: ++this.data.result > this.data.stock ? --this.data.result : this.data.result
		})
		this.currCount(this.data.result)
	},
	currCount () {
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
		this.triggerEvent('customDevCount', { ComponentTemporaryCountArray: this.temporaryCountArray })
	}
  }
})
