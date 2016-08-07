$(function() {
	//初始化
	function init() {
		win.init();
		library.init();
		cvsSet.init();
		bind();
	}
	//所有dom元素绑定事件
	function bind() {
		win.bind();
		menu.bind();
		cvsTab.bind();
		tool.bind();
		library.bind();
	}
	
	

	//全局模块
	var win = (function() {
		var flag = false; //flag代表是否全屏化，若全屏化，则头部高度为0
		function init() {
			initCvsHeight();
			initLibHeight();
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
		
		function newCvs(){
			$(document).on('click','#j-new_cvs',function(){
				var cvsItem=$('<ul>');
				var cvsTab=$('<li class="active">'+
								'<input type="text" value="空白页" readonly="readonly" />'+
								'<div class="u-tabc_chbt">'+
									'<a href="javascript:" class="u-rename"><i class="icon icon-edit"></i></a>'+
									'<a href="javascript:" class="u-prev"><i class="icon icon-prev"></i></a>'+
									'<a href="javascript:" class="u-next"><i class="icon icon-next"></i></a>'+
									'<a href="javascript:" class="u-close"><i class="icon icon-close"></i></a>'+
								'</div>'+
							'</li>');
				$('#j-cvs_set').append(cvsItem);
				$('#j-tabc').append(cvsTab);
				
				var newCvs=new Canvas(cvsTab,cvsItem);
				
				cvsSet.set.push(newCvs);
				cvsSet.cur=cvsSet.set.length-1;
				
				$('#j-cvs_set ul').removeClass('active');
				cvsSet.set[cvsSet.cur].cvs.addClass('active');
				$('#j-tabc li').removeClass('active');
				cvsSet.set[cvsSet.cur].tab.addClass('active');
			});
		}

		return {
			bind: bind
		}
	})();

	//画板tab栏模块
	var cvsTab = (function() {
		var cur = 0; //表示位于最左边的那个tab栏的索引值
		var curActive = 0; //表示当前激活tab栏Li的索引值
		function bind() {
			moveCvsTab();
			activeTab();
			editTabName();
			closeTab();
			closeTool();
			closeLib();
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
					cur++;
					$('#j-tabc').animate({
						'left': -cur * cw
					}, 300);
				}
			});
			$(document).on('click', '#j-page_left', function() {
				if(cur > 0) {
					cur--;
					$('#j-tabc').animate({
						'left': -cur * cw
					}, 300);
				}
			});
		}
		//激活tab栏
		function activeTab() {
			//前一个（后一个tab栏）
			$(document).on('click', '.u-tabc_chbt .u-next', function() {
				if(curActive < $('#j-tabc li').length - 1) {
					curActive++;
					$('#j-tabc li').removeClass('active');
					$('#j-tabc li').eq(curActive).addClass('active');
					$('#j-tabc input').attr('readonly', 'readonly');
				}
				return false; //阻止冒泡事件
			});
			$(document).on('click', '.u-tabc_chbt .u-prev', function() {
				if(curActive > 0) {
					curActive--;
					$('#j-tabc li').removeClass('active');
					$('#j-tabc li').eq(curActive).addClass('active');
					$('#j-tabc input').attr('readonly', 'readonly');
				}
				return false;
			});

			//点击tab被激活
			$(document).on('click', '#j-tabc li', function() {
				$('#j-tabc li').removeClass('active');
				$(this).addClass('active');
				//当点击的不是当前激活的tab栏时，重命名输入框变为只可读
				if($(this).index() != curActive) {
					$('#j-tabc input').attr('readonly', 'readonly');
				}
				curActive = $(this).index();
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
				if(curActive == $('#j-tabc li').length - 1) {
					curActive--;
				}
				$(this).parents('li').remove();
				//更新父级ul的宽度
				setTabWidth()
				$('#j-tabc li').eq(curActive).addClass('active');
				if(cur > 0) {
					cur--;
					$('#j-tabc').animate({
						'left': -cur * cw
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
		return {
			setTabWidth: setTabWidth,
			bind: bind
		}
	})();

	var tool = (function() {
		function bind() {
			showToolName();
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
			var $img = $('<img  src="" />');
			var w, h, l, t, src, off = false; //off设置为false,只有当lib-drag li点击后才设置为true,防止其它元素点击通过冒泡触发document的mouseup事件
			$(document).on('mousedown', '.lib-drag li', function(e) {
				off = true;
				src = $(this).find('img').eq(0).attr('src')
				w = $(this).find('a').eq(0).width();
				h = $(this).find('a').eq(0).width();
				l = e.pageX - (w + 20);
				t = e.pageY - (h + 20);;
				$img.attr({
					'src': src,
					class: 'dImg'
				});
				$img.css({
					left: l,
					top: t,
					width: w * .8,
					height: h * .8
				});
				if(win.flag) {
					$img.css('zIndex', '10010');
				} else {
					$img.css('zIndex', '10005');
				}
			});
			$(document).on('mousemove', function(e) {
				if(off) {
					l = e.pageX - (w + 20);
					t = e.pageY - (h + 20);
					$img.css({
						left: l,
						top: t
					});
					$('body').append($img);
					return false;
				}

			});
			$(document).on('mouseup', function(e) {
				var yoff = (e.pageY > $('#j-cvs_core').offset().top) && (e.pageY < $('body').height());
				var xoff = (e.pageX > $('#j-tools').width()) && (e.pageX < $('body').width() - $('#j-library').width());
				if(off && yoff && xoff) {
					products.addProduct(e.pageX, e.pageY, src);
				}
				$img.remove();
				off = false;
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
			$('.pop').hide();
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
				$('.pop').hide();
				$('#j-pop_upload').fadeIn();
				var data = new DataLoader({
					template: $('#t-select_files'),
					container: $('#j-select_files'),
					url: "tmp/file.json"
				});
				data.getData();
			});
			$(document).on('click', '.pop-close', function() {
				$('.pop').hide();
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