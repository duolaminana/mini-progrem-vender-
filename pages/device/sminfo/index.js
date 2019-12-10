// pages/device/sminfo/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')
const synMemberInfoAjax = require('../../signIn/bin/synMemberInfoAjax')

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
	isHideUnauthorized: false,
	goodsList: [
		{
			categoryName: '全部',
		}
	],
    barCurrent: 0, // 侧边导航初始选项
	showComCart: false,
	showComDetail: false,
	touchcart: false,

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
  },
  
  RefreshThisPage () {
	console.log('刷新')
	this.onLoad(this.options)
  },
  
  touchcartfnc () { // 刷新购物车和底部导航的显示
	this.setData({
		touchcart: !this.data.touchcart
	})
  },

  barCutAir (e) { // 导航事件
    this.setData({
      barCurrent: e.currentTarget.dataset.type
    })
  },
  
  openComCart (e) { // 定义接收子组件的方法 // 打开或关闭购物车
	this.data.showComCart?this.setData({
		showComCart: false
	}):this.setData({
		showComCart: true
	})
  },
  
  openComDetail (e) { // 打开商品详情
	let productCode = e.currentTarget.dataset.productcode
	$.postMask($.host_product+'findProductChannel',{
		enable: "START",
		channelId: app.globalData.channelId,
		productCode: productCode
	}).then(res => {
		this.DETAIL.setParentData({ ...this.getProducts(productCode), ...res}) // 执行详情页的组件的函数给组件传数据
	})
	this.setData({ // open
		showComDetail: true
	})
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
  
  closeComDetail (e) { // 关闭商品详情
	this.setData({
		showComDetail: false
	})
  },
  
  gotoPayOrderPage (e) { // 去付款按钮
	let categoryId = e.detail.categoryId ? e.detail.categoryId : e.currentTarget.dataset.categoryid
	let productCode = e.detail.productCode ? e.detail.productCode : e.currentTarget.dataset.productcode
	let option = e.detail.option ? e.detail.option : undefined
	
	if(!app.globalData.isSyn || !app.globalData.isBindingPhone){
		return this.GUIUP.showBlock() // 显示绑定手机号弹框
	}else{
		// 进入支付
		if(categoryId != 'cartOut'){
			app.CartStockApi.add({productCode: productCode}, option ? option : this.getProducts(productCode))
			this.setData({
				touchcart: !this.data.touchcart
			})
		}else{
			if(app.CartStockApi.say().length <= 0){
				wx.showToast({
					title: '您的购物车空空如也!',
					icon: 'none',
					duration: 4000
				})
				return
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
  
  customDevCountFnc (e) {
	/**海市蜃楼
	 * 海市蜃楼 // 每个加入该组件的页面都可以使用
	 * countKey [Component] 组件
	 * @属性触发
	 * @动态更改 [dev_custom_count] this.data.goodsList
	 * @param {Array}  ComponentTemporaryCountArray
	 * @param {String}  productCode 唯一标识
	 * @param {Number}  dev_custom_count 数值
	 * */
	for(let item of e.detail.ComponentTemporaryCountArray){
		for(let [index, option] of this.data.goodsList.entries()){
			if(option.products)
			for(let [idx, select] of option.products.entries()){
				if(item.productCode == select.productCode){
					// this.data.goodsList[index].products[idx].dev_custom_count = item.count
					let goods = 'goodsList['+index+'].products['+idx+'].dev_custom_count'
					this.setData({
						[goods]: item.count
					})
				}
			}
		}
	}
  },
  
  bindGetUserInfo: function(e) { // 微信授权/同步后台会员/按钮
      if (e.detail.userInfo) {
		app.globalData.setting = e.detail
		synMemberInfoAjax({...e.detail, id: app.globalData.wxUserInfo.id, success: res => {
			if(res){
				wx.showToast({
					title: '系统已同步您的会员!',
					icon: 'none',
					duration: 2000
				})
				app.globalData.unauthorized = false
				this.setData({
					isHideUnauthorized: false
				})
			}else{
				wx.showToast({
					title: '系统同步您的会员失败!',
					icon: 'none',
					duration: 2000
				})
			}
			this.GUIUP.initChange()
		}})
      } else {
          wx.showModal({
              title: '系统提示',
              content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
              showCancel: false,
              confirmText: '返回授权',
              success: function(res) {
                  if (res.confirm) {
                      // console.log('用户点击了“返回授权”');
                  }
              }
          });
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	this.GUIUP = this.selectComponent('#getInfoPhone')
	this.DETAIL = this.selectComponent('#goods-detail')
	console.log(this.GUIUP)
	if(app.globalData.wxUserInfo){
		 // 已经获取到会员信息了
		getSettingFnc.call(this)
	}else{
		app.wxLoginGetMemberInfoResponseCallback = res => { // 未获取到会员用户信息/ app.js 获取会员响应回调
			getMemberInfoFnc.call(this, res)
		}
	}
	function getMemberInfoFnc(res) {
		/**
		 * manageInitResponse  首次处理获取会员问题 *****(重要)
		 * @miss 1	网络慢的时候会执行
		 * @miss 2	接口访问不了的时候会执行
		 * */
		if(res.errMsg != 'request:ok'){
			// 网络等原因导致接口无法访问
			wx.showModal({
				title: '系统提示',
				content: '服务器无法访问',
				showCancel: false,
				confirmText: '重新加载',
				success: res => {
					if (res.confirm) {
						$.getMask(`${$.host_order}getMemberInfo?jsCode=${app.globalData.code}`, (res)=> {
							// 网络异步请求,可用回调获取状态.获取微信会员请求响应回调
							getMemberInfoFnc.call(this, res)
						})
					}
				}
			})
			return
		}
		if(res.data.code==200){
			// 成功获取用户会员信息操作
			// 设置globalData等重要信息
			res = res.data.result
			if(!app.globalData.wxUserInfo){
				/**
				 * 网络异步处理
				 * 或
				 * 第二次以上请求返回赋值
				 * */
				app.globalData.isSyn = res.isSyn
				app.globalData.isBindingPhone = res.isBindingPhone
				app.globalData.isBindingCard = res.isBindingCard
				app.globalData.wxUserInfo = res.data
			}
			getSettingFnc.call(this)
		}else{
			// 服务器返回错误!!!
		}
	}
	function getSettingFnc() {
		wx.getSetting({ // 微信授权/同步后台会员
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					console.log('用户已授权!!')
					wx.getUserInfo({
						success: res => {
							app.globalData.setting = res
							synMemberInfoAjax({...res, id: app.globalData.wxUserInfo.id, success: res => {
								if(res){
									wx.showToast({
										title: '系统已同步您的会员!',
										icon: 'none',
										duration: 2000
									})
									app.globalData.unauthorized = false
									this.setData({
										isHideUnauthorized: false
									})
									this.GUIUP.initChange()
								}else{
									wx.showToast({
										title: '系统同步您的会员失败!',
										icon: 'none',
										duration: 2000
									})
								}
							}})
						},
						fail: res => {
							console.log('获取用户信息fail: ', res)
						}
					})
				}else{
					console.log('用户未授权!!')
					app.globalData.unauthorized = true
					this.setData({
						isHideUnauthorized: true
					})
				}
			}
		})
	}
	
	this.options = options
	// 扫码进来,获取machineCode
	if(options && options.machineCode && options.channelId){ // 小程序码进入
		goodsynFnc.call(this, options)
	}else if(JSON.stringify(options).indexOf('"q":') != -1){ // 普通二维码进入
		goodsynFnc.call(this, $.getUrlParam(decodeURIComponent(options.q)))
	}else{
		wx.switchTab({
			url: `/pages/index/index`
		})
	}
	function goodsynFnc(optionsParams) {
		app.globalData.machineCode = $.trim(optionsParams.machineCode)
		app.globalData.channelId = $.trim(optionsParams.channelId)
		$.getMask($.host_device+'goodsyn',{machineCode: app.globalData.machineCode,isNeedType:false}).then((res) => {
			/**
			 * 请求大分类商品
			 * */
			app.CartStockApi.AddGoodsType({
				categoryId: res[0].categoryId
			})
			if(res)
			for(let [index, item] of res.entries()){ // 在的数据上添加数量属性/默认1
				for(let [idx, option] of item.products.entries()){
					res[index].products[idx].dev_custom_count = 1
				}
			}
			this.setData({
				goodsList: [...this.data.goodsList, ...res]
			})
		})
	}
  },
  
  update_navigate_isBindingPhoneBack_data (val) {
	// 绑定页面返回时数据更新
	this.GUIUP.initChange()
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