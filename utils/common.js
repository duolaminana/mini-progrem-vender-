module.exports = {
    getUrlParam: function(urlstr){
		/**
		 * 获取url问好后面的参数,将参数转成对象形式
		 * @param { String } urlstr ---- url
		 * @return { Object } obj ---- 参数的对象形式
		 * */
		let wh_idx = urlstr.indexOf('?')
		if(wh_idx == -1) return {}
		let paramStr = urlstr.substring(wh_idx + 1)
		let paramArr = paramStr.split("&")
		let obj = {}
		for(let item of paramArr){
			let itemArr = item.split("=")
			obj[itemArr[0]] = itemArr[1]
		}
		return obj
	},
	getArrItem: function(arrData, key, val){
		// 查找返回单个
		for(let item of arrData){
			if(item[key] == val)
			return item
		}
		return {}
	},
	getArrItemByIdx: function(arrData, idx){
		// 查找返回单个
		for(let [index, item] of arrData.entries()){
			if(index == idx)
			return item
		}
		return {}
	},
	getArrItems: function(arrData, key, val){
		// 查找返回多个
		let arr = []
		for(let item of arrData){
			if(item[key] == val)
			return arr.push(item)
		}
		return arr
	},
	ZOOM_IMG_FNC: function(){
		/**
		 * 自定义图片缩放
		 * width=100% => width>height 
		 * height=100% => height>width 
		 * width/height=100% => height=width 
		 * 
		 * 
		 * &&& => wxss
		 * .pic{
				width: XXrpx;
				height: XXrpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.pic image{
				height: 100%;
				width: 100%;
			}
		 * 
		 * &&& => wxml
		 * <view class="pic">
				<image
				src="{{item.machineImageAddress}}"
				bindload="imagesOnload"
				data-cssimgkey="cssimgkey" 
				data-cssimgidx="{{idx}}" 
				data-cssimgidxTop="{{index}}" 
				style="{{wxsCom.objToString(cssimgkey[index])}}"
				/>
			</view>
		 * 
		 * &&& => js
		 * imagesOnload: $.ZOOM_IMG_FNC(),
		 * 
		 * @param {Array} cssimgkey || ZOOM_IMG
		 * @param {Number} idx || 0 ----------------cssimgidx
		 * @param {Number} index 二级分(父级) -------------------cssimgidxtop
		 * @param {Function} imagesOnload
		 * */
		return function(e){
			let key = e.currentTarget.dataset.cssimgkey || 'ZOOM_IMG'
			let idx = e.currentTarget.dataset.cssimgidx || 0
			let index = e.currentTarget.dataset.cssimgidxtop
			let width = e.detail.width
			let height = e.detail.height
			
			let value = width == height ? {
					width:'100%',
					height:'100%'
				} : width < height ? {
					width:(e.detail.width / e.detail.height * 100) + '%',
					height:'100%'
				} : {
					width:'100%',
					height:(e.detail.height / e.detail.width * 100) + '%'
				}
			
			let arr = this.data[key] || []
			if(index || index == 0){
				arr[index] = arr[index] || []
				arr[index][idx] = value
			}else{
				arr[idx] = value
			}
			
			this.setData({
				[key]: arr
			})
		}
	},
}