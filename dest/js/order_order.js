 $(function()
{
	var userAddressId = BOM.parseQueryStr(window.location.href).userAddressId ||-1;
	var userSelectId   = 0;
	var couponDetailId = BOM.parseQueryStr(window.location.href).couponDetailId ||-1;
	var productPrice   = 0;
	var totalPrice     = 0;
	var payType        = "WeChat";
	ygOrder = 
	{
		init:function()
		{
			ygOrder.getDefAddr(userAddressId);
		},
		// 获取默认收货地址
		getDefAddr:function(userAddressId)
		{
			$.ajax(
	        {
	            type: "get",
	            async: false,
	            url: GLOBALURL.dataUrl+"/mobile/userAddress/findDefaultUserAddress.do",
	            data:{userAddressId:userAddressId},
	            dataType: "jsonp",
	            jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
	            success: function(data)
	            {
	              if(data.type == "success")
	              {
	                ygOrder.fxtplDefAddr(data.extra);
	                ygOrder.getProductMsg();
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
		//渲染默认收货地址。
		fxtplDefAddr:function(data)
		{
			if(data == null)
			{
				$("#js_address").html('<div class="ad-infor"><p class="ad-dd">您还没有收货地址哦，添加一个吧！</p></div><div class="ad-goback"><i class="iconfont"></i></div>');
			}else
			{
				userSelectId = data.id;
				Fxtpl.render("js_address",data);
			}
			
		},
		// 获取购物车商品信息。
		getProductMsg:function()
		{
			$.ajax(
	        {
	            type: "get",
	            async: false,
	            url: GLOBALURL.dataUrl+"/mobile/order/findItemInfo.do",
	            data:{},
	            dataType: "jsonp",
	            success: function(data)
	            {
	              if(data.type == "success")
	              {
	                ygOrder.fxtplProduct(data);
	                productPrice = data.extra.productPrice;
	                $("#js_productPrice").html(productPrice);
	                ygOrder.getYouhui(couponDetailId,productPrice);
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
		//渲染购物车商品信息。
		fxtplProduct:function(data)
		{
			Fxtpl.render("js_product_msg",data);
		},
		//获取优惠卷 及满减金额，运费的接口
		getYouhui:function(couponDetailId,productPrice)
		{
			$.ajax(
	        {
	            type: "get",
	            async: false,
	            url: GLOBALURL.dataUrl+"mobile/coupon /findCouponForPay.do",
	            data:{couponDetailId:couponDetailId,productPrice:productPrice},
	            dataType: "jsonp",
	            success: function(data)
	            {
	              if(data.type == "success")
	              {
	                ygOrder.fxtplYouhui(data.extra);
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
		//渲染优惠券列表。
		fxtplYouhui:function(data)
		{
			$("#js_expressPrice").html(data.expressPrice);
			$("#js_manJianPrice").html(data.manJianPrice);
			
			if(data.coupon != null)
			{
				$("#js_couponPrice").html(data.coupon.faceValue);
				$("#js_couponTitle").html(data.coupon.faceValue+'元优惠券');
				couponDetailId = data.coupon.couponDetailId;
				totalPrice = productPrice+data.expressPrice-data.manJianPrice-data.coupon.faceValue;
			}else
			{
				totalPrice = productPrice+data.expressPrice-data.manJianPrice;
			};
			$("#js_totalPrice").html(totalPrice);
			$("#js_address").on("click",function()
			{
				window.location.href = "../order/address.html?userAddressId="+userSelectId+"&couponDetailId="+couponDetailId +"&totalPrice="+productPrice;
			});
			$("#js_getcoupon").on("click",function()
			{
				window.location.href = "../order/coupon.html?userAddressId="+userSelectId+"&couponDetailId="+couponDetailId+"&totalPrice="+productPrice;;
			});
			ygOrder.submitOrder();
		},
		//提交订单。
		submitOrder:function()
		{
			$("#js_submitOrder").on("click",function()
			{
				$("#js_submitOrder").off("click");
				$.ajax(
		        {
		            type: "get",
		            async: false,
		            url: GLOBALURL.dataUrl+"mobile/order/commitOrder.do",
		            data:{userAddressId:userSelectId,couponDetailId:couponDetailId,payType:payType,totalPrice:totalPrice},
		            dataType: "jsonp",
		            success: function(data)
		            {
		              if(data.type == "success")
		              {
		              	var state = data.extra.orderId+"-"+data.extra.totalPrice;
		                window.location.href = "submitSuccess.html?state="+state;
		              }else if(data.type == "error")
		              {
	                   //未登录。
	                	if(data.extra.key == "REDIRECT_LONGIN_PAGE")
		                {
		                  window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
		                }else
		                {
		                	YIIGOO.popWindow(data.content);
		                }
		              }
		            },
		            error: function()
		            {
		              YIIGOO.popWindow('系统繁忙，请稍后再试…');
		            }
		        });
	        })
		}
	};
	ygOrder.init();
})