// pages/pay/pay.js
const {app,$,cusAppData} = require('../../utils/public.js')
import { useReturnMoney , createPayByWxMini } from "../../api/api.js"

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
	rebateIcon: true,
	rebate: 0,
	show_totalPrice: 0, // 下单的金额
	show_realPrice: 0, // 实付金额
	show_totalCount: 0, // 下单的数量
	q: {},
	showRebate: false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	wx.showLoading({title:'加载中'})
	useReturnMoney().then(res=>{
		res = res.result || {}
		wx.hideLoading()
		this.setData({
			rebate: (res.remainingProfit < 0) || (!res.remainingProfit) ? 0 : res.remainingProfit
		})
		console.log('返现接口返回:', res)
		this.calculateOrderParams()
	}).catch(res=>{
		wx.hideLoading()
		wx.showModal({
			title: '系统提示',
			content: res.message || res.msg || '网络错误!',
			showCancel: false
		})
	})
  },
  
  cutRebate (){
	  this.setData({rebateIcon:!this.data.rebateIcon})
	  if(this.data.rebateIcon){
		this.calculateRrealPrice(this.data.rebate)
	  }else{
		this.calculateRrealPrice(0)
	  }
  },
  
  calculateRrealPrice (rebate){
	if(this.data.show_totalPrice <= 0){
		this.setData({
			show_realPrice: 0,
			showRebate : false
		})
	}else{
		if(this.data.show_totalPrice > rebate){
			this.setData({
				show_realPrice: $.Sub(this.data.show_totalPrice , rebate),
				showRebate: true
			})
		}else{
			this.setData({
				show_realPrice: 0.01, // 一分钱唤起支付
				showRebate: true
			})
		}
	}  
  },
	
	calculateOrderParams (){
		// if(app.CartStockApi_Dummy.say().length){ // 从虚拟购物车库绑定数据 ------不存在了
		// 	this.setData({thisData:app.CartStockApi_Dummy.say()})
		// 	this.data.show_totalPrice = app.CartStockApi_Dummy.totalActivityPrice
		// 	this.data.show_totalCount = app.CartStockApi_Dummy.totalCount
		// }else
		{ // 从购物车库绑定数据
			this.setData({
				thisData:app.CartStockApi.say(),
				show_totalPrice:app.CartStockApi.totalActivityPrice,
				show_totalCount:app.CartStockApi.totalCount,
			})
		}
		let details = [],
			xmSpace = []
		for(let item of this.data.thisData){
			console.log('逐条商品:',item)
			if(item.categoryId == 182 && item.activityNum){ // 都限免
				let xmSpace_item = {}
				xmSpace_item.pirce = item.actualPrice
				if(item.dev_custom_count <= item.activityNum){
					xmSpace_item.num = item.dev_custom_count
					details.push({
						categoryId: item.categoryId,
						categorylId: item.categorylId,
						productCode: item.productCode,
						productNumber: item.dev_custom_count,
						isFree: 1
					})
				}else{ // 此商品下单数量大于限免数量时,分作两条商品
					xmSpace_item.num = item.activityNum
					details.push({
						categoryId: item.categoryId,
						categorylId: item.categorylId,
						productCode: item.productCode,
						productNumber: item.activityNum,
						isFree: 1
					})
					details.push({
						categoryId: item.categoryId,
						categorylId: item.categorylId,
						productCode: item.productCode,
						productNumber: item.dev_custom_count - item.activityNum,
					})
				}
				xmSpace.push(xmSpace_item)
				continue
			}
			details.push({
				categoryId: item.categoryId,
				categorylId: item.categorylId,
				productCode: item.productCode,
				productNumber: item.dev_custom_count
			})
		}
		
		/**
		 *  计算下单参数
		 * 	@param {Number} xmSpace.totalPrice 购物袋限免总金额
		 * 	@param {Number} this.data.show_totalPrice 订单总金额
		 * 	@param {Number} this.data.show_realPrice 实付总金额(订单总金额 - 积分)
		 * */
		xmSpace.totalPrice = 0
		for(let item of xmSpace){
			xmSpace.totalPrice = $.Add(xmSpace.totalPrice , $.Mul(item.num || 0 , item.pirce || 0))
		}
		
		this.data.show_totalPrice = $.Sub(this.data.show_totalPrice , xmSpace.totalPrice)
		
		this.calculateRrealPrice(this.data.rebate)
		
		this.data.q = {
			"details": details,
			"price": this.data.show_totalPrice,
			"productNums": this.data.show_totalCount,
			"realPrice": this.data.show_realPrice,
			"preferentialPrice": this.data.showRebate ? this.data.rebateIcon ? this.data.rebate : null : null
		} // price 订单金额 / realPrice实付金额
		console.log('下单参数打印:', this.data.q)
	},

    makePayAir () { // 下单事件
		wx.showLoading({title:'加载中',mask:true})
		createPayByWxMini(this.data.q).then(res=>{
			wx.hideLoading()
			console.log('生成订单成功:',res)
			let resPay = res.result
			app.globalData.orderNO.push(resPay.orderId)
			if(this.data.show_realPrice == 0){
				app.CartStockApi.subAll()
				wx.navigateTo({
					url: `/pages/pay/finish/index?orderId=${resPay.orderId}`
				})
				return
			}
			wx.requestPayment({
				timeStamp: resPay.timeStamp,
				nonceStr: resPay.nonceStr,
				package: resPay.packaAge,
				signType: resPay.signType,
				paySign: resPay.signs,
				success :(res)=> {
					console.log('支付成功',res)
					app.CartStockApi.subAll()
					wx.navigateTo({
						url: `/pages/pay/finish/index?orderId=${resPay.orderId}`
					})
				},
				fail (res) {
					console.log('支付错误',res)
					if(res.errMsg != 'requestPayment:fail cancel'){
						wx.navigateTo({
						  url: `/pages/pay/finish/index?fail=true`
						})
					}
				},
				complete:()=>{
					console.log('支付接口调用00000000000000')
				}
			})
		}).catch(res=>{
			wx.hideLoading()
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
	if(getApp().globalData.isPayment_state){
		getApp().globalData.isPayment_state =  false
		wx.navigateTo({
			url: `/pages/device/sminfo/index?machineCode=${getApp().globalData.machineCode}&channelId=${getApp().globalData.channelId}`
		})
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