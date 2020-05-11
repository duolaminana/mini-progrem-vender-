// pages/user/user.js
const {app,$,cusAppData} = require('../../utils/public.js')
const { 
returnMoney ,
queryPersonalInfo , 
queryOrderDetailes ,
getCodeClaimGoods , 
postRebateList ,
postIntegraList
} = require('../../api/api.js')
const QRCode = require('../../libs/weapp-qrcode.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ...cusAppData,
    hdData: {
      ...cusAppData,
      content: {
        text: '我的',
        style: {
          color: 'white'
        }
      }
    },
    isGetgoods: false,
	WX_USERLOGIN_STATE: false,
	UserImg: '/static/img/user/user_img.png',
	UserName: '',
	UserAuth: '未实名认证',
	ajaxUserInfo: null,
	UserCashMoney: '-',
	UserIntegral: '-',
	UserOrderNO: [],
	AUTHORIZATION:true, // 页面的展示状态(默认已授权状态)
	
	toGetgoodsItem: {},
	toGotoGetCodeCom_CODE: null
  },
  
  AUTHORIZATION_fnc (e){
	//   wx.hideLoading()
  	  this.setData({AUTHORIZATION:true})
  	  // this.selectComponent('#com-bindPhone').showThat()
	  this.initUserInfo()
  },

  toGotoGetCodeCom_CODE_fnc () {
	this.setData({
		toGotoGetCodeCom_CODE: null
	})
  },

  gotoGetCodeCom (e) { // 去取货
	let code = e.currentTarget?e.currentTarget.dataset.code:e;
	for(let item of this.data.UserOrderNO){
		if(code == item.orderNo){
			this.setData({toGetgoodsItem:item});
			this.data.toGotoGetCodeCom_CODE = code;
		}
	}
    this.setData({
      isGetgoods: true
    })
  },
  
  takeUserInfo (e) { // 接收子组件
	console.log(123)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	
  },

  initUserInfo (){
	this.WX_USERLOGIN_STATE = true
	postRebateList().then(res=>{
		console.log('获取返现信息接口success:', res.result)
		this.setData({
			UserCashMoney: res.result.remainingProfitofit || 0
		})
	}).catch(res=>{
		console.log('获取返现信息接口fail:', res)
	})
	postIntegraList().then(res=>{
		console.log('获取积分信息接口success:', res.result)
		this.setData({
			UserIntegral: res.result.allIntegrals || 0
		})
	}).catch(res=>{
		console.log('获取积分信息接口fail:', res)
	})
	queryPersonalInfo().then(res=>{
		console.log('获取用户信息接口success:', res.result)
		res = res.result
		this.setData({
			ajaxUserInfo: res,
			UserImg: res.memberImg,
			UserName: res.nickName,
			UserAuth: res.isAutonym == 1 ? '已实名认证' : '未实名认证',
		})
	}).catch(res=>{
		console.log('获取用户信息接口fail:', res)
	})
	getCodeClaimGoods().then(res=>{
		console.log('去取货接口:', res.result)
		if(res.result && res.result.length>0){
			// wx.showLoading({title: "正在生成二维码",mask:true})
			let count = 0
			this.setData({UserOrderNO:res.result})
			for(let [index, item] of this.data.UserOrderNO.entries()){
				new QRCode('myQrcode'+index,{ // 字段shippingWay生成二维码 === 显示支持线上支付
					text: item.orderNo,
					width: 66,
					height: 66,
					padding: 6, // 生成二维码四周自动留边宽度，不传入默认为0
					correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
					callback: (res) => {
						console.log('生成二维码回调:',res.path)
						// 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
						// item.code_src = res.path
						this.setData({
							['UserOrderNO['+index+'].code_src']: res.path
						})
						count++
						if(count >= this.data.UserOrderNO.length){
							// wx.hideLoading()
							if(this.data.toGotoGetCodeCom_CODE != null){
								this.gotoGetCodeCom(this.data.toGotoGetCodeCom_CODE)
							}
						}
					}
				})
			}
		}
	}).catch(res=>{
		console.log('去取货接口fail:', res)
	})
  },

  gotoUserInfoPage(){
	wx.navigateTo({
		url: `/pages/user/info/index`,
		success: res => {
			// 通过eventChannel向被打开页面传送数据
			res.eventChannel.emit('acceptDataFromOpenerPage', this.data.ajaxUserInfo)
		}
	})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	// wx.showLoading({title: "加载中"})
	if(app.globalData.wxUserInfo){
		this.selectComponent('#com-authorization').author()
	}else{
		app.wxLoginGetMemberInfoResponseCallback = res => {
			this.selectComponent('#com-authorization').author()
		}
	}
  },

  /**
   * 生命周期函数--监听页面隐藏，长生乐长生乐，长生自安乐
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})