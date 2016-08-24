//相关产品推荐
var relProc = (function() {
	function bind() {
		toggleRelInfo();
		toggleList();
	}

	function toggleRelInfo() {
		$(document).on('click', '#j-rel_list li', function() {
			showRelInfo($(this).index());
		});
	}

	function toggleList() {
		$(document).on('click', '#j-rel_bt', function() {
			$('.m-rel_list').toggle();
		});
	}
	//加载数据
	function load(url) {
		var data = new DataLoader({
			template: $('#t-rel_list'),
			container: $('#j-rel_list'),
			url: url,
			fn: function() {
				if($('#j-rel_list li').length > 0) {
					$('.g-relative_proc').show();
					$('#j-rel_list').width($('#j-rel_list li').eq(0).outerWidth(true) * $('#j-rel_list li').length);
					showRelInfo(0);

				}
			}
		});
		data.getData();
	}
	//显示相关产品的详情信息
	function showRelInfo(index) {
		var tar = $('#j-rel_list li').eq(index);
		$('#j-rel_show img').attr('src', tar.find('img').attr('src'));
		$('#j-rel_show h4').html(tar.attr('data-name'));
		$('#j-rel_show strong').html(tar.attr('data-price'));
		$('#j-rel_show span').eq(0).html('规格：' + tar.attr('data-spec'));
		$('#j-rel_show span').eq(1).html('材质：' + tar.attr('data-material'));
		$('#j-rel_show a').attr('href', tar.attr('data-url'));
	}
	return {
		bind: bind,
		load: load
	}
})();

var relImg = (function() {
	function bind() {
		toggleImg();
	}

	function load(url) {
		var data = new DataLoader({
			template: $('#t-rel_img'),
			container: $('#j-rel_img'),
			url: url,
			fn: function() {
				if($('#j-rel_img li').length > 0) {
					$('.g-relative_img').show();
					$('#j-rel_img li').eq(0).addClass('active');
				}
			}
		});
		data.getData();
	}

	function toggleImg() {
		$(document).on('click', '#j-rel_img li', function() {
			$(this).addClass('active').siblings().removeClass('active');
			$('#j-cvs_set li.active').find('img').attr('src', $(this).find('img').attr('src'));
			$('#j-cvs_set li.active').css({
				width: $('#j-cvs_set li.active').find('img').width(),
				height: $('#j-cvs_set li.active').find('img').height()
			});
			return false;
		});
	}
	return {
		load: load,
		bind: bind
	}
})();

var cvsSet = (function() {
	var cur = 0; //表示当前激活tab栏Li的索引值
	var curLeft = 0; //表示位于最左边的那个tab栏的索引值
	var zIndex = 0;
	var scale = 1; //画布缩放倍数 .5-2
	//声明画布中心点
	var trpos = {
		x: 0,
		y: 0
	};

	function bind() {
		moveCvsTab();
		activeTab();
		editTabName();
		closeTab();
		closeTool();
		closeLib();
		unselected();
		$.initInputBox();
	}
	//失去焦点时，控制点消失
	function unselected() {
		$(document).on('click', function() {
			$('#j-cvs_set li').removeClass('active');
			$.hideInput();
			$('.g-relative_img').hide();
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

			if ($('#j-cvs_set ul.active li').length>0) {
				$.pop({
					title: '提示',
					content: '<div class="pop-text">'+
								'您还未保存！'+						
							'</div>',
					className: 'pop-tip',
					sure_text: '去保存',
					callback: function(){
						$('.pop-bts a').eq(1).on('click',function(){
							$('.pop').remove();
							$('.u-pairs').trigger('click');
						});
					}
				});
			}
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
			if ($('#j-cvs_set ul').length==0) {
				$('#j-new_cvs').trigger('click');
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
		var w, h, x, y, $inner;
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
		if(info.isProc) {
			newLi.attr('data-cg', info.isProc);
		}
		$('#j-cvs_set ul.active').append(newLi); //这里必须先添加到父级上，再设置left和top值，不然无法获获取高宽
		var defer = $.Deferred(); //设置延迟函数，使得图片加载完，获取宽度，再设置样式
		if(info.isColorBlock) {
			$inner = $('<div class="inner"><div class="u-color img"></div></div>');
			newLi.append($inner);
			$inner.css('background', info.color);
			w = 68;
			h = 68;
			defer.resolve();
		} else if(info.isWordBlock) {
			var $inner = $('<div class="inner"><div class="u-word img">请输入文字内容</div></div>');
			newLi.append($inner);
			w = 136;
			h = 68;
			defer.resolve();
		} else {
			$inner = $('<div class="inner" ><img class="img" src="' + info.src + '" /></div>');
			var $img = $inner.find('img');
			$img.load(function() {
				newLi.append($inner);
				w = $img.width();
				h = $img.height()
				$img.attr('data-id', info.id);
				//保存图片最原始的高度和宽度
				$img.attr('data-initW', w);
				$img.attr('data-initH', h);
				defer.resolve();
			})
		}
		defer.done(function() {
			x = info.x - w / 2;
			y = info.y - h / 2;
			newLi.css({
				width: w,
				height: h,
				left: x,
				top: y,
				zIndex: cvsSet.zIndex++
					//transform: 'scale(' + cvsSet.scale + ')'
			});
			newLi.attr('data-initW', w);
			newLi.attr('data-initH', h);
			newLi.attr('data-initL', x);
			newLi.attr('data-initT', y);
			$inner.attr('data-cx', $inner.offset().left + $inner.width() / 2)
			$inner.attr('data-cy', $inner.offset().top + $inner.height() / 2)
				//初始化放大缩小
			setZoom($inner, false)
			cvsSet.localSave();
		});
		var newProc = new Product(newLi);
		newProc.init(); //最后初始化

		//初始化锁定按钮状态
		cvsSet.setLockStatus(false);
		$('#j-cvs_set li.active').removeClass('active');
		return newProc;
	}

	function setZoom(ele, bool) {
		ele.css({
			transform: 'scale(' + cvsSet.scale + ')'
		});
		var $pointctrl = ele.parents('ul').siblings('.g-pointctrl');
		var num = 1;
		if($pointctrl.length > 0) {
			var num = ele.closest('ul').find('li').length;
		} else {
			$pointctrl = ele.siblings('.g-pointctrl');
		}
		$pointctrl.css({
			transform: 'scale(' + 1* cvsSet.scale + ')'
		});
		//$pointctrl.find('span').css('transform', 'scale(' + 1 / cvsSet.scale + ')');
	}

	function setLockStatus(flag) {
		//flag表示是否处于锁定状态
		var icon = $('#j-lock .icon');
		if(flag) {
			icon.removeClass('icon-lock');
			icon.addClass('icon-unlock');
			$('#j-lock').attr('data-name', '解锁');
		} else {
			icon.removeClass('icon-unlock');
			icon.addClass('icon-lock');
			$('#j-lock').attr('data-name', '锁定');
		}
	}

	function localSave() {
		//本地数据存储 用于存储当前画布的 的所有html节点数据  用于返回和提交后台数据
		// key值为 当前画布id加版本号 ： id +","+version;
		// velue为 画布所有的html节点；
		
		//本地存储
		var _id = $('#j-cvs_set >ul.active').attr('id');
		var version =parseInt( $('#j-cvs_set >ul.active').data('version'));
		version++;
		var html=$('#j-cvs_set >ul.active').html()
		var key=_id+","+version;
		window.sessionStorage.setItem(key,html);	
		$('#j-cvs_set >ul.active').data('version',version)
		var max_ver=10;
		//最大存max步，如果超出，则销毁前面的
		sessionStorage.removeItem(_id+","+(version-10));
	}

	return {
		cur: cur,
		zIndex: zIndex,
		scale: scale,
		trpos: trpos,
		bind: bind,
		setTabWidth: setTabWidth,
		addProduct: addProduct,
		setLockStatus: setLockStatus,
		setZoom: setZoom,
		localSave: localSave
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
	//是否显示输入框
Product.prototype.isShowInputBox = function() {
		$.hideInput();
		//文本输入框是否显示
		var $input = this.obj.find('.u-word');
		var $ul = this.obj.find('ul');
		if($('#j-cvs_set li.active').length == 1 && $input.length > 0 && $ul.length < 1) {
			$.showInput($input);
		}
	}
	//点击或按下时添加被选中项目
Product.prototype.addSelectItem = function(e) {
	if(!this.obj.hasClass('active')) {
		if(!e.shiftKey) {
			$('#j-cvs_set li').removeClass('active');
		}
		this.obj.addClass('active');
	}
	//显示相关推荐
	var $img = $('#j-cvs_set li.active').eq(0).find('img');
	if($('#j-cvs_set li.active').length == 1 && $img.length == 1) {
		relImg.load('tmp/relImg.json');
		if(this.obj.attr('data-cg') == 'proc') {
			relProc.load('tmp/relProc.json');
		} else {
			$('.g-relative_proc').hide();
		}
	} else {
		$('.g-relative_proc').hide();
		$('.g-relative_img').hide();
	}
}
Product.prototype.selected = function(e,_this) {
	var _this = this;
		//事件绑定
		_this.obj.on('click',function(e) {
			_this.addSelectItem(e);
			//锁定按钮状态
			if($('#j-cvs_set li.active').length > 0) {
				var off = true;
				$('#j-cvs_set li.active').each(function(i, ele) {
					if(!$(ele).hasClass('lock')) {
						off = false;
					}
				});
				cvsSet.setLockStatus(off);
			}
			_this.isShowInputBox();
			return false;
		});
	}
	//移动
Product.prototype.drag = function() {
		var _this = this;
		this.obj.on('mousedown', function(e) {
			var tmpAngle = [];
			_this.addSelectItem(e);
			_this.isShowInputBox();
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
				y = 0,
				$ul,
				angleLi; //临时变量
			$(document).on('mousemove.drag', function(e) {
				x = e.pageX - startx;
				y = e.pageY - starty;
				$('#j-cvs_set li.active').each(function(i, ele) {
					$ul = $(ele).find('ul');
					if($ul.length > 0) {
						$(ele).css('transform', 'translate3d(' + x + 'px,' + y + 'px,0px) rotateZ(' + tmpAngle[i] + 'deg)');
						$ul.find('li').each(function(i, eleLi) {
							angleLi = parseFloat($(eleLi).attr('data-angle'));
							angleLi = angleLi ? angleLi : 0;
							$(eleLi).css('transform', 'rotateZ(' + angleLi + 'deg)');
						});
					} else {
						$(ele).css('transform', 'translate3d(' + x + 'px,' + y + 'px,0px) rotateZ(' + tmpAngle[i] + 'deg)');
					}
				});
			});
			$(document).on('mouseup.drag', function(e) {
				$(document).off('.drag');
				$('#j-cvs_set li.active').each(function(i, ele) {
					$ul = $(ele).find('ul');
					if($ul.length > 0) {
						$(ele).css('transform', 'translate3d(0px,0px,0px) rotateZ(' + tmpAngle[i] + 'deg)');
						$ul.find('li').each(function(i, eleLi) {
							angleLi = parseFloat($(eleLi).attr('data-angle'));
							angleLi = angleLi ? angleLi : 0;
							$(eleLi).css('transform', 'rotateZ(' + angleLi + 'deg)');
						});
					} else {
						$(ele).css('transform', 'translate3d(0px,0px,0px) rotateZ(' + tmpAngle[i] + 'deg)');
					}
					//在移动或者旋转中获取元素的位置都用.css()的方法，不用offset(),原因是不管是移动、旋转、或者放大缩小，offset()的值都在变化，只有通过.css()方法才能获取变化前的那个值
					$(ele).css({
						left: parseFloat($(ele).css('left')) + x,
						top: parseFloat($(ele).css('top')) + y
					});
				});
				if (x!=0||y!=0) {
					//本地存储
					cvsSet.localSave();
				}
			});
			return false;
		});
	}
	//旋转
Product.prototype.rotate = function() {
		var _this = this;
		var $ul,
			angleZ = 0, //旋转角度
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
					$ul = _this.obj.find('ul');
					if($ul.length > 0) {
						_this.obj.css('transform', 'rotateZ(' + angle + 'deg)');
						$ul.find('li').each(function(i, eleLi) {
							angleLi = parseFloat($(eleLi).attr('data-angle'));
							angleLi = angleLi ? angleLi : 0;
							$(eleLi).css('transform', 'rotateZ(' + angleLi + 'deg)');
						});
					} else {
						_this.obj.css('transform', 'rotateZ(' + angle + 'deg)');
					}
				});
				$(document).on('mouseup.rotate', function(e) {
					$(document).off('.rotate');
					//保存已经旋转的角度值
					_this.obj.attr('data-angle', angle);
					$('body').css('cursor', 'default');
					cvsSet.localSave();
				});
				return false;
			}
		});
	}
	//放大和缩小
Product.prototype.scale = function() {
	var _this = this;
	var bases = [];
	var scale = 0;
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
			dist = 0;
		$('#j-cvs_set li.active').each(function(i, ele) {
			var base = {
				width: $(ele).width(),
				height: $(ele).height(),
				left: parseFloat($(ele).css('left')),
				top: parseFloat($(ele).css('top'))
			};
			bases.push(base);
			var $ul = $(ele).find('ul');
			if($ul.length > 0) {
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
			cvsSet.localSave();
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
		var $inner = tar.ele.find('.inner');
		var $img = $inner.find('.img');
		if($inner.length > 1) {
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
				$(eleLi).find('.img').css({
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

