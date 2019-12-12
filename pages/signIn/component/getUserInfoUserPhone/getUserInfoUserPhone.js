// pages/signIn/component/getUserPhone/getUserPhone.js
const {app,$,cusAppData} = require('../../../../utils/public')
const synMemberInfoAjax = require('../../bin/synMemberInfoAjax')
const memberBindingPhoneAjax = require('../../bin/memberBindingPhoneAjax')

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
	isShowtyle: { // 初始化弹框显示
		display: "flex",
		opacity: 1,
		transition: app.globalData.duration + "ms"
	},
	isSyn: true,
	isBindingPhone: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
	// 隐藏弹框事件
	hideBlock () {
		this.setData({
			isShowtyle: {
				...this.data.isShowtyle,
				opacity: 0
			}
		})
		setTimeout(() => {
			this.setData({
				isShowtyle: {
					...this.data.isShowtyle,
					display: "none"
				}
			})
		},app.globalData.duration)
	},
	showBlock () {
		this.setData({
			isShowtyle: {
				...this.data.isShowtyle,
				display: "flex"
			}
		},() => {
			this.setData({
				isShowtyle: {
					...this.data.isShowtyle,
					opacity: 1
				}
			})
		})
	},
	getPhoneNumber (e) {
		// 获取手机号
		if(e.detail.encryptedData){
			console.log('您点击获取手机号授权的 <<确定>> 按钮!')
			memberBindingPhoneAjax({...e.detail, id: app.globalData.wxUserInfo.id, type: 1, code: app.globalData.code, success: res => {
				if(res){
					app.globalData.isBindingPhone = true
					this.setData({
						isBindingPhone: true
					})
					wx.showToast({
						title: '系统已同步您的手机号!',
						icon: 'none',
						duration: 2000
					})
					this.hideBlock()
				}else{
					// ....
				}
			}})
		}else{
			console.log('您点击获取手机号授权的 <<取消>> 按钮!')
		}
	},
	initChange () {
		// console.log('initChange',app.globalData.isBindingPhone)
		if(app.globalData.isBindingPhone){
			this.setData({
				isBindingPhone: true
			})
		}else{
			this.setData({
				isBindingPhone: false
			})
		}
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
  },
  detached () {
    // 组件移除执行
  },
  moved () {
    // 组件移动的时候执行
  }
})
