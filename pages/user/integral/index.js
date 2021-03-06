// pages/user/integral/index.js
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
        text: '我的积分'
      },
      left: {
        class: 'goback-black'
      }
    },
    tpl_ibData: {
      number: 96,
      classify: 'jifen',
      array: [
        {
          time: '2019-10-31 16:06:05',
          title: '购烟',
          note: '+2'
        },
        {
          time: '2019-10-31 16:06:05',
          title: '购烟',
          note: '+2'
        },
        {
          time: '2019-10-31 16:06:05',
          title: '购烟',
          note: '+2'
        }
      ]
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})