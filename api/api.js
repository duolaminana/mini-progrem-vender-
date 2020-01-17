import request from "./../utils/request.js";

/**
 * 获取用户信息
 * 
*/
export function getMemberInfo(pid){
  return request.get("/order/wxAppApi/getMemberInfo",{jsCode: getApp().globalData.code,pid: pid || null},{ noAuth : true });
}

/**
 * 同步用户信息
 * 
*/
export function synMemberInfo(){
  return request.put("/order/wxAppApi/synMemberInfo",{
    encryptedData: getApp().globalData.setting.encryptedData,
    iv: getApp().globalData.setting.iv,
    memberId: getApp().globalData.wxUserInfo.id
  },{ noAuth : true });
}

/**
 * 获取个人信息
 * 
*/
export function queryPersonalInfo(){
  return request.get("/order/wxAppApi/queryPersonalInfo",{openId: getApp().globalData.wxUserInfo.appOpenId},{ noAuth : true });
}

/**
 * 绑定用户手机号码
 * 
*/
export function setBindPhone(data){
  return request.post("/order/wxAppApi/memberBindingPhone",{
    bindingType: 0,
    encryptedData: '',
    iv: '',
	code: '',
    memberId : getApp().globalData.wxUserInfo.id,
	jsCode: '',
    phone : '',
	...data
  },{ noAuth : true });
}

/**
 * 绑定用户身份证
 * 
*/
export function setBindCard(cardNo){
  return request.get("/order/wxAppApi/MemberBindingCard",{memberId : getApp().globalData.wxUserInfo.id,cardNo: cardNo},{ noAuth : true });
}

/**
 * 获取热销商品
 * 
*/
export function getGoodsHotData(){
  return request.get("/position/miniProgram/queryHotProduct",{latitude: getApp().globalData.myLocation[0],longitude: getApp().globalData.myLocation[1]},{ noAuth : true });
}

/**
 * 查询附近设备
 * 
*/
export function queryNearbyDevice(data = {}){
  return request.post("/position/miniProgram/findNearByMachine",{
    laytitude: getApp().globalData.myLocation[0],
    longitude: getApp().globalData.myLocation[1],
	memberId: getApp().globalData.wxUserInfo.id,
	...data
  },{ noAuth : false });
}

/**
 * 获热商品对应的设备
 */
export function queryHotMachineProduct(code){
	return request.post('/position/miniProgram/queryHotMachineProduct', {
		latitude: getApp().globalData.myLocation[0],
		longitude: getApp().globalData.myLocation[1],
		memberId: getApp().globalData.wxUserInfo.id,
		maxDistance: 10000,
		productCode: code
	}, { noAuth : true });
}

/**
 * 是否购买过的
 */
export function memberFindOrderByMachCode(code){
	return request.get('/order/wxAppApi/memberFindOrderByMachCode', {machCode:code,memberId:getApp().globalData.wxUserInfo.id}, { noAuth : true });
}

/**
 * 获取对应设备商品详情
 */
export function findProductChannel(data){
	return request.post('/product/productChannel/findProductChannel', data, { noAuth : true });
}

/**
 * 获取对应设备商品
 */
export function getDeviceGoods(code){
	return request.get('/position/machineRoad/goodsyn', {machineCode: code,isNeedType: true}, { noAuth : true });
}

/**
 * 支付成功页面获取返现
 */
export function returnMoney(data) {
  return request.get(`/pay/getRebate`, data, { noAuth : true });
}

/**
 * 支付成功页面领取返现或积分
 */
export function pullMoneyIntegral(No, num, val) {
  return request.get(`/order/wxAppApi/memberGetProfit`, { 
	  memberId:getApp().globalData.wxUserInfo.id,
	  orderNo: No,
	  profitType: num,
	  number: val
	}, { noAuth : true });
}

/**
 * 可用返现数据请求
 */
export function useReturnMoney(code){
	return request.post('/order/memberProfit/findMemberProfitByMemberId?memberId='+getApp().globalData.wxUserInfo.id+'&channelId='+(code || getApp().globalData.channelId), {memberId: getApp().globalData.wxUserInfo.id,channelId: code || getApp().globalData.channelId}, { noAuth : true });
}

/**
 * 生成订单
 */
export function createPayByWxMini(data){
	return request.post('/pay/createPayByWxMini', {
		memberId: getApp().globalData.wxUserInfo.id,
		openid: getApp().globalData.wxUserInfo.appOpenId,
		machineCode: getApp().globalData.machineCode,
		...data
	}, { noAuth : true });
}

/**
 * 打开扫描身份证的设备
 */
export function cardMessageEvoke(code){
	return request.get('/mqtt/cardMessage/evoke', {machineCode: getApp().globalData.machineCode}, { noAuth : true });
}

/**
 * 获取身份证信息
 */
export function cardMessageGain(code){
	return request.get('/mqtt/cardMessage/gain', {machineCode: getApp().globalData.machineCode}, { noAuth : true });
}

/**
 * 获取验证码
 */
export function wxAppSmsCode(phone){
	return request.post(`/auth/loginUser/wxAppSmsCode?memberId=${getApp().globalData.wxUserInfo.id}&phone=${phone}`,{},{ noAuth : true })
}

/**
 * 查询设备信息
 */
export function queryMachine(code){
	return request.get(`/position/miniProgram/queryMachine`,{machineCode:code},{ noAuth : true })
}

/**
 * 请求大分类商品
 */
export function getGoodsyn(data){
	return request.get(`/position/machineRoad/goodsyn`,data,{ noAuth : true })
}

/**
 * 人证核验
 */
export function witnessCheck(data){
	return request.upload(`/face/witnessCheck`, data, { noAuth : true })
}

/**
 * 人脸验证
 */
export function checkFace(data){
	return request.upload(`/face/checkFace`, data, { noAuth : true })
}

/**
 * 出货状态
 */
export function outStatus(data){
	return request.get(`/mqtt/miniProgram/outStatus`, data, { noAuth : true })
}

/**
 * 查询会员待取货的订单
 */
export function getCodeClaimGoods(){
	return request.get(`/order/wxAppApi/queryPendingProduct`, {memberId: getApp().globalData.wxUserInfo.id}, { noAuth : true })
}

/**
 * 获取订单记录
 */
export function queryOrderDetailes(data){
	return request.post(`/order/wxAppApi/queryOrderDetailes`, {memberId: getApp().globalData.wxUserInfo.id}, { noAuth : true })
}

/**
 * 获取环保袋限免购买过的数量
 */
export function findMemberFreeProduct(str){
	return request.post(`/order/wxAppApi/findMemberFreeProduct?memberId=${getApp().globalData.wxUserInfo.id}&productCodes=${str}`, {memberId: getApp().globalData.wxUserInfo.id,productCodes: str}, { noAuth : true })
}

/**
 * 修改昵称
 */
export function updateNickName(name){
	return request.post(`/order/wxAppApi/updateNickName`, {id: getApp().globalData.wxUserInfo.id,"nickName": name}, { noAuth : true })
}

/**
 * 查询好友列表
 */
export function getFriendList(){
	return request.get(`/order/wxAppApi/queryFriendList`, {memberId: getApp().globalData.wxUserInfo.id}, { noAuth : true })
}

/**
 * 获取返现列表
 */
export function postRebateList(data){
	return request.post(`/order/wxAppApi/queryRebate`, {
		memberId: getApp().globalData.wxUserInfo.id,
		  // "pageNum": 0,
		  // "pageSize": 0
	}, { noAuth : true })
}

/**
 * 获取积分列表
 */
export function postIntegraList(data){
	return request.post(`/order/wxAppApi/queryIntegralRebate`, {
		memberId: getApp().globalData.wxUserInfo.id,
		  // "pageNum": 0,
		  // "pageSize": 0
	}, { noAuth : true })
}