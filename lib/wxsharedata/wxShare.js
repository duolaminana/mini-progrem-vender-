module.exports = {
    title: '环阳通云自购平台提供',
    path: '/pages/index/index?memberId='+(getApp().globalData.wxUserInfo ? getApp().globalData.wxUserInfo.id : ''),
    imageUrl: '/images/icon/logo.png'
}