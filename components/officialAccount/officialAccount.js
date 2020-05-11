// components/officialAccount/officialAccount.js
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
	
  },

  /**
   * 组件的方法列表
   */
  methods: {
	open () {
		this.animation.translateY(0).step()
		this.setData({
			animationData: this.animation.export()
		})
	},
	close () {
		this.animation.translateY('-300rpx').step()
		this.setData({
			animationData: this.animation.export()
		})
	},
  },
  ready (){
	this.animation = wx.createAnimation({
		duration: 1200,
		timingFunction: 'ease',
	})
	setTimeout(()=>{
		this.open()
	},1000)
	setTimeout(()=>{
		this.close()
	},7000)
  }
})
