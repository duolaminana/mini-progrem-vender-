/**
 * 过年
 * */

const protocol = 'http'

const www = 'vendor-platform-test.sun-hyt.com'
const uploadFile = 'vendor-miniprogram-aliy.sun-hyt.com'

const position = 'position'
const order = 'order'
const auth = 'auth'
const product = 'product'
const pay = 'pay'
const face = 'face'
const mqtt = 'mqtt'

const miniProgram = 'miniProgram'
const wxAppApi = 'wxAppApi'
const loginUser = 'loginUser'
const machineRoad = 'machineRoad'
const productChannel = 'productChannel'
const memberProfit = 'memberProfit'
const cardMessage = 'cardMessage'

module.exports = {
    host_position: `${protocol}://${www}/${position}/${miniProgram}/`,
    host_order: `${protocol}://${www}/${order}/${wxAppApi}/`,
    host_auth: `${protocol}://${www}/${auth}/${loginUser}/`,
    host_device: `${protocol}://${www}/${position}/${machineRoad}/`,
    host_product: `${protocol}://${www}/${product}/${productChannel}/`,
    host_pay: `${protocol}://${www}/${pay}/`,
    host_face: `${protocol}://${uploadFile}/${face}/`,
    host_memberProfit: `${protocol}://${www}/${order}/${memberProfit}/`,
    host_cardMessage: `${protocol}://${www}/${mqtt}/${cardMessage}/`,
}