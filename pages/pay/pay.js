// pages/pay/pay.js
const {app,$,cusAppData} = require('../../utils/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...cusAppData,
    hdData: {
        ...cusAppData,
      warp: {
        style: {
          backgroundColor: 'white'
        }
      },
      content: {
        text: '订单支付'
      },
	  left: {
		class: 'goback-black'
	  }
    },
    fbData: { // fixedbottom数据
      text: '确认支付',
      click: 'makePayAir',
      style: {
        backgroundColor: '#EE7700'
      }
    },
	thisData: [],
	totalActivityPrice: 0,
	totalArticle: 0,
	rebateIcon: false,
	rebate: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  console.log(123132,app.CartStockApi.totalActivityPrice)
	this.setData({ // 从购物车库绑定数据
		thisData: app.CartStockApi.say(),
		totalActivityPrice: app.CartStockApi.totalActivityPrice,
		totalArticle: app.CartStockApi.totalArticle,
		initTotalPrice: app.CartStockApi.totalActivityPrice
	})
	$.postMask($.host_memberProfit+'findMemberProfitByMemberId?memberId='+app.globalData.wxUserInfo.id,{
		memberId:app.globalData.wxUserInfo.id
	}).then((res)=>{ // 返现数据请求
		this.setData({
			rebate: res.remainingProfit
		})
		this.clickRebate()
	})
  },

  clickRebate () { // 返现事件
	this.setData({
		rebateIcon: !this.data.rebateIcon
	})
	let totalPrice = this.data.initTotalPrice - (this.data.rebateIcon ? this.data.rebate : 0)
	if(totalPrice < 0){
		totalPrice = 0
	}
	this.setData({
		totalActivityPrice: totalPrice
	})
  },

  makePayAir () { // 确定订单事件
	let details = []
	for(let item of app.CartStockApi.say()){
		details.push({
			// categoryId: item.categoryId,
			categoryId: 174,
			categorylId: item.categorylId,
			productCode: item.productCode,
			productNumber: item.dev_custom_count
		})
	}
	console.log(details)
	$.postMask($.host_pay+'createPayByWxMini',{
		"details": details,
		"memberId": app.globalData.wxUserInfo.id,
		"openid": app.globalData.wxUserInfo.appOpenId,
		"machineCode": app.globalData.machineCode,
		"price": app.CartStockApi.totalActivityPrice,
		"productNums": this.data.totalArticle,
		"realPrice": this.data.totalActivityPrice,
		"preferentialPrice": this.data.rebate
	}).then((res) => {
		console.log('确认订单',res)
		for(let item of details){
			app.CartStockApi.sub({productCode:item.productCode})
		}
		app.globalData.orderNO.push(res.orderId)
		wx.requestPayment({
			timeStamp: res.timeStamp,
			nonceStr: res.nonceStr,
			package: res.packaAge,
			signType: res.signType,
			paySign: res.signs,
			success (res) {
				console.log('支付成功',res)
				wx.navigateTo({
					url: `/pages/pay/finish/index`
				})
			},
			fail (res) {
				console.log('支付错误',res)
			}
		})
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