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
	rebate: 0,
	
	dummy: false
  },
  
  imagesOnload: $.ZOOM_IMG_FNC(),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.CartStockApi_Dummy.say().length > 0)
    this.data.dummy = !this.data.dummy
    if(this.data.dummy)
    this.setData({ // 从虚拟购物车库绑定数据
      thisData: app.CartStockApi_Dummy.say(),
      totalActivityPrice: app.CartStockApi_Dummy.totalActivityPrice,
      totalArticle: app.CartStockApi_Dummy.totalArticle,
      initTotalPrice: app.CartStockApi_Dummy.totalActivityPrice
    })
    else
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
        rebate: (res.remainingProfit < 0) || (!res.remainingProfit) ? 0 : res.remainingProfit
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
    let arrMy = this.data.dummy ? app.CartStockApi_Dummy.say() : app.CartStockApi.say()
    let details = []
    for(let item of arrMy){
      details.push({
        categoryId: item.categoryId,
        categorylId: item.categorylId,
        productCode: item.productCode,
        productNumber: item.dev_custom_count
      })
    }
    $.postMask($.host_pay+'createPayByWxMini',{
      "details": details,
      "memberId": app.globalData.wxUserInfo.id,
      "openid": app.globalData.wxUserInfo.appOpenId,
      "machineCode": app.globalData.machineCode,
      "price": this.data.dummy ? app.CartStockApi_Dummy.totalActivityPrice : app.CartStockApi.totalActivityPrice,
      "productNums": this.data.totalArticle,
      "realPrice": this.data.totalActivityPrice,
      "preferentialPrice": this.data.rebateIcon ? this.data.rebate : null
    }).then((res) => {
      console.log('createPayByWxMini',res)
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.packaAge,
        signType: res.signType,
        paySign: res.signs,
        success :(ress)=> {
          console.log('支付成功',ress)
          for(let item of details){
            if(this.data.dummy)
            app.CartStockApi_Dummy.sub({productCode:item.productCode})
            else
            app.CartStockApi.sub({productCode:item.productCode})
          }
          app.globalData.orderNO.push(res.orderId)
		  wx.navigateTo({
		    url: `/pages/pay/finish/index?orderId=${res.orderId}`
		  })
        },
        fail (res) {
          wx.navigateTo({
            url: `/pages/pay/finish/index?fail=true`
          })
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
	app.CartStockApi_Dummy.subAll()
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