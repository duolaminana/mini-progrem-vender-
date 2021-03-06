function argumentsToparamsArr(){
	/**
	 * 转换传入的参数
	 * @param {Array}  arr
	 * [url,data,header,complete]
	 * [string,object,string,function]
	 * */
	if(this.length == 1)
	return [this[0], {}, 'application/json;charset=UTF-8', function(){}]
	else if(this.length == 2)
	if(typeof this[1] == 'string')
	return [this[0], {}, this[1], function(){}]
	else if(typeof this[1] == 'function')
	return [this[0], {}, 'application/json;charset=UTF-8', this[1]]
	else
	return [this[0], this[1], 'application/json;charset=UTF-8', function(){}]
	else if(this.length == 3)
	if(typeof this[1] == 'string')
	return [this[0], {}, this[1], this[2]]
	else
	if(typeof this[2] == 'string')
	return [this[0], this[1], this[2], function(){}]
	else
	return [this[0], this[1], 'application/json;charset=UTF-8', this[2]]
	else
	return [this[0], this[1], this[2], this[3]]
}

// Request
function thisRequest(resolve, reject, type, mask){
	if(mask && mask=='mask')
	wx.showLoading({
		title: '加载中',
		mask: true
	})
	wx.request({
		url: this[0],
		method: type,
		data: this[1],
		header: {
			'content-type': this[2]
		},
		success (res) {
			if(res.statusCode != 200){
				let msg = res.data.message || res.data.msg || '微信访问失败!'
				reject(msg)
				wx.showModal({
					title: `微信提示${res.statusCode}`,
					content: msg,
					showCancel: false,
					success (res) {}
				})
				return
			}
			if(res.data.code != 200){
				let msg = res.data.message || res.data.msg || '系统访问失败!'
				reject(msg)
				wx.showModal({
					title: `系统提示${res.data.code}`,
					content: msg,
					showCancel: false,
					success (res) {}
				})
				return
			}
			resolve(res.data.result)
		},
		fail(res) {
			reject()
			wx.showModal({
				title: `系统提示`,
				content: `访问错误!\n${res.errMsg}`,
				showCancel: false,
				success (res) {}
			})
		},
		complete: (res)=> {
			if(mask && mask=='mask') wx.hideLoading()
			this[3](res)
		}
	})
}

function thisRequest2(job, resolve, reject, mask){
	if(mask && mask=='mask')
	wx.showLoading({
		title: '加载中',
		mask: true
	})
	wx.request({
		url: job.url,
		method: job.type,
		data: job.data?job.data:{},
		header: Object.assign({'content-type': 'application/json;charset=UTF-8'}, job.header?job.header:{}),
		success (res) {
			if(res.statusCode == 200){
				if(res.data.code == 200){
					job.success(res.data.result)
					resolve(res.data.result)
				}else
				wx.showModal({
					title: '系统提示',
					content: res.data.message,
					showCancel: false,
					success (res) {}
				})
			}else
			console.log('微信返回statusCode: ',res.statusCode)
		},
		fail(res) {
			console.log('请求fail错误: ',res)
			job.error?job.error(res):void(0)
		},
		complete(res) {
			if(mask && mask=='mask') wx.hideLoading()
			job.complete?job.complete(res):void(0)
		}
	})
}

/**
 * 001
 * */
function get(){
	return new Promise((resolve, reject) => {
		thisRequest.call(argumentsToparamsArr.call(arguments), resolve, reject, 'GET')
	})
}
function post(){
	return new Promise((resolve, reject) => {
		thisRequest.call(argumentsToparamsArr.call(arguments), resolve, reject, 'POST')
	})
}
function ajax(){
	return new Promise((resolve, reject) => {
		thisRequest2(arguments[0], resolve, reject)
	})
}

/**
 * 002	mask
 * */
function getMask(){
	return new Promise((resolve, reject) => {
		thisRequest.call(argumentsToparamsArr.call(arguments), resolve, reject, 'GET', 'mask')
	})
}
function postMask(){
	return new Promise((resolve, reject) => {
		thisRequest.call(argumentsToparamsArr.call(arguments), resolve, reject, 'POST', 'mask')
	})
}
function ajaxMask(){
	return new Promise((resolve, reject) => {
		thisRequest2(arguments[0], resolve, reject, 'mask')
	})
}

/**
 * mask 加载弹框
 * */
module.exports = {
    get, post, ajax, getMask, postMask, ajaxMask
}