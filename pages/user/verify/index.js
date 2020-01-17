// pages/user/verify/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')
import { cardMessageEvoke , cardMessageGain , setBindCard , witnessCheck , checkFace } from '../../../api/api.js'

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
        text: '身份认证'
      },
	  left: {
		class: 'goback-black'
	  }
    },
	bindingFace: false, // 是否已经绑定过人脸认证
	bindingCard: false, // 是否已经绑定过身份认证
	isShowCamera: false,
	showGain: false,
	time: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	if(app.globalData.isBindingCard){
		this.setData({
			bindingFace: true,
			bindingCard: true,
		})
	}
  },

  showCamera () { // 打开关闭相机
	this.setData({
		isShowCamera: !this.data.isShowCamera
	})
  },

  verfiyFace () {
	if(app.globalData.isBindingCard){
		this.showCamera()
	}else{
		if(this.data.bindingCard){
			this.showCamera()
		}else
		wx.showModal({
		  title: '系统提示',
		  content: '请先进行身份证验证',
		  showCancel: false
		})
	}
  },

  verfiyCard () {
	if(this.data.bindingCard){
		wx.showModal({
		  title: '系统提示',
		  content: '请点击人脸验证',
		  showCancel: false
		})
		return
	}
	wx.showLoading({title:'正在打开扫描',mask:true})
	cardMessageEvoke().then(res=>{
		wx.hideLoading()
		this.showAjaxGain()
		let num = 30
		this.setData({
			time: num
		})
		let timer = setInterval(()=>{ // 循环获取
			if(num <= 0){
				if(!this.data.bindingCard){
					wx.showModal({
						title: '系统提示',
						content: '请重新验证!',
						showCancel: false
					})
				}
				this.hideAjaxGain()
				clearInterval(timer)
				return
			}
			this.setData({
				time: --num
			})
			if((num % 2) == 0)
			cardMessageGain().then(res=>{
				console.log('cardMessageGain api 响应:',res)
				res = res.result
				if(res){
					console.log('刷身份证信息记入.....',res.faceAttribute)
					clearInterval(timer)
					this.hideAjaxGain()
					this.gain = res
					this.data.bindingCard = true
					wx.showToast({
						title: "请进行人脸验证!",
						duration: 1500
					})
					return
				}
			})
		},1000)
	})
  },

  photograph () {
	  const ctx = wx.createCameraContext(); //创建相机上下文
	  ctx.takePhoto({
		quality: 'high',
		success: (res) => {
			if(app.globalData.isBindingCard)
			this.loginFace(res)
			else
			this.registerFace(res)
		},
		fail: (res)=> {
			console.log('拍照错误',res)
			wx.showModal({
				title: '提示',
				content: '拍照错误,请重新拍照!',
				showCancel: false
			})
		}
	  })
  },

  registerFace (res) { // 认证人脸
	wx.showLoading({
		title: "正在上传中。。。",
		mask: true
	})
	let q = {
		filePath: res.tempImagePath,
		data: {
			faceAttribute: JSON.stringify(this.gain.faceAttribute)
		}
	}
	witnessCheck(q).then(res => {
		this.data.bindingFace = true
		this.showCamera()
		console.log('人证核验接口 api success响应',res)
		// console.log('卡号',this.gain.faceAttribute.card)
		setBindCard(this.gain.faceAttribute.card).then(res => {
			console.log('绑定用户身份证接口 api success响应',res)
			wx.hideLoading()
			res = res.result
			app.globalData.isBindingCard = true
			app.globalData.wxUserInfo.id = res
			wx.navigateTo({
				url: `/pages/pay/pay`
			})
		}, res => {
			console.log('绑定用户身份证接口 api fail响应',res)
			wx.hideLoading()
			wx.showModal({
				title: '提示',
				content: res,
				showCancel: false
			})
		})
	}).catch(res => {
		console.log('witnessCheck api fail响应:',res)
		wx.hideLoading()
		wx.showModal({
			title: '系统提示',
			content: res,
			showCancel: false
		})
	})
  },

  loginFace (res) { // 验证人脸
	wx.showLoading({
		title: "正在上传中。。。",
		mask: true
	})
	let q = {
		filePath: res.tempImagePath
	}
	checkFace(q).then((res, resp) => {
		console.log('checkFace api 响应:',res)
		wx.navigateTo({
			url: `/pages/pay/pay`
		})
	}).catch(res => {
		console.log('checkFace api fail响应:',res)
		wx.hideLoading()
		wx.showModal({
			title: '系统提示',
			content: res || '验证失败,请重新验证!',
			showCancel: false
		})
	})
  },

  showAjaxGain () {
	this.setData({
		showGain: true
	}, () => {
		this.animation.opacity(1).step()
		this.setData({
			animationData: this.animation.export()
		})
	})
  },
  
  hideAjaxGain () {
	this.animation.opacity(0).step()
	this.setData({
		animationData: this.animation.export()
	})
	setTimeout(()=>{
		this.setData({
			showGain: false
		})
	}, app.globalData.duration);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	this.animation = wx.createAnimation({
		duration: app.globalData.duration,
		timingFunction: 'ease',
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