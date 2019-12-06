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
	currVerfiyFace: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	if(app.globalData.isBindingCard){
		this.setData({
			bindingFace: true,
			bindingCard: true
		})
	}
  },
  
  showCamera () {
	this.setData({
		isShowCamera: this.data.isShowCamera?false:true
	})
  },

  verfiyFace () {
	if(this.data.bindingFace){
		this.loginFace()
	}else{
		this.registerFace()
	}
  },

  verfiyCard () {
	if(this.data.bindingCard){
		wx.showModal({
		  title: '系统提示',
		  content: '您已经进行过身份证认证\n请直接进行人脸验证',
		  showCancel: false
		})
	}else{
		this.registerCard()
	}
  },
  
  registerFace () {
	console.log('首次人脸认证成功')
	this.setData({
		bindingFace: true
	})
	this.loginFace()
  },
  
  registerCard () {
	console.log('首次身份证认证成功')
	$.postMask('').then((res)=>{
		if(res){
			let num = 0
			let timer = setInterval(()=>{ // 循环获取
				if(num >= 10){
					return clearInterval(timer)
				}
				++num
				$.postMask('').then((res)=>{
					if(res){
						clearInterval(timer)
						this.setData({
							bindingCard: true
						})
						this.goPayPage()
						wx.showModal({
						  title: '系统提示',
						  content: '身份证认证成功,请进行人脸认证!',
						  showCancel: false
						})
					}
				})
			},800)
		}
	})
  },
  
  loginFace () {
	console.log('开始验证人脸!!')
	const ctx = wx.createCameraContext(); //创建相机上下文
	console.log(ctx.takePhoto)
	ctx.takePhoto({
		quality: 'high',
		success: (res) => {
			// console.log('拍照',res)
			this.setData({
				src: res.tempImagePath //相机拍照得到照片的地址
			})
			wx.showToast({
				icon: "loading",
				title: "正在上传中。。。"
			})
			wx.uploadFile({
				url: $.host_face + 'checkFace', //仅为示例，非真实的接口地址
				filePath: this.data.src,
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
					this.setData({
						currVerfiyFace: res.data
					})
					this.goPayPage()
				}
			})
		},
		fail: (res)=> {
			console.log('拍照错误',res)
		}
	})
  },

  goPayPage () {
	if(this.data.bindingCard && this.data.bindingFace && this.data.currVerfiyFace)
	wx.navigateTo({
		url: `/pages/pay/pay`
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