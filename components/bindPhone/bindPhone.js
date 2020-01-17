import { setBindPhone } from '../../api/api.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	hide:{
	  type: Boolean,
	  value: true,
	  observer(newVal,oldVal,path){
	    // console.log(newVal)
	  }
	},
  },

  /**
   * 组件的初始数据
   */
  data: {
	hiddenSignIn: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
	bindPhoneNumber (e) {// 获取手机号
		if(e.detail.errMsg === 'getPhoneNumber:ok'){ // 确定获取手机号
			wx.login({
				success:(res)=> {
					let q = {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
						bindingType: 1,
						jsCode: res.code,
						code: ''
					}
					setBindPhone(q).then(res => {
						getApp().globalData.isBindingPhone = true
						getApp().globalData.wxUserInfo.id = res.result
						this.setData({
							hide: true
						})
						wx.showToast({
							title: '系统已同步您的手机号!',
							icon: 'none',
							duration: 1500
						})
					})
				}
			})
		}else{ // 取消
			console.log('您点击获取手机号授权的 <<取消>> 按钮!')
		}
	},
	gotoSignIn (){
		this.setData({hiddenSignIn:false})
	},
	showThat (){
		if(!getApp().globalData.isBindingPhone)
		this.setData({
			hide: false
		})
	},
	hideBlock (){
		this.setData({
			hide: true
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
	// this.animation = wx.createAnimation({
	// 	duration: getApp().globalData.duration,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
	// 	timingFunction: 'ease',//动画的效果 默认值是linear
	// })
  },
  detached () {
    // 组件移除执行
  },
  moved () {
    // 组件移动的时候执行
  }
})
