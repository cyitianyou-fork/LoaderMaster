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
	var curLeft = 0; //表示位于最左边的那个tab栏的索引值
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
		var w = $('#j-tabc li').eq(0).outerWidth()* $('#j-tabc li').length;
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
					'left': -curLeft * cw
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
			var cw = $('#j-tabc li').eq(0).outerWidth(); //每个tab栏Li的宽度
			if(curLeft > 0) {
				curLeft--;
				$('#j-tabc').animate({
					'left': -curLeft * cw
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
		setTabWidth: setTabWidth,
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
		this.obj.on('mousedown', function(e) {
			var angle = parseFloat(_this.obj.attr('data-angle')); //旋转角度
			angle = angle ? angle : 0;
			var startx = e.pageX; //起始点
			var starty = e.pageY;
			var x = 0,
				y = 0; //临时变量
			$(document).on('mousemove.drag', function(e) {
				x = e.pageX - startx;
				y = e.pageY - starty;
				_this.obj.css('transform', 'translate3d(' + x + 'px,' + y + 'px,0px) rotate(' + angle + 'deg)');
			});
			$(document).on('mouseup.drag', function(e) {
				$(document).off('.drag');
				//改变中心点的位置
				_this.cx += x;
				_this.cy += y;
				_this.obj.css('transform', 'translate3d(' + 0 + 'px,' + 0 + 'px,0px) rotate(' + angle + 'deg)');
				//在移动或者旋转中获取元素的位置都用.css()的方法，不用offset(),原因是不管是移动、旋转、或者放大缩小，offset()的值都在变化，只有通过.css()方法才能获取变化前的那个值
				_this.obj.css({
					left: parseFloat(_this.obj.css('left')) + x,
					top: parseFloat(_this.obj.css('top')) + y
				});

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
				var disx, disy; //临时变量
				$(document).on('mousemove.rotate', function(e) {
					disx = e.pageX - _this.cx;
					disy = e.pageY - _this.cy;
					angle = 360 * Math.atan2(disy, disx) / (2 * Math.PI)
					angle = angle < -90 ? (450 + angle) : angle + 90;
					_this.obj.css('transform', 'rotate(' + angle + 'deg)');
				});
				$(document).on('mouseup.rotate', function(e) {
					$(document).off('.rotate');
					//保存已经旋转的角度值
					_this.obj.attr('data-angle', angle);
					_this.obj.css('transform', 'rotate(' + angle + 'deg)');
					$('body').css('cursor', 'default');
				});
				return false;
			}
		});
	}
	//放大和缩小
Product.prototype.scale = function() {
	var _this = this;
	this.obj.find('.m-pointctrl span').on('mousedown', function(e) {
		$('body').css('cursor', $(this).css('cursor'));
		var index = $(this).index();
		var startx = e.pageX;
		var starty = e.pageY;
		var disw = 0,
			dish = 0,
			disl = 0,
			dist = 0,
			tmp = 0;
		var base = {
			width: _this.obj.width(),
			height: _this.obj.height(),
			x: parseFloat(_this.obj.css('left')),
			y: parseFloat(_this.obj.css('top'))
		};
		$(document).on('mousemove.scale', function(e) {
			disw = e.pageX - startx;
			dish = e.pageY - starty;
			switch(index) {
				case 0:
					tmp = Math.min(disw, dish);
					if(base.width - tmp < 11) {
						tmp = base.width - 11;
					}
					if(base.height - tmp < 11) {
						tmp = base.height - 11;
					}
					dist = disl = tmp;
					disw = dish = -tmp;
					break;
				case 1:
					tmp = dish;
					if(base.height - tmp < 11) {
						tmp = base.height - 11;
					}
					dish = -tmp;
					disl = disw = 0;
					dist = tmp;
					break;
				case 2:
					tmp = disw;
					if(base.width + tmp < 11) {
						tmp = 11 - base.width;
					}
					if(base.height + tmp < 11) {
						tmp = 11 - base.height;
					}
					dish = disw = tmp;
					dist = -tmp;
					disl = 0;
					break;
				case 3:
					tmp = -disw;
					if(base.width - tmp < 11) {
						tmp = base.width - 11;
					}
					disw = -tmp;
					dist = disl = dish = 0;
					break;
				case 4:
					tmp = -Math.min(disw, dish);
					if(base.width - tmp < 11) {
						tmp = base.width - 11;
					}
					if(base.height - tmp < 11) {
						tmp = base.height - 11;
					}
					dish = disw = -tmp;
					dist = disl = 0;
					break;
				case 5:
					tmp = -dish;
					if(base.height - tmp < 11) {
						tmp = base.height - 11;
					}
					dish = -tmp;
					dist = disl = disw = 0;
					break;
				case 6:
					tmp = disw;
					if(base.width - tmp < 11) {
						tmp = base.width - 11;
					}
					if(base.height - tmp < 11) {
						tmp = base.height - 11;
					}
					dish = disw = -tmp;
					disl = tmp;
					dist = 0;
					break;
				case 7:
					tmp = disw;
					if(base.width - tmp < 11) {
						tmp = base.width - 11;
					}
					disw = -tmp;
					disl = tmp;
					dist = dish = 0;
					break;

			}

			_this.obj.css({
				width: base.width + disw,
				height: base.height + dish,
				left: base.x + disl,
				top: base.y + dist,
			});
			_this.obj.find('img').css({
				width: base.width + disw,
				height: base.height + dish
			});
			_this.getCenterPoint();
		});
		$(document).on('mouseup.scale', function(e) {
			$(document).off('.scale');
			$('body').css('cursor', 'default');
		});
		return false;
	});
}