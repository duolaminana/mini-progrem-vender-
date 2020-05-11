// pages/pay/finish/finish.js
const {app,$,cusAppData} = require('../../../utils/public.js')
const { returnMoney , pullMoneyIntegral } = require('../../../api/api.js')
const QRCode = require('../../../libs/weapp-qrcode.js')

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
        text: '支付结果'
      }
    },
    fbData: { // fixedbottom数据
      text: '返回首页',
      click: 'air',
    },
	isWin: true,
	iconTitle: '支付成功',
	iconColor: '#EE7700',
	iconType: 'success',
	integral: 0,
	backMoney: 0,
	orderId: null,
	jfText: '领取',
	fxText: '领取',
	jfcolor: 'color',
	getCargoShow: false,
    shippingWay: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
	if(options.fail){
		this.setData({
			isWin:false,
			iconTitle:'支付失败',
			iconColor: '#D73F3C',
			iconType: 'warn'
		})
		return
	}
	getApp().globalData.isPayment_state = true
	this.setData({
		orderId: options.orderId,
		shippingWay: app.globalData.shippingWay
	})
	if(this.data.shippingWay == 0){
		new QRCode('myQrcode',{ // 字段shippingWay生成二维码 === 显示支持线上支付
		  text: this.data.orderId,
		  width: 150,
		  height: 150,
		  padding: 10, // 生成二维码四周自动留边宽度，不传入默认为0
		  correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
		  callback: (res) => {
		    console.log('生成二维码回调:',res.path)
		    // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
		  }
		})
	}else{
		this.setData({
			getCargoShow:true,
		})
	}
	returnMoney({orderId:this.data.orderId}).then(res=>{
		console.log('支付成功页面获取积分接口:', res)
		let val = res.result
		if(val <= 0){
			this.setData({
				jfcolor: 'color'
			})
			return
		}
		this.setData({
			integral: $.Mul(val , 100),
			backMoney: val,
			jfcolor: 'color2'
		})
	})
  },
  
  checked (e) {
	  if(this.data.jfcolor != 'color2') return
	  if(e.currentTarget.dataset.who == 0){
		  console.log('积分')
		  wx.showLoading({
		  	title: "领取中",
				mask: true
		  })
		  pullMoneyIntegral(this.data.orderId, 1, this.data.backMoney).then(res=>{
			console.log('支付成功领取积分接口:', res)
			if(!res){
				wx.showToast({
					title:'领取失败!',
					icon: 'none',
					mask: true
				})
				return
			}
			wx.showToast({
				title:'领取成功!',
				icon: 'success',
				mask: true
			})
			this.setData({
				jfText: '已领取',
				jfcolor: 'color'
			})
		  }).catch(res=>{
			  wx.showToast({
				title:'领取失败!',
				icon: 'none',
				mask: true
			  })
		  })
	  }else{
		  console.log('返现')
		  wx.showLoading({
		  	title: "领取中",
				mask: true
		  })
		  pullMoneyIntegral(this.data.orderId, 2, this.data.backMoney).then(res=>{
			console.log('支付成功领取返现接口:', res)
			if(!res){
				wx.showToast({
					title:'领取失败!',
					icon: 'none',
					mask: true
				})
				return
			}
			wx.showToast({
				title:'领取成功!',
				icon: 'success',
				mask: true
			})
			this.setData({
				fxText: '已领取',
				jfcolor: 'color'
			})
		  }).catch(res=>{
			  wx.showToast({
				title:'领取失败!',
				icon: 'none',
				mask: true
			  })
		  })
	  }
  },

  air () {
	getApp().globalData.isPayment_state = false
    wx.switchTab({
		url: `/pages/index/index`
    })
  },

  toOrderPage () {
	wx.navigateBack({
	  delta: 1
	})  
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