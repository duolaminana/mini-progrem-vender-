// component/floatGlass/floatGlass.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
	width: wx.getSystemInfoSync().windowWidth,
	height: wx.getSystemInfoSync().windowHeight,
	left: wx.getSystemInfoSync().windowWidth - 56 + 'px',
	top: '200px'
  },

  /**
   * 组件的方法列表
   */
  methods: {
	handlMove (e) {
		this.setData({
		  left: e.touches[0].clientX-20 + 'px',
		  top: e.touches[0].clientY-20 + 'px'
		})
	},
	handlEnd (e) {
		let left = parseInt(this.data.left)
		let top = parseInt(this.data.top)
		if(left < 0){
			left = 0
		}
		if(left > (this.data.width-40)){
			left = this.data.width-40
		}
		if(top < 0){
			top = 0
		}
		if(top > (this.data.height-40)){
			top = this.data.height-40
		}
		this.setData({
		  left: left + 'px',
		  top: top + 'px'
		})
	},
	clickTab () {
		this.triggerEvent('customClickTab', { click: true })
	}
  }
})
