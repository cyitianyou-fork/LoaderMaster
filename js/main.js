$(function(){
	function init(){
		initCvsHeight(false);
		initCvsTab();
		bind();
	}
	init();
	
	//初始化画布的 高度和画布主体区的高度
	function initCvsHeight(flag){
		//flag代表是否全屏化，若全屏化，则头部高度为0
		var winHeight = $(window).height();
		var toph=flag?0:60;
		$('#software').css('height',(winHeight - toph));
		var h=$('#software').height()-$('#j-cvs_tab').height()-$('#j-menu').height();
		$('#j-cvs_main').css('height',h);
		
		//库面板列表主体区的高度
		var libh=$('#j-lib_content').parent('.g-library').height();
		console.log(libh)
		$('#j-lib_content').siblings().each(function(i,ele){
			libh-=$(ele).outerHeight(true);
		});
		if (libh>0) {
			$('#j-lib_content').height(libh);
		}
	}
	//所有dom元素绑定事件
	function bind(){
		//窗口事件
		resizeWindow();
		//菜单事件
		showSubMenu();
		//画布主体事件
		moveCvsTab();
		//工具栏事件
		showToolName();
	}
	
	function resizeWindow(){
		//窗口大小发生变化时，重置画布大小
		var fulloff=false; //当前窗口是否全屏显示
		$(window).resize(function(){
			initCvsHeight(fulloff);
		});
		//全屏显示
		$(document).on('click','#j-full_screen',function(){
			if (!fulloff) {
				$('#software').css({position:'absolute','left':0,'top':0});
				fulloff=true;
			}else{
				$('#software').css({position:'static'});
				fulloff=false;
			}
			initCvsHeight(fulloff);
		});
	}
	
	//菜单栏,鼠标置上显示二级菜单，移开隐藏二级菜单
	function showSubMenu(){
		var timer=null;
		$(document).on('mouseover','.u-menu_item',function(){
			clearInterval(timer);
			$(this).find('.g-submenu').show();
			$(this).siblings('li').find('.g-submenu').hide();
			
		});
		$(document).on('mouseout','.u-menu_item',function(){
			var _this=this;
			//用定时器解决 鼠标绝对定位有间隙元素 移出后就立即隐藏了bug
			timer=setTimeout(function(){
				$(_this).find('.g-submenu').hide();
			},300);
		});
	}
	
	
	//自适应画布tab栏宽度
	function initCvsTab(){
		var w=$('#j-tabc li').eq(0).outerWidth()*$('#j-tabc li').length;
		$('#j-tabc').width(w);
	}
	
	function moveCvsTab(){
		var cw=$('#j-tabc li').eq(0).outerWidth(); //每个tab栏Li的宽度
		var fw=$('#j-tabc').parent('.m-tabc_wrap').width(); //父级包裹层的宽度
		var cur=0;  //表示位于最左边的那个tab栏的索引值
		//左右移动tab栏
		$(document).on('click','#j-page_right',function(){
			if (($('#j-tabc').position().left+$('#j-tabc').width())>fw) {
				cur++;
				$('#j-tabc').animate({'left':-cur*cw},300);
			}
		});
		$(document).on('click','#j-page_left',function(){
			if (cur>0) {
				cur--;
				$('#j-tabc').animate({'left':-cur*cw},300);
			}
		});
		
		//前一个（后一个tab栏）
		var curActive=0; //表示当前激活tab栏Li的索引值
		$(document).on('click','.u-tabc_chbt .u-next',function(){
			if(curActive<$('#j-tabc li').length-1){
				curActive++;
				$('#j-tabc li').removeClass('active');
				$('#j-tabc li').eq(curActive).addClass('active');
				$('#j-tabc input').attr('readonly','readonly');
			}
			return false; //阻止冒泡事件
		});
		$(document).on('click','.u-tabc_chbt .u-prev',function(){
			if(curActive>0){
				curActive--;
				$('#j-tabc li').removeClass('active');
				$('#j-tabc li').eq(curActive).addClass('active');
				$('#j-tabc input').attr('readonly','readonly');
			}
			return false;
		});
		
		
		//点击tab被激活
		$(document).on('click','#j-tabc li',function(){
			$('#j-tabc li').removeClass('active');
			$(this).addClass('active');
			//当点击的不是当前激活的tab栏时，重命名输入框变为只可读
			if($(this).index()!=curActive){
				$('#j-tabc input').attr('readonly','readonly');
			}
			curActive=$(this).index();
		});
		
		//点击icon-edit可修改tab栏Li的名字
		$(document).on('click','.u-tabc_chbt .u-rename',function(){
			$(this).parents('.u-tabc_chbt').siblings('input').removeAttr('readonly').focus();
			return false;
		});
		
		//点击close关闭当前tab栏中的li
		$(document).on('click','.u-tabc_chbt .u-close',function(){
			if ($('#j-tabc li').length<2) {
				return;
			}
			if (curActive==$('#j-tabc li').length-1) {
				curActive--;
			}
			$(this).parents('li').remove();
			//更新父级ul的宽度
			initCvsTab();
			$('#j-tabc li').eq(curActive).addClass('active');
			if (cur>0) {
				cur--;
				$('#j-tabc').animate({'left':-cur*cw},300);
			}
			return false;
		});
	}
	
	//鼠标放在工具栏上显示工具的名称
	function showToolName(){
		$(document).on('mouseover','#j-tools a',function(e){
			//获取父级的相对位置
			var left=$('#j-cvs_main').offset().left;
			var top=$('#j-cvs_main').offset().top;
			$('#j-tool_name').html($(this).attr('name'));
			$('#j-tool_name').css({left:e.pageX-left+10,top:e.pageY-top+10});
			$('#j-tool_name').show();
		});
		$(document).on('mouseout','#j-tools a',function(e){
			$('#j-tool_name').hide();
		});
	}
	
	//
	function
	
});
