// pages/user/verify/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')

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
		this.loginFace()
	}else{
		if(this.data.bindingCard)
		this.registerFace()
		else
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
	$.getMask($.host_cardMessage + 'evoke',{machineCode: app.globalData.machineCode}).then((res)=>{
		if(res){
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
				if((num % 3) == 0)
				$.get($.host_cardMessage + 'gain',{machineCode: app.globalData.machineCode}).then((res)=>{
					if(res){
						clearInterval(timer)
						this.hideAjaxGain()
						this.gain = res.faceAttribute
						this.data.bindingCard = true
						wx.showToast({
							title: "请进行人脸验证!",
							duration: 1500
						})
					}
				})
			},1000)
		}
	})
  },

  MemberBindingCard () {
	$.getMask(`${$.host_order}MemberBindingCard?cardNo=${this.gain.card}&memberId=${app.globalData.wxUserInfo.id}`).then((res) => {
		app.globalData.isBindingCard = true
		app.globalData.wxUserInfo.id = res
		wx.navigateTo({
			url: `/pages/pay/pay`
		})
	})
  },

  registerFace () { // 人脸认证
	this.showCamera()
	console.log('人脸认证registerFace')
	const ctx = wx.createCameraContext(); //创建相机上下文
	ctx.takePhoto({
		quality: 'high',
		success: (res) => {
			console.log('人脸',res)
			wx.showToast({
				icon: "loading",
				title: "正在上传中。。。"
			})
			console.log(wx.uploadFile)
			wx.uploadFile({
				url: $.host_face + 'witnessCheck',
				filePath: res.tempImagePath,
				name: 'multipartFile',
				formData: {
					faceAttribute: JSON.stringify(this.gain)
				},
				success:(res)=>{
					console.log('witnessCheck api 响应:',res)
					if (res.statusCode != 200) {
						wx.showModal({
							title: '提示',
							content: '上传失败',
							showCancel: false
						})
						return
					}
					if(res.data){
						this.data.bindingFace = true
						this.showCamera()
						this.MemberBindingCard()
					}else{
						wx.showModal({
							title: '提示',
							content: '验证失败,请重新验证!',
							showCancel: false
						})
					}
				},
				complete:(res)=>{
					console.log('uploadFile',res)
					wx.hideLoading()
				}
			})
			console.log('盗贼')
		},
		fail: (res)=> {
			console.log('拍照错误',res)
		}
	})
  },

  loginFace () { // 人脸验证
	this.showCamera()
	const ctx = wx.createCameraContext(); //创建相机上下文
	ctx.takePhoto({
		quality: 'high',
		success: (res) => {
			wx.showToast({
				icon: "loading",
				title: "正在上传中。。。"
			})
			wx.uploadFile({
				url: $.host_face + 'checkFace', //仅为示例，非真实的接口地址
				filePath: res.tempImagePath,
				name: 'multipartFile',
				formData: {},
				success:(res)=>{
					console.log('Face api 响应:',res)
					if (res.statusCode != 200) {
						wx.showModal({
							title: '提示',
							content: '上传失败',
							showCancel: false
						})
						return
					}
					this.showCamera()
					wx.navigateTo({
						url: `/pages/pay/pay`
					})
				},
				complete:()=>{
					wx.hideLoading()
				}
			})
		},
		fail: (res)=> {
			console.log('拍照错误',res)
		}
	})
  },

  showAjaxGain () {
	this.setData({
		showGain: true
	}, ()=>{
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