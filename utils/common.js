module.exports = {
    getUrlParam: function(urlstr){
		/**
		 * 获取url问好后面的参数,将参数转成对象形式
		 * @param { String } urlstr ---- url
		 * @return { Object } paramObj ---- 参数的对象形式
		 * */
		let wh_idx = urlstr.indexOf('?')
		if(wh_idx == -1) return {}
		let paramStr = urlstr.substring(wh_idx + 1)
		let paramArr = paramStr.split("&")
		let paramObj = {}
		for(let item of paramArr){
			let itemArr = item.split("=")
			paramObj[itemArr[0]] = itemArr[1]
		}
		return paramObj
	}
}