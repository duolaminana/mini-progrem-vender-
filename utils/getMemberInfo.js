import { getMemberInfo } from '../api/api.js';

export default function appGetMemberInfo(callback){
  getMemberInfo().then(res => {
	// {
	// 	code: 200
	// 	message: "操作成功"
	// 	result:{
	// 		data: {id: 99, cardNo: null, appOpenId: "ozJ2-4nABXGTsGws-2tY1gFxmf-w", memberImg: "https://wx.qlogo.cn/mmopen/vi_32/zIZWvmoXC36QzDpex…bhziaZKER1f6SO1gatskxXORHmTIUA1FfMYhexsTTkcfg/132", nickName: "该用户没有昵称", …}
	// 		isBindingCard: false
	// 		isBindingPhone: true
	// 		isSyn: true,
	// 	}
	// }
  	console.log('用户信息 [data]',res)
  	res = res.result
	
  	getApp().globalData.isSyn = res.isSyn
  	getApp().globalData.isBindingPhone = res.isBindingPhone
  	getApp().globalData.isBindingCard = res.isBindingCard
	
  	getApp().globalData.wxUserInfo = res.data
	if(callback) callback(res.data)
  }, res => {
  	wx.showModal({
  		title: '提示',
  		content: res,
  		confirmText: '重新加载',
  		success: res => {
			if(res.confirm == true) appGetMemberInfo()
  		}
  	})
  })
}