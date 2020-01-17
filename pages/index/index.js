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
	LOCATION: false
  },
  swiperBannerIdx (e) { // 轮播图下标切换事件
	this.setData({
		Swiper_active: e.detail.current
	})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	console.log('邀请人memberId',options)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let res = {"code":200,"message":"操作成功","result":[{"productCode":"6901028111539","productName":"南京","categoryName":"南京","productImageAddress":"http://vendor-platform-dev.oss-cn-shenzhen.aliyuncs.com/20191113162402429ea3314d1fdf42e8a401670f451b3fa.png","sellPrice":1100.00,"activityPrice":1050.00,"distance":null,"machineCode":null,"channelId":null},{"productCode":"6901028079952","productName":"钻石(荷花)","categoryName":"香烟","productImageAddress":"http://vendor-platform-dev.oss-cn-shenzhen.aliyuncs.com/201911131444056766258f4c33219ca54ea3ba11c1f34a0.png","sellPrice":30.00,"activityPrice":19.00,"distance":null,"machineCode":null,"channelId":null},{"productCode":"6901028079952","productName":"钻石(荷花)","categoryName":"钻石","productImageAddress":"http://vendor-platform-dev.oss-cn-shenzhen.aliyuncs.com/201911131444056766258f4c33219ca54ea3ba11c1f34a0.png","sellPrice":20.00,"activityPrice":null,"distance":2666.529251252476,"machineCode":"H000012","channelId":1},{"productCode":"54646453","productName":"正天丸","categoryName":"感冒药","productImageAddress":"http://vendor-platform-dev.oss-cn-shenzhen.aliyuncs.com/2019121217420369fdc2638f21b37077c0dc36812ded511.png","sellPrice":26.00,"activityPrice":null,"distance":4126.1607217547335,"machineCode":"H00001","channelId":117},{"productCode":"6901028013413","productName":"真龙(珍品)","categoryName":"香烟","productImageAddress":"http://vendor-platform-dev.oss-cn-shenzhen.aliyuncs.com/2019111314500564e69fd0eb08337490e03396bad695c13.png","sellPrice":20.00,"activityPrice":null,"distance":4126.1607217547335,"machineCode":"H00001","channelId":117},{"productCode":"154668588","productName":"奥美拉唑肠溶胶囊","categoryName":"感冒药","productImageAddress":"http://vendor-platform-dev.oss-cn-shenzhen.aliyuncs.com/2019121217340569a40a7cb82abdefd7a95880d8cd9a940.png","sellPrice":23.00,"activityPrice":null,"distance":4126.1607217547335,"machineCode":"H00001","channelId":117}]}
    // this.setData({hotGoodsArr:res.result})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	getApp().CartStockApi_Dummy.subAll()
	getApp().CartStockApi.subAll()
	
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
			console.log('热销商品接口:',res)
			this.setData({hotGoodsArr:res.result})
		})
		queryNearbyDevice({
			pageNum: 1,
			pageSize: 6,
			maxDistance: 10000
		}).then(res=>{
			console.log('为你推荐接口接口:',res)
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
				pageSize: 6,
				maxDistance: 10000
			}).then(res=>{
				this.setData({recommendGoodsArr:res.result.list})
			})
		}
	}
  },

  goToDeviceInfo(e){
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

  goToHotDeviceInfo(e){
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
		this.onShow()
		wx.showToast({
			title: '刷新成功',
			icon: 'none'
		})
		wx.hideLoading()
		wx.stopPullDownRefresh()
	}).catch(()=>{
		wx.showToast({
			title: '刷新失败',
			icon: 'none'
		})
		wx.hideLoading()
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