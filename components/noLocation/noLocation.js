// components/noLocation/noLocation.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	show:{
	  type: Boolean,
	  value: true,
	  observer(newVal,oldVal,path){
	    // console.log(newVal)
	  }
	},
	text:{
	  type: String,
	  value: '定位服务暂未开启，请先开启定位服务',
	  observer(newVal,oldVal,path){
	    // console.log(newVal)
	  }
	},
	height:{
	  type: String || Number,
	  value: 200,
	  observer(newVal,oldVal,path){
	    // console.log(newVal)
	  }
	},
	size:{
		type: String || Number,
		value: 28,
		observer(newVal,oldVal,path){
		  // console.log(newVal)
		}
	},
	icosize:{
		type: String || Number,
		value: 118,
		observer(newVal,oldVal,path){
		  // console.log(newVal)
		}
	}
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
