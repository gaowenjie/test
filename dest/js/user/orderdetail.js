$(function()
{
	var orderId = BOM.parseQueryStr(window.location.href).orderId;
	var ygOrderdetail = 
	{
		init:function()
		{ 
			ygOrderdetail.getorderdetail(orderId);
		},
		getorderdetail:function(orderId)
		{
		    $.ajax(
	        {
			    type: "get",
			    async: false,
			    url: GLOBALURL.dataUrl+"mobile/userCentre/findOrderInfo.do",
			    data:{orderId:orderId},
			    dataType: "jsonp",
			    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
			    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
			    success: function(data)
			    {
			        if(data.type == "success")
			        {
			          data.extra.orderTime = YIIGOO.getLocalTime(data.extra.createTime);
			          var orderData = data.extra;
			          for(var i=0;i<orderData.detailModels.length;i++)
			          {
			          	orderData.detailModels[i].imageUrl = YIIGOO.setImgUrl(orderData.detailModels[i].imageUrl,"200*200");
			          }
			          ygOrderdetail.fxtplorder(orderData);
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
		fxtplorder:function(data)
		{
			Fxtpl.render("js_orderdetail",data);
			var orderId = data.orderId;
			var totalPrice = data.totalPrice;
			if(data.orderStatus == "WaitingSend" || data.orderStatus == "WaitingPay" || data.orderStatus == "WaitingCheck" || data.orderStatus == "TradeClosed")
			{
				$("#js_express").hide();
			}
			if(data.orderStatus == "WaitingSend" || data.orderStatus == "WaitingSign" || data.orderStatus == "TradeClosed")
			{
				$("#js_comment").hide();
			};
			if(data.orderStatus == "WaitingPay")
			{
				$("#js_comment").html('<p class="o-but" id="js_cancel_order"><a class="smallbut-not" href="javascript:void(0);">取 消</a></p><p class="o-but" id="js_pay_order"><a class="smallbut" href="../order/submitSuccess.html?state='+orderId+'-'+totalPrice+'">支 付</a></p>');
			};
			$("#js_cancel_order").on("click",function()
			{
				YIIGOO.delWindow("确定要取消订单吗？",function()
		        {
					$.ajax(
			        {
					    type: "get",
					    async: false,
					    url: GLOBALURL.dataUrl+"mobile/order/cancelOrder.do",
					    data:{orderId:orderId},
					    dataType: "jsonp",
					    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
					    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
					    success: function(data)
					    {
					        if(data.type == "success")
					        {
					         	window.location.reload(); 
					        }else if(data.type == "error")
					        {
					        	YIIGOO.popWindow(data.content);
					        }  
					    },
					    error: function()
					    {
					        YIIGOO.popWindow('系统繁忙，请稍后再试…');
					    }
			        });
		        });
			});
			$("#js_comment_order").on("click",function()
			{
				window.location.href = 'notcomment.html?orderId='+orderId;
			});
			$("#js_kefu_btn").on("click",function()
			{
				$("#js_kefu").show();
				$(".layer-close").on("click",function()
				{
					$("#js_kefu").hide();
				});
			});
			//图片滚动加载。
      		YIIGOO.scrollLoad();
		}
	};
	ygOrderdetail.init();
});