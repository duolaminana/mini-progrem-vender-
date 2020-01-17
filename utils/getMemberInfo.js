import { getMemberInfo } from '../api/api.js';

export default function appGetMemberInfo(callback, callback2){
	wx.login({
		success: res => {
			// 发送 res.code 到后台换取 openId, sessionKey, unionId
			getApp().globalData.code = res.code
			getMemberInfo(this.memberId).then(res => {
				/* *
				 * 用户id: id
				 * openId: appOpenId
				 * 身份证卡号: cardNo
				 * 用户头像: memberImg
				 * 用户头像: nickName
				 * 是否同步过用户信息: isSyn
				 * 是否绑定过手机号码: isBindingPhone
				 * 是否进行过脸证核验: isBindingCard
				 * */
				res = res.result
				getApp().globalData.isSyn = res.isSyn
				getApp().globalData.isBindingPhone = res.isBindingPhone
				getApp().globalData.isBindingCard = res.isBindingCard
				getApp().globalData.wxUserInfo = res.data
				if(callback) callback(res.data)
			}).catch(res=>{
				if(callback2) callback2(res)
				wx.showModal({
					title: '',
					content: res.message || res.msg || '请检查网络状态!',
					confirmText: '确定',
					showCancel: false,
					success: res => {
						// if(res.confirm == true) appGetMemberInfo()
					}
				})
			})
		},
		fail(res) {
			if(callback2) callback2(res)
			wx.showModal({
				title: '',
				content: res.message || res.msg || '请检查网络状态!',
				confirmText: '确定',
				showCancel: false,
				success: res => {
					// if(res.confirm == true) appGetMemberInfo()
				}
			})
		}
	})
}