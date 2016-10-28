 
/*--------------------一屏显示页面-------------------------------------*/
$(function(){
	// var design_W=320,design_H=480;
	var design_W=375,design_H=667;
	var wide=$(window).innerWidth();
	var height=$(window).innerHeight();
	var t=0;
	resizeArea();
	function resizeArea(){
		var a=$(window).innerWidth();
		var b=a/design_W*design_H;
		if(b>$(window).innerHeight())
		{
			b=$(window).innerHeight();
			a=b/design_H*design_W
		}
		if(b>a&&b<$(window).innerHeight())
		{
			b=$(window).innerHeight()
		}
		$(".wrap").css("width",a+"px");
		$(".wrap").css("height",b+"px");
		$(".wrap").css("margin-left",(($(window).innerWidth()-a)/2)+"px");
		$("html").css("font-size",a/375*16+"px");
	}
	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
		clearTimeout(t);
		t = setTimeout(function () {
			resizeArea();
		}, 10);
	}, false);
})