// components/signIn/signIn.js
const {app,$,cusAppData} = require('../../utils/public.js')
import { wxAppSmsCode , setBindPhone } from '../../api/api.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	show:{
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
	phone: '',
	ucode: '',
	codeText: '获取验证码',
	disabled: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
	headerTouch(e){
		this.setData({show:true})
	},
	bindPhoneChange (e) { // input框数据双向绑定
		this.setData({
			phone: e.detail.value
		})
	},
	bindUcodeChange (e) { // input框数据双向绑定
		this.setData({
			ucode: e.detail.value
		})
	},
	getCode () { // 获取验证码
		if(!$.reg(this.data.phone)){
			return wx.showToast({
			  title: '请正确填写手机号码!',
			  icon: 'none',
			  duration: 1500
			})
		}
		wxAppSmsCode(this.data.phone).then(res => {
			wx.showToast({
			  title: '发送验证码成功',
			  icon: 'success',
			  duration: 2000
			})
			let timeCount = 60
			this.setData({
				codeText: timeCount + 's 重新获取',
				disabled: 'disabled'
			})
			let timer = setInterval(()=>{
				if(timeCount <= 0){
					this.setData({
						codeText: '获取验证码',
						disabled: false
					})
					clearInterval(timer)
					return
				}
				--timeCount
				this.setData({
					codeText: (timeCount < 10 ? '0' + timeCount.toString() : timeCount) + 's 重新获取'
				})
			},1000)
		}, res => {
			wx.showModal({
				title: `提示`,
				content: res,
				showCancel: false,
			})
		})
	},
	memberBangdingPhone () {
		if(!$.reg(this.data.phone)){
			return wx.showModal({
				title: `系统提示`,
				content: '手机号填写错误!',
				showCancel: false,
				success (res) {}
			})
		}else if(!this.data.ucode){
			return wx.showModal({
				title: `系统提示`,
				content: '验证码不能为空!',
				showCancel: false,
				success (res) {}
			})
		}
		let q = {
			phone: this.data.phone,
			code: this.data.ucode, 
			bindingType: 2,
			jsCode: '',
		}
		setBindPhone(q).then(res => {
			getApp().globalData.User_isBindingPhone = true
			getApp().globalData.wxUserInfo.id = res.result
			this.setData({show: true})
			this.triggerEvent('touch', { signInBindingPhone: 'ok' })
			wx.showToast({
				title: '系统已同步您的手机号!',
				icon: 'none',
				duration: 1500
			})
		}, res => {
			wx.showModal({
				title: `提示`,
				content: res,
				showCancel: false,
			})
		})
	}
  }
})
