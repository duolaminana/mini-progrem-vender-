// import { setBindPhone } from '../../api/api.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	show:{
	  type: Boolean,
	  value: false,
	  observer(newVal,oldVal,path){
	    // console.log(newVal)
	  }
	},
  },

  /**
   * 组件的初始数据
   */
  data: {
	missClass: '',
	miss: '请等待出货...',
	text: '\n'
  },

  /**
   * 组件的方法列表
   */
  methods: {
	check(){
		this.close()
	},
	open(){
		this.setData({
			show:true
		},()=>{
			this.animation.opacity(1).step()
			this.setData({
				animation: this.animation.export()
			})
		})
	},
	close(){
		this.animation.opacity(0).step()
		this.setData({
			animation: this.animation.export()
		})
		setTimeout(()=>{
			this.setData({show:false})
		},300);
	},
	CHsuccess(){
		this.setData({
			missClass: 'success',
			miss: '出货成功',
			text: '请取走您的商品'
		})
	},
	CHfail(){
		this.setData({
			missClass: 'fail',
			miss: '出货失败',
			text: '请联系管理员, 联系方式: 1855323232'
		})
	},
  },
  created () {
    // 组件在内存中创建完毕执行
  },
  attached () {
    // 组件挂载之前执行
  },
  ready () {
    // 页面首次渲染完毕时执行
	this.animation = wx.createAnimation({
		duration: 300,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
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
