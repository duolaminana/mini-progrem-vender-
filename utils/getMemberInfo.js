import { getMemberInfo } from '../api/api.js';

export default function appGetMemberInfo(callback, callback2){
	wx.login({
		success: res => {
			// 发送 res.code 到后台换取 openId, sessionKey, unionId
			getApp().globalData.code = res.code
			getMemberInfo(this?this.memberId:null).then(res => {
				/* *
				 * 用户id: id
				 * openId: appOpenId
				 * 身份证卡号: cardNo
				 * 用户头像: memberImg
				 * 用户头像: nickName
				 * 是否同步过用户信息: User_isSyn
				 * 是否绑定过手机号码: User_isBindingPhone
				 * 是否进行过脸证核验: User_isBindingCard
				 * */
				res = res.result
				getApp().globalData.User_isSyn = res.isSyn
				getApp().globalData.User_isBindingPhone = res.isBindingPhone
				getApp().globalData.User_isBindingCard = res.isBindingCard
				getApp().globalData.wxUserInfo = res.data
				if(callback) callback(res.data)
			}).catch(res=>{
				if(callback2) callback2(res)
				console.log('获取用户信息失败',res)
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
			console.log('wx.login失败',res)
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