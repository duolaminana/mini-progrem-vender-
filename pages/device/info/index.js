// pages/device/info/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')

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
        text: '设备详情'
      },
      left: {
        class: 'goback-black'
      }
    },
    footButtonData: {
      icon: '/static/img/icon/go_addr.png',
      text: '去这里',
      click: 'goThatAddress'
    },
    barArr: [
      {
        note: '全部'
      },
      {
        note: '黄鹤楼'
      },
      {
        note: '利群'
      },
      {
        note: '冬虫夏草'
      },
      {
        note: '好日子'
      },
      {
        note: '好日子'
      },
      {
        note: '好日子'
      },
      {
        note: '好日子'
      }
    ],
    barCurrent: 0
  },

  barAir (e) { // 导航事件
    this.setData({
      barCurrent: e.currentTarget.dataset.type
    })
  },

  goThatAddress () {
    // wx.chooseLocation({ // 用于搜索位置的地图
    //   success: function (res) {
    //   // success
    //   console.log(res,"location")
    //   console.log(res.name)
    //   console.log(res.latitude)
    //   console.log(res.longitude)
    //   },
    //   fail: function () {
    //   // fail
    //   },
    //   complete: function () {
    //   // complete
    //   }
    // })
    
    if(app.globalData.myLocation)
    wx.openLocation({
        latitude:app.globalData.myLocation[0],
        longitude:app.globalData.myLocation[1]
    })
    else
    require('../../../utils/tpl/wxLocation').call(this, (res)=>{
        wx.openLocation({
            latitude:res[0],
            longitude:res[1]
        })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ // 商品导航设置
      barArr:[
        {
          note: '全部'
        },
        {
          note: '黄鹤楼'
        },
        {
          note: '利群'
        },
        {
          note: '冬虫夏草'
        },
        {
          note: '双喜'
        },
        {
          note: '好日子'
        },
        {
          note: '五叶神'
        }
      ]
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