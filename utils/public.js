const app = getApp()
const host = require('./config/host')
const timer = require('./calculate/timer')
const getLocation = require('./appLocation/getLocation')
const autoGetUserInfo = require('./autoGetUserInfo/autoGetUserInfo')
const request = require('./request/request')
const reg = require('./regular/common')
const common = require('./common')


// 用于引入页面的data的公共数据 ...cusAppData
const cusAppData = {
    __hdHeight__: app.globalData.rectBottom,
    __hdbodyHeight__: app.globalData.rectHeight
}

module.exports = {
    app: app,
    cusAppData: cusAppData,
    $: Object.assign(host, timer, getLocation, request, autoGetUserInfo, reg, common)
}