
(function($) {

	$.extend({
		nameEle: $('<span class="u-tool_name"></span>'),
		showName: function(options) {
			console.log(this)
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
	var cur = 0;
	function init() {
		var newCvs = new Canvas($('#j-tabc li').eq(0), $('#j-cvs_set ul').eq(0));
	}
	return {
		set: set,
		cur: cur,
		init:int
	}
})();

function Canvas(tab, cvs, type) {
	this.tab = tab;
	this.cvs = cvs;
	this.queues = new Array();
	this.size = 0;
	this.type = type ? type : '';
}

Canvas.prototype.addProduct = function(x, y, src) {
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
	$('#j-cvs_set').append(newLi); //这里必须先添加到父级上，再设置left和top值，不然无法获取$dv的高宽
	x = x - newLi.width() / 2;
	y = y - newLi.height() / 2;
	newLi.css({
		left: x,
		top: y
	});
	var newProc = new Product(newLi);
	newProc.init();
	queues.push(newProc);
	this.size++;
}

function Product(obj) {
	this.obj = obj;
	this.isSelected = false;
}
Product.prototype.init = function() {
	this.selected();
}
Product.prototype.selected = function() {
	$(document).on('click', function(e) {
			console.log(e.target)
		})
		//	this.obj.on('click', function() {
		//		$(this).find('.g-pointctrl').show();
		//		$(this).siblings().find('.g-pointctrl').hide();
		//		this.isSelected=true;
		//		return false;
		//	});

}