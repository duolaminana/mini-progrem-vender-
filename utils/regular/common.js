module.exports = {
    reg (val) { // 验证手机号码
		return /^1[3456789]\d{9}$/.test(val) ? true : false
	},
	trim (val) { // 去掉两边的空格
		return val.replace(/(^\s*)|(\s*$)/g, "")
	},
	trimL (val) { // 去掉左边的空格
		return val.replace(/(^\s*)/g,"")
	},
	trimR (val) { // 去掉右边的空格
		return val.replace(/(\s*$)/g,"")
	},
	trimAll (val) { // 去掉所有空格
		return val.replace(/\s/g, "")
	}
}