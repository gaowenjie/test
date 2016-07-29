$(function()
{
	var orderStatus = BOM.parseQueryStr(window.location.href).orderStatus || null,
		updataTime  = 0,
		start       = 0,
		limit       = 200;
	var ygOrderlist = 
	{
		startNum:0,
		init:function()
		{
			 
			$(".orderNav a").removeClass("active");
			switch(orderStatus)
			{
				case "WaitingPay" :  //待付款。
				$($(".orderNav a").get(1)).addClass("active");
				break;
				case "WaitingSend" :  //待发货。
				$($(".orderNav a").get(2)).addClass("active");
				break;
				case "WaitingSign" :  //配送中，待签收。
				$($(".orderNav a").get(3)).addClass("active");
				break;
				case "TradeSuccess" : //交易成功。
				$($(".orderNav a").get(4)).addClass("active");
				break;
				case null :
				default:
				$($(".orderNav a").get(0)).addClass("active");
				break;
			}
			ygOrderlist.getorderlist(orderStatus,start,limit);

			//  滚动加载。滚动到最底部，加载新数据。
		    // $(window).scroll(function () 
		    // {
		    //     var scrollTop = $(this).scrollTop();
		    //     var scrollHeight = $(document).height();
		    //     var windowHeight = $(this).height();
		    //     if (scrollTop + windowHeight == scrollHeight) 
		    //     {
		    //         //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
		    //         ygOrderlist.getorderlist(orderStatus,ygOrderlist.startNum,limit);
		    //     }
		    // });

		},
		getorderlist:function(orderStatus,start,limit)
		{
		    $.ajax(
	        {
		    type: "get",
		    async: false,
		    url: GLOBALURL.dataUrl+"mobile/userCentre/findMyOrderList.do",
		    data:{orderStatus:orderStatus,start:start,limit:limit},
		    dataType: "jsonp",
		    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		    success: function(data)
		    {
		        if(data.type == "success")
		        {
		        	ygOrderlist.startNum += limit;
		        	//重构图片
		        	for(var i=0;i<data.extra.length;i++)
		            {
		            	for(var j=0;j<data.extra[i].images.length;j++)
		            	{
		          	  		data.extra[i].images[j].imageUrl = YIIGOO.setImgUrl(data.extra[i].images[j].imageUrl,"200*200");
		          	  	};
		          	  	data.extra[i].imagesLength = data.extra[i].images.length;;
		          	  	
		            }
		          ygOrderlist.fxtplorderlist(data,orderStatus);
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
		fxtplorderlist:function(data,type)
		{
			if(data.extra.length == 0)
			{
				var str="";
				str+='<div class="nodatago">';
			        str+='<p class="t">您还没有订单哦, 去逛逛~</p>';
			        str+='<p class="bigbut">';
			          str+='<a href="../mall/index.html" class="fff">去逛逛</a>';
			        str+='</p>';
			    str+='</div>';
				$("#js_orderlist").html(str);
			}else
			{
				Fxtpl.render("js_orderlist_module",data);
				$("#js_orderlist").append($("#js_orderlist_module").html());
				var swiper = new Swiper('.swiper-container', {
			        pagination: '.swiper-pagination',
			        slidesPerView: 4,
			        paginationClickable: true,
			        spaceBetween: 15,
			       // width:3
			    });
				//图片滚动加载。
      			YIIGOO.scrollLoad();
			}
			
		}
	};
	ygOrderlist.init();
});