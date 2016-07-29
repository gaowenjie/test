$(function()
{
	var orderId = BOM.parseQueryStr(window.location.href).orderId || null,
		submitData = {};
	var ygNotcomment = 
	{
		init:function()
		{
			ygNotcomment.getorderlist(orderId);

		},
		getorderlist:function(orderId)
		{
		    $.ajax(
	        {
			    type: "get",
			    async: false,
			    url: GLOBALURL.dataUrl+"mobile/userCentre/findWaitingComment.do",
			    data:{orderId:orderId},
			    dataType: "jsonp",
			    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
			    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
			    success: function(data)
			    {
			        if(data.type == "success")
			        {
			        	//重构图片
			        	for(var i=0;i<data.extra.length;i++)
			            {
			          	  	data.extra[i].imageUrl= YIIGOO.setImgUrl(data.extra[i].imageUrl,"200*200");
			            }
			          	ygNotcomment.fxtplorderlist(data);
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
		},
		fxtplorderlist:function(data,type)
		{
			Fxtpl.render("yg-bd",data);
			$(".alinkSplit").each(function()
		    {
		       $(this).attr("href",$(this).attr("thisdirectory")+$(this).attr("thisid"));
		    });
		    ygNotcomment.comment();
		},
		//评论。
		comment:function()
		{
			$(".js_comment").on("click",function()
			{
				//$(".js_comment").off("click");
				$("#js_imgcon .userImg").remove();
				submitData.orderId = orderId;
				submitData.productId = $(this).attr("data-productId");
				submitData.skuId = $(this).attr("data-skuId");
				$("#js_productImg").attr("src",$(this).attr("data-url"));
				$("#js_productName").html($(this).attr("data-name"));
				console.log(submitData);
				$("#js_submitcomment").show();
				$(".layer-close").on("click",function()
				{
					$("#js_submitcomment").hide();
				});
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
					var $commentTag = $("#js_tags a.on");
					var commentTagArry = [];
					for(var i=0;i<$commentTag.length;i++)
					{
						commentTagArry.push($($commentTag.get(i)).attr("dataValue"));
					};
					var $userImg = $("#js_imgcon .userImg").find("img");
					var userImgArry = [];
					for(var i=0;i<$userImg.length;i++)
					{
						userImgArry.push($userImg.get(i).src);
					};
					submitData.content = $("#js_userComment").val() == "" ? "好评!" : $("#js_userComment").val();
					submitData.commentTags = commentTagArry.join(",");
					submitData.imagesUrls = userImgArry.join(",");
					console.log(submitData);
					ygNotcomment.setComment(submitData);
				});
			});
		},
		//提交评论。
		setComment:function(data)
		{
			$.ajax(
	        {
			    type: "get",
			    async: false,
			    url: GLOBALURL.dataUrl+"mobile/userCentre/commentOrderItem.do",
			    data:data,
			    dataType: "jsonp",
			    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
			    //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
			    success: function(data)
			    {
			        if(data.type == "success")
			        {
			        	YIIGOO.popWindow(data.content,function()
		        		{
		        			window.location.reload();
		        		});
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
		}
	};
	ygNotcomment.init();
}); 

function previewImage(file)
{
	// var filextension=file.value.substring(file.value.lastIndexOf("."),file.value.length);
 //    filextension=filextension.toLowerCase();
 //    if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
 //    {
 //    	alert("对不起，系统仅支持标准格式的照片，请您调整格式后重新上传，谢谢 !");
 //    	file.focus();
 //    }
 //    else
 //    {
 //    }
		if($("#js_imgcon li").length>=5)
		{
			YIIGOO.popWindow("图片最多上传四张！");return;
		}
		var oLi = document.createElement("li");
		oLi.className = "userImg";
		var oA  = document.createElement("a");
		var img = document.createElement("img");
		oA.href = "javascript:void(0);";
		oA.appendChild(img);
		oLi.appendChild(oA);
	    if (file.files && file.files[0])
	    {
	        var reader = new FileReader();
	        reader.onload = function(evt){
	        	$.post(GLOBALURL.dataUrl+"mobile/file/uploadBase64Image.do", {uploadFile: evt.target.result,fileName:file.files[0].name,filetype:'commentList'}, function (data) 
	        	{
					img.src = data.fileUrl;
				});
	        };
	        reader.readAsDataURL(file.files[0]);
	        $("#js_imgcon").prepend(oLi);
	    };
};