(function($) {
	$.fn.extend({
		getPointCtrl: function() {
			var pointCtrl = '<div class="g-pointctrl">' +
				'<span></span>' +
				'<span></span>' +
				'<span></span>' +
				'<span></span>' +
				'<span></span>' +
				'<span></span>' +
				'<span></span>' +
				'<span></span>' +
				'<span></span>' +
				'</div>';
			this.append(pointCtrl);
		}
	});
})(jQuery);

function Products() {
	this.queue = new Array();
	this.size = 0;
}

Products.prototype.addProduct = function(x, y,src) {
	var $dv = $('<div class="cvs-item"><img src="' + src + '"/></div>');
	$('#j-cvs_core').append($dv); //这里必须先添加到父级上，再设置left和top值，不然无法获取$dv的高宽
	x = x - $dv.width() / 2;
	y = y - $dv.height() / 2;
	$dv.css({
		left: x,
		top: y
	});
	var newProc=new Product($dv);
	newProc.selected();
	this.queue.push(newProc);
}

function Product(obj) {
	this.obj = obj;
}
Product.prototype.selected = function() {
	this.obj.on('click', function() {
		$(this).getPointCtrl();
	});
}