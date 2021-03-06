$(function() {
	//初始化
	function init() {
		win.init();
		library.init();
		bind();
		//清空所有的本地数据
		sessionStorage.clear()
	}
	//所有dom元素绑定事件
	function bind() {
		win.bind();
		menu.bind();
		tool.bind();
		library.bind();
		cvsSet.bind();
		relProc.bind();
		relImg.bind();
	}

	//全局模块
	var win = (function() {
		var flag = false; //flag代表是否全屏化，若全屏化，则头部高度为0
		function init() {
			initCvsHeight();
			initLibHeight();
			//初始化画布的中心点
			cvsSet.trpos.cx = ($('#j-cvs_set').width() - $('#j-tools').width() - $('#j-library').width()) / 2;
			cvsSet.trpos.cy = $('#j-cvs_set').height() / 2 + $('#j-cvs_set').offset().top;
		}

		function bind() {
			resize();
			fullScreen();
			//pointCtrsHide()
		}
		//初始化画布主体区的高度
		function initCvsHeight() {
			var winHeight = $(window).height();
			var toph = win.flag ? 6 : 60;
			$('#software').css('height', (winHeight - toph));
			var h = $('#software').height() - $('#j-menu').height();
			$('#j-cvs_main').css('height', h);
		}

		//初始化列表区高度
		function initLibHeight() {
			//库面板列表主体区的高度
			var libh = $('#j-lib_content').parent('.g-library').height();
			$('#j-lib_content').siblings().each(function(i, ele) {
				libh -= $(ele).outerHeight(true);
			});
			libh = libh < 114 ? 114 : libh; //这里设置最小高度的原因是，如果高度低于114，且子级存在分页时，页面布局看着上不美观
			$('#j-lib_content').height(libh);

			//产品类条件筛选框的高度,不能高于列表区的高度
			if($('.pop-cond').height() > libh) {
				$('.pop-cond').height(libh);
			}

			//库面板产品类分类列表高度
			$('.g-procs_wrap').height($('#j-lib_content').height());
		}

		function resize() {
			//窗口大小发生变化时，重置画布大小
			$(window).resize(function() {
				init();
			});
		}

		function fullScreen() {
			var val = 0; //差值
			//全屏显示
			$(document).on('click', '#j-full_screen', function() {
				if(!win.flag) {
					$('#software').css({
						position: 'absolute',
						'left': 0,
						'top': 0,
						'zIndex': 10007
					});
					val = -54;
					win.flag = true;
				} else {
					$('#software').css({
						position: 'static'
					});
					val = 54;
					win.flag = false;
				}
				init();
				//库面板、工具栏、tab栏的高度跟着变化
				$('#j-cvs_tab').css('top', $('#j-cvs_tab').offset().top + val);
				$('#j-input_word').css('top', $('#j-input_word').offset().top + val);
				$('#j-tools').css({
					top: $('#j-tools').offset().top + val,
					height: $('#j-tools').height() - val
				});
				$('#j-library').css({
					top: $('#j-library').offset().top + val,
					height: $('#j-library').height() - val
				});
				initLibHeight();
			});
		}

		function pointCtrsHide() {
			$(document).on('click', function() {
				$('.g-pointctrl').hide();
			});
		}

		return {
			init: init,
			bind: bind
		}

	})();

	//菜单模块
	var menu = (function() {
		function bind() {
			showSubMenu();
			newCvs();
			savePop();
			openPop();
			cancelCvs();
			clearCvs();
		}
		//菜单栏,鼠标置上显示二级菜单，移开隐藏二级菜单
		function showSubMenu() {
			var timer = null;
			$(document).on('mouseover', '.u-menu_item', function() {
				clearInterval(timer);
				$(this).find('.g-submenu').show();
				$(this).siblings('li').find('.g-submenu').hide();

			});
			$(document).on('mouseout', '.u-menu_item', function() {
				var _this = this;
				//用定时器解决 鼠标绝对定位有间隙元素 移出后就立即隐藏了bug
				timer = setTimeout(function() {
					$(_this).find('.g-submenu').hide();
				}, 300);
			});
		}
		//新建
		function newCvs() {
			$(document).on('click', '#j-new_cvs', function() {
				var cvsItem = $('<ul data-version="0">');
				var cvsTab = $('<li class="active">' +
					'<input type="text" value="空白页" readonly="readonly" />' +
					'<div class="u-tabc_chbt">' +
					'<a href="javascript:" class="u-rename"><i class="icon icon-edit"></i></a>' +
					'<a href="javascript:" class="u-prev"><i class="icon icon-prev"></i></a>' +
					'<a href="javascript:" class="u-next"><i class="icon icon-next"></i></a>' +
					'<a href="javascript:" class="u-close"><i class="icon icon-close"></i></a>' +
					'</div>' +
					'</li>');
				cvsItem.attr('id', 'cvs' + $('#j-cvs_set >ul').length);
				$('#j-cvs_set').append(cvsItem);
				$('#j-tabc').append(cvsTab);
				cvsSet.setTabWidth();
				$('#j-page_right').trigger('click');
				$('#j-cvs_set ul').removeClass('active');
				cvsItem.addClass('active');
				$('#j-tabc li').removeClass('active');
				cvsTab.addClass('active');
				cvsSet.cur = $('#j-tabc li').length - 1;
			});
		}
		//保存、发布弹出框
		function savePop() {
			$(document).on('click', '.u-pairs', function() {
				$.pop({
					title: '保存搭配',
					content: '<dl class="clearfix">' +
						'<dt><img src="tmp/proc01.png"/></dt>' +
						'<dd>' +
						'<div class="row">' +
						'<div class="col col-1">名称:</div>' +
						'<div class="col col-2"><input class="col-content" type="text" value="空白页" /></div>' +
						'</div>' +
						'<div class="row row-color">' +
						'<div class="col col-1">色系:</div>' +
						'<div class="col col-2">' +
						'<div class="col-content">' +
						'<span></span>' +
						'<i class="icon icon-traigledown"></i>' +
						'</div>' +
						'<div class="subcol-color subcol-2">' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'<a href="javascript:"><i></i></a>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<div class="row">' +
						'<div class="col col-1">风格:</div>' +
						'<div class="col col-2"><input class="col-content" type="text" value="田园简欧" /></div>' +
						'</div>' +
						'<div class="row">' +
						'<div class="col col-1">空间:</div>' +
						'<div class="col col-2">' +
						'<div class="col-content">' +
						'<span>其它</span>' +
						'<i class="icon icon-traigledown"></i>' +
						'</div>' +
						'<div class="subcol subcol-2">' +
						'<a href="javascript:">其它</a>' +
						'<a href="javascript:">雪茄房</a>' +
						'<a href="javascript:">前台</a>' +
						'<a href="javascript:">大堂</a>' +
						'<a href="javascript:">主卧</a>' +
						'<a href="javascript:">入户花园</a>' +
						'<a href="javascript:">会客区</a>' +
						'<a href="javascript:">宴会厅</a>' +
						'<a href="javascript:">红酒房</a>' +
						'<a href="javascript:">书房</a>' +
						'<a href="javascript:">客厅</a>' +
						'<a href="javascript:">储藏室</a>' +
						'<a href="javascript:">阳台</a>' +
						'<a href="javascript:">庭院</a>' +
						'<a href="javascript:">娱乐室</a>' +
						'<a href="javascript:">棋牌室</a>' +
						'<a href="javascript:">走廊</a>' +
						'<a href="javascript:">工作室</a>' +
						'<a href="javascript:">卫生间</a>' +
						'<a href="javascript:">厨房</a>' +
						'<a href="javascript:">茶室</a>' +
						'<a href="javascript:">老人房</a>' +
						'<a href="javascript:">婴儿房</a>' +
						'<a href="javascript:">儿童房</a>' +
						'<a href="javascript:">衣帽间</a>' +
						'<a href="javascript:">卧室</a>' +
						'<a href="javascript:">餐厅</a>' +
						'<a href="javascript:">玄关</a>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<div class="row">' +
						'<div class="col col-1">户型:</div>' +
						'<div class="col col-2">' +
						'<div class="col-content">' +
						'<span>两室一厅</span>' +
						'<i class="icon icon-traigledown"></i>' +
						'</div>' +
						'<div class="subcol subcol-2">' +
						'<a href="javascript:">两室一厅</a>' +
						'<a href="javascript:">三室一厅</a>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<div class="row">' +
						'<div class="col col-1">面积:</div>' +
						'<div class="col col-2">' +
						'<div class="col-content">' +
						'<span>90-180</span>' +
						'<i class="icon icon-traigledown"></i>' +
						'</div>' +
						'<div class="subcol subcol-2">' +
						'<a href="javascript:">90-180</a>' +
						'<a href="javascript:">90</a>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<div class="row">' +
						'<div class="col col-1">商业空间:</div>' +
						'<div class="col col-2">' +
						'<div class="col-content">' +
						'<span>其它</span>' +
						'<i class="icon icon-traigledown"></i>' +
						'</div>' +
						'<div class="subcol subcol-2">' +
						'<a href="javascript:">其它</a>' +
						'<a href="javascript:">居家</a>' +
						'<a href="javascript:">ktv</a>' +
						'<a href="javascript:">影院</a>' +
						'<a href="javascript:">酒吧</a>' +
						'<a href="javascript:">健身房</a>' +
						'<a href="javascript:">公寓</a>' +
						'<a href="javascript:">办公室</a>' +
						'<a href="javascript:">售楼处</a>' +
						'<a href="javascript:">橱窗</a>' +
						'<a href="javascript:">专卖店</a>' +
						'<a href="javascript:">展示厅</a>' +
						'<a href="javascript:">样板房</a>' +
						'<a href="javascript:">会所</a>' +
						'<a href="javascript:">别墅</a>' +
						'<a href="javascript:">酒店</a>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</dd>' +
						'</dl>',
					className: 'pop-save',
					id: 'j-save_pairs',
					callback: function() {
						$('#j-save_pairs .icon-traigledown').on('click', function() {
							$(this).parents('.col-2').find('.subcol-2').toggle();
						});
						$('#j-save_pairs .subcol-2 a').on('click', function() {
							var par = $(this).parents('.subcol-2');
							var con = par.siblings('.col-content').find('span');
							par.hide();
							if(par.hasClass('subcol-color')) {
								var bg = $(this).find('i').eq(0).css('background');
								con.css('background', bg);
							} else {
								var val = $(this).html();
								con.html(val);
							}
						});
					}
				});
			});
			$(document).on('click', '.u-plan', function() {
				$.pop({
					title: '保存方案',
					content: '<dl class="clearfix">' +
						'<dt><img src="tmp/proc01.png"/></dt>' +
						'<dd>' +
						'<div class="row">' +
						'<div class="col col-1">名称:</div>' +
						'<div class="col col-2"><input class="col-content" type="text" value="方案名称" /></div>' +
						'</div>' +
						'<div class="row">' +
						'<div class="col col-1">类别:</div>' +
						'<div class="col col-2">' +
						'<div class="col-content">' +
						'<span>健身房</span>' +
						'<i class="icon icon-traigledown"></i>' +
						'</div>' +
						'<div class="subcol subcol-2">' +
						'<a href="javascript:">健身房</a>' +
						'<a href="javascript:">公寓</a>' +
						'<a href="javascript:">专卖店</a>' +
						'<a href="javascript:">俱乐部</a>' +
						'<a href="javascript:">橱窗</a>' +
						'<a href="javascript:">展示厅</a>' +
						'<a href="javascript:">会所</a>' +
						'<a href="javascript:">别墅</a>' +
						'<a href="javascript:">酒店</a>' +
						'<a href="javascript:">办公室</a>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<div class="row">' +
						'<div class="col col-1">风格:</div>' +
						'<div class="col col-2">' +
						'<div class="col-content">' +
						'<span>其它</span>' +
						'<i class="icon icon-traigledown"></i>' +
						'</div>' +
						'<div class="subcol subcol-2">' +
						'<a href="javascript:">田园简欧</a>' +
						'<a href="javascript:">田园</a>' +
						'<a href="javascript:">简欧</a>' +
						'<a href="javascript:">简美</a>' +
						'<a href="javascript:">北欧</a>' +
						'<a href="javascript:">其他混塔</a>' +
						'<a href="javascript:">伊斯兰</a>' +
						'<a href="javascript:">地中海</a>' +
						'<a href="javascript:">日式</a>' +
						'<a href="javascript:">现代</a>' +
						'<a href="javascript:">浅色现代</a>' +
						'<a href="javascript:">现代中式</a>' +
						'<a href="javascript:">现代波普</a>' +
						'<a href="javascript:">现代北欧</a>' +
						'<a href="javascript:">现代奢华</a>' +
						'<a href="javascript:">现代极简</a>' +
						'<a href="javascript:">新中式</a>' +
						'<a href="javascript:">新中式</a>' +
						'<a href="javascript:">中式传统</a>' +
						'<a href="javascript:">美式</a>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<div class="row">' +
						'<div class="col col-1">面积:</div>' +
						'<div class="col col-2">' +
						'<div class="col-content">' +
						'<span>90-180</span>' +
						'<i class="icon icon-traigledown"></i>' +
						'</div>' +
						'<div class="subcol subcol-2">' +
						'<a href="javascript:">90-180</a>' +
						'<a href="javascript:">90</a>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<div class="row">' +
						'<div class="col col-1">户型:</div>' +
						'<div class="col col-2">' +
						'<div class="col-content">' +
						'<span>两室一厅</span>' +
						'<i class="icon icon-traigledown"></i>' +
						'</div>' +
						'<div class="subcol subcol-2">' +
						'<a href="javascript:">两室一厅</a>' +
						'<a href="javascript:">三室一厅</a>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</dd>' +
						'</dl>',
					id: 'j-save_plan',
					className: 'pop-save',
					callback: function() {
						$('#j-save_plan .icon-traigledown').on('click', function() {
							$(this).parents('.col-2').find('.subcol-2').toggle();
						});
						$('#j-save_plan .subcol-2 a').on('click', function() {
							var par = $(this).parents('.subcol-2');
							var con = par.siblings('.col-content').find('span');
							par.hide();
							if(par.hasClass('subcol-color')) {
								var bg = $(this).find('i').eq(0).css('background');
								con.css('background', bg);
							} else {
								var val = $(this).html();
								con.html(val);
							}
						});
					}
				});
			});
		}
		//打开
		function openPop() {
			$(document).on('click', '#j-open', function() {
				$.pop({
					title: '打开',
					content: '<div class="pop-tab">' +
						'<span class="active">搭配</span>' +
						'<span>方案</span>' +
						'</div>' +
						'<div class="clearfix">' +
						'<div class="cho_cond">' +
						'<span class="active">全部搭配</span>' +
						'<span>未公开搭配</span>' +
						'<span>公开搭配</span>' +
						'</div>' +
						'<div class="pop-search">' +
						'<i class="icon icon-search"></i>' +
						'<input type="text" placeholder="搜索" />' +
						'</div>' +
						'</div>' +
						'<div class="pop-con_wrap">' +
						'<ul id="j-pop_list" class="clearfix">' +

						'</ul>' +
						'<script id="t-pop_list" type="text/template7">' +
						'{{#each list}}' +
						'<li>' +
						'<a href="javascript:"><img src="{{url}}"/></a>' +
						'<p>{{name}}</p>' +
						'</li>' +
						'{{/each}}' +
						'</script>' +
						'</div>',
					id: 'j-open_pop',
					className: 'pop-open',
					callback: function() {
						//获取打开弹出框的数据
						function getOpenData(url) {
							var data = new DataLoader({
								template: $('#t-pop_list'),
								container: $('#j-pop_list'),
								url: url
							});
							data.getData();
						}

						getOpenData('tmp/pop-list.json');

						$('#j-open_pop .pop-tab span').on('click', function() {
							$(this).addClass('active').siblings().removeClass('active');
							getOpenData('tmp/pop-list.json');
						});
						$('#j-open_pop .cho_cond span').on('click', function() {
							$(this).addClass('active').siblings().removeClass('active');
							getOpenData('tmp/pop-list.json');
						});
					}
				});
			});
		}

		//撤销
		function cancelCvs() {
			$(document).on('click', '#j-cancel', function() {
				$('.g-relative_proc').hide();
				$('.g-relative_img').hide();
				var _id = $('#j-cvs_set >ul.active').attr('id');
				var version = parseInt($('#j-cvs_set >ul.active').data('version'));
				version--;
				var key = _id + "," + version;
				var html = sessionStorage.getItem(key);
				$('#j-cvs_set >ul.active').html(html);
				$('#j-cvs_set >ul.active').data('version', version)
					//回退后即从本地存储中删除
				sessionStorage.removeItem(_id + "," + (version - 10));
				var $li = $('#j-cvs_set >ul.active').find('>li');
				var newProc;
				for(var i = 0; i < $li.length; i++) {
					newProc = new Product($li.eq(i));
					newProc.init();
				}
			});
		}

		//清空
		function clearCvs() {
			$(document).on('click', '#j-reset', function() {
				$('#j-cvs_set >ul.active').html('');
			});
		}

		return {
			bind: bind
		}
	})();

	var tool = (function() {
		function bind() {
			showToolName();
			deleteProc();
			copyProc();
			beGroup();
			toPart();
			flipHorizontalProc();
			flipVerticalProc();
			layerForward();
			layerTop();
			layerBackward();
			layerBottom();
			toggleLock();
			zoomInAndOut();
		}
		//鼠标放在工具栏上显示工具的名称
		function showToolName() {
			$(document).on('mouseover', '#j-tools a', function(e) {
				$.showName({
					x: e.pageX + 5,
					y: e.pageY + 5,
					text: $(this).attr('data-name')
				});
			});
			$(document).on('mouseout', '#j-tools a', function(e) {
				$.hideName();
			});
		}

		//删除
		function deleteProc() {
			//通过工具栏删除
			$(document).on('click', '#j-delete', function() {
				$('#j-cvs_set li.active').remove();
				$('.g-relative_proc').hide();
				$('.g-relative_img').hide();
				cvsSet.localSave();
			});
			//通过键盘delete删除
			$(document).on('keydown', function(e) {
				if(e.keyCode == 8) {
					$('#j-cvs_set li.active').remove();
					$('.g-relative_proc').hide();
					$('.g-relative_img').hide();
					cvsSet.localSave();
				}
			});
		}
		//复制
		function copyProc() {
			$(document).on('click', '#j-copy', function() {
				$('#j-cvs_set li.active').each(function(i, ele) {
					var $copy = $(ele).clone();
					$copy.css({
						left: parseFloat($(ele).css('left')) + 10,
						top: parseFloat($(ele).css('top')) + 10
					});

					$(ele).removeClass('active');
					$copy.removeClass('lock');
					$copy.addClass('active');
					//保证每个Li的zIndex都不重复
					var $li = $copy.find('li');
					if($li.length > 0) {
						$copy.css('zIndex', cvsSet.zIndex);
						var rs=[];
						for (var i=0;i<$li.length;i++) {
							rs.push($li.eq(i));
						}
						rs.sort(function(obj1, obj2) {
							return parseInt(obj1.css('zIndex')) - parseInt(obj2.css('zIndex'));
						});
						for(var i = 0; i < rs.length; i++) {
							rs[i].css('zIndex', cvsSet.zIndex++);
						}
					} else {
						$copy.css('zIndex', cvsSet.zIndex++);
					}
					$('#j-cvs_set ul.active').append($copy);
					updatePos($copy);
					var newProc = new Product($copy);
					newProc.init();
				});
				cvsSet.localSave();
				return false;
			});
		}
		//水平镜像
		function flipHorizontalProc() {
			$(document).on('click', '#j-fliphorizontal', function() {
				$('#j-cvs_set li.active').each(function(i, ele) {
					var $ul = $(ele).find('ul');
					var $obj = $ul.length > 0 ? $ul : $(ele).find('.img');
					var angle = $obj.attr('data-angle'); //旋转角度
					if(angle) {
						angle = JSON.parse(angle);
						angle.x = angle.x ? angle.x : 0;
						angle.y = angle.y ? angle.y : 0;
					} else {
						angle = {};
						angle.x = 0;
						angle.y = 0;
					}
					angle.y += 180;
					$obj.css('transform', 'rotateY(' + angle.y + 'deg) rotateX(' + angle.x + 'deg)');
					angle = JSON.stringify(angle);
					$obj.attr('data-angle', angle);
				});
				cvsSet.localSave();
				return false;
			});
		}
		//垂直
		function flipVerticalProc() {
			$(document).on('click', '#j-flipvertical', function() {
				$('#j-cvs_set li.active').each(function(i, ele) {
					var $ul = $(ele).find('ul');
					var $obj = $ul.length > 0 ? $ul : $(ele).find('.img');
					var angle = $obj.attr('data-angle'); //旋转角度
					if(angle) {
						angle = JSON.parse(angle);
						angle.x = angle.x ? angle.x : 0;
						angle.y = angle.y ? angle.y : 0;
					} else {
						angle = {};
						angle.x = 0;
						angle.y = 0;
					}
					angle.x += 180;
					$obj.css('transform', 'rotateX(' + angle.x + 'deg) rotateY(' + angle.y + 'deg)');
					angle = JSON.stringify(angle);
					$obj.attr('data-angle', angle);
				});
				cvsSet.localSave();
				return false;
			});
		}

		//成组
		function beGroup() {
			$(document).on('click', '#j-group', function() {
				var maxZIndex = 0 //找到子级中zIndex最大值的那个值赋给父级的zIndex
				var $activeLi = $('#j-cvs_set li.active');
				if($activeLi.length > 1) {
					var $newLi = $('<li>' +
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
						'<ul></ul></li>');
					$newLi.css('padding', 0);
					var $first = $('#j-cvs_set li.active').eq(0);
					var pos = getPointPos($first);
					var left = pos.l,
						top = pos.t,
						right = pos.r,
						bottom = pos.b;
					$first.siblings('.active').each(function(i, ele) {
						pos = getPointPos($(ele));
						left = pos.l < left ? pos.l : left;
						right = pos.r > right ? pos.r : right;
						top = pos.t < top ? pos.t : top;
						bottom = pos.b > bottom ? pos.b : bottom;
					});
					$newLi.css({
						width: right - left,
						height: bottom - top,
						left: left,
						top: top
					});
					var $ul = $newLi.find('ul');
					$activeLi.each(function(i, ele) {
						var $img = $(ele).find('.img');
						maxZIndex = parseInt($(ele).css('zIndex')) > maxZIndex ? parseInt($(ele).css('zIndex')) : maxZIndex;
						var angle = parseFloat($(ele).attr('data-angle'));
						angle = angle ? angle : 0;
						if($img.length > 1) {
							getPartEle({
								ele: $(ele),
								par: $ul,
								left: left,
								top: top
							});

						} else {
							$(ele).css({
								left: parseFloat($(ele).css('left')) - left,
								top: parseFloat($(ele).css('top')) - top,
							});
							$ul.append($(ele));
						}

					});
					$activeLi.removeClass('active');
					$activeLi.off();
					$newLi.css('zIndex', maxZIndex);
					$newLi.addClass('active');
					$('#j-cvs_set ul.active').append($newLi);
					updatePos($newLi)
					var newProc = new Product($newLi);
					newProc.init();
				}
				cvsSet.localSave();
				return false;
			});
		}
		//更新pos位置
		function updatePos(ele){
			//保存中心点
			var pos = {
				"cx": parseFloat(ele.css('left')) + ele.width() / 2,
				"cy": parseFloat(ele.css('top')) + ele.height() / 2,
				"x": parseFloat(ele.css('left')),
				"y": parseFloat(ele.css('top')),
				"w": ele.width(),
				"h": ele.height(),
				"scale": 1 - cvsSet.scale
			};
			ele.data('pos', pos);
			ele.find('li').each(function(i, eleLi) {
				var posLi = {
					"w": $(eleLi).width(),
					"h": $(eleLi).height(),
					"l": parseFloat($(eleLi).css('left')),
					"t": parseFloat($(eleLi).css('top'))
				}
				$(eleLi).data('pos', posLi);
			});
		}
		//分解
		function toPart() {
			$(document).on('click', '#j-part', function() {
				$('#j-cvs_set li.active').each(function(i, ele) {
					var $img = $(ele).find('.img');
					if($img.length > 1) {
						getPartEle({
							ele: $(ele),
							par: $('#j-cvs_set ul.active'),
							left: 0,
							top: 0
						});
					}
				});
				cvsSet.localSave();
				return false;
			});
		}

		//获取分解后的元素Li
		function getPartEle(tar) {
			var $ul = tar.ele.find('ul');
			//找到成组后ul镜像翻转的角度
			var angleImg = getMirrorAngle($ul); //旋转角度

			var angle = parseFloat(tar.ele.attr('data-angle'));
			angle = angle ? angle : 0;
			tar.ele.find('li').each(function(j, eleLi) {
				//计算成组后镜像翻转left和top的变化值
				var mirX = angleImg.y % 360 == 0 ? 0 : (2 * (tar.ele.width() / 2 - parseFloat($(eleLi).css('left')) - $(eleLi).width() / 2 - 5));
				var mirY = angleImg.x % 360 == 0 ? 0 : (2 * (tar.ele.height() / 2 - parseFloat($(eleLi).css('top')) - $(eleLi).height() / 2 - 5));
				//初始时，父级的中心点到子级Li中心点的向量AB
				var ABx = parseFloat($(eleLi).css('left')) + $(eleLi).width() / 2 - tar.ele.width() / 2;
				var ABy = parseFloat($(eleLi).css('top')) + $(eleLi).height() / 2 - tar.ele.height() / 2;
				//AB向量与X轴的夹角，注意坐标轴是向左向下为正值
				var triangle = Math.atan2(ABy, ABx) * 360 / (2 * Math.PI);
				//加上旋转后的角度
				triangle += angle;
				var AB = Math.sqrt(Math.pow(ABx, 2) + Math.pow(ABy, 2));
				//旋转后子级中心点到父级的中心点向量AC
				var ACx = AB * Math.cos(triangle / 180 * Math.PI);
				var ACy = AB * Math.sin(triangle / 180 * Math.PI);
				//disx,disy表示旋转后子级Li中心点移动的距离
				var disx = ACx - ABx;
				var disy = ACy - ABy;
				var angleEle = parseFloat($(eleLi).attr('data-angle'));
				angleEle = angleEle ? angleEle : 0;
				angleEle += angle;
				$(eleLi).css({
					left: parseFloat($(eleLi).css('left')) + parseFloat(tar.ele.css('left')) + disx + mirX - tar.left,
					top: parseFloat($(eleLi).css('top')) + parseFloat(tar.ele.css('top')) + disy + mirY - tar.top,
					transform: 'rotateZ(' + angleEle + 'deg)'
				});
				$(eleLi).attr('data-angle', angleEle);
				var $img = $(eleLi).find('.img').eq(0);
				var angleLiImg = getMirrorAngle($img);
				angleLiImg.x += angleImg.x;
				angleLiImg.y += angleImg.y;
				$img.css('transform', 'rotateX(' + angleLiImg.x + 'deg) rotateY(' + angleLiImg.y + 'deg)');
				$img.attr('data-angle', JSON.stringify(angleLiImg))
				tar.par.append($(eleLi));
				if(tar.left == 0) {
					var newProc = new Product($(eleLi));
					newProc.init();
				}
			});
			tar.ele.remove();
		}

		//获取镜像转角
		function getMirrorAngle(ele) {
			var angle = ele.attr('data-angle'); //旋转角度
			if(angle) {
				angle = JSON.parse(angle);
				angle.x = angle.x ? angle.x : 0;
				angle.y = angle.y ? angle.y : 0;
			} else {
				angle = {};
				angle.x = 0;
				angle.y = 0;
			}
			return angle;
		}
		//获取控制点的坐标
		function getPointPos(obj) {
			var point = obj.find('.m-pointctrl span').eq(0);
			var pos = {
				l: point.offset().left,
				r: point.offset().left,
				t: point.offset().top,
				b: point.offset().top
			};
			point.siblings('span').each(function(i, ele) {
				if($(ele).offset().left < pos.l) {
					pos.l = $(ele).offset().left;
				} else if($(ele).offset().left > pos.r) {
					pos.r = $(ele).offset().left;
				}
				if($(ele).offset().top < pos.t) {
					pos.t = $(ele).offset().top;
				} else if($(ele).offset().top > pos.b) {
					pos.b = $(ele).offset().top;
				}
			});
			//将控制点的坐标转为实际元素的坐标
			pos = {
				l: pos.l + 5,
				r: pos.r + 5,
				t: pos.t + 5,
				b: pos.b + 5
			}
			return pos;
		}
		//上移一层
		function layerForward() {
			$(document).on('click', '#j-layerforward', function() {
				$('#j-cvs_set li.active').each(function(i, ele) {
					var rs = upLayer($(ele));
					if(rs.length > 0) {
						var zIndex = parseInt(rs[0].css('zIndex'));
						rs[0].css('zIndex', parseInt($(ele).css('zIndex')));
						$(ele).css('zIndex', zIndex);
					}
				});
				cvsSet.localSave();
				return false;
			});
		}
		//移至顶层
		function layerTop() {
			$(document).on('click', '#j-layertop', function() {
				$('#j-cvs_set li.active').each(function(i, ele) {
					var rs = upLayer($(ele));
					if(rs.length > 0) {
						var zIndex = parseInt(rs[rs.length - 1].css('zIndex'));
						for(var i = rs.length - 1; i > 0; i--) {
							rs[i].css('zIndex', parseInt(rs[i - 1].css('zIndex')));
						}
						rs[0].css('zIndex', parseInt($(ele).css('zIndex')));
						$(ele).css('zIndex', zIndex);
					}
				});
				cvsSet.localSave();
				return false;
			});
		}
		//下移一层
		function layerBackward() {
			$(document).on('click', '#j-layerbackward', function() {
				$('#j-cvs_set li.active').each(function(i, ele) {
					var rs = lowerLayer($(ele));
					if(rs.length > 0) {
						var zIndex = parseInt(rs[0].css('zIndex'));
						rs[0].css('zIndex', parseInt($(ele).css('zIndex')));
						$(ele).css('zIndex', zIndex);
					}
				});
				cvsSet.localSave();
				return false;
			});
		}
		//移至底层
		function layerBottom() {
			$(document).on('click', '#j-layerbottom', function() {
				$('#j-cvs_set li.active').each(function(i, ele) {
					var rs = lowerLayer($(ele));
					if(rs.length > 0) {
						var zIndex = parseInt(rs[rs.length - 1].css('zIndex'));
						for(var i = rs.length - 1; i > 0; i--) {
							rs[i].css('zIndex', parseInt(rs[i - 1].css('zIndex')));
						}
						rs[0].css('zIndex', parseInt($(ele).css('zIndex')));
						$(ele).css('zIndex', zIndex);
					}
				});
				cvsSet.localSave();
				return false;
			});
		}
		//找到上层的Li
		function upLayer(obj) {
			var $activeLi = $('#j-cvs_set li');
			var zIndex = parseInt(obj.css('zIndex'));
			var rs = [];
			var bl, br, bt, bb; //bool表示是否存在重叠的li
			var curLi;
			for(var i = 0; i < $activeLi.length; i++) {
				curLi = $activeLi.eq(i);
				if(i != obj.index()) {
					bl = (parseInt(curLi.css('left')) + curLi.width()) < parseInt(obj.css('left'));
					br = parseInt(curLi.css('left')) > (parseInt(obj.css('left')) + obj.width());
					bt = (parseInt(curLi.css('top')) + curLi.height()) < parseInt(obj.css('top'));
					bb = parseInt(curLi.css('top')) > (parseInt(obj.css('top')) + obj.height());
					if(bl || br || bt || bb) {
						continue;
					} else {
						if(parseInt(curLi.css('zIndex')) > zIndex) {
							rs.push(curLi);
						}
					}
				}
			}
			if(rs.length > 0) {
				rs.sort(function(obj1, obj2) {
					return parseInt(obj1.css('zIndex')) - parseInt(obj2.css('zIndex'));
				});
			}
			return rs;
		}
		//找到下层的Li
		function lowerLayer(obj) {
			var $activeLi = $('#j-cvs_set li');
			var zIndex = parseInt(obj.css('zIndex'));
			var rs = [];
			var bl, br, bt, bb; //bool表示是否存在重叠的li
			var curLi;
			for(var i = 0; i < $activeLi.length; i++) {
				curLi = $activeLi.eq(i);
				if(i != obj.index()) {
					bl = (parseInt(curLi.css('left')) + curLi.width()) < parseInt(obj.css('left'));
					br = parseInt(curLi.css('left')) > (parseInt(obj.css('left')) + obj.width());
					bt = (parseInt(curLi.css('top')) + curLi.height()) < parseInt(obj.css('top'));
					bb = parseInt(curLi.css('top')) > (parseInt(obj.css('top')) + obj.height());
					if(bl || br || bt || bb) {
						continue;
					} else {
						if(parseInt(curLi.css('zIndex')) < zIndex) {
							rs.push(curLi);
						}
					}
				}
			}
			if(rs.length > 0) {
				rs.sort(function(obj1, obj2) {
					return parseInt(obj2.css('zIndex')) - parseInt(obj1.css('zIndex'));
				});
			}
			return rs;
		}

		function toggleLock() {
			$(document).on('click', '#j-lock', function() {
				if($('#j-cvs_set li.active').length < 1) {
					return;
				}
				if($('#j-cvs_set li.active.lock').length < $('#j-cvs_set li.active').length) {
					cvsSet.setLockStatus(true);
					$('#j-cvs_set li.active').addClass('lock');
				} else {
					cvsSet.setLockStatus(false);
					$('#j-cvs_set li.active').removeClass('lock');
				}
				cvsSet.localSave();
				return false;
			});
		}

		//放大和缩小
		function zoomInAndOut() {
			var point = $('#j-zoom .u-dian').eq(0);
			//总长度的一半
			var ttL = Math.floor(($('#j-zoom').height() - point.height()) / 2);
			//初始化中心点
			var certer = parseFloat(point.css('top'));
			//当前长度
			var curL = 0;
			$(document).on('click', '#j-zoom .u-jia', function() {
				if(curL < ttL) {
					curL++;
					point.css('transform', 'translate3d(0,' + curL + 'px,0)');
					console.log()
					toZoom(curL);
				}
			});
			$(document).on('click', '#j-zoom .u-jian', function() {
				if(curL > -ttL) {
					curL--;
					point.css('transform', 'translate3d(0,' + curL + 'px,0)');
					toZoom(curL);
				}
			});
			point.on('mousedown', function(e) {
				$('body').css('cursor', 'pointer');
				var start = e.pageY;
				var top = 0;
				$(document).on('mousemove.zoom', function(e) {
					top = e.pageY - start;
					top += curL;
					if(top < -ttL) {
						top = -ttL;
					} else if(top > ttL) {
						top = ttL;
					}
					point.css('transform', 'translate3d(0,' + top + 'px,0)');
					toZoom(top);
				});
				$(document).on('mouseup.zoom', function() {
					$(document).off('.zoom');
					curL = top;
					$('body').css('cursor', 'default');
				});
			});

			function toZoom(curL) {
				//放大倍数范伟：.5-2
				cvsSet.scale = curL > 0 ? (1 + curL / ttL) : (1 + curL / (2 * ttL));
				$('#j-cvs_set >ul >li').each(function(i, ele) {
					cvsSet.setZoom($(ele), true);
				});
			}
		}

		return {
			bind: bind
		}
	})();

	//areaSelection表示地区选择弹出框
	var areaSelection = (function() {
		//province,city,area分别表示当前选的省、市、区
		var province, city, area;

		//初始化
		function init() {
			var cProvince = new DataLoader({
				template: $('#t-province'),
				container: $('#j-province'),
				url: 'tmp/province.json'
			});
			cProvince.getData();
			var cCity = new DataLoader({
				template: $('#t-city'),
				container: $('#j-city'),
				url: 'tmp/city.json'
			});
			cCity.getData();
			var cArea = new DataLoader({
				template: $('#t-area'),
				container: $('#j-area'),
				url: 'tmp/area.json'
			});
			cArea.getData();
			var cFloor = new DataLoader({
				template: $('#t-floor'),
				container: $('#j-floor'),
				url: 'tmp/floor.json'
			});
			cFloor.getData();

			province = $('#j-province').val(),
				city = $('#j-city').val(),
				area = $('#j-area').val();
		}

		function bind() {
			//地区选择，当省份变化时，加载市的数据
			$(document).on('change', '#j-province', function() {
				province = $(this).val();
				//根据省份的值加载城市的值
				var cCity = new DataLoader({
					template: $('#t-city'),
					container: $('#j-city'),
					url: 'tmp/city2.json'
				});
				cCity.getData();
			});
			//当城市变化时，加载区的数据
			$(document).on('change', '#j-city', function() {
				city = $(this).val();
				//根据省份的值加载城市的值
				var cArea = new DataLoader({
					template: $('#t-area'),
					container: $('#j-area'),
					url: 'tmp/area.json'
				});
				cArea.getData();
			});
			//当区变化时，加载楼盘的数据
			$(document).on('change', '#j-area', function() {
				area = $(this).val();
				//根据省份的值加载城市的值
				var cFloor = new DataLoader({
					template: $('#t-floor'),
					container: $('#j-floor'),
					url: 'tmp/city2.json'
				});
				cFloor.getData();
			});
		}

		return {
			init: init,
			bind: bind
		}
	})();

	//表示库面列表区事件
	var libContent = (function() {
		var num = 0; //记录当前tab栏Li的索引值
		var isdetail = false; //是否进入产品类的详情页

		//初始化
		function init() {
			//库面板加载数据
			var lib1 = new DataLoader({
				template: $('#t-item1_cg'),
				container: $('#j-procs_cg'),
				url: 'tmp/proc_cg.json'
			});
			lib1.getData();
		}

		function bind() {
			switchTab();
			showSubCg();
			toProcDetail();
			showInfoInProc();
			myCollection();
			remove();
			downImg();
			drag();
		}

		function switchTab() {
			//tab栏切换
			$(document).on('click', '.tab-bt li', function() {
				$('.pop-cond').hide(); //隐藏所有的筛选条件弹出框
				libContent.num = parseInt($(this).attr('href'));
				var param = {};
				switch(libContent.num) {
					case 1:
						param = {
							template: $('#t-comment'),
							container: $('#j-comment'),
							url: "tmp/common.json"
						};
						break;
					case 2:
						param = {
							template: $('#t-user'),
							container: $('#j-user'),
							url: "tmp/common.json"
						};
						break;
					case 3:
						param = {
							template: $('#t-collect'),
							container: $('#j-collect'),
							url: "tmp/common.json"
						};
						break;
					case 4:
						param = {
							template: $('#t-fodder'),
							container: $('#j-fodder'),
							url: "tmp/file.json"
						};
						break;
					case 6:
						param = {
							template: $('#t-bg'),
							container: $('#j-bg'),
							url: "tmp/bg.json"
						};
						break;
					case 7:
						param = {
							template: $('#t-color'),
							container: $('#j-color'),
							url: "tmp/color.json"
						};
						break;
					case 9:
						param = {
							template: $('#t-graph'),
							container: $('#j-graph'),
							url: "tmp/bg.json"
						};
						break;
					case 10:
						param = {
							template: $('#t-light'),
							container: $('#j-light'),
							url: "tmp/bg.json"
						};
						break;
					default:
						break;
				}
				if(param.url) {
					var data = new SubDataLoader(param);
					data.getData();
				}

				$('#j-lib_tab li').removeClass('active');
				$('.m-others').hide();
				$('#j-back').removeClass('show');
				if(libContent.num == 4) {
					$('.m-other_item2').show();
				} else if(libContent.num == 5) {
					$('.m-other_item3').show();
				} else {
					$('.m-other_item1').show();
				}
				if(libContent.num == 0) {
					$('#j-detail_wrap').hide();
					$('#j-procs_wrap').fadeIn();
					libContent.isdetail = false;
				}
				if(libContent.num < 6) {
					$(this).addClass('active');
				}
				$('#j-lib_content .content').addClass('hide');
				$('#j-lib_content .content').eq(libContent.num).removeClass('hide');

			});
		}

		function showSubCg() {
			//产品类中点击切换显示二级类目
			$(document).on('click', '#j-procs_cg h3', function() {
				var tarLi = $(this).parents('li');
				tarLi.addClass('active').siblings().removeClass('active');
				$("#j-procs_cg ul").hide()
				$(this).siblings("ul").fadeIn()
			});
		}

		function toProcDetail() {
			//产品类下的子目录类点击切换到详情页
			$(document).on('click', '.m-subprocs_cg li', function() {
				$('.pop-cond').hide();
				var id = $(this).attr('data-id');
				//根据id值加载详情页的数据
				var newList = new SubDataLoader({
					template: $('#t-item1_detail'),
					container: $('#j-procs_detail'),
					url: "tmp/proc_detail.json"
				});
				newList.getData();
				//根据id值加载筛选条件的数据
				var newCond = new DataLoader({
					template: $('#t-cond1_dt'),
					container: $('#j-cond1_dt'),
					url: "tmp/cond1_detail.json"
				});
				newCond.getData();
				$('#j-procs_wrap').hide();
				$('#j-detail_wrap').fadeIn();
				$('#j-back').addClass('show');
				libContent.isdetail = true;
			});
		}

		function showInfoInProc() {
			//在产品库详情下，鼠标放上显示详情信息
			$(document).on('mouseover', '#j-procs_detail li', function() {
				var l = $(this).position().left;
				if(($(this).index() + 1) % 5 == 0) {
					l += 68 - $('#j-proc_info').outerWidth();
				}
				var t = $(this).position().top + 60;
				console.log()
				$('#j-proc_info').css({
					left: l,
					top: t
				});
				$('#j-proc_info h4').html($(this).attr('data-name'));
				$('#j-proc_info strong').html($(this).attr('data-price'));
				$('#j-proc_info span').eq(0).html('规格：' + $(this).attr('data-spec'));
				$('#j-proc_info span').eq(1).html('材质：' + $(this).attr('data-material'));
				$('#j-proc_info span').eq(2).html('角度：' + $(this).attr('data-traigle'));
				$('#j-proc_info').show();
			});
			$(document).on('mouseout', '#j-procs_detail li', function() {
				$('#j-proc_info').hide();
			});
			$(document).on('mouseover', '#j-proc_info', function() {
				$('#j-proc_info').show();
			});
			$(document).on('mouseout', '#j-proc_info', function() {
				$('#j-proc_info').hide();
			});
		}

		function myCollection() {
			//点击爱心收藏到我的收藏夹中
			$(document).on('click', '.u-love', function() {
				if(!$(this).hasClass('loved')) {
					$(this).addClass('loved');
					var parLi = $(this).parent('li');
					/*
					 * 根据父级li的id,将该产品标志位收藏，且添加到收藏夹中
					 */
				}
			});
		}

		//点击close,删除li
		function remove() {
			$(document).on('click', '#j-lib_content .u-close', function(e) {
				$(this).parents('li').remove();
			});
		}
		//下载图片
		function downImg() {
			$(document).on('click', '.u-down', function() {
				var url = $(this).siblings('img').src;
				window.open(url, "_blank");
				return false;
			});
		}

		//库面板列表下的单元可拖动，松开后再画布区生产一个cvs-item元素
		function drag() {
			var dragObj = null;
			var w, h, l, t, $ul, color, src, id,
				off = false, //off设置为false,只有当lib-drag li点击后才设置为true,防止其它元素点击通过冒泡触发document的mouseup事件
				isColorBlock = false, //是否是颜色块
				isWordBlock = false, //是否是文字块
				isProc = ''; //是否是产品类，只有产品类才加载相关推荐
			$(document).on('mousedown', '.lib-drag li', function(e) {
				off = true;
				$ul = $(this).parent('ul');
				if($ul.hasClass('proc')) {
					isProc = 'proc';
				}
				if($ul.hasClass('m-lib_color')) {
					dragObj = $('<div>');
					color = $(this).css('background');
					dragObj.css({
						background: color,
						borderRadius: 3
					});
					isColorBlock = true;
				} else if($ul.hasClass('m-lib_word')) {
					dragObj = $('<div>');
					dragObj.html('ABcd');
					dragObj.css({
						fontSize: '24px',
						color: '#333'
					})
					isWordBlock = true;
				} else {
					dragObj = $('<img  src="" />');
					src = $(this).find('img').eq(0).attr('src');
					id = $(this).find('img').eq(0).attr('data-id');
					id = id ? id : '';
					dragObj.attr('src', src);
				}
				w = $(this).width();
				h = $(this).height();
				l = e.pageX - (w + 20);
				t = e.pageY - (h + 20);;
				dragObj.attr('class', 'dobj');
				dragObj.css({
					left: l,
					top: t,
					width: w * .8,
					height: h * .8
				});
				if(win.flag) {
					dragObj.css('zIndex', '10010');
				} else {
					dragObj.css('zIndex', '10005');
				}
			});
			$(document).on('mousemove.lib', function(e) {
				if(off) {
					l = e.pageX - (w + 20);
					t = e.pageY - (h + 20);
					dragObj.css({
						left: l,
						top: t
					});
					$('body').append(dragObj);
					return false;
				}

			});
			$(document).on('mouseup.lib', function(e) {
				var yoff = (e.pageY > $('#j-cvs_core').offset().top) && (e.pageY < $('body').height());
				var xoff = (e.pageX > $('#j-tools').width()) && (e.pageX < $('body').width() - $('#j-library').width());
				if(off && yoff && xoff) {
					cvsSet.addProduct({
						x: e.pageX,
						y: e.pageY,
						src: src,
						id: id,
						color: color,
						isColorBlock: isColorBlock,
						isWordBlock: isWordBlock,
						isProc: isProc
					});
					//加载产品推荐
					if(isProc == 'proc') {
						relProc.load('tmp/relProc.json');
					} else {
						$('.g-relative_proc').hide();
					}
				}
				if(dragObj) {
					dragObj.remove();
				}
				//数据还原
				off = false;
				isColorBlock = false;
				isWordBlock = false;
				isProc = '';
			});

		}

		return {
			num: num,
			isdetail: isdetail,
			init: init,
			bind: bind
		}
	})();

	//表示库面板的弹出框事件（主要是搜索栏中点击小按钮，弹出选择条件）
	var libPop = (function() {
		//初始化
		function init() {
			//$('.pop').hide();
			//加载筛选条件一的数据
			var cond1 = new DataLoader({
				template: $('#t-cond1_cg'),
				container: $('#j-cond1_cg'),
				url: 'tmp/cond1_data.json'
			});
			cond1.getData();
		}

		function bind() {
			backProcCg();
			showCond1();
			showCond2();
			newFile();
			fileUpload();
		}

		function backProcCg() {
			//icon-back事件，返回产品分类
			$(document).on('click', '#j-back', function() {
				$('.pop-cond').hide(); //隐藏所有的筛选条件弹出框
				$('#j-detail_wrap').hide();
				$('#j-procs_wrap').fadeIn();
				$('#j-back').removeClass('show');
				libContent.isdetail = false;
			});
		}

		function showCond1() {
			//显示icon-list的筛选条件
			$(document).on('click', '#j-cond1_off', function() {
				$('.pop-cond').hide();
				if(libContent.num == 0 && !libContent.isdetail) {
					$('#j-cg_wrap').show();
				} else if(libContent.num == 0 && libContent.isdetail) {
					$('#j-dt_wrap').show();
				}
			});
		}

		function showCond2() {
			//显示icon-filter的筛选条件
			$(document).on('click', '#j-filter', function() {
				$('.pop-cond').hide();
				if(libContent.num < 2) {
					$('#j-cond2').show();
				} else if(libContent.num == 2) {
					areaSelection.init();
					$('#j-cond2_sl').show();
				}
			});
			//关闭icon-filter的筛选条件
			$(document).on('click', '.close-pop', function() {
				$('.pop-cond').hide();
			});
		}

		function newFile() {
			$(document).on('click', '#j-new_file', function() {
				var newLi = $('<li><a href="javascript:"><img src="tmp/file.png" /></a><input type="text" value="文件夹" /></li>');
				$('#j-fodder').append(newLi);
				newLi.find('input').focus();
			});
		}
		//个人素材，点击上传，显示弹出框
		function fileUpload() {
			$(document).on('click', '#j-upload', function() {
				$.pop({
					title: '上传',
					content: '<div class="pop-input">' +
						'<input class="showfile" type="text" readonly="readonly" />' +
						'<label for=""><input type="file" /><a href="javascript:">浏览</a></label>' +
						'</div>' +
						'<div class="pop-select">' +
						'<select id="j-select_files">' +
						'</select>' +
						'<script id="t-select_files" type="text/template7">' +
						'{{#each list}}' +
						'<option value="">{{filename}}</option>' +
						'{{/each}}' +
						'</script>' +
						'</div>',
					className: 'pop-upload',
					id: 'j-pop_upload',
					callback: function() {
						$('#j-pop_upload').fadeIn();
						var data = new DataLoader({
							template: $('#t-select_files'),
							container: $('#j-select_files'),
							url: "tmp/file.json"
						});
						data.getData();
					}
				});
			});

		}

		return {
			init: init,
			bind: bind
		}
	})();

	var library = (function() {
		function init() {
			libContent.init();
			libPop.init();
		}

		function bind() {
			libContent.bind();
			libPop.bind();
			areaSelection.bind();
		}

		return {
			init: init,
			bind: bind
		}
	})();

	init();
});