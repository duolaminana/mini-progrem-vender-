// pages/device/sminfo/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')
const synMemberInfoAjax = require('../../signIn/bin/synMemberInfoAjax')
import { memberFindOrderByMachCode , queryMachine , getGoodsyn } from "../../../api/api.js"

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
	goodsList: [
		{
			categoryName: '全部',
		}
	],
    barCurrent: 0, // 侧边导航初始选项
	touchcart: '',
	myMakeUseOne: [], // 点击加入购物车count=1时的标记

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
	AUTHORIZATION:true // 页面的展示状态(默认已授权状态)
  },
  
  AUTHORIZATION_fnc (e){
	  this.setData({AUTHORIZATION:true})
	  this.selectComponent('#com-bindPhone').showThat()
  },
  
 //  RefreshThisPage () {
	// console.log('刷新')
	// this.onLoad(this.options)
 //  },

  barCutAir (e) { // 导航事件
    this.setData({
      barCurrent: e.currentTarget.dataset.type
    })
  },
  
  imagesOnload: $.ZOOM_IMG_FNC(),
  
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
		this.data.myMakeUseOne = [] // 清除标记
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
		this.selectComponent('#goods-detail').setParentData({ ...res, ...this.getProducts(productCode) }) // 执行详情页的组件的函数给组件传数据
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
	 * @param {Boolean}  MakeUse count==1时是否需要操作
	 * 只愿岁岁年年
	 * */
	for(let item of e.detail.ComponentTemporaryCountArray){
		for(let [index, option] of this.data.goodsList.entries()){
			if(option.products)
			for(let [idx, select] of option.products.entries()){
				if(item.productCode == select.productCode){
					if(item.count == 1){ // 加入购物车
						let MakeUse = false // 真假count=1
						for(let Sitem of this.data.myMakeUseOne){
							if(Sitem.productCode == select.productCode){
								MakeUse = true // 假不做操作
								break
							}
						}
						if(!MakeUse){ // 我是真
							$.postMask($.host_product+'findProductChannel',{ // 详情数据获取
								enable: "START",
								channelId: app.globalData.channelId,
								productCode: item.productCode
							},() => {
								// 详情请求失败返回count=0/退出
								this.setData({
									['goodsList['+index+'].products['+idx+'].dev_custom_count']: 0
								})
								return
							}).then(res => {
								this.data.myMakeUseOne.push(item)
								app.CartStockApi.add({productCode: item.productCode}, {...res, ...this.getProducts(item.productCode)})
								this.setData({
									['goodsList['+index+'].products['+idx+'].dev_custom_count']: item.count,
									touchcart: JSON.stringify({synCount:e.detail.ComponentTemporaryCountArray})
								})
							})
						}
					}
					if(item.count == 0){
						for(let [IIDx, TSitem] of this.data.myMakeUseOne.entries()){
							if(TSitem.productCode == select.productCode){
								this.data.myMakeUseOne.splice(IIDx, 1)
								break
							}
						}
						// app.CartStockApi.sub({productCode: item.productCode}) // 删除在cart.js/冲突
					}
					if(item.count != 1){ // 网络请求异步延迟.bug处理
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
	
	if(!app.globalData.isSyn || !app.globalData.isBindingPhone){
		return this.COM_authorization.author()
	}else{
		// 进入支付
		if(e.detail.click == 'footbar'){
			if(app.CartStockApi.say().length <= 0){
				wx.showToast({
					title: '您的购物车没有商品!',
					icon: 'none',
					duration: 3000
				})
				return
			}
		}else{
			if(categoryId == 182){ // 塑料袋
				app.CartStockApi_Dummy.add({productCode: productCode}, option ? option : itemw)
				return wx.navigateTo({
					url: '/pages/pay/pay'
				})
			}else{
				app.CartStockApi.add({productCode: productCode}, option ? option : itemw)
				this.setData({
					touchcart: !this.data.touchcart
				})
			}
		}
		for(let item of app.CartStockApi.say()){
			if(item.categoryId == 157 || item.categoryId == 174 || item.categoryId == 183) // 验证是否需要进入人脸验证或者身份证验证
			return wx.navigateTo({
				url: '/pages/user/verify/index'
			})
		}
		return wx.navigateTo({
			url: '/pages/pay/pay'
		})
	}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('扫码结果',options)
    this.options = options
    wx.showLoading({title:'加载中',mask:true})
    this.appGetwxUserInfoSuccess(res => {
      wx.hideLoading()
      this.selectComponent('#com-authorization').author()
      memberFindOrderByMachCode(app.globalData.machineCode).then(res => {
        // 是否购买过的
        this.setData({
          alreadyPay: res.result
        })
      })
    },res=>{
      wx.hideLoading()
    })
    
    // 扫码进来,获取machineCode
    if(options && options.machineCode && options.channelId){ // 小程序码进入
      this.goodsynFnc(options)
    }else if(JSON.stringify(options).indexOf('"q":') != -1){ // 普通二维码进入
      this.goodsynFnc($.getUrlParam(decodeURIComponent(options.q)))
    }else{
      wx.switchTab({
        url: `/pages/index/index`
      })
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
  
  goodsynFnc (optionsParams) {
  	app.globalData.machineCode = $.trim(optionsParams.machineCode)
  	app.globalData.channelId = $.trim(optionsParams.channelId)
  	queryMachine(app.globalData.machineCode).then(res => {
  		console.log('查询设备信息:',res)
  		res = res.result
  		this.setData({
  			sbinfoData: res
  		})
  		app.globalData.shippingWay = res.shippingWay
  	})
  	getGoodsyn({machineCode:app.globalData.machineCode,isNeedType:true}).then(res => {
  		console.log('大分类商品数据:',res)
  		res = res.result
  		res = res.filter(filitem => filitem.categoryName)
  		// res = require('./test')
  		app.CartStockApi.AddGoodsType('activityPrice')
  		for(let [index, item] of res.entries()){ // 更正返回详情数据
  			for(let [idx, option] of item.products.entries()){
  				res[index].products[idx] = app.CartStockApi.corr(option)
  			}
  		}
  		this.setData({
  			goodsList: [...this.data.goodsList, ...res]
  		})
  	})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	// 获取getUserInfoUserPhone组件
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