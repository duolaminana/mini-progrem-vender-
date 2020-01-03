import request from "./../utils/request.js";

/**
 * 获取用户信息
 * 
*/
export function getMemberInfo()
{
  return request.get("/order/wxAppApi/getMemberInfo",{
    jsCode: getApp().globalData.code
  },{ noAuth : true });
}

/**
 * 获取个人信息
 * 
*/
export function queryPersonalInfo()
{
  return request.get("/order/wxAppApi/queryPersonalInfo",{
    openId: getApp().globalData.wxUserInfo.appOpenId
  },{ noAuth : true });
}

/**
 * 同步用户信息
 * 
*/
export function synMemberInfo()
{
  return request.put("/order/wxAppApi/synMemberInfo",{
    encryptedData: getApp().globalData.setting.encryptedData,
    iv: getApp().globalData.setting.iv,
    memberId: getApp().globalData.wxUserInfo.id
  },{ noAuth : true });
}

/**
 * 绑定用户手机号码
 * 
*/
export function setBindPhone(data)
{
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
export function setBindCard(cardNo)
{
  return request.get("/order/wxAppApi/MemberBindingCard",{
    memberId : getApp().globalData.wxUserInfo.id,
	cardNo: cardNo
  },{ noAuth : true });
}

/**
 * 获取热销商品
 * 
*/
export function getGoodsHotData()
{
  return request.get("/position/miniProgram/queryHotProduct",{
    latitude: getApp().globalData.myLocation[0],
    longitude: getApp().globalData.myLocation[1]
  },{ noAuth : true });
}

/**
 * 查询附近设备
 * 
*/
export function queryNearbyDevice(data = {})
{
  return request.post("/position/miniProgram/findNearByMachine",{
    latitude: getApp().globalData.myLocation[0],
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
	return request.get('/order/wxAppApi/memberFindOrderByMachCode', {
		machCode:code,
		memberId:getApp().globalData.wxUserInfo.id
	}, { noAuth : true });
}

/**
 * 获取对应设备商品
 */
export function getDeviceGoods(code){
	return request.get('/position/machineRoad/goodsyn', {
		machineCode: code,
		isNeedType: true
	}, { noAuth : true });
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
export function pullMoneyIntegral(No, num) {
  return request.get(`/wxAppApi/memberGetProfit`, { 
	  memberId:getApp().globalData.wxUserInfo.id,
	  orderNo: No,
	  profitType: num
	}, { noAuth : true });
}

/**
 * 打开扫描身份证的设备
 */
export function cardMessageEvoke(code){
	return request.get('/mqtt/cardMessage/evoke', {
		machineCode: getApp().globalData.machineCode
	}, { noAuth : true });
}

/**
 * 获取身份证信息
 */
export function cardMessageGain(code){
	return request.get('/mqtt/cardMessage/gain', {
		machineCode: getApp().globalData.machineCode
	}, { noAuth : true });
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