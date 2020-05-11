// pages/device/sminfo/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')
import PullDownRefresh from '../../../utils/PullDownRefresh.js';
const synMemberInfoAjax = require('../../signIn/bin/synMemberInfoAjax')
import { memberFindOrderByMachCode , queryMachine , getGoodsyn , findMemberFreeProduct , findProductChannel } from "../../../api/api.js"

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
			text: '扫码购买'
		},
		left: {
			class: 'goback-black',
			type: 'switchTab',
			text: '首页',
			url: '/pages/index/index'
		}
    },
	//判断小程序的API，回调，参数，组件等是否在当前版本可用。
	canIUse: wx.canIUse('button.open-type.getUserInfo'),
	scanCode: null,
	goodsList: [
		{
			categoryName: '全部',
		}
	],
    barCurrent: 0, // 侧边导航初始选项
	touchcart: '',

    footerPayData : { // 底部导航
      state: true,
      goCart: 'swichGoodsCartAir',
      goDownOrder: 'downOrderAir'
    },
    footerCartData: { // 购物车
      state: false,
      clearCartAir: 'clearGoodsCartAir'
    },
    footerDetailData: { // 商品详情
      state: false,
      closeDetail: 'closeGoodsDetailAir',
      goDownOrder: 'downOrderAir',
      addCart: 'addCartAir',
	  animationData: {}
    },
	sbinfoData: {},
	alreadyPay: false,
	shippingWay: app.globalData.shippingWay,
	isCardModule: 0, // 是否需要认证核验 1要 0不要
	AUTHORIZATION:true // 页面的展示状态(默认已授权状态)
  },
  
  AUTHORIZATION_fnc (e){
	  this.setData({AUTHORIZATION:true})
	  this.selectComponent('#com-bindPhone').showThat()
  },

  barCutAir (e) { // 导航事件
    this.setData({
      barCurrent: e.currentTarget.dataset.type
    })
  },

  touchcartfnc (e) { // 刷新购物车和底部导航的显示/跟打开关闭相关
	this.setData({
		touchcart: e.detail.click
	})
	if(e.detail.click == 'clearCompCart'){ // 购物车清空时调整index.js dev_custom_count
		for(let [index, option] of this.data.goodsList.entries()){
			if(option.products)
			for(let [idx, select] of option.products.entries()){
				this.setData({
					['goodsList['+index+'].products['+idx+'].dev_custom_count'] : 0
				})
			}
		}
	}
  },

  openComDetail (e) { // 商品详情\\打开
	let productCode = e.currentTarget.dataset.productcode
	$.postMask($.host_product+'findProductChannel',{ // 详情数据获取
		enable: "START",
		channelId: app.globalData.channelId,
		productCode: productCode
	}).then(res => {
		console.log('打开productCode='+productCode+' 详情数据:',res)
		let synObj = this.getProducts(productCode)
		for (const key in synObj) {              // 去除对象内多余的空值key
		    if (synObj[key] === '') {
		      delete synObj[key]
		    }
		}
		this.selectComponent('#goods-detail').setParentData(Object.assign(res, synObj)) // 执行详情页的组件的函数给组件传数据
		this.setData({
			touchcart: 'open' // 特定指令/打开详情组件
		})
	})
  },

  customComputeCountFnc (e) {
	/**海市蜃楼 ComputeCount 同步dev_custom_count
	 * 海市蜃楼 // 每个加入该组件的页面都可以使用
	 * countKey [Component] 组件
	 * @属性触发
	 * @动态更改 [dev_custom_count] this.data.goodsList
	 * @param {Array}  ComponentTemporaryCountArray
	 * @param {String}  productCode 唯一标识
	 * @param {Number}  dev_custom_count 数值
	 * 只愿岁岁年年
	 * */
	for(let item of e.detail.ComponentTemporaryCountArray){
		for(let [index, option] of this.data.goodsList.entries()){
			if(option.products)
			for(let [idx, select] of option.products.entries()){
				if(item.productCode == select.productCode){
					if(item.count == 1){
						if(app.CartStockApi.see({productCode: item.productCode})){ // 减购物车
							app.CartStockApi.rev({productCode: item.productCode}, {dev_custom_count: item.count})
							this.setData({
								['goodsList['+index+'].products['+idx+'].dev_custom_count']: item.count,
								touchcart: JSON.stringify({synCount:e.detail.ComponentTemporaryCountArray})
							})
						}else{ // 加购物车
							wx.showLoading({title: '加载中',mask: true})
							findProductChannel({ // 详情数据获取
								enable: "START",
								channelId: app.globalData.channelId,
								productCode: item.productCode
							}).then(res=>{
								wx.hideLoading()
								res = res.result
								app.CartStockApi.add({productCode: item.productCode}, {...res, ...this.getProducts(item.productCode)})
								this.setData({
									['goodsList['+index+'].products['+idx+'].dev_custom_count']: item.count,
									touchcart: JSON.stringify({synCount:e.detail.ComponentTemporaryCountArray})
								})
							}).catch(res=>{
								wx.hideLoading()
								wx.showToast({
									title: res.message || res.msg || '网络错误!',
									icon: 'none',
									duration: 1500
								})
								this.setData({ // 详情请求失败返回count=0/退出
									['goodsList['+index+'].products['+idx+'].dev_custom_count']: 0
								})
							})
						}
					}else{ // 网络请求异步延迟.bug处理
						// 惶惶不可终日
						this.setData({
							['goodsList['+index+'].products['+idx+'].dev_custom_count']: item.count,
							touchcart: JSON.stringify({synCount:e.detail.ComponentTemporaryCountArray})
						})
					}
					break
				}
			}
		}
	}
  },
  
  getProducts (productCode) { // 获取选项products
	for(let [index, item] of this.data.goodsList.entries()){
		if(item.products)
		for(let [idx, option] of item.products.entries()){
			if(productCode == option.productCode){
				return option
			}
		}
	}
  },

  gotoPayOrderPage (e) { // 去付款按钮
	let categoryId = e.detail.categoryId ? e.detail.categoryId : e.currentTarget.dataset.categoryid
	let productCode = e.detail.productCode ? e.detail.productCode : e.currentTarget.dataset.productcode
	let option = e.detail.option ? e.detail.option : undefined
	
	let itemw = this.getProducts(productCode)
	
	// if(!app.globalData.User_isSyn || !app.globalData.User_isBindingPhone){
	// 	return this.COM_authorization.author()
	// }
	if(e.detail.click == 'footbar'){
		if(!app.CartStockApi.say().length){
			wx.showToast({
				title: '您的购物车没有商品!',
				icon: 'none',
				duration: 3000
			})
			return
		}
	}else{
		if(categoryId == 9999999){ // 塑料袋182
			app.CartStockApi_Dummy.add({productCode: productCode}, option ? option : itemw)
			app.CartStockApi.rev({productCode: productCode}, {dev_custom_count: 1})
		}else{
			app.CartStockApi.add({productCode: productCode}, option ? option : itemw)
			// this.setData({
			// 	touchcart: !this.data.touchcart
			// })
		}
	}
	console.log('购物车数据展示:',app.CartStockApi.say())
	if(this.data.isCardModule)
	wx.navigateTo({
		url: '/pages/user/verify/index'
	})
	else
	wx.navigateTo({
		url: '/pages/pay/pay'
	})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('扫码结果',options)
    this.scanCode = options
	
    // wx.showLoading({title:'加载中',mask:true})
    this.appGetwxUserInfoSuccess(res => {
		// wx.hideLoading()
		this.selectComponent('#com-authorization').author()
		memberFindOrderByMachCode(app.globalData.machineCode).then(res => {
			// 是否购买过的
			this.setData({
				alreadyPay: res.result
			})
		}).catch(()=>{
			// wx.hideLoading()
		})
    })

    // 扫码进来,获取machineCode
    if(this.scanCode && this.scanCode.machineCode){ // 小程序码进入
		this.goodsynFnc(this.scanCode)
    }else if(JSON.stringify(this.scanCode).indexOf('"q":') != -1){ // 测试普通二维码进入
		this.goodsynFnc($.getUrlParam(decodeURIComponent(options.q)))
    }else{
		wx.switchTab({ url:`/pages/index/index` })
    }
  },

  appGetwxUserInfoSuccess (callback){
    if(app.globalData.wxUserInfo){
		callback()
    }else{
		app.wxLoginGetMemberInfoResponseCallback = res => {
			callback()
		}
    }
  },

  DeviceStatus (){
	if(app.globalData.DEVICE_STATUS == 0 || app.globalData.NETWORK_STATUS == 0){
		this.selectComponent('#com-deviceStatus').open()
	}
  },

	findMemberFreeProduct(arr){ // 环保袋剩余数量计算
		let isExec = true
		exec.call(this)
		let timer = setInterval(res=>{
			if(isExec) exec.call(this, timer)
		},50)
		function exec(timer){
			if(app.globalData.wxUserInfo){
				isExec = false
				findMemberFreeProduct(arr, app.globalData.channelId).then(res=>{
					console.log('获取环保袋限免购买过的数量接口:',res)
					let data = this.data.goodsList
					for(let [index, item] of data.entries()){ // 更正返回详情数据
						if(item.products)
						for(let [idx, option] of item.products.entries()){
							for(let child of res.result){
								if(Object.keys(child)[0] == option.productCode){
									let uoNum = (option.activityNum || 0) - (child[Object.keys(child)[0]] || 0)
									if(uoNum < 0) uoNum = 0
									this.setData({
										['goodsList['+index+'].products['+idx+'].activityNum']: uoNum
									})
								}
							}
						}
					}
				})
				if(timer) clearInterval(timer)
				return
			}
		}
	},
  
  goodsynFnc (optionsParams) {
  	app.globalData.machineCode = $.trim(optionsParams.machineCode)
  	queryMachine(app.globalData.machineCode).then(res => {
  		console.log('查询设备信息:',res)
  		res = res.result
  		this.setData({
  			sbinfoData: res,
			shippingWay: res.shippingWay,
			isCardModule: res.isCardModule
  		})
		app.globalData.DEVICE_STATUS =  res.status
		app.globalData.NETWORK_STATUS =  res.networkStatus
		this.DeviceStatus()
		app.globalData.deviceOphone = res.phone
  		app.globalData.shippingWay = res.shippingWay
		app.globalData.channelId = res.channelId
		console.log('出货方式shippingWay:',app.globalData.shippingWay)
		
		getGoodsyn({machineCode:app.globalData.machineCode,isNeedType:true}).then(res => {
			console.log('大分类商品数据:',res)
			res = res.result
			res = res.filter(filitem => filitem.categoryName)
			// res = require('./test')
			let creatArr = []
			app.CartStockApi.AddGoodsType('activityPrice')
			for(let [index, item] of res.entries()){ // 更正返回详情数据
				for(let [idx, option] of item.products.entries()){
					res[index].products[idx] = app.CartStockApi.corr(option)
					if(res[index].categoryId == 182 && res[index].products[idx].activityNum){
						creatArr.push(res[index].products[idx].productCode)
					}
				}
			}
			this.setData({
				goodsList: [...this.data.goodsList, ...res]
			})
			creatArr = JSON.stringify(creatArr)
			creatArr = creatArr.substring(1, creatArr.length)
			creatArr = creatArr.substring(0, creatArr.length-1)
			creatArr = creatArr.replace(/\"/g,'')
			this.findMemberFreeProduct(creatArr)
		})
  	})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	// 获取getUserInfoUserPhone组件
  },
  
  refreshFcn () {
	this.setData({
		goodsList: [
			{
				categoryName: '全部',
			}
		],
		barCurrent: 0,
		sbinfoData: {},
		alreadyPay: false,
		isCardModule: 0,
	})
	this.selectComponent('#com-authorization').author()
	memberFindOrderByMachCode(app.globalData.machineCode).then(res => {
		// 是否购买过的
		this.setData({
			alreadyPay: res.result
		})
	}).catch(()=>{
		wx.hideLoading()
	})
	if(this.scanCode && this.scanCode.machineCode){ // 小程序码进入
		this.goodsynFnc(this.scanCode)
	}else if(JSON.stringify(this.scanCode).indexOf('"q":') != -1){ // 测试普通二维码进入
		this.goodsynFnc($.getUrlParam(decodeURIComponent(options.q)))
	}else{
		wx.switchTab({ url:`/pages/index/index` })
	}
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
	PullDownRefresh({
		member: true,
		location: false
	}).then(()=>{
		console.log('刷新成功')
		this.setData({
			goodsList: [
				{
					categoryName: '全部',
				}
			],
			barCurrent: 0, // 侧边导航初始选项
		})
		app.CartStockApi.subAll()
		this.refreshFcn()
		wx.stopPullDownRefresh()
	}).catch(()=>{
		wx.showToast({
			title: '刷新失败',
			icon: 'none'
		})
		wx.stopPullDownRefresh()
	})
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