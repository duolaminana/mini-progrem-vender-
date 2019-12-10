const findProductChannel_details = {
	salePrice: 0, //商品售价.活动价格
	actualPrice: 0, //实际售价
	auditStatus: 0, //商品审核状态
	buyPrice: 0, //商品进价
	categoryId: "", //商品分类id
	categoryName: "", //渠道分类名称
	categorylId: "", //渠道商品类id
	channelId: "", //渠道id
	createDate: "", //创建时间
	enable: "START", //是否启用 0 不启用 1 启用
	id: "", //主键
	imageAddress: "", //图片地址
	operator: "", //操作人
	operatorName: "", //操作人姓名
	
	productCode: "", //商品编码
	productId: "", //商品id
	productName: "", //商品名称
	dictUnit: "", //商品单位
	dictUnitName: '', //商品单位名称(从字典表中拉取数据)
	
	productDesc: "", //商品描述
	productFunction: "", //商品说明
	productIngredient: "", //商品原料
	productSpecification: "", //商品规格
	remark: "", //备注
	
	status: "", // 是否上架 0 下架 1 上架
	updateDate: "" //修改时间
}

const goodsyn_details = {
	actualPrice: 0, //实际售价
	activityPrice: null, // 活动价格
	buyPrice: 0, //商品进价
	categoryId: "", //商品分类id
	categoryName: "", //渠道分类名称
	categorylId: "", //渠道商品类目id
	createDate: "", //创建时间(活动价格)
	endDate: "", //结束时间(活动价格)
	imageAddress: "", //图片地址
	productCode: "", //商品编码
	productName: "", //商品名称
	dictUnitName: '', //商品单位名称(从字典表中拉取数据)
	sort: 1, // 排序/非数组下标.从1开始
	stock: 0, // 库存
	
	dev_custom_count: 0 // <前端自定义字段><商品选择数量><默认值.设置.0>
}

module.exports = {
	...findProductChannel_details,
	...goodsyn_details
}