//app.js // version 9.6.4 // wx3eff7b04dd4cf910
const host = require('./utils/config/host')
const request = require('./utils/request/request')
const CartStockApi = require('./libs/storeCart/api')
import {
  HTTP_REQUEST_URL
} from './config'
import {
  getMemberInfo
} from './api/api'
import appGetMemberInfo from './utils/getMemberInfo'

App({
  onLaunch: function(option) {
    var that = this;
    if (option.query.hasOwnProperty('scene')) {
      switch (option.scene) {
        //扫描小程序码
        case 1047:
          that.globalData.scene = option.scene;
          break;
          //长按图片识别小程序码
        case 1048:
          that.globalData.scene = option.scene;
          break;
          //手机相册选取小程序码
        case 1049:
          that.globalData.scene = option.scene;
          break;
          //直接进入小程序
        case 1001:
          that.globalData.scene = option.scene;
          break;
      }
    }
    console.log(option)
    appGetMemberInfo.call(option.query, function(res) {
      console.log('用户信息:', res)
      if (that.wxLoginGetMemberInfoResponseCallback) {
        that.wxLoginGetMemberInfoResponseCallback(res)
      }
    })

    that.CartStockApi = new CartStockApi() // 购物车仓库
    that.CartStockApi_Dummy = new CartStockApi() // 虚拟购物车仓库
  },
  onShow(options) {
    // Do something when show.
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg) {
    console.log(msg)
  },
  globalData: {
    url: HTTP_REQUEST_URL,
    code: undefined,
    setting: null,
    unauthorized: false, // 未授权


    interval: 10, // display:none变成display:block时长 (毫秒)
    duration: 400, // 动画过渡时长 (毫秒)

    // 适配屏幕头部的高度=>获取微信右上角胶囊信息.根据胶囊位置与高度决定头部的高度等
    rectBottom: wx.getMenuButtonBoundingClientRect().bottom + 8 + 'px',
    rectHeight: wx.getMenuButtonBoundingClientRect().height + 16 + 'px',


    isPayment_state: false,

    // 当前用户信息
    User_location: false, // 定位
    User_isSyn: false, // 是否同步过小程序
    User_isBindingPhone: false, // 是否有手机号
    User_isBindingCard: false, // 是否有绑定身份证等
    wxUserInfo: null, // 会员信息
    orderNO: [],

    // 当前设备信息（扫描购买）
    DEVICE_STATUS: 1, // 设备状态 1激活 0未激活
    NETWORK_STATUS: 1, // 机器网络状态 1在线 0离线
    machineCode: '', // 设备编号/ID
    channelId: '', // 设备渠道ID
    shippingWay: null, // 出货方式
  }
})