const host = require('../../../utils/config/host')
const request = require('../../../utils/request/request')

module.exports = function (res) {
	/**
	 * 会员绑定手机号
	 * @param {Object} res  
	 * @param {String} res.encryptedData 
	 * @param {String} res.iv 
	 * @param {String} res.code 小程序临时登录凭证
	 * @param {Number || String} res.memberId 会员ID
	 * */
	wx.login({
		success: resf => {
			request.postMask(`${host.host_order}memberBindingPhone`,{
				jsCode: resf.code,
				bindingType: res.type,
				encryptedData: res.encryptedData,
				iv: res.iv,
				code : res.code?res.code:'',
				memberId : res.id,
				phone : res.phone?res.phone:'',
			}).then(data => {
				console.log('-----绑定手机号接口调用成功',data)
				res.success?res.success(data):void(0)
			})
		}
	})
}