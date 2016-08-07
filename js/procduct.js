
(function($) {
	$.fn.extend({
		getPointCtrl: function() {
			var content = $('<div class="g-pointctrl">' +
				'<span><i></i></span>' +
				'<span></span>' +
				'<span><i></i></span>' +
				'<span></span>' +
				'<span><i></i></span>' +
				'<span></span>' +
				'<span><i></i></span>' +
				'<span></span>' +
				'<span></span>' +
				'</div>');
			this.append(content);
		}
	});
	$.extend({
		nameEle:$('<span class="u-tool_name"></span>'),
		showName:function(options){
			var defaults={
				x:0,
				y:0,
				text:"name"
			}
			var rs=$.extend(true,{}, defaults, options);
			$.nameEle.html(rs.text);
			$.nameEle.css({
				left:rs.x,
				top:rs.y
			});
			$('body').append($.nameEle);
		},
		hideName:function(){
			$.nameEle.remove();
		}
	})
})(jQuery);




var products = (function() {
	var queue = new Array();
	var size = 0;

	function addProduct(x,y,src) {
		var $dv = $('<div class="cvs-item"><img src="' + src + '"/></div>');
		$('#j-cvs_core').append($dv); //这里必须先添加到父级上，再设置left和top值，不然无法获取$dv的高宽
		x = x - $dv.width() / 2;
		y = y - $dv.height() / 2;
		$dv.css({
			left: x,
			top: y
		});
		var newProc = new Product($dv);
		newProc.selected();
		queue.push(newProc);
	}
	
	return{
		addProduct:addProduct
	}
})();

function Product(obj) {
	this.obj = obj;
}
Product.prototype.selected = function() {
	this.obj.on('click', function() {
		$(this).getPointCtrl();
	});
}