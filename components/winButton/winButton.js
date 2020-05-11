// components/winButton/winButton.js
const { $ } = require('../../utils/public')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stylec:{
      type: String,
      value: 'fixed address',
      observer(newVal,oldVal,path){
        // console.log(newVal)
		/**
		 * fixed
		 * absolute
		 * address
		 * pay
		 * auto
		 * */
      }
    },
    icon:{
      type: String,
      value: '',
      observer(newVal,oldVal,path){
        // console.log(newVal)
      }
    },
    text:{
      type: String,
      value: '确定',
      observer(newVal,oldVal,path){
        // console.log(newVal)
      }
    },
    type:{
      type: String,
      value: 'free', // free scan tap
      observer(newVal,oldVal,path){
        // console.log(newVal)
      }
    },
    to:{
      type: String,
      value: '',
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
    touchTo () {
      switch(this.data.type)
      {
        case 'scan':{
          wx.scanCode({
            onlyFromCamera: false,
			      // scanType: 'WX_CODE',
            success: res =>{
				      console.log('winButton组件扫码结果:',res)
              if(res.path)
                wx.navigateTo({
                  url: `/${res.path}`
                })
              else
                wx.showModal({
                  title: '系统提示',
                  content: '无效二维码!',
                  showCancel: false,
                  success: res => {}
                })
            },
            fail: res =>{
              wx.showToast({
				  title: '扫码摄像头已关闭',
				  icon: 'none',
				  duration: 1200
              })
            }
          })
          break;
        }
		case 'tap':{
			this.triggerEvent('touch', { click: 'ok' })
			break;
		}
        default:
          wx.navigateTo({
            url: this.to
          })
      }
    }
  }
})
