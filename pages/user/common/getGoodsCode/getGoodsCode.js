// component/getGoodsCode/getGoodsCode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer (e) {
        // console.log(e)
      }
    },
    thisItem: {
      type: Object,
      value: {},
      observer (newVal) {
        // console.log(e)
		if(newVal.commodityInformation){
			let addt = 0
			for(let option of newVal.commodityInformation){
				addt += option.discounts
			}
			this.setData({discounts:addt})
		}
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
	discounts:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tagClose () {
      // wx.showTabBar()
      this.setData({
        show: false
      })
    }
  }
})
