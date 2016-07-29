$(function()
{
	var shaidanData = YIIGOO.getLocalStorage("shaidanData");
	console.log(shaidanData);
	var ygAddcomment = 
	{
		init:function()
		{
			ygAddcomment.fxtplshaidan(shaidanData);
			$("#js_tags a").on("click",function()
			{
				if($(this).hasClass("on"))
				{
					$(this).removeClass("on");
					if($("#js_tags a.on").length<=0)
					{
						$("#js_tags a").eq(0).addClass("on");
					}
				}else
				{
					if($("#js_tags a.on").length>=4)
					{
						YIIGOO.popWindow("最多选择四个标记！");
					}else
					{
						$(this).addClass("on");
					}
				}
			});
			$("#js_fabu").on("click",function()
			{
				$("#js_fabu").off("click");
				ygAddcomment.fabu();
			});
			var nickName = YIIGOO.getLocalStorage("nickName");			
			$("#titleId").html(nickName+"的晒单评论");
		},
		fxtplshaidan:function(data)
		{
			Fxtpl.render("js_shandanImg",data);
			var swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        //spaceBetween: 30,
		        centeredSlides: true,
		        autoplay: 2500,
		        effect: 'fade',
		        autoplayDisableOnInteraction: false
		    });
		},
		fabu:function()
		{
			if($("#js_comment").val() == "")
			{
				YIIGOO.popWindow("评论内容不能为空");
				return;
			}
			shaidanData.publishDesc = $("#js_comment").val();
			var tags = [];
			var tagsNum = $("#js_tags a.on").length;
			for(var i=0 ;i<tagsNum;i++)
			{
				tags.push($("#js_tags a.on").eq(i).html());
			}
			shaidanData.tags = tags.join(",");
			//发布晒单
			$.ajax(
		    {
		        type: "get",
		        async: false,
		        url: GLOBALURL.dataUrl+"mobile/publish/publish.do?",
	            data:{tags:shaidanData.tags,publishDesc:shaidanData.publishDesc,publishDetail:JSON.stringify(shaidanData.publishDetail)},
		        dataType: "jsonp",
		        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		        //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		        success: function(data)
		        {
		            if(data.type == "success")
		            {
		            	window.location.href = "../user/index.html";
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
		}
	};
	ygAddcomment.init();
});