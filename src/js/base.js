var userData = [];


//jsonp demo。
$.ajax(
{
     type: "get",
     async: false,
     url: "http://192.168.1.195:8080/yg_mobile/mobile/ygProduct/detail.do?id=1",
     dataType: "jsonp",
     jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
     jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
     success: function(json){
         alert(json.id);
     },
     error: function(){
         alert('fail');
     }
});
/*生成任意长度的随机字符串。*/
function randomString(len) 
{
　　len = len || 32;
　　var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
};

//登录信息。本地存储。
//localstorage.
var loginMSG = [{"name":""},{}];
if(window.localStorage)
{
	//清空本地存储数据。localStorage
	//var userData1 = JSON.parse(localStorage.getItem("userData"));
	//数据需要解析出来，转化为json数据。
	localStorage.clear();
	localStorage.removeItem("loginMSG");
	localStorage.setItem("loginMSG", JSON.stringify(loginMSG));
};

$(document).ready(function() {
	function getElesByClass(strClass,contextEle)
	{
		function getEle(strClass,eles){
			var ary=[];
			var reg=new RegExp('\\b'+strClass+'\\b');
			for(var i=0;i<eles.length;i++){			
					if(reg.test(eles[i].className)){
						ary.push(eles[i]);			
					}
			}
			return ary;
		}
		contextEle=contextEle||document;
		if(contextEle.nodeType!=1&&contextEle.nodeType!=9){contextEle=document;}
		if(contextEle.getElementsByClassName){
			return contextEle.getElementsByClassName(strClass);
		}else{
			var classArray=strClass.split(' ');
			var eles=contextEle.getElementsByTagName('*');
			for(var i=0;i<classArray.length;i++){	
					if(classArray[i].replace(/\s/g,'').length>0){
						eles=getEle(classArray[i],eles);
					}
				}
			return eles;
		}
	};
	
	/*鍔犺浇鐢ㄦ埛鏁版嵁銆傘€傘€傘€�*/
	var userData1 = JSON.parse(localStorage.getItem("userData"));
	if(userData1)
	{
		var navList = document.getElementById("navList");
		var pindaoAll = getElesByClass("pindao",navList);
		$(".pindao").removeClass("dis_block");
		for(var i=0;i<userData1.length;i++)
		{
			for(var j=0;j<pindaoAll.length;j++)
			{
				if(userData1[i].title == pindaoAll[j].innerText)
				{
					$(pindaoAll[j]).addClass("dis_block");break;
				}
			}
		}
		$("#scroller").html();
		$("#scroller").html(getUserSelect(userData1));
	}
	/*椤堕儴鑿滃崟鏍�*/
	$("#navClose").on('click', function(event) 
	{
		event.preventDefault();
		var navList = document.getElementById("navList");

		var userSelect = getElesByClass("dis_block",navList);
		// alert(userSelect.length);
		userData = [];
		for (var i = 0;i<userSelect.length;i++) 
		{
			var data = {};
			data.title = userSelect[i].innerText;
			data.href   = userSelect[i].href;
			userData.push(data);
		};
		$("#scroller").html();
		if(window.localStorage)
		{
    		//娓歌鍣ㄦ敮鎸乴ocalStorage
    		localStorage.clear();
    		localStorage.removeItem("userData");
    		localStorage.setItem("userData", JSON.stringify(userData));
		}
		//document.cookie="userData="+userData; 
		$('#navList').fadeOut('400');
		$('#navList').css('display','none');
		$("#scroller").html();
		$("#scroller").html(getUserSelect(userData));
		$("#scroller").attr("style","transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); transition-duration: 0ms; transform: translate(0px, 0px) translateZ(0px);");
	});
	$("#navList a").on('click',function(event) {
		event.preventDefault();
		if($(this).hasClass('dis_block')){
			$(this).removeClass('dis_block')
		}else{
			$(this).addClass('dis_block');
		}
	});
	$("#navOpen").on('click', function(event) {
		event.preventDefault();
		$('#navList').fadeIn('400');
	});
	$("#navIscroll li").on('click',function(event) {
		//event.preventDefault();
		$(this).addClass('cur').siblings('li').removeClass('cur');
	});
	/*杩斿洖椤堕儴*/
	$(".goTop").on('click',function(event) {
		$(window).scrollTop(0);
	});
	$(window).scroll(function() {
		var wst = $(window).scrollTop();
		var jl=2+'em';
		if(wst>40){
			$("#navWrap").addClass('fixed');
		}
		else{
			$("#navWrap").removeClass('fixed');
		}
	});
	/*鍒嗕韩*/
	$("#btn_share").on('click', function(event) {
		event.preventDefault();
		$('#shareBox').stop().fadeIn(400);
	});
	$("#btn_cancle").on('click', function(event) {
		event.preventDefault();
		$('#shareBox').stop().fadeOut(400);
	});

});



//璁块棶璁惧鍒ゆ柇
// function browserRedirect(dir) {
// 	var sUserAgent = navigator.userAgent.toLowerCase();
// 	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
// 	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
// 	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
// 	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
// 	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
// 	var bIsAndroid = sUserAgent.match(/android/i) == "android";
// 	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
// 	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
// 	if ((bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){
// 	   var host=window.location.host;
// 	   var reHost=window.location.host+'/'+dir;
// 		//鑾峰彇椤甸潰瀹屾暣鍦板潃
// 		url = window.location.href;
// 		dumpUrl=url.replace(host,reHost);
// 		window.location.href=dumpUrl;
// 	}
// }
// //鏂扮増璁块棶璁惧鍒ゆ柇20140604
// function browserRedirect_new() {
//     var sUserAgent = navigator.userAgent.toLowerCase();

// 	if( /spider|bot|slurp/.test(sUserAgent) ){
// 		return;
// 	}

//     if(/AppleWebKit.*Mobile/i.test(sUserAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/i.test(sUserAgent)) || /ipad|iphone os|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)){

//        var host=window.location.host;
// 	   var url = window.location.href;
//        if(host.substr(0,4)=='www.'){
//             var reHost=host.replace('www.','m.');
//        }else{
//             var frist = host.indexOf('.');
//             var tmp = host.substr(0,frist);
//             var reHost=host.replace(host.substr(0,frist)+'.','m.')+'/'+tmp;
//        }
//         dumpUrl=url.replace(host,reHost);
// 		if(reHost) window.location.href=dumpUrl;
//     }
// }