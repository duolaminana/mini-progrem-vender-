// pages/index/yqfriend/index.js
const {app,$,cusAppData} = require('../../../utils/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...cusAppData,
    hdData: {
        ...cusAppData,
      content: {
        text: '邀请好友',
        style: {
          color: 'white'
        }
      },
      left: {
        class: 'goback'
      }
    },
  },
  onShareAppMessage: function (res) { // 分享触发函数
    // if (res.from === 'button') {}
    return {
      title: '环阳通云自购平台提供',
      path: '/pages/index/index?memberId='+( getApp().globalData.wxUserInfo ? getApp().globalData.wxUserInfo.id : '' ),
      imageUrl: '/images/icon/logo.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})