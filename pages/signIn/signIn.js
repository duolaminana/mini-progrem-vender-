const {app,$,cusAppData} = require('../../utils/public.js')
const memberBindingPhoneAjax = require('./bin/memberBindingPhoneAjax')

Page({
  data: {
     // 头部数据
    hdData: {
      ...cusAppData,
      warp: {
        style: {
          backgroundColor: 'white'
        }
      },
      content: {
        text: '自助售卖系统'
      },
	  left: {
		class: 'goback-black'
	  }
    },
    fbData: { // fixedbottom数据
      text: '绑定',
      click: 'memberBangdingPhone'
    },
	phone: '',
	ucode: '',
	codeText: '获取验证码',
	disabled: false
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
		return wx.showModal({
			title: `系统提示`,
			content: '手机号填写错误!',
			showCancel: false,
			success (res) {}
		})
	}
	$.postMask(`${$.host_auth}/wxAppSmsCode?phone=${this.data.phone}&memberId=${app.globalData.wxUserInfo.id}`).then(res => {
		wx.showModal({
			title: `系统提示`,
			content: '发送验证码成功',
			showCancel: false,
			success (res) {}
		})
		console.log('发送验证码成功!')
		let timeCount = 15
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
	memberBindingPhoneAjax({
		phone: this.data.phone, 
		id: app.globalData.wxUserInfo.id, 
		code: this.data.ucode, 
		type: 2,
		success () {
			console.log('绑定手机号成功!')
			app.globalData.User_isBindingPhone = true
			// "将参数传回上一页"
			const pages = getCurrentPages()
			const prevPage = pages[pages.length-2] // 上一页
			// 调用上一个页面的setData 方法，将数据存储
			prevPage.update_navigate_User_isBindingPhoneBack_data(true)
			wx.navigateBack({
				delta: 1
			})
		}
	})
  }
})
