module.exports = {
	alipayState: 0,//是否已绑定支付宝用户唯一标识 0 未绑定 1绑定
	appOpenId: '', //会员在程序的唯一openId
	buyerId: '', //支付宝唯一买家账号
	cardNo: '', //身份证号码
	createDate: '', //创建时间
	id: '', // ID
	isAutonym: 1, //是否已经实名制 1未实名 2已实名
	memberAddress: '', //会员地址
	memberBorn: '', //会员出生日期
	memberCardImg: '', //身份证图片
	memberImg: '', //用户微信头像
	memberName: '', //姓名
	memberPhone: '', //电话
	memberSex: 1, //性别:1 男 2 女
	nickName: '', //昵称
	openId: '', //如果用户使用微信支付并且关注了公众号即可获取
	pid: '', //string
	updateDate: '', //string($date-time)修改时间,当表发生改变字段自动更新
	wxState: 0	//boolean是否已绑定微信用户唯一标识 0 未绑定 1绑定
}