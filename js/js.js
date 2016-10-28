
window.onload=function () {
    var window_w=document.querySelector("body").offsetWidth/16+"rem";
    var _index=0;
    var socks=document.querySelector(".socks");
    var pattern=/boom\.png/;
    var cur_rem=parseInt($("html").css("fontSize"));
    var preX,curX,curY,transferX=0,cur_left,cur_right,cur_top,body_w,cur_w,cur_h,result=0,score_num,start;
    /*------------------------存储礼物路径和宽高代码开始---------------------------------*/
    var img_box=[
        {"src":"images/gifts-1.png","width":"2rem","height":"1.9rem","score":2},
        {"src":"images/gifts-2.png","width":"2.625rem","height":"1.9375rem","score":4},
        {"src":"images/gifts-3.png","width":"2.875rem","height":"2.71875rem","score":5},
        {"src":"images/gifts-4.png","width":"3.1875rem","height":"2.375rem","score":5},
        {"src":"images/gifts-5.png","width":"3.5rem","height":"3.3125rem","score":10},
        {"src":"images/gifts-6.png","width":"3.625rem","height":"2.6875rem","score":5},
        {"src":"images/boom.png","width":"3.30163rem","height":"2.64946rem","score":-10},
        {"src":"images/boom.png","width":"3.30163rem","height":"2.64946rem","score":-10},
        {"src":"images/boom.png","width":"3.30163rem","height":"2.64946rem","score":-10},
        {"src":"images/boom.png","width":"3.30163rem","height":"2.64946rem","score":-10},
        {"src":"images/boom.png","width":"3.30163rem","height":"2.64946rem","score":-10},
        {"src":"images/boom2.png","width":"7.84511rem","height":"7.73641rem","score":-10}
    ];
    $(".zhezhao").on("click",function () {
        $(this).css("display","none");
        $(".guide").css("display","none");
        start=setInterval(generate_gifts,800);
    })

    /*-------------------------游戏开始生成袜子----------------------------------*/

    /*------------------------生成礼物代码开始---------------------------*/
    function generate_gifts() {
        var gifts_index=Math.round(Math.random()*10);
        var range_right=parseInt(window_w)-parseInt(img_box[gifts_index].width);
        var x_position=Math.round(Math.random()*range_right)+"rem";
        var y_position=-img_box[gifts_index].height;
        var img=document.createElement("img");
        var speed=Math.round(Math.random()*3+2);   //礼物下落速度
        img.src=img_box[gifts_index].src;
        img.style.width=img_box[gifts_index].width;
        img.style.height=img_box[gifts_index].height;
        img.score=img_box[gifts_index].score;
        img.style.position="absolute";
        img.style.left=x_position;
        img.style.top=-y_position;
        img.classList.add("slideDown");
        img.classList.add("num"+_index);
        if(pattern.test(img.src)){                   //正则判断是否为炸弹，是炸弹的话加速
            $(img).css("webkitAnimationDuration",speed-1+"s");
        }else{
            $(img).css("webkitAnimationDuration",speed+"s");
        }
        $(img).css("webkitAnimationFillMode","forwards");
        document.querySelector(".container2").appendChild(img);
        document.querySelector("."+"num"+_index).addEventListener("webkitAnimationEnd",function () {
            document.querySelector(".container2").removeChild(this);
        },false);
        var time=setInterval(function () {
            if(test_collide(img)){          //碰撞检测
                if(pattern.test(img.src)){  //正则判断是否为炸弹，是炸弹则转化为爆炸图片
                    score_num=img.score;
                    add(score_num);
                    show_score(score_num,img);
                    img.src=img_box[img_box.length-1].src;
                    img.style.width=img_box[img_box.length-1].width;
                    img.style.marginLeft=-parseInt(img_box[img_box.length-1].width)/2*cur_rem+"px";
                    img.style.marginTop=-parseInt(img_box[img_box.length-1].height)/2*cur_rem+"px";
                    img.style.height=img_box[img_box.length-1].height;
                    $(this).css("zIndex",999);
                    $(".socks").css("zIndex",0);
                    shake();        //屏幕抖动
                }else{                                   //如果不是炸弹则执行下面一行
                    $(img).css("visibility","hidden");
                    score_num=img.score;
                    add(score_num);
                    show_score(score_num,img);
                    $(this).css("zIndex",9);
                    $(".socks").css("zIndex",999);
                }
                clearInterval(time)
            }
        },20);
        _index++;
    }
    /*---------------------------袜子拖动代码----------------------------------------*/

    /*-----------------------------触摸事件---------------------------------------*/
    if(isMobile()){
        socks.addEventListener("touchstart",touchstart,false);
        /*-----------------将touchmove放到touchstart里面绑定是为了当手指移出袜子的时候解除掉touchmove事件，再下一次点击重新绑定-----------------*/
        socks.addEventListener("touchend",touchend,false);
        function touchstart(event){
            event.preventDefault();
            socks.addEventListener("touchmove",touchmove,false);
            if(event.targetTouches.length==1){      //避免多手指触摸情况
                var touch=event.targetTouches[0];
                preX=touch.pageX;
            }
        }
        function touchmove() {
            event.preventDefault();               //避免触发默认行为，特别在微信端；
            if(event.targetTouches.length==1){    //避免多手机触摸情况
                cur_left=parseInt($(socks).css("left"));
                cur_right=parseInt($(socks).css("right"));
                cur_top=parseInt($(socks)[0].offsetTop);
                body_w=parseInt($("body")[0].offsetWidth);
                cur_w=parseInt($(socks)[0].offsetWidth);
                cur_h=parseInt($(socks)[0].offsetHeight);
                var touch=event.targetTouches[0];
                curX=touch.pageX;
                curY=touch.pageY;
                if(curY<cur_top-100){
                    touchend()
                }
                if(cur_left<0+cur_w/4){             //边界检测
                    $(socks).css("left",cur_w/3);
                }else if(cur_left>body_w-cur_w/2){
                    $(socks).css("left",body_w-cur_w/2);
                }else{
                    transferX =curX-preX;            //用累加是因为css的样式会叠加！！
                    $(socks).css("left",cur_left+transferX);
                    preX=curX;
                }
            }
        }
        function touchend() {
            socks.removeEventListener("touchmove",touchmove,false);
            transferX=0;
        }
    }else{
        /*---------------------鼠标事件----------------------------------*/
        socks.addEventListener("mousedown",mousedown,false);
        socks.addEventListener("mouseup",mouseup,false);
        function mousedown(event) {
            event.preventDefault();
            socks.addEventListener("mousemove",mousemove,false);
            preX=event.pageX;
            }
        function mousemove(event) {
            event.preventDefault();               //避免触发默认行为，特别在微信端；
            cur_left=$(socks).css("left");
            cur_right=$(socks).css("right");
            cur_top=$(socks)[0].offsetTop;
            curX=event.pageX;
            curY=event.pageY;
            if(curY<cur_top){
                touchend()
            }
            if(cur_left<0+cur_w/4){
                $(socks).css("left",cur_w/3);
            }else if(cur_left>body_w-cur_w/2){
                $(socks).css("left",body_w-cur_w/2);
            }else{
                transferX =curX-preX;            //用累加是因为css的样式会叠加！！
                $(socks).css("left",cur_left+transferX);
                preX=curX;
            }
        }
        function mouseup() {
            socks.removeEventListener("mousemove",mousemove,false);
            transferX=0;
        }
    }
    /*----------------------判断pc还是移动--------------------------------*/
    function isMobile(){
        var sUserAgent= navigator.userAgent.toLowerCase(),
            bIsIpad= sUserAgent.match(/ipad/i) == "ipad",
            bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os",
            bIsMidp= sUserAgent.match(/midp/i) == "midp",
            bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
            bIsUc= sUserAgent.match(/ucweb/i) == "ucweb",
            bIsAndroid= sUserAgent.match(/android/i) == "android",
            bIsCE= sUserAgent.match(/windows ce/i) == "windows ce",
            bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile",
            bIsWebview = sUserAgent.match(/webview/i) == "webview";
        return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
    }
    /*-----------------------碰撞检测---------------------------*/
    function test_collide(obj) {
        cur_left=parseInt($(socks).css("left"));
        cur_top=parseInt($(socks)[0].offsetTop);
        cur_w=parseInt($(socks)[0].offsetWidth);
        cur_h=parseInt($(socks)[0].offsetHeight);
        var socks_obj = {
            x: cur_left,
            y: cur_top,
            w: cur_w,
            h: cur_h
        }
        var gifts_obj = {
            x: parseInt(obj.style.left)*cur_rem,
            y: parseInt(obj.offsetTop),
            w: parseInt(obj.style.width)*cur_rem,
            h: parseInt(obj.style.height)*cur_rem
        }
        /*--------------礼物的中心点或底部左右两点在袜子内则认为接到--------------------------*/
        var px1, py1,px2,py2,px3,py3;
        px1 =gifts_obj.x;
        py1 =gifts_obj.y+gifts_obj.h;
        px2 =gifts_obj.x+gifts_obj.w;
        py2 =gifts_obj.y+gifts_obj.h;
        px3=gifts_obj.x+gifts_obj.w/2;
        py3 =gifts_obj.y+gifts_obj.h/2;
        // 判断点是否都在两个对象中
        if (px1 >= socks_obj.x-cur_w/3 && px1 <= socks_obj.x-cur_w*2/3 + socks_obj.w && py1 >= socks_obj.y && py1 <= socks_obj.y + socks_obj.h || px2 >= socks_obj.x-cur_w/3 && px2 <= socks_obj.x-cur_w*2/3 + socks_obj.w && py2 >= socks_obj.y && py2 <= socks_obj.y + socks_obj.h|| px3 >= socks_obj.x-cur_w/3 && px3 <= socks_obj.x-cur_w*2/3 + socks_obj.w && py3 >= socks_obj.y && py3 <= socks_obj.y + socks_obj.h ) {
            return true;
        } else {
            return false;
        }
    }
    /*---------------炸弹爆炸屏幕抖动------------------------------*/
    function shake() {
        $("body").addClass("shake");
        $("body").on("webkitAnimationEnd",function () {
            $("body").removeClass("shake");
        })
    }
    /*--------------------计算分数------------------------*/
    function add(value) {
        result +=value;
        if(result>=200){
            clearInterval(start);
            $(".score span").html(200);
            result=200;
            $(".socks").fadeOut(500);
            $(".score").fadeOut(500);
            $(".choujiang").fadeIn(500);
        }else if(result<=0){
            $(".score span").html(0);
            result=0;
        }else{
            $(".score span").html(result);
        }
    }
    /*--------------------显示接到礼物时的分数-----------------------*/
    function show_score(value,obj) {
        var show_box=document.createElement("div");
        show_box.style.position="absolute";
        show_box.style.left=(parseInt(obj.style.left)+parseInt(obj.style.width)/2)*cur_rem+"px";
        show_box.style.top=parseInt(obj.offsetTop)-10+"px";
        show_box.style.fontSize="1rem";
        show_box.style.color="rgb(255,251,31)";
        if(value>0){
            show_box.innerHTML="+"+value;
        }else{
            show_box.innerHTML=value;
        }
        show_box.classList.add("fadeInUp");
        $("body")[0].appendChild(show_box);
        $(show_box).on("webkitAnimationEnd",function () {
            $("body")[0].removeChild(show_box);
        })
    }
}