import { getGoodsHotData, queryNearbyDevice } from '../../api/api.js';
import { loopLocation } from '../../utils/Location.js';
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
	LOCATION: true
  },
  swiperBannerIdx (e) { // 轮播图下标切换事件
	this.setData({
		Swiper_active: e.detail.current
	})
  },

  imagesOnload(e){
		this.data.imgScaleCC = this.data.imgScaleCC || {}
		this.data.imgScaleCC[e.currentTarget.dataset.scale] = (e.detail.width / e.detail.height * 100) + '%'
		this.setData({
			imgScaleCC: this.data.imgScaleCC
		})
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
    loopLocation(res=>{
	  this.setData({
		LOCATION: true
	  })
      this.getThisPageData()
    })
  },
  getThisPageData(){
	// wx.showLoading({title:'加载中',mask:true})
	if(app.globalData.wxUserInfo){
		getGoodsHotData().then(res=>{
			// wx.hideLoading()
			this.setData({hotGoodsArr:res.result})
		})
		queryNearbyDevice({
			pageNum: 1,
			pageSize: 6
		}).then(res=>{
			this.setData({recommendGoodsArr:res.result.list})
		})
	}else{
		app.wxLoginGetMemberInfoResponseCallback = res => { // 未获取到会员用户信息/ app.js 获取会员响应回调
			getGoodsHotData().then(res=>{
				// wx.hideLoading()
				this.setData({hotGoodsArr:res.result})
			})
			queryNearbyDevice({
				pageNum: 1,
				pageSize: 6
			}).then(res=>{
				this.setData({recommendGoodsArr:res.result.list})
			})
		}
	}
  },

  goToDeviceInfo(e){
	let code = e.currentTarget.dataset.code
	for(let item of this.data.recommendGoodsArr){
		if(item.machineCode == code)
		wx.navigateTo({
			url: `/pages/device/info/index`,
			success: res => {
				// 通过eventChannel向被打开页面传送数据
				res.eventChannel.emit('acceptDataFromOpenerPage', item)
			}
		})
	}
  },

  goToHotDeviceInfo(e){
	let code = e.currentTarget.dataset.code
	for(let item of this.data.hotGoodsArr){
		if(item.machineCode == code)
		wx.navigateTo({
			url: `/pages/index/hotsell/index`,
			success: res => {
				// 通过eventChannel向被打开页面传送数据
				res.eventChannel.emit('acceptDataFromOpenerPage', item)
			}
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