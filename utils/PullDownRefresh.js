import { appGetMemberInfo } from './getMemberInfo.js';
import { loopLocation } from './location.js';

export default function PullDownRefresh(data){
	return new Promise((reslove, reject) => {
		appGetMemberInfo(function(res){
			console.log('下拉刷新————用户信息:', res)
			loopLocation(resx=>{
				console.log('下拉刷新————获取定位:', res)
				reslove({
					member: res,
					location: resx
				})
			}).catch(reject)
		}).catch(reject)
		return
		if(!data || data.member && data.location){
			appGetMemberInfo(function(res){
				console.log('下拉刷新————用户信息:', res)
				loopLocation(resx=>{
					console.log('下拉刷新————获取定位:', res)
					reslove({
						member: res,
						location: resx
					})
				}).catch(reject)
			}).catch(reject)
			return
		}
		if(data.member)
		appGetMemberInfo(function(res){
			console.log('下拉刷新————用户信息:', res)
			reslove({
				member: res
			})
		}).catch(reject)
		if(data.location)
		loopLocation(res=>{
			console.log('下拉刷新————获取定位:', res)
			reslove({
				location: res
			})
		}).catch(reject)
	})
}