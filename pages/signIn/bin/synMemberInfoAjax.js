const host = require('../../../utils/config/host')
const request = require('../../../utils/request/request')

module.exports = function (res) {
	/**
	 * 同步会员信息
	 * @param {Object} res  
	 * @param {String} res.encryptedData 
	 * @param {String} res.iv 
	 * @param {Number || String} res.memberId 会员ID
	 * */
	request.ajaxMask({
		url: `${host.host_order}synMemberInfo`,
		type: 'PUT',
		data: {
			encryptedData: res.encryptedData,
			iv: res.iv,
			memberId: res.id
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		success (data) {
			// console.log('同步会员成功',data)
			res.success?res.success(data):void(0)
		}
		// complete () {}
	})
}