// pages/user/verify/facial/index.js
const {app,$,cusAppData} = require('../../../../utils/public')

const {
	outer_id,
	api_key,
	api_secret
} = {
	outer_id:'15185672444',
	api_key:'KIOpCvIPTeD_ntL9Kb5V6v6S9OTdK6-N',
	api_secret:'hpkPFmLRfTHT0gjQZm2gMa-6AfIzNdh0',
}
// console.log(outer_id)

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
	    text: '人脸识别'
	  },
	  left: {
		class: 'goback-black'
	  }
	},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	// wx.checkIsSupportSoterAuthentication({
	//     success(res) {
	// 		console.log('======',res.supportMode)
	//       // res.supportMode = [] 不具备任何被SOTER支持的生物识别方式
	//       // res.supportMode = ['fingerPrint'] 只支持指纹识别
	//       // res.supportMode = ['fingerPrint', 'facial'] 支持指纹识别和人脸识别
	//     }
	// })
	// wx.startSoterAuthentication({
	//    requestAuthModes: ['facial'],
	//    challenge: '123456',
	//    authContent: '请用指纹解锁',
	//    success(res) {
	// 	   console.log('success',res)
	//    },
	//    fail(res){
	// 	   console.log('fail',res)
	//    }
	// })
	
	// wx.request({
	//   url: 'https://api-cn.faceplusplus.com/facepp/v3/faceset/create',//请求接口
	//   method: 'post',
	//   data: {
	// 	'api_key': api_key,//请填写你创建的api_key 
	// 	'api_secret': api_secret,//请填写你的api_secret
	// 	'outer_id':outer_id,//账号下全局唯一的 FaceSet 自己自定义，后面要用到
	//   },
	//   header: {
	// 	'content-type': 'application/x-www-form-urlencoded',
	//   },
	//   success(res) {
	// 	console.log('创建脸集成功!',res.data)//打印
	//   },fail:function(e){
	// 	wx.showModal({
	// 	  title: '提示',
	// 	  content: '创建失败',
	// 	  showCancel: false
	// 	})
	//   },complete:function(){
		
	//   }
	// })
  },
  
	register: function () {
		const ctx = wx.createCameraContext() //创建相机上下文
		ctx.takePhoto({
			quality: 'high', //获取原图
			success: (res) => {
				this.setData({
					src: res.tempImagePath //得到拍照后的图片地址
				});
				wx.showToast({
					icon: "loading",
					title: "正在上传中。。。"
				});
				var that = this;
				console.log(that.data.src);
				wx.uploadFile({ //上传图片到接口，获取人脸唯一标识，face_token
					url: "https://api-cn.faceplusplus.com/facepp/v3/detect",
					filePath: that.data.src, //刚才拍照的图片地址
					name: 'image_file', //图片的字段名和接口的字段要对应上
					header: {
						"Content-Type": "multipart/form-data" //必须用此header
					},
					formData: {
						'api_key': api_key,//请填写你创建的 apikey
						'api_secret': api_secret,//请填写你的api_secret
					},
					success: function (res) {
						console.log(res);
						if (res.statusCode != 200) {
							wx.showModal({
								title: '提示',
								content: '上传失败',
								showCancel: false
							})
							return;
						}
						var obj = JSON.parse(res.data); //转换成json格式不然解析不了
						
						if (obj['faces'][0] == null || obj['faces'][0] == '') { //根据反回的数据判断是是否检测到人脸
							wx.showModal({
								title: '提示',
								content: '检测不到人脸',
								showCancel: true
							})
							return;
						} else {
							that.setData({
								face_token: obj['faces'][0]['face_token'],//获取得到的人脸标识
							});
							
							wx.request({
								url:'https://api-cn.faceplusplus.com/facepp/v3/faceset/addface',
								method: 'POST',
								data: {
									'api_key': api_key,//请填写你创建的 apikey
									'api_secret': api_secret,//请填写你的api_secret
									'face_tokens': that.data.face_token,
									'outer_id': outer_id, //脸集唯一标识，就是上面我们创建的脸集
								},
								header: {
									'content-type': 'application/x-www-form-urlencoded',
								},
								success(res) {
									if(res.statusCode==200){
										if(res.data.face_added > 0){
											//把新注册的人脸与脸集进行对比获得confidence值 这个值大于80我们就认为人脸集中有这个人
											wx.request({
												url: 'https://api-cn.faceplusplus.com/facepp/v3/search',//接口
												method: 'post',
												data: {
													'api_key': api_key,//请填写你创建的 apikey
													'api_secret': api_secret,//请填写你的api_secret
													'face_token': that.data.face_token,//传入face_token和脸集中的数据比对
													'outer_id': outer_id, //脸集唯一标识，就是上面我们创建的脸集
													'return_result_count': '1'//返回一条匹配数据，范围1-5
												},
												header: {
													'content-type': 'application/x-www-form-urlencoded',
												},
												success(res) {
													console.log('res-----------',res)
													console.log('---------',res.data)
											
													//var obj = JSON.parse(res.data);
													that.setData({
														confidence: res.data['results'][0]['confidence'] //对比得到的可信值
													});
													if (that.data.confidence < 80) { //可信值小于80我们就把他加到脸集中
														wx.showModal({
															title: '提示',
															content: '不是本人',
															showCancel: false
														})
														//把face_token添加到脸集中
														// wx.request({
														// 	url: 'https://api-cn.faceplusplus.com/facepp/v3/faceset/addface',//添加到脸集的接口
														// 	method: 'post',
														// 	data: {
														// 		'api_key': 'KIOpCvIPTeD_ntL9Kb5V6v6S9OTdK6-N',//请填写你创建的 apikey
														// 		'api_secret': 'hpkPFmLRfTHT0gjQZm2gMa-6AfIzNdh0',//请填写你的api_secret
														// 		'face_tokens': that.data.face_token,//把上请求得到的人脸标识添加到脸集中
														// 		'outer_id': '15185672300',
														// 	},
														// 	header: {
														// 		'content-type': 'application/x-www-form-urlencoded',
														// 	},
														// 	success(res) {
														// 		console.log(res.data)
														// 		wx.showModal({
														// 			title: '提示',
														// 			content: '注册成功',
														// 			showCancel: false
														// 		 })
														// 	},
														// 	fail: function (e) {
														// 		wx.showModal({
														// 			title: '提示',
														// 			content: '注册失败',
														// 			showCancel: false
														// 		})
														// 	},
														// 	complete: function () {
														// 		wx.hideToast();//隐藏提示
														// 	}
														// })
													} else {
													 //  wx.showModal({
														// title: '提示',
														// content: '你已经注册过了',
														// showCancel: false
													 //  })
														 wx.showModal({
															title: '提示',
															content: '认证成功',
															showCancel: false
														 })
													}
												},
												fail: function (e) {
													wx.showModal({
														title: '提示',
														content: '校验未知错误',
														showCancel: false
													})
												},
												complete: function () {
													wx.hideToast();
												}
											})
										}else{
											console.log('添加脸集数为：0')
										}
									}else{
										console.log(res.statusCode,res.data.error_message)
									}
								}
							})
						}
					},
					fail: function (e) {
						console.log(e);
						wx.showModal({
							title: '提示',
							content: '上传失败',
							showCancel: false
						})
					},
					complete: function () {
						wx.hideToast(); //隐藏Toast
					}
				})
			}
		})
	},
	
	//登录验证
	verify: function () {
	  var that = this
	  const ctx = wx.createCameraContext(); //创建相机上下文
	  ctx.takePhoto({
		quality: 'high',
		success: (res) => {
		  this.setData({
			src: res.tempImagePath //相机拍照得到照片的地址
		  })
		  wx.showToast({
			icon: "loading",
			title: "正在上传中。。。"
		  });
		  wx.uploadFile({ //上传照片和脸集中的照片对比并得出结果

			url: 'https://api-cn.faceplusplus.com/facepp/v3/search', //对比人脸接口
			filePath: that.data.src,//上传相机拍照得到照片的地址
			name: 'image_file',
			header: {
			  'content-type': 'application/x-www-form-urlencoded'
			},
			formData: {
			  'api_key': api_key,//请填写你创建的 apikey
			  'api_secret': api_secret,//请填写你的api_secret
			  'outer_id': outer_id, //脸集唯一标识
			  'return_result_count': '1',//只反回一条匹配数据

			},
			success: function (res) {

			  if (res.statusCode != 200) {
				wx.showModal({
				  title: '提示',
				  content: '上传失败',
				  showCancel: false
				})
				return;
			  }
			  console.log(res)
			  var obj = JSON.parse(res.data);//转成json对象
			  if (obj['faces'][0] == null || obj['faces'][0] == '') {//判断是否检测到人脸
				wx.showModal({
				  title: '提示',
				  content: '未检测到人脸',
				  showCancel: false
				})
				return;
			  } else {
				that.setData({
				  confidence: obj['results'][0]['confidence'] //可信值
				});

				console.log(obj['results'][0]['confidence']);

				if (that.data.confidence >= 80) { //可信值大于80就认为是同一个人

				  wx.showModal({
					title: '提示',
					content: '验证通过',
					showCancel: false
				  })
				  return;
				} else {
				  wx.showModal({
					title: '提示',
					content: '验证失败',
					showCancel: false
				  })
				  return;
				}
			  }
			},
			fail: function (e) {
			  console.log(e);
			  wx.showModal({
				title: '提示',
				content: '上传失败',
				showCancel: false
			  })
			},
			complete: function () {
			  wx.hideToast(); //隐藏Toast
			}
		  })
		}
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