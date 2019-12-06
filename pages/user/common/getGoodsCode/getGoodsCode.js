// component/getGoodsCode/getGoodsCode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer (e) {
        // console.log(e)
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
    tagClose () {
      // wx.showTabBar()
      this.setData({
        show: false
      })
    }
  }
})
