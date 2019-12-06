// component/errMsgAjax/errMsgAjax.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	ifChange: {
		type: Boolean,
		value: false,
		observer (newVal,oldVal,path) {
			this.setData({
				isHide: !this.data.isHide
			})
		}
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	isHide: true
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
