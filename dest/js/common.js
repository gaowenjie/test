//全局数据接口。
var GLOBALURL = 
{
	//dataUrl:"http://192.168.1.195:8080/yg_mobile/" ,   // 张赛
	//dataUrl:"http://192.168.2.116:80/yg_mobile/",       //郭浩 

	// dataUrl:"http://192.168.2.104:8910/"   ,             //本地
	// pageUrl:"http://192.168.2.112:9000/"			//测试服务器


	pageUrl:"http://m.yg.com/",                //本地
	dataUrl:"http://m.yg.com/"				//测试服务器


};
var YIIGOO =
{
	//设置登录状态。本地存储的值。
	setLoginId:function(value)
	{
		YIIGOO.setLocalStorage("loginId",value);
	},
	//取得登录Id。本地存储的值。
	getLoginId:function()
	{
		return YIIGOO.getLocalStorage("loginId");
	},
	//清除登录状态。
	clearLogin:function()
	{
		YIIGOO.clearLocalStorage("loginId");
	},
	//取得登录状态。
	getLoginType:function(url,fn)
	{
		$.ajax(
	    {
		    type: "get",
		    async: false,
		    url: GLOBALURL.dataUrl+"mobile/admin/isLogin.do",
		    data:{},
		    dataType: "jsonp",
		    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		    success: function(data)
		    {
		        if(data.type == "success")
		        {
		        	if(data.extra.key == "LOGIN_SUCCESS")
		        	{
		        		if(fn){fn()};
		        	}
		        	// else if(data.extra.key == "REDIRECT_LONGIN_PAGE")
		        	// {
		        	// 	window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+url;//用户个人中心。
		        	// }
		        }else if(data.type == "error")
		        {
		        	if(data.extra.key == "REDIRECT_LONGIN_PAGE")
		        	{
		        		window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+url;//用户个人中心。
		        	}
		        }  
		    },
		    error: function()
		    {
		        YIIGOO.popWindow('系统繁忙，请稍后再试…');
		    }
	    });
	},
	//本地数据存储
	setLocalStorage:function(name,value)
	{
		window.localStorage.setItem(name,JSON.stringify(value));
	},
	getLocalStorage:function(name)
	{
		return  JSON.parse(window.localStorage.getItem(name));
	},
	clearLocalStorage:function(name)
	{
		window.localStorage.removeItem(name);
	},
	//图片滚动加载组件。需要滚动加载的图片给一个默认图片，类名。realsrc属性。
	scrollLoad:function()
	{
		var temp = -1;
		_init();
		$(window).on("scroll",function ()
	  	{
	  		_init();
		});
		function _init()
		{
			var imgElements = document.getElementsByTagName("img");
			var lazyImgArr=new Array();
			var j=0;
			for(var i=0,len=imgElements.length;i<len;i++)
			{
				if($(imgElements[i]).hasClass("lazy"))
				{
					lazyImgArr[j++]=imgElements[i];
				}
			};
			var scrollHeight = document.body.scrollTop||document.documentElement.scrollTop;
			var bodyHeight =window.innerHeight;
			if(temp<scrollHeight)//为true表示是向下滚动的，否则向上滚动。不需要执行操作。
			{
				for (var i=0,len=lazyImgArr.length;i<len;i++) 
				{
					var imgTop = $(lazyImgArr[i]).offset().top;//图片纵坐标。
					if(imgTop - scrollHeight<=bodyHeight)
					{
						$(lazyImgArr[i]).attr("src",$(lazyImgArr[i]).attr("realSrc"));
						$(lazyImgArr[i]).removeClass("lazy");
						$(lazyImgArr[i]).show(200);
					}
				};
				temp = scrollHeight;
			}
		}
	},
	//弹窗方法
	popWindow:function(msg,fn)
	{
	 	var str="";
	 	str+='<div class="popWindow yg-login-layer" id="popWindow">';
		str+='</div>';
		str+='<p class="yg-login-hint" id="msg">';
				str+=msg;
			str+='</p>';
		var popLayer = document.createElement("div");
		popLayer.id = "popLayer";
		popLayer.innerHTML = str;
		document.body.appendChild(popLayer);
		popLayer.onclick = function()
		{
			document.body.removeChild(popLayer);
			if(fn){fn()};
		}
		window.setTimeout(function(){document.body.removeChild(popLayer);if(fn){fn()};},2000);
	},
	//删除弹窗
	delWindow:function(title,fn)
	{
		var str = "";
        str+='';
        str+='<article class="promptBox">';
          str+='<div class="prompttext">'+title+'</div>';
          str+='<div class="promptbut flex">';
            str+='<a href="javascript:void(0);" id="js_cancel_del">取消</a>';
            str+='<a href="javascript:void(0);" id="js_sure_del">确定</a>';
          str+='</div>';
        str+='</article>';
        str+='<div class="clicklayer"></div>';
        $("#js_del_layer").html(str);
        $("#js_cancel_del").on("click",function()
        {
          $("#js_del_layer").html("");
        });
        $("#js_sure_del").on("click",function()
    	{
    		fn();
    	});
	},
	setImgUrl:function(urlStr,type)
	{
		type = type || 800*800;
		if(urlStr== null)
		{
			return null;
		}
		var lastPointIndex = urlStr.lastIndexOf(".");
		return urlStr.slice(0,lastPointIndex)+"-"+type+urlStr.slice(lastPointIndex,urlStr.length);
	},
	getLocalTime:function (ms,type) 
	{ 
		var now = new Date(ms);
		var   year=now.getFullYear();     
        var   month=now.getMonth()+1;     
        var   date=now.getDate();     
        var   hour=now.getHours();     
        var   minute=now.getMinutes();     
        var   second=now.getSeconds();  
        if(type == "ymd")
        {
        	return   year+"/"+YIIGOO.toDou(month)+"/"+YIIGOO.toDou(date);  
        };
        switch(type)
		{
			case "ymd" :  //待付款。
			return  year+"/"+YIIGOO.toDou(month)+"/"+YIIGOO.toDou(date); 
			break;
			case "m" :  //待发货。
			return  YIIGOO.toDou(month); 
			break;
			case "d" :  //配送中，待签收。
			return  YIIGOO.toDou(date);
			break;
			default:
			return   year+"/"+YIIGOO.toDou(month)+"/"+YIIGOO.toDou(date)+"   "+YIIGOO.toDou(hour)+":"+YIIGOO.toDou(minute);  
			break;
		};       
    },
    getLocalTimeTwo:function (ms) 
	{ 
		var now = new Date(ms);
		var   year=now.getFullYear();     
        var   month=now.getMonth()+1;     
        var   date=now.getDate();     
        var   hour=now.getHours();     
        var   minute=now.getMinutes();     
        var   second=now.getSeconds();     
        return   year+"/"+YIIGOO.toDou(month)+"/"+YIIGOO.toDou(date);                
    }, 
    toDou:function(iNum){
    	return iNum<10?'0'+iNum:''+iNum;
    }    
};
// JavaScript Document,事件处理程序。
var EventUtil = 
{
	//添加事件
	addHandler:function(element,type,handler)
	{
		if(element.addEventListener)
			{
				element.addEventListener(type,handler,false);
			}else if(element.attachEvent)
			{element.attachEvent("on"+type,handler);}
		else{element["on"+type] = handler;}
	},
	//取消事件。
	removeHandler:function(element,type,handler)
	{
		if(element.removeEventListener){element.removeEventListener(type,handler,false);}	
		else if(element.detachEvent)
			{element.detachEvent("on"+type,handler);}
		else {element["on"+type] = null;}
	},
	//获得事件。
	getEvent:function(event)
	{
		return  event ? event : window.event;	
	},
	//获得事件源。
	getTarget: function(event)
	{
		return event.target||event.srcElement;	
	},
	getCharCode:function(event)
	{
		if(typeof event.charCode == "number")
		{return event.charCode;}else
		{return event.keyCode;
			}
	},
	//取消事件冒泡。
	stopPropagation: function(event)
	{
		if(event.stopPropagation){event.stopPropagation();}
		else {window.event.cancelBubble = true;}		
	},
	//取消事件默认行为。在dom二级中return false 是不起作用的。
	preventDefault:function(event)
	{
		if(event.preventDefault)
		{event.preventDefault();}
		else {event.returnValue = false;}
	},
	//强制让element执行函数fn。
	changeThis: function(element,fn)
	{
		return function(event){fn.call(element,event)};
	},
	//取得鼠标的客户区坐标位置。相对于浏览器而言。
	getClient:function(event)
	{
		return {x:event.clientX,y:event.clientY}
	},
	//取得鼠标的页面坐标位置。
	getPag:function(event)
	{
		var x = event.pageX ? event.pageX:(event.clientX+document.body.scrollLeft||document.documentElement.scrollLeft);
		var y = event.pageY ? event.pageY:(event.clientY+document.body.scrollTop||document.documentElement.scrollTop);
		return {x:x,y:y};	
	},
	//取得鼠标的浏览器坐标位置。
	getScreen:function(event)
	{
		return {x:event.screenX,y:event.screenY};	
	}
};
//浏览器方法。
var BOM = 
{
	//解析url字符串
	parseQueryStr:function(str)
	{
		var tempa=null;//存放临时匹配到的字符串的那个临时数组
		//定义一个取每一对值的正则，把满足要求的内容分别定义成两个分组。匹配到的内容不到包括=?&这三个字符既可
		var reg=/([^=?&]+)=([^=?&]+)/g;
		var obj={}
		while( tempa=reg.exec(str)){//把exec的返回值赋给这个tempa,如果tempa不是null，则exec会执行多次。
		//tempa是一个数组，这个数组的长度是reg中匹配到的子表达式（分组）的个数加1
		//tempa的第0项是整个正则匹配到的内容，所以从索引1开始
			obj[tempa[1]]=tempa[2];			
			}
		return obj;
	},
	//设置cookie
	setCookie:function (cname, cvalue, exdays) 
	{
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	},
	//获取cookie
	getCookie:function(cname) 
	{
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
	    }
	    return "";
	},
	//清除cookie  
	clearCookie:function(name) 
	{  
	   BOM.setCookie(name, "", -1);  
	}
};
//页面加载完运行的方法。
$(function()
{
	//首页
	$("#js_bottombar_index").on("click",function()
	{
		window.location.href = GLOBALURL.pageUrl+"index.html";
	});
	//好物
	$("#js_bottombar_list").on("click",function()
	{
		window.location.href = GLOBALURL.pageUrl+"product/list.html";
	});
	//亿果园
	$("#js_bottombar_mall").on("click",function()
	{
		window.location.href = GLOBALURL.pageUrl+"mall/index.html";
	});
	//购物车
	$("#js_bottombar_cart").on("click",function()
	{
		var str = GLOBALURL.pageUrl+"cart/cart.html";
		YIIGOO.getLoginType(str,function()
		{
			window.location.href = str;
		});
	});
	//我的
	$("#js_bottombar_user").on("click",function()
	{
		var str = GLOBALURL.pageUrl+"user/index.html";
		YIIGOO.getLoginType(str,function()
		{
			window.location.href = str;
		});
	});
	//购物车底部。
	$.ajax(
    {
	    type: "get",
	    async: false,
	    url: GLOBALURL.dataUrl+"mobile/admin/isLogin.do",
	    data:{},
	    dataType: "jsonp",
	    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
	    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
	    success: function(data)
	    {
	        if(data.type == "success")
	        {
	        	if(data.extra.key == "LOGIN_SUCCESS")
	        	{
	        		//获取购物车数量
			      	$.ajax(
				    {
				        type:"get",
				        async: false,
				        url: GLOBALURL.dataUrl+"mobile/shoppingcar/findCount.do",
				        //参数未定。
				        data:{},
				        dataType: "jsonp",
				        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
				        //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
				        success: function(data)
				        {
				          if(data.type == "success" && data.extra != 0)
				          {
				          	if(data.extra >= 100)
				            {
				              data.extra = "..";
				            }
				          	var str = "";
					            str+='<i class="iconfont">'+'<em class="num">'+data.extra+'</em>&#xe64c;'+'</i>';
					            str+='<p>购物车</p>';
				            $("#js_bottombar_cart").html(str);
				          }  
				        },
				        error: function()
				        {
				             YIIGOO.popWindow('系统繁忙，请稍后再试…');
				        }
				    });
	        	}
	        }
	    },
	    error: function()
	    {
	        YIIGOO.popWindow('系统繁忙，请稍后再试…');
	    }
    });
	//晒单 评论
    $("#yg-doc").delegate(".js_pinglun","click",function()
    {
        var that = this;
        //登录状态，才能点赞。
            YIIGOO.getLoginType(window.location.href,function()
            {
            var publishId = $(that).attr("id").split("_")[2];
            var nickName  = YIIGOO.getLocalStorage("nickName") || "yiigoo";
            if($(".shai-navInput").length == 0)
            {
              $("body").append('<nav class="shai-navInput" style="z-index:111"><input maxlength="100" type="text" id="js_shaidan_pinglun" placeholder="评论" class="shai-navInput-text"><input type="button" value="发送" id="js_pinglun_btn" class="shai-navInput-but"></nav>');
            }else
            {
              return;
            };
            $("#js_shaidan_pinglun").focus();
            $("#js_pinglun_btn").on("click",function()
            {
              var content = $("#js_shaidan_pinglun").val(); 
              if(content == "" || $("#js_shaidan_pinglun").val().trim() == "")
              {
                //YIIGOO.popWindow("评论不能为空");
                return;
              }
              var pinglunNum = Number($(that).find('span').eq(0).html())+1;
              $("#js_pingluncon_"+publishId).prepend('<p><em>'+nickName+'：</em><span>'+content+'</span></p>');
              $(that).find('span').eq(0).html(pinglunNum);
              $(".shai-navInput").remove();
              $.ajax(
              {
                type: "get",
                async: false,
                url: GLOBALURL.dataUrl+"mobile/publish/publishComment.do",
                data:{publishId:publishId,content:content},
                dataType: "jsonp",
                jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
                //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
                success: function(data)
                {
                  
                },
                error: function()
                {
                     YIIGOO.popWindow('系统繁忙，请稍后再试…');
                }
              });
            });
          });
    });
    //晒单 赞。
    $("#yg-doc").delegate(".js_zan","click",function()
    {
        var that = this;
        var zanNum = Number($(this).find("span").eq(0).html());
        //登录状态，才能点赞。
        YIIGOO.getLoginType(window.location.href,function()
        {
            if($(that).hasClass("on"))
            {
             $(that).removeClass("on");
              $(that).find("span").eq(0).html(zanNum-1)
            }else
            {
              $(that).addClass("on");
              $(that).find("span").eq(0).html(zanNum+1)
            };
            var thisPublishId = $(that).attr("id").split("_")[2]; 
            var receiverId        = $(that).attr("userId");
            //点赞和取消赞。
	        $.ajax(
	        {
	            type: "get",
	            async: false,
	            url: GLOBALURL.dataUrl+"mobile/publish/pushNice.do?",
	            data:{publishId:thisPublishId,receiverId:receiverId},
	            dataType: "jsonp",
	            jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
	            jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
	            success: function(data)
	            {
	              
	            },
	            error: function()
	            {
	                 YIIGOO.popWindow('系统繁忙，请稍后再试…');
	            }
	        });
        });
    });
	//sourceCode
	var sourceCode = BOM.parseQueryStr(window.location.href).sourceCode || null;
	if(sourceCode != null )
	{
		BOM.setCookie("sourceCode",sourceCode,7);
	};
	
});