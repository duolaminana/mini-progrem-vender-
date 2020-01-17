// components/deviceStatus/deviceStatus.js
const app = getApp()

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
	initTranslateY: 0,
	hideWarp: true,
	hideMain: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
	author () {
		
	},
	open () {
		this.setData({
			hideWarp: false,
			hideMain: false
		})
	},
	close () {
		this.setData({
			hideWarp: true,
			hideMain: true
		})
	}
  },
  ready () {
	this.shopcart = wx.createSelectorQuery().in(this).select('#com-deviceStatus')

	this.animation = wx.createAnimation({
		duration: app.globalData.duration,
		timingFunction: 'ease',
	})
	this.animationWarp = wx.createAnimation({
		duration: app.globalData.duration,
		timingFunction: 'ease',
	})
  }
})
