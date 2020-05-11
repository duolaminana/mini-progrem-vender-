import { getGoodsHotData, queryNearbyDevice } from '../../api/api.js';
import { loopLocation } from '../../utils/location.js';
import PullDownRefresh from '../../utils/PullDownRefresh.js';
const {app,$,cusAppData} = require('../../utils/public.js')

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
    Swiper_active: 0, // 轮播图初始下标
    SwiperData: [ // 轮播图
      {
        "id": 1,
        "imgurl": "/static/img/banner/banner.png"
      },{
        "id": 2,
        "imgurl": "/static/img/banner/banner.png"
      },{
        "id": 3,
        "imgurl": "/static/img/banner/banner.png"
      },{
        "id": 4,
        "imgurl": "/static/img/banner/banner.png"
      }
    ],
    hotGoodsArr: [],
    recommendGoodsArr: [],
	LOCATION: false,
	AUTHORIZATION:true // 页面的展示状态(默认已授权状态)
  },
  swiperBannerIdx (e) { // 轮播图下标切换事件
	this.setData({
		Swiper_active: e.detail.current
	})
  },

  AUTHORIZATION_fnc (e){
  	this.setData({AUTHORIZATION:true})
  	this.selectComponent('#com-bindPhone').showThat()
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	
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
	getApp().CartStockApi_Dummy.subAll()
	getApp().CartStockApi.subAll()
	this.setData({
		hotGoodsArr: [],
		recommendGoodsArr: [],
		LOCATION: false
	})
	
    loopLocation(res=>{
	  this.setData({
		LOCATION: true
	  })
      this.zoujungao()
    })
  },
  zoujungao(){
	if(app.globalData.wxUserInfo){
		this.requestData()
	}else{
		app.wxLoginGetMemberInfoResponseCallback = res => {
			this.requestData()
		}
	}
  },
  requestData (){
	this.selectComponent('#com-authorization').author()
	wx.showLoading({title:'加载中',mask:true})
	let hide = 0
	getGoodsHotData().then(res=>{
		console.log('热销商品接口success:',res)
		hide++
		if(hide == 2) wx.hideLoading()
		this.setData({hotGoodsArr:res.result})
	}).catch(res=>{
		console.log('热销商品接口fail:',res)
		hide++
		if(hide == 2) wx.hideLoading()
	})
	queryNearbyDevice({
		pageNum: 1,
		pageSize: 6,
		maxDistance: 10000
	}).then(res=>{
		console.log('为你推荐接口success:',res)
		hide++
		if(hide == 2) wx.hideLoading()
		this.setData({recommendGoodsArr:res.result.list})
	}).catch(res=>{
		console.log('为你推荐接口fail:',res)
		hide++
		if(hide == 2) wx.hideLoading()
	})
  },
  navigateToDeviceInfo(e){
	let index = e.currentTarget.dataset.code
	let data = this.data.recommendGoodsArr
	wx.navigateTo({
		url: `/pages/device/info/index`,
		success: res => {
			// 通过eventChannel向被打开页面传送数据
			res.eventChannel.emit('acceptDataFromOpenerPage', $.getArrItemByIdx(data, index))
		}
	})
  },
  navigateToHotDeviceInfo(e){
	let index = e.currentTarget.dataset.code
	let data = this.data.hotGoodsArr
	wx.navigateTo({
		url: `/pages/index/hotsell/index`,
		success: res => {
			// 通过eventChannel向被打开页面传送数据
			res.eventChannel.emit('acceptDataFromOpenerPage', $.getArrItemByIdx(data, index))
		}
	})
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
	// wx.startPullDownRefresh()
	// wx.stopPullDownRefresh()
	wx.showLoading({title: "加载中", mask: true})
	PullDownRefresh({
		member: true,
		location: true
	}).then(()=>{
		console.log('刷新成功')
		wx.hideLoading()
		this.onShow()
		wx.showToast({
			title: '刷新成功',
			icon: 'none'
		})
		wx.stopPullDownRefresh()
	}).catch(()=>{
		wx.hideLoading()
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