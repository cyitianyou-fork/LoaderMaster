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
			'<img src="' + info.src + '"/></li>');
		var newProc = new Product(newLi);
		$('#j-cvs_set ul.active').append(newLi); //这里必须先添加到父级上，再设置left和top值，不然无法获取$dv的高宽
		var x, y;
		if(info.isNew) { //是复制创建节点还是新建创建节点
			x = info.x - newLi.width() / 2;
			y = info.y - newLi.height() / 2;
		} else {
			x = info.x + 15;
			y = info.y + 15;
		}
		newLi.css({
			left: x,
			top: y
		});
		newProc.init(); //最后初始化
		return newProc;
	}
	
	return {
		cur: cur,
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
				if(e.shiftKey) {
					$(this).addClass('active');
				} else {
					$('#j-cvs_set li').removeClass('active');
					$(this).addClass('active');
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
			_this.selected();
			$('#j-cvs_set li.active').each(function(i, ele) {
				var angle = $(ele).attr('data-angle'); //旋转角度
				if (angle) {
					angle=JSON.parse(angle);
					angle.x=angle.x?angle.x:0;
					angle.y=angle.y?angle.y:0
					angle.z=angle.z?angle.z:0
				}else{
					angle={};
					angle.x=0;
					angle.y=0;
					angle.z=0;
				}
				tmpAngle.push(angle);
				angle=null;
			});
			var startx = e.pageX; //起始点
			var starty = e.pageY;
			var x = 0,
				y = 0; //临时变量
			$(document).on('mousemove.drag', function(e) {
				x = e.pageX - startx;
				y = e.pageY - starty;
				$('#j-cvs_set li.active').each(function(i, ele) {
					$(ele).css('transform', 'translate3d(' + x + 'px,' + y + 'px,0px) rotateX('+tmpAngle[i].x+'deg) rotateY('+tmpAngle[i].y+'deg) rotateZ(' + tmpAngle[i].z + 'deg)');
				});
			});
			$(document).on('mouseup.drag', function(e) {
				$(document).off('.drag');
				$('#j-cvs_set li.active').each(function(i, ele) {
					$(ele).css('transform', 'translate3d(0,0,0) rotateX('+tmpAngle[i].x+'deg) rotateY('+tmpAngle[i].y+'deg) rotateZ(' + tmpAngle[i].z + 'deg)');
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
			$('body').css('cursor', $(this).css('cursor'));
			if(_this.obj.hasClass('active')) {
				cx = parseFloat(_this.obj.css('left')) + _this.obj.width() / 2;
				cy = parseFloat(_this.obj.css('top')) + _this.obj.height() / 2;
				var angle = _this.obj.attr('data-angle'); //旋转角度
				if (angle) {
					angle=JSON.parse(angle);
					angle.x=angle.x?angle.x:0;
					angle.y=angle.y?angle.y:0
				}else{
					angle={};
					angle.x=0;
					angle.y=0;
					angle.z=0;
				}
				var disx, disy; //临时变量
				$(document).on('mousemove.rotate', function(e) {
					disx = e.pageX - cx;
					disy = e.pageY - cy;
					angleZ = 360 * Math.atan2(disy, disx) / (2 * Math.PI)
					angleZ = angleZ < -90 ? (450 + angleZ) : angleZ + 90;
					angleZ=angle.x%360==0?angleZ:angleZ-180;  //存在一个bug,只要垂直翻转是奇数次，z轴就会多转180度，原因至今还没弄清楚
					_this.obj.css('transform', 'rotateZ('+angleZ+'deg) rotateY('+angle.y+'deg) rotateX(' + angle.x + 'deg)');
				});
				$(document).on('mouseup.rotate', function(e) {
					$(document).off('.rotate');
					//保存已经旋转的角度值
					angle.z=angleZ;
					angle=JSON.stringify(angle)
					_this.obj.attr('data-angle', angle);
					_this.obj.css('transform', 'rotateZ('+angleZ+'deg) rotateY('+angle.y+'deg) rotateX(' + angle.x + 'deg)');
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
	var tmp = 0;
	this.obj.find('.m-pointctrl span').on('mousedown', function(e) {
		bases.length = 0;
		$('body').css('cursor', $(this).css('cursor'));
		var index = $(this).index();
		var startx = e.pageX;
		var starty = e.pageY;
		var disw = 0,
			dish = 0,
			disl = 0,
			dist = 0;
		$('#j-cvs_set li.active').each(function(i, ele) {
			var base = {
				width: $(ele).width(),
				height: $(ele).height(),
				x: parseFloat($(ele).css('left')),
				y: parseFloat($(ele).css('top'))
			};
			bases.push(base);
		});
		$(document).on('mousemove.scale', function(e) {
			disw = e.pageX - startx;
			dish = e.pageY - starty;
			switch(index) {
				case 0:
					tmp = dish;
					scopeLimit();
					dist = disl = tmp;
					disw = dish = -tmp;
					break;
				case 1:
					tmp = dish;
					scopeLimit();
					dish = -tmp;
					disl = disw = 0;
					dist = tmp;
					break;
				case 2:
					tmp = dish;
					scopeLimit();
					dish = disw = -tmp;
					dist = tmp;
					disl = 0;
					break;
				case 3:
					tmp = -disw;
					scopeLimit();
					disw = -tmp;
					dist = disl = dish = 0;
					break;
				case 4:
					tmp = -dish;
					scopeLimit();
					dish = disw = -tmp;
					dist = disl = 0;
					break;
				case 5:
					tmp = -dish;
					scopeLimit();
					dish = -tmp;
					dist = disl = disw = 0;
					break;
				case 6:
					tmp = -dish;
					scopeLimit();
					dish = disw = -tmp;
					disl = tmp;
					dist = 0;
					break;
				case 7:
					tmp = disw;
					scopeLimit();
					disw = -tmp;
					disl = tmp;
					dist = dish = 0;
					break;

			}
			$('#j-cvs_set li.active').each(function(i, ele) {
				$(ele).css({
					width: bases[i].width + disw,
					height: bases[i].height + dish,
					left: bases[i].x + disl,
					top: bases[i].y + dist,
				});
				$(ele).find('img').css({
					width: bases[i].width + disw,
					height: bases[i].height + dish
				});
			});

		});
		$(document).on('mouseup.scale', function(e) {
			$(document).off('.scale');
			//			$('#j-cvs_set li.active').each(function(i,ele){
			//				
			//			});
			//			_this.getCenterPoint();
			$('body').css('cursor', 'default');
		});
		return false;
	});

	function scopeLimit() {
		for(var i = 0; i < bases.length; i++) {
			if(bases[i].width - tmp < 11) {
				tmp = bases[i].width - 11;
			}
			if(bases[i].height - tmp < 11) {
				tmp = bases[i].height - 11;
			}
		}
	}
}