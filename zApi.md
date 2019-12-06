# 小程序后台接口

### 某项参数记录

#### 方便查看

- 判断微信用户是否已经进入过小程序

```
{
	alipayState	boolean
	是否已绑定支付宝用户唯一标识 0 未绑定 1绑定
	
	appOpenId	string
	会员在程序的唯一openId
	
	buyerId	string
	支付宝唯一买家账号
	
	cardNo	string
	身份证号码
	
	createDate	string($date-time)
	创建时间
	
	id	integer($int32)
	id
	isAutonym	integer($int32)
	是否已经实名制 1未实名 2已实名
	
	memberAddress	string
	地址
	
	memberBorn	string
	出生日期
	
	memberCardImg	string
	身份证图片
	
	memberImg	string
	用户微信头像
	
	memberName	string
	姓名
	
	memberPhone	string
	电话
	
	memberSex	integer($int32)
	性别:1 男 2 女
	
	nickName	string
	昵称
	
	openId	string
	如果用户使用微信支付并且关注了公众号即可获取
	
	pid	string
	updateDate	string($date-time)
	修改时间,当表发生改变字段自动更新
	
	wxState	boolean
	是否已绑定微信用户唯一标识 0 未绑定 1绑定
}
```