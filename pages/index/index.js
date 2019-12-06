//index.js
const {app,$,cusAppData} = require('../../utils/public')

Page({
    data: {
      ...cusAppData,
      // 头部配置
      hdData: {
        ...cusAppData,
        warp: {
          style: {
            backgroundColor: 'white'
          }
        },
        content: {
          text: '首页'
        }
      },
      // 扫码购买按钮配置
      fbData: {
        icon: '/static/img/icon/saoyisao_icon.png',
        text: '扫码购买',
        click: 'gotoSmInfoPage'
      },
	  
      dots_active: 0, // 轮播图初始下标
      bannerSwiperArr: [ // 轮播图
        {
          "id": 1,
          "imgurl": "/static/img/banner/banner.png"
        },
        {
          "id": 2,
          "imgurl": "/static/img/banner/banner.png"
        },
        {
          "id": 3,
          "imgurl": "/static/img/banner/banner.png"
        },
        {
          "id": 4,
          "imgurl": "/static/img/banner/banner.png"
        }
      ],
      
	  hotGoodsArr: [], // 热销商品
      recommendGoodsArr: [], // 推荐商品
	  showFloatGlass: true
    },
	
    swiperBannerIdx (e) {
		/**
		 * 轮播图下标切换事件
		 * */
		this.setData({
			dots_active: e.detail.current
		})
    },
	
    gotoSmInfoPage () {
		/**
		 * 点击扫码购买事件
		 * */
		wx.scanCode({
			onlyFromCamera: true,
			success: res =>{
			  wx.navigateTo({
				url: `/pages/device/sminfo/index?machineCode=${app.globalData.machineCode}`
			  })
			},
			fail: res =>{
			  wx.showToast({
				title: '扫码摄像头已关闭',
				icon: 'none',
				duration: 1200
			  })
			}
		})
    },
	
    hotLoad () {
		/**
		 * 热销商品
		 * */
		$.get(`${$.host_position}/queryHotProduct`, {
			latitude: app.globalData.myLocation[0],
			longitude: app.globalData.myLocation[1]
		},'application/json').then((res)=>{
			res = [
				{
				  "productName": "利群(硬烟嘴)", // 商品名称
				  "activityPrice": 48, // 商品活动价
				  "sellPrice": 80, // 商品售价
				  "distance": 80, // 机器的距离
				  "machineCode": 80, // 机器的编号
				  "productCode": 80, // 商品编号
				  "productImageAddress": "/static/img/goods.png", // 商品地址
				  "channelId": 80, // 商户id
				},
				{
				  "productName": "利群(硬烟嘴)", // 商品名称
				  "activityPrice": 48, // 商品活动价
				  "sellPrice": 80, // 商品售价
				  "distance": 80, // 机器的距离
				  "machineCode": 80, // 机器的编号
				  "productCode": 80, // 商品编号
				  "productImageAddress": "/static/img/goods.png", // 商品地址
				  "channelId": 80, // 商户id
				},
				{
				  "productName": "利群(硬烟嘴)", // 商品名称
				  "activityPrice": 48, // 商品活动价
				  "sellPrice": 80, // 商品售价
				  "distance": 80, // 机器的距离
				  "machineCode": 80, // 机器的编号
				  "productCode": 80, // 商品编号
				  "productImageAddress": "/static/img/goods.png", // 商品地址
				  "channelId": 80, // 商户id
				},
				{
				  "productName": "利群(硬烟嘴)", // 商品名称
				  "activityPrice": 48, // 商品活动价
				  "sellPrice": 80, // 商品售价
				  "distance": 80, // 机器的距离
				  "machineCode": 80, // 机器的编号
				  "productCode": 80, // 商品编号
				  "productImageAddress": "/static/img/goods.png", // 商品地址
				  "channelId": 80, // 商户id
				}
			]
			this.setData({
				hotGoodsArr: res
			})
		})
    },
	
    recommendLoad () {
		/**
		 * 推荐商品
		 * */
		$.get(`${$.host_position}/queryHotProduct`, {
			latitude: app.globalData.myLocation[0],
			longitude: app.globalData.myLocation[1],
			openId: null
		},'application/json').then((res)=>{
			res = [
				{
				  "susp": 1,
				  "type": 0,
				  "imgurl": "/static/img/goods/yan_img.png",
				  "name": "烟",
				  "machineCode": 80, // 机器的编号
				  "distance": 48,
				  "productImageAddress": "石岩"
				},
				{
				  "susp": 0,
				  "type": 1,
				  "imgurl": "/static/img/goods/yao_img.png",
				  "name": "药",
				  "distance": 48,
				  "addr": "石岩石岩石岩石岩石岩"
				},
				{
				  "susp": 0,
				  "type": 2,
				  "imgurl": "/static/img/goods/mianhuatang_img.png",
				  "name": "棉花糖",
				  "distance": 48,
				  "addr": "石岩"
				},
				{
				  "susp": 0,
				  "type": 0,
				  "imgurl": "/static/img/goods/yan_img.png",
				  "name": "烟",
				  "distance": 48,
				  "addr": "石岩"
				}
			]
			this.setData({
				recommendGoodsArr: res
			})
		})
    },
	
	floatGlass (e) {
		/**
		 * 浮动按钮事件
		 * */
		$.thisLocation.call(this, ()=>{
			this.setData({
				showFloatGlass: false
			})
			this.hotLoad()
			this.recommendLoad()
		})
	},
    
    onLoad: function (options) {
		$.thisLocation.call(this, ()=>{
			this.setData({
				// showFloatGlass: false
			})
			this.hotLoad()
			this.recommendLoad()
		})
    },
    onShow: function () {
      // 页面出现在前台时执行
    },
    onReady: function () {
      // 页面首次渲染完毕时执行
    },
    onHide: function () {
      // 页面从前台变为后台时执行
    },
    onUnload: function () {
      // 页面销毁时执行
    },
    onPullDownRefresh: function () {
      // 触发下拉刷新时执行
    },
    onReachBottom: function () {
      // 页面触底时执行
    },
    onShareAppMessage: function (res) {
      // 页面被用户分享时执行
    },
    onPageScroll: function () {
      // 页面滚动时执行
    },
    onResize: function () {
      // 页面尺寸变化时执行
    }
})
