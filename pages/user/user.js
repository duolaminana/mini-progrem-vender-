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
	
	toGetgoodsItem: {}
  },
  
  AUTHORIZATION_fnc (e){
	  wx.hideLoading()
  	  this.setData({AUTHORIZATION:true})
  	  // this.selectComponent('#com-bindPhone').showThat()
	  this.initUserInfo()
  },

  gotoGetCodeCom (e) { // 去取货
	let code = e.currentTarget.dataset.code
	for(let item of this.data.UserOrderNO){
		if(code == item.orderNo){
			this.setData({toGetgoodsItem:item})
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
		console.log('获取返现信息接口:', res.result)
		this.setData({
			UserCashMoney: res.result.remainingProfitofit || 0
		})
	})
	postIntegraList().then(res=>{
		console.log('获取积分信息接口:', res.result)
		this.setData({
			UserIntegral: res.result.allIntegrals || 0
		})
	})
	queryPersonalInfo().then(res=>{
		console.log('获取用户信息接口:', res.result)
		res = res.result
		this.setData({
			ajaxUserInfo: res,
			UserImg: res.memberImg,
			UserName: res.nickName,
			UserAuth: res.isAutonym == 1 ? '已实名认证' : '未实名认证',
		})
	})
	getCodeClaimGoods().then(res=>{
		console.log('去取货接口:', res.result)
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
				item.code_src = res.path
			  }
			})
		}
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
	wx.showLoading({title: "加载中",mask: true})
	if(app.globalData.wxUserInfo){
		this.selectComponent('#com-authorization').author()
	}else{
		app.wxLoginGetMemberInfoResponseCallback = res => { // 未获取到会员用户信息/ app.js 获取会员响应回调
			this.selectComponent('#com-authorization').author()
		}
	}
  },

  /**
   * 生命周期函数--监听页面隐藏
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