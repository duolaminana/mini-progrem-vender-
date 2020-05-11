module.exports = {
  // 请求域名 格式： https://您的域名
  HTTP_REQUEST_URL:'https://vendor-platform-test.sun-hyt.com',
  // 请求域名 格式： https://您的域名(上传文件)
  HTTP_REQUEST_UPLOAD:'https://vendor-miniprogram-aliy.sun-hyt.com',
  // Socket链接 暂不做配置
  WSS_SERVER_URL:'',
  // 请求头
  HEADER:{
    'content-type': 'application/json'
  },
  // 上传请求name
  UPLOAD_NAME: 'multipartFile',
  // PUT请求
  HEADER_PUT:{
    'content-type': 'application/x-www-form-urlencoded'
  },
  // Socket调试模式
  SERVER_DEBUG:true,
  // 心跳间隔
  PINGINTERVAL:3000,

  // 回话密钥名称 请勿修改此配置
  TOKENNAME: 'Authori-zation',
}