// pages/device/device.js
const {app,$,cusAppData} = require('../../utils/public')
import { loopLocation } from '../../utils/Location.js';
import { queryNearbyDevice, memberFindOrderByMachCode } from '../../api/api.js';

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
          backgroundColor: '#ee7700'
        }
      },
      content: {
        text: '发现',
        style: {
          color: 'white'
        }
      }
    },
	LOCATION: false,
    barCurrent: 0,
    barArr: [],
	ThisShopData_All:[],
	ShowShopData:[],
	inputvalue: '',
	disabled: true,
	SWITCH_PAGING_LOADING: false,
	pageNum: 1, // 当前页数
	pageSize: 10, // 每页数量
	total: 0, // 总页数
	pages: 0
  },

  barAir (e) { // 导航事件
    this.setData({
      barCurrent: e.currentTarget.dataset.type
    })
  },
  
  imagesOnload(e){
  		this.data.imgScaleCC = this.data.imgScaleCC || {}
  		this.data.imgScaleCC[e.currentTarget.dataset.scale] = (e.detail.width / e.detail.height * 100) + '%'
  		this.setData({
  			imgScaleCC: this.data.imgScaleCC
  		})
  	},

	searchInput(){
		if(this.data.inputvalue) return
		wx.navigateTo({
			url:`/pages/device/search/index`
		})
	},

	searchImg(){
		if(this.data.inputvalue){
			this.searchTouch()
		}else
		wx.navigateTo({
			url:`/pages/device/search/index`
		})
	},
	
	bindInputChange(e){
		this.data.inputvalue = e.detail.value
		if(this.data.inputvalue==''){
			this.setData({
				inputvalue:this.data.inputvalue
			})
			this.firstInitTouch()
		}
	},
	
	goToDeviceInfo(e){
		let code = e.currentTarget.dataset.code
		for(let item of this.data.ThisShopData_All){
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
	
	gotoDeviceMap(){
		wx.navigateTo({
		  url: `/pages/device/deviceMap/deviceMap`,
		  success: res => {
		    // 通过eventChannel向被打开页面传送数据
		    res.eventChannel.emit('acceptDataFromOpenerPage', this.data.ThisShopData_All)
		  }
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
	if(app.searchvalue){
		this.searchTouch()
	}else{
		this.firstInitTouch()
	}
  },
  
  Officers(callback){ // 来吧是个机会
  	loopLocation(res=>{
  		this.setData({
  			LOCATION: true
  		})
  		if(app.globalData.wxUserInfo){
  			callback()
  	  	}else{
  			wx.showLoading({title:'获取用户信息',mask:true})
  	  		app.wxLoginGetMemberInfoResponseCallback = res => { // 未获取到会员用户信息/ app.js 获取会员响应回调
  				wx.hideLoading()
  				callback()
  	  		}
  	  	}
  	})
  },

  getThisData(q,callback){ // queryNearbyDevice
	wx.showLoading({title:'正在查询中',mask:true})
  	queryNearbyDevice(q).then(res=>{
		wx.hideLoading()
		console.log(res)
		if(callback) callback()
  		if(res.code==200){
			this.data.pageNum = res.result.pageNum
			this.data.pageSize = res.result.pageSize
			this.data.pages = res.result.pages
			this.setData({
				ThisShopData_All: [...this.data.ThisShopData_All , ...res.result.list]
			})
			this.createBarArr()
  		}else{
			wx.showModal({
				title: '系统提示',
				content: res.message,
				showCancel: false
			})
		}
  	},res=>{
		wx.showModal({
			title: '系统提示',
			content: res.message,
			showCancel: false
		})
	})
  },
  
  createBarArr(){ // 导航数组实现
  	let obj = {}
  	this.setData({
  		barArr: this.data.ThisShopData_All.reduce((cur,next) => {
  			obj[next.categoryId] ? "" : obj[next.categoryId] = true && cur.push(next)
  			return cur
  		},[{categoryId: ''}]) //设置cur默认类型为数组，并且初始值为空的数组
  	})
  },
  
  firstInitTouch(){ // 初始化加载
	this.setData({
		ThisShopData_All : []
	})
	var q = {
		keyword: '',
		categoryId: '',
		pageNum: 1,
		pageSize: 10
	}
	this.Officers(()=>{
		this.getThisData(q)
		this.StorCode()
	})
  },
  
  searchTouch(){ // 搜索加载
	  this.setData({
	  	inputvalue : app.searchvalue,
	  	ThisShopData_All : []
	  })
	  let categoryId = this.data.barArr[this.data.barCurrent]
	  var q = {
	  	keyword: app.searchvalue,
	  	categoryId: categoryId ? this.data.barArr[this.data.barCurrent].categoryId : '',
	  	pageNum: 1,
	  	pageSize: 10
	  }
		this.Officers(()=>{
			this.getThisData(q)
		})
  },
	
	scrolltolower(e){ // 分页加载
		if(this.data.pageNum >= this.data.pages) return
		// if(this.data.barCurrent != 0) return
		if(this.data.SWITCH_PAGING_LOADING) return
		this.setData({
			SWITCH_PAGING_LOADING: true
		})
		var q = {
			keyword: this.data.inputvalue,
			categoryId: this.data.barArr[this.data.barCurrent].categoryId,
			pageNum: this.data.pageNum + 1,
			pageSize: this.data.pageSize
		}
		this.getThisData(q,()=>{
			setTimeout(()=>{
				this.setData({
					SWITCH_PAGING_LOADING: false
				})
			},500)
		})
	},

  StorCode(){ // 缓存查询历史
	let arr = []
	wx.getStorage({
	  key: 'hyt_searchDevice',
	  success: (res)=> {
		arr=typeof JSON.parse(res.data) == 'object'?JSON.parse(res.data): []
		console.log(arr)
		if(this.inputvalue){
			arr.push(this.data.inputvalue)
			wx.setStorage({
				key:"hyt_searchDevice",
				data:JSON.stringify(arr)
			})
		}
	  },
	  fail:(res)=> {
		wx.setStorage({
			key:"hyt_searchDevice",
			data:JSON.stringify(arr.push(this.data.inputvalue))
		})
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