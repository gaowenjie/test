$(function()
{
	var orderData = {};
	var sourceCode=null;//推广id
	var ygMyindex = 
	{
		init:function()
		{
			ygMyindex.getUserMsg();

		},
		getUserMsg:function(orderId)
		{
		    $.ajax(
	        {
		    type: "get",
		    async: false,
		    url: GLOBALURL.dataUrl+"mobile/userCentre/findUserInfo.do",
		    data:{},
		    dataType: "jsonp",
		    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		    success: function(data)
		    {
		        if(data.type == "success")
		        {
		        	if(data.extra.key == "REDIRECT_LONGIN_PAGE")
		        	{
		        		window.location.href  = "login.html?pageBack=userCenter";//用户个人中心。
		        	};
		        	ygMyindex.getOrderNum();
					ygMyindex.getTcAndMsg();
					//园园
					sourceCode=data.extra.sourceCode;
					ygMyindex.tiBtn();

		          	Fxtpl.render("js_userMsg",data.extra);
		          	$("#js_myshare").on("click",function()
		          	{
		          		window.location.href = "../share/mypage.html?userId="+data.extra.id;
		          	});
		        }else if(data.type == "error")
	            {
	              //未登录。
	              if(data.extra.key == "REDIRECT_LONGIN_PAGE")
	              {
	                window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
	              }
	            }
		    },
		    error: function()
		    {
		        YIIGOO.popWindow('系统繁忙，请稍后再试…');
		    }
	        });
		},
		getOrderNum:function(orderId)
		{
		    $.ajax(
	        {
		    type: "get",
		    async: false,
		    url: GLOBALURL.dataUrl+"mobile/userCentre/findCountByOrderStatus.do",
		    data:{},
		    dataType: "jsonp",
		    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		    success: function(data)
		    {
		        if(data.type == "success")
		        {
		          ygMyindex.fxtplOrderNum(data.extra);
		        }else if(data.type == "error")
	            {
	              //未登录。
	              if(data.extra.key == "REDIRECT_LONGIN_PAGE")
	              {
	                window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
	              }
	            }
		    },
		    error: function()
		    {
		        YIIGOO.popWindow('系统繁忙，请稍后再试…');
		    }
	        });
		},
		getTcAndMsg:function(orderId)
		{
		    $.ajax(
	        {
		    type: "get",
		    async: false,
		    url: GLOBALURL.dataUrl+"mobile/userCentre/isShowForMe.do",
		    data:{},
		    dataType: "jsonp",
		    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		    success: function(data)
		    {
		        if(data.type == "success")
		        {
		          if(data.extra.message)
		          {
		          	$("#js_message").show();
		          }
		          if(data.extra.ticheng)
		          {
		          	$("#js_ticheng").show();
		          }
		        }else if(data.type == "error")
	            {
	              //未登录。
	              if(data.extra.key == "REDIRECT_LONGIN_PAGE")
	              {
	                window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
	              }
	            }
		    },
		    error: function()
		    {
		        YIIGOO.popWindow('系统繁忙，请稍后再试…');
		    }
	        });
		},
		fxtplOrderNum:function(data)
		{
			for(var i=0;i<data.length;i++)
			{
				if(data[i].orderStatus == "WaitingPay")
				{
					orderData.WaitingPay = data[i].amount;continue;
				}
				if(data[i].orderStatus == "WaitingSend")
				{
					orderData.WaitingSend = data[i].amount;continue;
				}
				if(data[i].orderStatus == "WaitingSign")
				{
					orderData.WaitingSign = data[i].amount;continue;
				}
			}
			Fxtpl.render("js_order",orderData);
		},
		//园园：提成
		tiBtn:function(){
			$("#tiBtn").click(function(){
				window.location.href="../discount/index.html?sourceCode="+sourceCode;
			})
			
		}
	};
	ygMyindex.init();
});