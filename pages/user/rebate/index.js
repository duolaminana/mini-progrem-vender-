const {app,$,cusAppData} = require('../../../utils/public.js')
const { postRebateList, postIntegraList } = require('../../../api/api.js')

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
        text: '',
        style: {
          color: 'black'
        }
      },
      left: {
        class: 'goback-black'
      }
    },
	who: true, // true返现 false积分
	secureA: {
		image: '/static/img/user/jifen_img.png',
		title: '积分(分)',
		way: '积分商城',
		icon: '/static/img/user/user_img.png',
		handle: 'handle',
		time: 'time',
		note: ['购物','购物','购物']
	},
	secureB: {
		image: '/static/img/user/fanxian_img.png',
		title: '返现(元)',
		way: '返现可用于抵扣香烟',
		icon: '/static/img/user/user_img.png',
		handle: 'fx-handle',
		time: 'fx-time',
		note: ['购烟','购烟发现','好友购烟返现']
	},
	secure: {},
	total: 0,
	thisList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	if(options.who == 'integral') this.setData({who: false})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	if(this.data.who)
	this.setData({ 
		secure: this.data.secureB,
		['hdData.content.text']: '我的返现'
	})
	else
	this.setData({ 
		secure: this.data.secureA,
		['hdData.content.text']: '我的积分'
	})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	if(this.data.who)
	this.getBackcash()
	else
	this.getIntegral()
  },

  getBackcash () {
	postRebateList().then(res=>{
		console.log('获取返现信息接口:', res.result)
		this.setData({
			total: res.result.remainingProfitofit || 0,
			thisList: res.result.rebate.list || []
		})
	})
  },

  getIntegral () {
	postIntegraList().then(res=>{
		console.log('获取积分信息接口:', res.result)
		this.setData({
			total: res.result.allIntegrals || 0,
			thisList: res.result.integral.list || []
		})
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