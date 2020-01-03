// pages/index/hotsell/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')
import { queryHotMachineProduct } from '../../../api/api.js'

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
        text: '热销商品'
      },
      left: {
        class: 'goback-black'
      }
    },
	thisGoodsData:{}
  },
  
  imagesOnload: $.ZOOM_IMG_FNC(),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	let that = this
	const eventChannel = this.getOpenerEventChannel()
	eventChannel.on('acceptDataFromOpenerPage', function(data) {
	  console.log('index.wxml',data)
	  that.execThis(data)
	})
  },
  
  execThis(data){
	this.setData({
		thisGoodsData: data
	})
	queryHotMachineProduct(data.productCode).then(res => {
		this.setData({thisGoods:res.result})
	})
  },
  
  goToDeviceInfo(e){
  	let data = this.data.thisGoods
  	let old = 'machineCode'
  	let code = e.currentTarget.dataset.code
  	wx.navigateTo({
  	  url: `/pages/device/info/index`,
  	  success: res => {
  	    // 通过eventChannel向被打开页面传送数据
  	    res.eventChannel.emit('acceptDataFromOpenerPage', $.getArrItem(data, old, code))
  	  }
  	})
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