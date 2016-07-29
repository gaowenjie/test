var hammer = '';
var sizeType = "one";
var currentIndex = 0;
var shaidanImgNum = 0;
var body_width = $('body').width();
var body_height = $('body').height();
//1:1
$('#type1').on('touchstart', function () 
{
	$("#clipArea").html("");
	//图片上传按钮
	clipImg("type1");
});
//4.3
$('#type2').on('touchstart', function () 
{
	$("#clipArea").html("");
	//图片上传按钮
	clipImg("type2");
});
//图片上传
function saveImageInfo() 
{
	var filename = $('#hit').attr('fileName');
	var img_data = $('#hit').attr('src');
	//通过ajax把值传到后台。
	$.post(GLOBALURL.dataUrl+"mobile/file/uploadBase64Image.do", {uploadFile: img_data,fileName:filename,fileType:'PublishDetailImage4One,PublishDetailImage4Three'}, function (data) {
		if(sizeType == "one")
		{
			var imgUrl = YIIGOO.setImgUrl(data.fileUrl,"480*480");
		}else
		{
			var imgUrl = YIIGOO.setImgUrl(data.fileUrl,"480*640");
		}
		shaidanImg(data.fileUrl);
	});
	//shaidanImg(img_data);
}
/*获取文件拓展名*/
function getFileExt(str) {
	var d = /\.[^\.]+$/.exec(str);
	return d;
};
//点击调用input的文件打开功能
$(function () {
	var ygShaidan = 
	{
		init:function()
		{
			$('#upload2').on('click', function () 
			{
				//图片上传按钮
				$('#file').click();
				clipImg("type1");
			});
			$("#js_nextstep").on("click",function()
			{
				// $("#js_nextstep").off();
				if($("#js_shaidanImg li.on").length<1)
				{
					YIIGOO.popWindow("请选择一个加标记的图片");
					return;
				}
				var shaidanData = 
				{
					tags:null,
					publishDesc:"",
					publishDetail:[]
				};
				var num = $("#js_shaidanImg li").length;
				for(var i=0;i<num;i++)
				{
					if($("#js_shaidanImg li").eq(i).hasClass("on"))
					{
						imgData = 
						{
							"imagePath": $("#js_shaidanImg li img").eq(i).attr("src"),
						    "isSign": "1",
						    "sizeType": sizeType,
						    "publishDetailTags":[]
						};
						shaidanData.publishDetail.unshift(imgData);
					}else
					{
						imgData = 
						{
							"imagePath": $("#js_shaidanImg li img").eq(i).attr("src"),
						    "isSign": "0",
						    "sizeType": sizeType,
						    "publishDetailTags":[]
						};
						shaidanData.publishDetail.push(imgData);
					}
					
				};
				console.log(shaidanData);
				YIIGOO.setLocalStorage("shaidanData",shaidanData);
				window.location.href = "addsign.html";
			});
		}
	};
	YIIGOO.getLoginType(window.location.href,function()
	{
		ygShaidan.init();
	});
	

});
//原始默认的上传
function clipImg(type)
{
	if(type=="type1")
	{
		var clipHeight = body_width * 0.8125;
	}else if(type=="type2")
	{
		var clipHeight = body_width * 0.8125*0.75;
	};
	$("#clipArea").photoClip(
	{
		width: body_width * 0.8125,
		height: clipHeight,
		file: "#file",
		view: "#hit",
		ok: "#clipBtn",
		loadStart: function () {
			//console.log("照片读取中");
			$('.lazy_tip span').text('');  
			$('.lazy_cover,.lazy_tip').show();
		},
		loadComplete: function () {
			//console.log("照片读取完成");
			$('.lazy_cover,.lazy_tip').hide();
		},
		clipFinish: function (dataURL) {
			$("#clipBtn").off();
			$('#hit').attr('src', dataURL);
			saveImageInfo();
			$("#clipArea").html('<i class="uptit">上传图片</i><span class="pic-up" id="upload2"></span>');
			$('#upload2').on('click', function () {
				if(shaidanImgNum>=3)
				{
					YIIGOO.popWindow("最多上传3张图片，并选择1张图片添加标记");
					return;
				}
				//图片上传按钮
				$('#file').click();
				clipImg("type1");
			});
		}
	});
};
//上传图片完成后页面加载图片
function shaidanImg(url)
{
	shaidanImgNum++;
	console.log(shaidanImgNum);
	if($("#js_shaidanImg_con").css("display") == "none")
	{
		$("#js_shaidanImg_des").css("display","none");
		$("#js_shaidanImg_con").css("display","block");
		$("#yg-fd  ").css("display","block");
	}
	$("#js_shaidanImg").append('<li><a href="javascript:void(0);" class="i"></a><img src="'+url+'"></li>');
	$("#js_shaidanImg li").on("click",function()
	{
		$("#js_shaidanImg li").removeClass("on");
		$(this).addClass("on");
	});
	$("#js_shaidanImg li.on i").on("click",function()
	{
		$(this).parent().remove();
	});
}
