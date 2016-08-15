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
	var cur = 0; //表示当前激活tab栏Li的索引值
	var curLeft = 0; //表示位于最左边的那个tab栏的索引值
	var zIndex = 0;

	function bind() {
		moveCvsTab();
		activeTab();
		editTabName();
		closeTab();
		closeTool();
		closeLib();
		unselected();
	}
	//失去焦点时，控制点消失
	function unselected() {
		$(document).on('click', function() {
			$('#j-cvs_set li').removeClass('active');
		});
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

	function addProduct(info) {
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
			'</li>');
		var w, h;
		if(info.isColorBlock) {
			var $dv = $('<div>');
			$dv.css({
				width: 68,
				height: 68,
				background: info.color,
			});
			w=68;
			h=68;
			newLi.append($dv);
		} else if(info.isWordBlock) {
			w=136;
			h=68;
			newLi.html('请输入文字');
		} else {
			var $img = $('<img  src="' + info.src + '" />');
			$img.load(function(){
				newLi.append($img);
				w = $img.width();
				h = $img.height()
				console.log(w+','+h);
				$img.attr('data-id', info.id);
				//保存图片最原始的高度和宽度
				$img.attr('data-initW', w);
				$img.attr('data-initH', h);
			});
		}
		$('#j-cvs_set ul.active').append(newLi); //这里必须先添加到父级上，再设置left和top值，不然无法获取$dv的高宽
		var x = info.x - w / 2;
		var y = info.y - h / 2;
		newLi.css({
			width: w,
			height: h,
			left: x,
			top: y,
			zIndex: cvsSet.zIndex++
		});
		var newProc = new Product(newLi);
		newProc.init(); //最后初始化

		//初始化锁定按钮状态
		$('#j-lock .icon').removeClass('icon-unlock');
		$('#j-lock .icon').addClass('icon-lock');
		$('#j-lock').attr('data-name', '锁定');
		$('#j-cvs_set li.active').removeClass('active');
		return newProc;
	}

	return {
		cur: cur,
		zIndex: zIndex,
		bind: bind,
		setTabWidth: setTabWidth,
		addProduct: addProduct
	}
})();

function Product(obj) {
	this.obj = obj;
}
Product.prototype.init = function() {
	this.selected();
	this.drag();
	this.rotate();
	this.scale();
}
Product.prototype.selected = function() {
		var _this = this;
		this.obj.on('click', function(e) {
			if(!$(this).hasClass('active')) {
				if(!e.shiftKey) {
					$('#j-cvs_set li').removeClass('active');
				}
				$(this).addClass('active');
			}
			if($('#j-cvs_set li.active').length > 0) {
				var icon = $('#j-lock .icon');
				var off = true;
				$('#j-cvs_set li.active').each(function(i, ele) {
					if(!$(ele).hasClass('lock')) {
						off = false;
					}
				});
				if(off) {
					icon.removeClass('icon-lock');
					icon.addClass('icon-unlock');
					$('#j-lock').attr('data-name', '解锁');
				} else {
					icon.removeClass('icon-unlock');
					icon.addClass('icon-lock');
					$('#j-lock').attr('data-name', '锁定');
				}
			}
			return false;
		});
	}
	//移动
Product.prototype.drag = function() {
		var _this = this;
		this.obj.on('mousedown', function(e) {
			var tmpAngle = [];
			//按下添加active
			if(!$(this).hasClass('active')) {
				if(!e.shiftKey) {
					$('#j-cvs_set li').removeClass('active');
				}
				$(this).addClass('active');
			}
			//判断是否是也有lock
			if($('#j-cvs_set li.active.lock').length > 0) {
				return;
			}
			$('#j-cvs_set li.active').each(function(i, ele) {
				var angle = $(ele).attr('data-angle'); //旋转角度
				angle = angle ? angle : 0;
				tmpAngle.push(angle);
			});
			var startx = e.pageX; //起始点
			var starty = e.pageY;
			var x = 0,
				y = 0; //临时变量
			$(document).on('mousemove.drag', function(e) {
				x = e.pageX - startx;
				y = e.pageY - starty;
				$('#j-cvs_set li.active').each(function(i, ele) {
					$(ele).css('transform', 'translate3d(' + x + 'px,' + y + 'px,0px) rotateZ(' + tmpAngle[i] + 'deg)');
				});
			});
			$(document).on('mouseup.drag', function(e) {
				$(document).off('.drag');
				$('#j-cvs_set li.active').each(function(i, ele) {
					$(ele).css('transform', 'translate3d(0,0,0) rotateZ(' + tmpAngle[i] + 'deg)');
					//在移动或者旋转中获取元素的位置都用.css()的方法，不用offset(),原因是不管是移动、旋转、或者放大缩小，offset()的值都在变化，只有通过.css()方法才能获取变化前的那个值
					$(ele).css({
						left: parseFloat($(ele).css('left')) + x,
						top: parseFloat($(ele).css('top')) + y
					});
				});
			});
			return false;
		});
	}
	//旋转
Product.prototype.rotate = function() {
		var _this = this;
		var angleZ = 0, //旋转角度
			cx = 0,
			cy = 0; //中心点
		this.obj.find('.m-rotatepoint span').on('mousedown', function(e) {
			if(_this.obj.hasClass('lock')) {
				return;
			}
			$('body').css('cursor', $(this).css('cursor'));
			if(_this.obj.hasClass('active')) {
				cx = parseFloat(_this.obj.css('left')) + _this.obj.width() / 2;
				cy = parseFloat(_this.obj.css('top')) + _this.obj.height() / 2;
				var disx, disy; //临时变量
				$(document).on('mousemove.rotate', function(e) {
					disx = e.pageX - cx;
					disy = e.pageY - cy;
					angle = 360 * Math.atan2(disy, disx) / (2 * Math.PI)
					angle = angle < -90 ? (450 + angle) : angle + 90;
					_this.obj.css('transform', 'rotateZ(' + angle + 'deg)');
				});
				$(document).on('mouseup.rotate', function(e) {
					$(document).off('.rotate');
					//保存已经旋转的角度值
					_this.obj.attr('data-angle', angle);
					_this.obj.css('transform', 'rotateZ(' + angle + 'deg)');
					$('body').css('cursor', 'default');
				});
				return false;
			}
		});
	}
	//放大和缩小
Product.prototype.scale = function() {
	var _this = this;
	var bases = [];
	this.obj.find('.m-pointctrl span').on('mousedown', function(e) {
		if($('#j-cvs_set li.active.lock').length > 0) {
			return;
		}
		bases.length = 0;
		$('body').css('cursor', $(this).css('cursor'));
		var index = $(this).index();
		var startx = e.pageX;
		var starty = e.pageY;
		var disw = 0,
			dish = 0,
			disl = 0,
			dist = 0
		scale = 0;
		$('#j-cvs_set li.active').each(function(i, ele) {
			var base = {
				width: $(ele).width(),
				height: $(ele).height(),
				left: parseFloat($(ele).css('left')),
				top: parseFloat($(ele).css('top'))
			};
			bases.push(base);
			var $img = $(ele).find('img');
			if($img.length > 1) {
				$(ele).find('li').each(function(j, eleLi) {
					$(eleLi).attr('data-width', $(eleLi).width());
					$(eleLi).attr('data-height', $(eleLi).height());
					$(eleLi).attr('data-left', $(eleLi).css('left'));
					$(eleLi).attr('data-top', $(eleLi).css('top'));
				});
			}
		});
		$(document).on('mousemove.scale', function(e) {
			disw = e.pageX - startx;
			dish = e.pageY - starty;
			switch(index) {
				case 0:
					$('#j-cvs_set li.active').each(function(i, ele) {
						scale = dish / bases[i].height;
						scopeLimit(i);
						eleScale({
							ele: $(ele),
							disw: -scale * bases[i].width,
							dish: -scale * bases[i].height,
							disl: scale * bases[i].width,
							dist: scale * bases[i].height,
							index: i
						});
					});
					break;
				case 1:
					$('#j-cvs_set li.active').each(function(i, ele) {
						scale = dish / bases[i].height;
						scopeLimit(i);
						eleScale({
							ele: $(ele),
							disw: -scale * bases[i].width,
							dish: -scale * bases[i].height,
							disl: scale * bases[i].width / 2,
							dist: scale * bases[i].height,
							index: i
						});
					});
					break;
				case 2:
					$('#j-cvs_set li.active').each(function(i, ele) {
						scale = dish / bases[i].height;
						scopeLimit(i);
						eleScale({
							ele: $(ele),
							disw: -scale * bases[i].width,
							dish: -scale * bases[i].height,
							disl: 0,
							dist: scale * bases[i].height,
							index: i
						});
					});
					break;
				case 3:
					$('#j-cvs_set li.active').each(function(i, ele) {
						scale = -disw / bases[i].height;
						scopeLimit(i);
						eleScale({
							ele: $(ele),
							disw: -scale * bases[i].width,
							dish: -scale * bases[i].height,
							disl: 0,
							dist: scale * bases[i].height / 2,
							index: i
						});
					});
					break;
				case 4:
					$('#j-cvs_set li.active').each(function(i, ele) {
						scale = -dish / bases[i].height;
						scopeLimit(i);
						eleScale({
							ele: $(ele),
							disw: -scale * bases[i].width,
							dish: -scale * bases[i].height,
							disl: 0,
							dist: 0,
							index: i
						});
					});
					break;
				case 5:
					$('#j-cvs_set li.active').each(function(i, ele) {
						scale = -dish / bases[i].height;
						scopeLimit(i);
						eleScale({
							ele: $(ele),
							disw: -scale * bases[i].width,
							dish: -scale * bases[i].height,
							disl: scale * bases[i].width / 2,
							dist: 0,
							index: i
						});
					});
					break;
				case 6:
					$('#j-cvs_set li.active').each(function(i, ele) {
						scale = -dish / bases[i].height;
						scopeLimit(i);
						eleScale({
							ele: $(ele),
							disw: -scale * bases[i].width,
							dish: -scale * bases[i].height,
							disl: scale * bases[i].width,
							dist: 0,
							index: i
						});
					});
					break;
				case 7:
					$('#j-cvs_set li.active').each(function(i, ele) {
						scale = disw / bases[i].height;
						scopeLimit(i);
						eleScale({
							ele: $(ele),
							disw: -scale * bases[i].width,
							dish: -scale * bases[i].height,
							disl: scale * bases[i].width,
							dist: scale * bases[i].height / 2,
							index: i
						});
					});
					break;

			}
		});
		$(document).on('mouseup.scale', function(e) {
			$(document).off('.scale');
			$('body').css('cursor', 'default');
		});
		return false;
	});
	//宽高缩小值都不能小于20
	function scopeLimit(index) {
		if((1 - scale) * bases[index].width < 20) {
			scale = 1 - 20 / bases[index].width;
		}
		if((1 - scale) * bases[index].height < 20) {
			scale = 1 - 20 / bases[index].height;
		}
	}

	//单个元素缩放
	function eleScale(tar) {
		tar.ele.css({
			width: bases[tar.index].width + tar.disw,
			height: bases[tar.index].height + tar.dish,
			left: bases[tar.index].left + tar.disl,
			top: bases[tar.index].top + tar.dist,
		});
		var $img = tar.ele.find('img');
		if($img.length > 1) {
			tar.ele.find('li').each(function(j, eleLi) {

				var w = parseFloat($(eleLi).attr('data-width'));
				var h = parseFloat($(eleLi).attr('data-height'));
				var l = parseFloat($(eleLi).attr('data-left'));
				var t = parseFloat($(eleLi).attr('data-top'));
				var angle = parseFloat($(eleLi).attr('data-angle'));
				angle = angle ? angle : 0;
				angle = angle * Math.PI / 180;

				w += tar.disw / bases[tar.index].width * w;
				h += tar.dish / bases[tar.index].height * h
				l += tar.disw / bases[tar.index].width * l;
				t += tar.dish / bases[tar.index].height * t;
				$(eleLi).css({
					width: w,
					height: h,
					left: l,
					top: t
				})
				$(eleLi).find('img').css({
					width: w,
					height: h
				})
			});
		} else {
			$img.css({
				width: bases[tar.index].width + tar.disw,
				height: bases[tar.index].height + tar.dish,
			});
		}
	}
}