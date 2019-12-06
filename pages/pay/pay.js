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
	this.setData({ // 从购物车库绑定数据
		thisData: app.CartStockApi.say(),
		totalActivityPrice: app.CartStockApi.totalActivityPrice,
		totalArticle: app.CartStockApi.totalArticle
	})
	$.postMask($.host_memberProfit+'findMemberProfitByMemberId',{memberId:app.globalData.wxUserInfo.id}).then((res)=>{ // 返现数据请求
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
	let totalPrice = this.data.totalActivityPrice - (this.data.rebateIcon ? this.data.rebate : 0)
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
			categorylId: item.categorylId,
			productCode: item.productCode,
			productNumber: item.dev_custom_count
		})
	}
	$.postMask($.host_pay+'createPayByWxMini',{
		"categoryId": app.CartStockApi.type.categoryId,
		"details": details,
		"memberId": app.globalData.wxUserInfo.id,
		"openid": app.globalData.wxUserInfo.openId,
		"price": this.data.totalActivityPrice,
		"productNums": this.data.totalArticle,
		"uprice": this.data.totalActivityPrice
	}).then((res) => {
		console.log(res)
	})
    // wx.navigateTo({
    //   url: `/pages/pay/finish/index`
    // })
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