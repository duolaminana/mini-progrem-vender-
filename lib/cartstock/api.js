const $file_db_fields = require('./db/fields')
const $ = require('../../utils/countNum')

module.exports = class CartStockApi{//定义了一个名字为Person的类
    constructor(data){//constructor是一个构造方法，用来接收参数
        this.data = data ? data : [];
		this.totalPrice = 0;  // 总零售价
		this.totalActivityPrice = 0; // 总活动价
		this.totalSubPrice = 0; // 总优惠价
		this.totalCount = 0; // 总物件
		this.type = []; // 购物车商品属性
    }
    say(){//这是一个类的方法，注意千万不要加上function
        return this.data;
    }
	corr(vla){// 更正字段.融合字段
		/**
		 * @param { Array||Object }  要合并更正的对象/数据里的对象
		 * @array 排序进行 [1,2,3,...]
		 * */
		if(Array.isArray(vla)){
			let obj = {...$file_db_fields}
			for(let item of vla){
				obj = { ...obj, ...item }
			}
			return obj
		}else{
			return { ...$file_db_fields, ...vla }
		}
	}
	/**
	 * js动态购物车
	 * @param {Object} AAA 传入操作条件(第一个键值对必须是唯一标识)
	 * @param {Object} option 传入操作的对象
	 * */
	add(AAA, option){ // 增
		/**
		 * @return {boolean} true/false 添加成功/失败
		 * */
		if(!AAA || !option || this._lenObj(AAA)<=0){
			console.log('<购物车>请正确传入参数!')
			throw '<购物车>请正确传入参数!'
		}
		if(!this.see(AAA)){
			this.data.push(option)
			console.log('<购物车>加入成功!')
			this._calculate()
			return true
		}else{
			console.log('<购物车>已存在该商品!')
			return false
		}
	}
	sub(AAA){ // 删
		/**
		 * @return {boolean} true/false 添加成功/失败
		 * */
		let data_item = this.see(AAA)
		if(data_item){
			for(let [index, item] of this.data.entries()){
				if(item == data_item){
					this.data.splice(index, 1)
					console.log('<购物车>删除成功!')
					break
				}
			}
		}
		this._calculate()
	}
	subAll(){ // 清空
		this.data=[]
		this._calculate()
	}
	rev(AAA, revobjs){ // 改
		console.log('更正------------')
		let data_item = this.see(AAA)
		if(data_item){
			for(let [index, item] of this.data.entries()){
				if(item == data_item){
					this.data.splice(index, 1, {...item, ...revobjs})
					console.log('<购物车>更改成功!')
					break
				}
			}
		}else{
			console.log('<购物车>将要删除的选择不存在!')
		}
		this._calculate()
	}
	see(AAA){ // 查
		let data_item = 'string'
		let lenSum = 0
		for(let key in AAA){
			if(data_item == 'string'){
				data_item = this._selex(key, AAA[key])
				++lenSum
				continue
			}
			if(data_item){
				for(let opt in data_item){
					if(opt == key){
						++lenSum
					}
				}
			}else{
				return false
			}
		}
		if(lenSum == this._lenObj(AAA)){
			return data_item
		}else{
			return false
		}
		console.log('<购物车>已调用查看!')
	}
	_selex(key, val){ // 单项查找// 对应选择唯一标识
		/**
		 * @return {array || boolean} [item,idx] || false
		 * */
		if(this.data.length > 0){
			for(let item of this.data){
				for(let itemkey in item){
					if(itemkey == key && item[itemkey] == val){
						return item
					}
				}
			}
			return false
		}else{
			return false
		}
	}
	_lenObj(AAA){ // 获取对象长度
		return Object.keys(AAA).length
	}
	_kvObj(AAA){ // 获取键\值
		let arr = []
		for(let key in AAA){
			arr.push([key, AAA[key]])
		}
		return arr
	}
	_calculate(){ // 计算总和 activityPrice == null时特殊处理
		this.totalActivityPrice = 0
		this.totalPrice = 0
		this.totalSubPrice = 0
		this.totalCount = 0
		for(let item of this.data){
			this.totalActivityPrice = $.Add(this.totalActivityPrice , $.Mul(item.activityPrice == null ? item.actualPrice : item.activityPrice , item.dev_custom_count))
			this.totalPrice = $.Add(this.totalPrice , $.Mul(item.actualPrice , item.dev_custom_count))
			this.totalCount += item.dev_custom_count
		}
		this.totalSubPrice = $.Sub(this.totalPrice , this.totalActivityPrice)
	}
	AddGoodsType(obg){ // 添加购物车商品属性之类的东东
		this.type.push(obg)
	}
}