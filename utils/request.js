import { HTTP_REQUEST_URL , HEADER , HEADER_PUT , UPLOAD_NAME , HTTP_REQUEST_UPLOAD } from './../config.js';
/**
 * 发送请求
 */
export default function request(api, method, data, {noAuth = false, noVerify = false})
{
  return new Promise((reslove, reject) => {
	if(method == 'upload'){
		wx.uploadFile({
			url: HTTP_REQUEST_UPLOAD + api,
			filePath: data.filePath,
			name: UPLOAD_NAME,
			formData: data.data,
			success:(res)=>{
				if (res.statusCode != 200) {
					reject('上传失败')
					return
				}
				res.data=JSON.parse(res.data)
				if(res.data.code == 200){
					reslove(res.data, res);
				}else{
					reject(res.data.msg || '系统错误');
				}
			},
			fail: (res)=> {
				reject('上传请求失败!');
			}
		})
		return
	}
    wx.request({
      url: HTTP_REQUEST_URL + api,
      method: method || 'GET',
      header: method == 'put' ? HEADER_PUT : HEADER,
      data: data || {},
      success: (res) => {
        if (noVerify)
          reslove(res.data, res);
        else if (res.data.code == 200)
          reslove(res.data, res);
        else
          reject(res.data.msg || '系统错误');
      },
      fail: (msg) => {
        reject('请求失败');
      }
    })
  });
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect', 'upload'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
});
