//库面板数据加载类
function DataLoader(obj) {
	this.obj = obj;
	//表示模板当前需要加载的数据集
	this.context = {
		list: []
	};
}
//获取数据
DataLoader.prototype.getData = function() {
		var _this = this;
		$.ajax({
			type: "get",
			url: _this.obj.url,
			async: true,
			success: function(data) {
				//console.log(data)
				if(data.status == 200) {
					_this.context = data;
					
					_this.toList();
				} else {
					_this.obj.container.html('<h2 style="margin:30px; color:#000">' + data.msg + '</h2>');
				}
			},
			error: function() {
				_this.obj.container.html('<h2 style="margin:30px; color:#000">404! 网络出错了...</h2>');
			}
		});
	}
	//编译模板，显示数据
DataLoader.prototype.toList = function() {
	
		var template = this.obj.template.html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(this.context);
		this.obj.container.html(html);
	}
	//实现继承的方法
function myextend(sub, sup) {
	function F() {}
	F.prototype = sup.prototype;
	sub.prototype = new F();
	sub.prototype.constructor = sub;
}
//子类，在获取数据，编译模板，输出的功能上增加了分页的功能
function SubDataLoader(obj) {
	DataLoader.call(this, obj);
	//存放所有的数据
	this.totalData = new Array();
	//总共页数
	this.pages = 0;
	//当前页码
	this.curPage = 0;

	//页码数量是动态加载的，给页面和其它按钮注册点击事件

}
//继承
myextend(SubDataLoader, DataLoader);
//重写父类获取数据集
SubDataLoader.prototype.getData = function() {
		var _this = this;
		$.ajax({
			type: "get",
			url: _this.obj.url,
			async: true,
			success: function(data) {
				if(data.status == 200) {
					//根据库面列表的高度决定一页显示多少行数据，32是底部页码的高度，74为每个数据集li的高度
					var row = Math.floor(($('#j-lib_content').height() - 32) / 74);
					//每页显示的数据集的个数
					var pageNum = row * 5;
					_this.pages = Math.ceil(data.list.length / pageNum);
					//初始化数据集，totalData是一个数组，用于存储每页的数据集
					for(var i = 0; i < _this.pages; i++) {
						var tmpContext = {
							"list": []
						};
						for(var j = 0; j < pageNum; j++) {
							if(i * pageNum + j < data.list.length) {
								tmpContext.list.push(data.list[i * pageNum + j]);
							}
						}
						_this.totalData.push(tmpContext);
						tmpContext = null;
					}
					//让当前页为0
					_this.curPage = 0;
					//编译模板显示数据
					_this.getList();
					//显示页码
					_this.clickPages();
				} else {
					_this.obj.container.html('<h2 style="margin:30px; color:#000">' + data.msg + '</h2>');
				}
			},
			error: function() {
				_this.obj.container.html('<h2 style="margin:30px; color:#000">404! 网络出错了...</h2>');
			}
		});
	}
	//封装更改当前数据集，并编译模板显示
SubDataLoader.prototype.getList = function() {
	this.context = this.totalData[this.curPage];
	this.toList();
}

SubDataLoader.prototype.clickPages = function() {
	//所有按钮的父级
	var parDom = this.obj.container.siblings('.g-lib_bts');
	if(this.pages > 1) {
		//页码的父级
		var pageDom = parDom.find('ol');
		pageDom.children().remove();
		//页码输入框
		var inputPage = parDom.find('input');
		var _this = this;
		//动态添加页码
		for(var i = 0; i < this.pages; i++) {
			pageDom.append('<li>' + (i + 1) + '</li>');
		}
		//页码集合
		var pageLi = pageDom.find('li');
		pageLi.eq(0).addClass('active');
		//给每个页码注册点击事件
		pageLi.each(function(i, ele) {
			$(ele).on('click', function() {
				_this.curPage = i;
				_this.getList();
				pageLi.removeClass('active');
				pageLi.eq(_this.curPage).addClass('active');
			});
		});
		//前一页
		parDom.find('.prev').on('click', function() {
			if(_this.curPage > 0) {
				_this.curPage--;
				_this.getList();
				pageLi.removeClass('active');
				pageLi.eq(_this.curPage).addClass('active');
			}
		});
		//后一页
		parDom.find('.next').on('click', function() {
			if(_this.curPage < _this.pages - 1) {
				_this.curPage++;
				_this.getList();
				pageLi.removeClass('active');
				pageLi.eq(_this.curPage).addClass('active');
			}
		});
		//第一页
		parDom.find('.first').on('click', function() {
			_this.curPage = 0;
			_this.getList();
			pageLi.removeClass('active');
			pageLi.eq(_this.curPage).addClass('active');
		});
		//最后一页
		parDom.find('.last').on('click', function() {
			_this.curPage = _this.pages - 1;
			_this.getList();
			pageLi.removeClass('active');
			pageLi.eq(_this.curPage).addClass('active');
		});
		//跳到指定页码
		parDom.find('.u-go').on('click', function() {
			if(parseInt(inputPage.val()) > 0) {
				_this.curPage = parseInt(inputPage.val()) - 1;
				_this.getList();
				pageLi.removeClass('active');
				pageLi.eq(_this.curPage).addClass('active');
			}
		});
	} else {
		parDom.hide();
	}
}