(function($) {

	$.extend({
		nameEle: $('<span class="u-tool_name"></span>'),
		showName: function(options) {
			var defaults = {
				x: 0,
				y: 0,
				text: "name"
			}
			var rs = $.extend(true, {}, defaults, options);
			$.nameEle.html(rs.text);
			$.nameEle.css({
				left: rs.x,
				top: rs.y
			});
			$('body').append($.nameEle);
		},
		hideName: function() {
			$.nameEle.remove();
		}
	})
})(jQuery);

var cvsSet = (function() {
	var set = new Array();
	var cur = 0; //表示当前激活tab栏Li的索引值
	var ccurLeft = 0; //表示位于最左边的那个tab栏的索引值
	function init() {
		var newCvs = new Canvas($('#j-tabc li').eq(0), $('#j-cvs_set ul').eq(0));
		set.push(newCvs);
	}

	function bind() {
		moveCvsTab();
		activeTab();
		editTabName();
		closeTab();
		closeTool();
		closeLib();
		unselected();
		selected();
	}
	//失去焦点时，控制点消失
	function unselected() {
		$(document).on('click', function() {
			$('#j-cvs_set li').removeClass('active');
		});
	}
	//点击，显示控制点
	function selected() {
		$(document).on('click', '#j-cvs_set li', function() {
			$('#j-cvs_set li').removeClass('active');
			$(this).addClass('active');
			return false;
		})
		$(document).on('mousedown', '#j-cvs_set li', function() {
			$('#j-cvs_set li').removeClass('active');
			$(this).addClass('active');
			return false;
		})
	}
	//设置应画布tab栏宽度
	function setTabWidth() {
		var w = $('#j-tabc li').eq(0).outerWidth() * $('#j-tabc li').length;
		$('#j-tabc').width(w);
	}
	//左右移动tab
	function moveCvsTab() {
		var cw = $('#j-tabc li').eq(0).outerWidth(); //每个tab栏Li的宽度
		var fw = $('#j-tabc').parent('.m-tabc_wrap').width(); //父级包裹层的宽度
		//左右移动tab栏
		$(document).on('click', '#j-page_right', function() {
			if(($('#j-tabc').position().left + $('#j-tabc').width()) > fw) {
				curLeft++;
				$('#j-tabc').animate({
					'left': -curLeft * cw
				}, 300);
			}
		});
		$(document).on('click', '#j-page_left', function() {
			if(curLeft > 0) {
				curLeft--;
				$('#j-tabc').animate({
					'left': curLeft * cw
				}, 300);
			}
		});
	}
	//激活tab栏
	function activeTab() {
		//前一个（后一个tab栏）
		$(document).on('click', '.u-tabc_chbt .u-next', function() {
			if(cvsSet.cur < $('#j-tabc li').length - 1) {
				cvsSet.cur++;
				$('#j-tabc li').removeClass('active');
				$('#j-tabc li').eq(cvsSet.cur).addClass('active');
				$('#j-cvs_set ul').removeClass('active');
				$('#j-cvs_set ul').eq(cvsSet.cur).addClass('active');
				$('#j-tabc input').attr('readonly', 'readonly');
			}
			return false; //阻止冒泡事件
		});
		$(document).on('click', '.u-tabc_chbt .u-prev', function() {
			if(cvsSet.cur > 0) {
				cvsSet.cur--;
				$('#j-tabc li').removeClass('active');
				$('#j-tabc li').eq(cvsSet.cur).addClass('active');
				$('#j-cvs_set ul').removeClass('active');
				$('#j-cvs_set ul').eq(cvsSet.cur).addClass('active');
				$('#j-tabc input').attr('readonly', 'readonly');
			}
			return false;
		});

		//点击tab被激活
		$(document).on('click', '#j-tabc li', function() {
			$('#j-tabc li').removeClass('active');
			$(this).addClass('active');
			//当点击的不是当前激活的tab栏时，重命名输入框变为只可读
			if($(this).index() != cvsSet.cur) {
				$('#j-tabc input').attr('readonly', 'readonly');
			}
			cvsSet.cur = $(this).index();
			$('#j-cvs_set ul').removeClass('active');
			$('#j-cvs_set ul').eq(cvsSet.cur).addClass('active');
		});
	}
	//修改tab栏的名字
	function editTabName() {
		//点击icon-edit可修改tab栏Li的名字
		$(document).on('click', '.u-tabc_chbt .u-rename', function() {
			$(this).parents('.u-tabc_chbt').siblings('input').removeAttr('readonly').focus();
			return false;
		});
	}
	//关闭tab
	function closeTab() {
		//点击close关闭当前tab栏中的li
		$(document).on('click', '.u-tabc_chbt .u-close', function() {
			if($('#j-tabc li').length < 2) {
				return;
			}
			set.splice(cvsSet.cur, 1);
			$(this).parents('li').remove();
			$('#j-cvs_set ul').eq(cvsSet.cur).remove();
			if(cvsSet.cur == $('#j-tabc li').length) {
				cvsSet.cur--;
			}
			//更新父级ul的宽度
			setTabWidth()
			$('#j-tabc li').eq(cvsSet.cur).addClass('active');
			$('#j-cvs_set ul').eq(cvsSet.cur).addClass('active');
			if(cvsSet.curLeft > 0) {
				cvsSet.curLeft--;
				$('#j-tabc').animate({
					'left': -cvsSet.curLeft * cw
				}, 300);
			}
			return false;
		});
	}
	//点击tooloff按钮，切换打开和关闭tool面板
	function closeTool() {
		$(document).on('click', '#j-tooloff', function() {
			$('#j-tools').toggle();
		});
	}
	//点击liboff按钮，切换打开和关闭library面板
	function closeLib() {
		$(document).on('click', '#j-liboff', function() {
			$('#j-library').toggle();
		});
	}

	function addProduct(x, y, src) {
		var newLi = $('<li>' +
			'<div class="g-pointctrl">' +
			'<div class="m-rotatepoint">' +
			'<span></span>' +
			'</div>' +
			'<div class="m-pointctrl">' +
			'<span></span>' +
			'<span></span>' +
			'<span></span>' +
			'<span></span>' +
			'<span></span>' +
			'<span></span>' +
			'<span></span>' +
			'<span></span>' +
			'</div>' +
			'</div>' +
			'<img src="' + src + '"/></li>');
		var newProc = new Product(newLi);
		set[cvsSet.cur].queues.push(newProc);
		set[cvsSet.cur].size++;
		set[cvsSet.cur].cvs.append(newLi); //这里必须先添加到父级上，再设置left和top值，不然无法获取$dv的高宽
		x = x - newLi.width() / 2;
		y = y - newLi.height() / 2;
		newLi.css({
			left: x,
			top: y
		});
		newProc.init(); //最后初始化
	}
	return {
		set: set,
		cur: cur,
		init: init,
		bind: bind,
		addProduct: addProduct
	}
})();

function Canvas(tab, cvs, type) {
	this.tab = tab;
	this.cvs = cvs;
	this.queues = new Array();
	this.size = 0;
	this.type = type ? type : '';
}

function Product(obj) {
	this.obj = obj;
	//中心点
	this.cx = 0;
	this.cy = 0;
}
Product.prototype.init = function() {
		//初始化中心点
		this.getCenterPoint();

		this.drag();
		this.rotate();
		this.scale();
	}
	//获取中心点的坐标值
Product.prototype.getCenterPoint = function() {
		this.cx = this.obj.offset().left + this.obj.width() / 2;
		this.cy = this.obj.offset().top + this.obj.height() / 2;
	}
	//移动
Product.prototype.drag = function() {
		var _this = this;
		var left = 0,
			top = 0;
		this.obj.on('mousedown', function(e) {
			var angle = parseFloat(_this.obj.attr('data-angle')); //旋转角度
			angle = angle ? angle : 0;
			var startx = e.pageX; //起始点
			var starty = e.pageY;
			var x, y; //临时变量
			$(document).on('mousemove.drag', function(e) {
				x = e.pageX - startx + left;
				y = e.pageY - starty + top;
				_this.obj.css('transform', 'translate3d(' + x + 'px,' + y + 'px,0px) rotate(' + angle + 'deg)');
			});
			$(document).on('mouseup.drag', function(e) {
				$(document).off('.drag');
				x = e.pageX - startx;
				y = e.pageY - starty;
				//改变中心点的位置
				_this.cx += x;
				_this.cy += y;
				x = e.pageX - startx + left;
				y = e.pageY - starty + top;
				left = x;
				top = y;
				//保存已经移动的x和y值
				_this.obj.attr('data-left', left);
				_this.obj.attr('data-top', top);
				_this.obj.css('transform', 'translate3d(' + x + 'px,' + y + 'px,0px) rotate(' + angle + 'deg)');
			});
			return false;
		});
	}
	//旋转
Product.prototype.rotate = function() {
		var _this = this;
		var angle = 0; //旋转角度
		this.obj.find('.m-rotatepoint span').on('mousedown', function(e) {
			$('body').css('cursor', $(this).css('cursor'));
			if(_this.obj.hasClass('active')) {
				var left = parseFloat(_this.obj.attr('data-left'));
				var top = parseFloat(_this.obj.attr('data-top'));
				var disx, disy; //临时变量
				$(document).on('mousemove.rotate', function(e) {
					disx = e.pageX - _this.cx;
					disy = e.pageY - _this.cy;
					angle = 360 * Math.atan2(disy, disx) / (2 * Math.PI)
					angle = angle < -90 ? (450 + angle) : angle + 90;
					_this.obj.css('transform', 'translate3d(' + left + 'px,' + top + 'px,' + '0px) rotate(' + angle + 'deg)');
				});
				$(document).on('mouseup.rotate', function(e) {
					$(document).off('.rotate');
					//保存已经旋转的角度值
					_this.obj.attr('data-angle', angle);
					_this.obj.css('transform', 'translate3d(' + left + 'px,' + top + 'px,' + '0px) rotate(' + angle + 'deg)');
					$('body').css('cursor', 'default');
					console.log('ll='+_this.obj.offset().left)
				});
				return false;
			}
		});
	}
	//放大和缩小
Product.prototype.scale = function() {
	var _this = this;
	this.obj.find('.m-pointctrl span').on('mousedown', function(e) {
		var index = $(this).index();
		var startx = e.pageX;
		var starty = e.pageY;
		var disx = 0,
			disy = 0,
			dis=0;
		var base = {
			width: _this.obj.width(),
			height: _this.obj.height(),
			x: _this.obj.offset().left,
			y: _this.obj.offset().top
		};
		console.log('1.'+_this.obj.offset().top)
		var left = parseFloat(_this.obj.attr('data-left'));
		var top = parseFloat(_this.obj.attr('data-top'));
		var angle = parseFloat(_this.obj.attr('data-angle')); //旋转角度
			angle = angle ? angle : 0;
			left+=_this.obj.width()*Math.
		//console.log(base)
		$(document).on('mousemove.scale', function(e) {
			console.log('2.'+_this.obj.offset().top)
			disx = e.pageX - startx;
			disy = e.pageY - starty;
			dis = Math.min(disx,disy);
			if (base.width-dis<11) {
				dis=base.width-11;
			}
			if (base.height-dis<11) {
				dis=base.height-11;
			}
			_this.obj.css({
				width: base.width-dis,
				height: base.height - dis,
				left: base.x + dis-left,
				top: base.y + dis-top,
			});
			console.log('dis='+(dis-top));
			console.log('base='+base.y);
			console.log('3.'+_this.obj.offset().top)
			_this.obj.find('img').css({
				width: base.width - dis,
				height:base.height - dis
			});
			_this.getCenterPoint();
		});
		$(document).on('mouseup.scale', function(e) {
			$(document).off('.scale');
		});
		return false;
	});
}