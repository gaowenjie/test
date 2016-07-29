$(function()
{
	var signNum = 0,//标记数量
		signTotalNum = 0;
	var shaidanData = YIIGOO.getLocalStorage("shaidanData");
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
	var hasTouch = 'ontouchstart' in window && !isTouchPad;
	var touchStart = hasTouch ? 'touchstart' : 'mousedown';
	var touchMove = hasTouch ? 'touchmove' : '';
	var touchEnd = hasTouch ? 'touchend' : 'mouseup';
	var addsign = 
	{
		init:function()
		{
			addsign.firstTime();
			$("#js_signImg").attr("src",shaidanData.publishDetail[0].imagePath)
			$("#js_nextstep").on("click",function()
			{
				addsign.nextstep();
			});
			$("#js_signImg").on("click",function(event)
			{
				addsign.addsign(event);
			});
		},
		//第一次登录
		firstTime:function()
		{
			$.ajax(
	      	{
	          type: "get",
	          async: false,
	          url: GLOBALURL.dataUrl+"mobile/admin/isGuide.do",
	          data:{},
	          dataType: "jsonp",
	          jsonp: "callback",
	          success: function(data)
	          {
	            if(data.type == "success")
	            {
	             	if(data.extra)
	             	{
	             		//第一次登录。
	             		$("#js_yindao").show();
	             		$("#js_yindao").on("click",function()
	             		{
	             			$(this).hide();
	             		});
	             	}else
	             	{
	             		$("#js_yindao").hide();
	             	}
	            }else if(data.type == "error")
	            {
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
		//添加标记。
		addsign:function(event)
		{
			addsign.changesign();

			//if( hasTouch ){ if ( e.touches.length > 1 || e.scale && e.scale !== 1) return }; //多点或缩放
			//数量大于5
			if(signNum>=5)
			{
				YIIGOO.popWindow("最多添加5个标记");
			}else
			{
				var point =event  // hasTouch ? event.touches[0] : event;
				startX =  point.pageX;
				startY =  point.pageY;
				var oW = $("#js_signImg").width();
					oH = $("#js_signImg").height();
				console.log(startX+":"+startY+"\n");
				console.log(oW+":"+oH);
				$("#js_save_sign").off("click");
				$("#js_addsign").show();
				$("#js_addsign").attr("typeId","new");  
				$(".layer-close").on("click",function()
				{
					$("#js_addsign").hide();
				});
				$("#js_hasBuy").off("click");
				$("#js_hasBuy").on("click",function()
				{
					addsign.hasBuy();
				});
				$("#js_save_sign").on("click",function()
				{
					if($("#js_pinpai").val()=="")
					{
						YIIGOO.popWindow("请输入品牌信息");return;
					};
					var brandName = $("#js_pinpai").val();
					var pinpai    = $("#js_pinpai").attr("pinpai");
					var fenlei    = $("#js_fenlei option:selected").val();
					if($("#js_addsign").attr("typeId") == "new") //添加新的标记
					{
						var positionX = (startX/oW)*100;
						var positionY = (startY/oH)*100;
						var str = "";
						if(positionX<=50)
						{
							str+='<div class="look-img-label js_sign" pinpai="'+pinpai+'" fenlei="'+fenlei+'" brandName="'+brandName+'" dir="Left" id="js_sign_'+signTotalNum+'" left="'+positionX+'" top="'+positionY+'" style="left:'+positionX+'%;top:'+positionY+'%;">';
					          str+='<dl class="img-label-big-l">';
					            str+='<dt class="b-name">'+brandName+'</dt>';
					            str+='<dd class="b-line">';
					              str+='<span></span>';
					              str+='<em></em>';
					            str+='</dd>';
					          str+='</dl>';
					          if(pinpai == "yiigoo")
					          {
					          	str+='<span class="img-label-lit-l">SHOP</span>';
					          }
					        str+='</div>';
						}else
						{
							str+='<div class="look-img-label js_sign" pinpai="'+pinpai+'" fenlei="'+fenlei+'" brandName="'+brandName+'" dir="Right" id="js_sign_'+signTotalNum+'" left="'+positionX+'" top="'+positionY+'" style="left:'+positionX+'%;top:'+positionY+'%;">';
			                  str+='<dl class="img-label-big-r">';
			                    str+='<dt class="b-line">';
			                      str+='<em></em>';
			                      str+='<span></span>';                  
			                    str+='</dt>';
			                    str+='<dd class="b-name">'+brandName+'</dd>';
			                  str+='</dl>';
			                 if(pinpai == "yiigoo")
					          {
					          	str+='<span class="img-label-lit-r">SHOP</span>';
					          }
			                str+='</div>';
						}
				        $("#js_sign_con").append(str);
				        addsign.drag($("#js_sign_"+signTotalNum).get(0),$("#js_sign_con"));
				        addsign.borderJudge($("#js_sign_"+signTotalNum),$("#js_sign_con"));
						signNum++;
						signTotalNum++;
					}else //更新标记。
					{
						var id = $("#js_addsign").attr("typeId");
						$("#js_sign_"+id).attr("brandName",brandName);
						$("#js_sign_"+id).attr("fenlei",fenlei);
						$("#js_sign_"+id).find(".b-name").html(brandName);
					};
					$("#js_pinpai").val("");
					$("#js_pinpai").attr("pinpai","");
					$("#js_addsign").hide();
				});
			}
		},
		changesign:function()
		{
			$("#js_sign_con").undelegate();
			$("#js_sign_con").delegate(".js_sign","click",function(event)
			{
				var id = $(this).attr("id").split("_")[2];
				$("#js_changesign").show();
				$("#js_changesign").attr("signId",id);
				$(".layer-close").on("click",function()
				{
					$("#js_changesign").hide();
				});
				EventUtil.stopPropagation(event);
				EventUtil.preventDefault(event);
				//删除标记。
				$("#js_del_sign").off("click");
				$("#js_del_sign").on("click",function()
				{
					var id = $(this).parent().parent().parent().attr("signId");
					$("#js_sign_"+id).remove();
					signNum--;
					$("#js_changesign").hide();
				});
				//改变标记方向
				$("#js_changeDir_sign").off("click");
				$("#js_changeDir_sign").on("click",function()
				{
					var id = $(this).parent().parent().parent().attr("signId");
					var str = "";
					console.log($("#js_sign_"+id).attr("dir"));
					if($("#js_sign_"+id).attr("dir") == "Left")
					{
						$("#js_sign_"+id).attr("dir","Right");
						str+='<dl class="img-label-big-r">';
		                    str+='<dt class="b-line">';
		                      str+='<em></em>';
		                      str+='<span></span>';                  
		                    str+='</dt>';
		                    str+='<dd class="b-name">'+$("#js_sign_"+id).attr("brandName")+'</dd>';
		                str+='</dl>';
		                if($("#js_sign_"+id).attr("pinpai") == "yiigoo")
				          {
				          	str+='<span class="img-label-lit-r">SHOP</span>';
				          }
		                $("#js_sign_"+id).html(str);
					}else if($("#js_sign_"+id).attr("dir") == "Right")
					{
						$("#js_sign_"+id).attr("dir","Left");
						str+='<dl class="img-label-big-l">';
				            str+='<dt class="b-name">'+$("#js_sign_"+id).attr("brandName")+'</dt>';
				            str+='<dd class="b-line">';
				              str+='<span></span>';
				              str+='<em></em>';
				            str+='</dd>';
				        str+='</dl>';
				        if($("#js_sign_"+id).attr("pinpai") == "yiigoo")
				        {
				          	str+='<span class="img-label-lit-l">SHOP</span>';
				        }
				        $("#js_sign_"+id).html(str);
					};
					$("#js_changesign").hide();  
				});
				//编辑标记。
				$("#js_edit_sign").off("click");
				$("#js_edit_sign").on("click",function()
				{
					$("#js_changesign").hide(); 
					var id = $(this).parent().parent().parent().attr("signId");
					$("#js_addsign").show();
					//更新标记。
					$("#js_addsign").attr("typeId",id);  
					$("#js_pinpai").val($("#js_sign_"+id).attr("brandName"));
					var fenleiSelect = document.getElementById("js_fenlei");
					var fenleiValue  = $("#js_sign_"+id).attr("fenlei").get(0);
					for(var i=0; i<fenleiSelect.options.length; i++){  
					    if(fenleiSelect.options[i].value == fenleiValue){  
					        fenleiSelect.options[i].selected = true;  
					        break;  
					    }  
					}; 
				});
			});
		},
		//已购商品
		hasBuy:function()
		{
			//已购商品
			$.ajax(
		    {
		        type: "get",
		        async: false,
		        url: GLOBALURL.dataUrl+"mobile/product/findProduct4ShaidanModel.do",
	            data:{start:0,limit:100},
		        dataType: "jsonp",
		        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		        //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		        success: function(data)
		        {
		            if(data.type == "success")
		            {
		            	Fxtpl.render("js_hasBuy_con",data);
		            	$("#js_hasBuy_con").show();
		            	$("#js_hasBuy_con li").on("click",function()
						{
							var brandName = $(this).attr("brandName");
							var productId = $(this).attr("productId");
							$("#js_hasBuy_con").hide();
							$("#js_pinpai").attr("pinpai","yiigoo");
							$("#js_pinpai").attr("productId",productId);
							$("#js_pinpai").val(brandName);
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
		//边界判断。
		borderJudge:function(ele,parentEle)
		{
			var eleW = $(ele).width(),
				eleH = $(ele).height(),
				eleL = $(ele).offset().left,
				eleT = $(ele).offset().top,
				parentEleW = $(parentEle).width(),
				parentEleH = $(parentEle).height();
			if(eleL <=0)
			{
				$(ele).css("left",0);
				$(ele).attr("left",0);
			}
			if(eleT <=0)
			{
				$(ele).css("top",0);
				$(ele).attr("top",0);
			}
			if(eleL+eleW >= parentEleW)
			{
				var left = (parentEleW-eleW)/parentEleW*100+"%";
				$(ele).css("left",left);
				$(ele).attr("left",left);

			};
			if(eleT+eleH >= parentEleH)
			{
				var top = (parentEleH-eleH)/parentEleH*100+"%";
				$(ele).css("top",top);
				$(ele).attr("top",top);
			}
		},
		//拖拽
		drag:function(ele,parentEle)
		{
			parentEleW = $(parentEle).width(),
			parentEleH = $(parentEle).height();
			ele.addEventListener('touchmove', function(event) 
			{
			  event.preventDefault();//阻止其他事件
			  // 如果这个元素的位置内只有一个手指的话
			  if (event.targetTouches.length == 1) 
			  {
				   var touch = event.targetTouches[0];  // 把元素放在手指所在的位置
				   ele.style.left = touch.pageX/parentEleW*100 + '%';
				   ele.style.top = touch.pageY/parentEleH*100 + '%';
				   $(ele).attr("left",touch.pageX/parentEleW*100);
				   $(ele).attr("top",touch.pageY/parentEleH*100);
				   addsign.borderJudge(ele,parentEle);
			   }
			}, false);
		},
		nextstep:function()
		{
			//晒单数据。
			var num = $(".js_sign").length;
			shaidanData.publishDetail[0].publishDetailTags = [];
			for(var i=0;i<num;i++)
			{
				var sign = {};
				sign.brandName = $(".js_sign").eq(i).attr("brandName");
				sign.productId = $(".js_sign").eq(i).attr("productId");
				sign.positionX = $(".js_sign").eq(i).attr("left");
				sign.positionY = $(".js_sign").eq(i).attr("top");
				sign.directionType = $(".js_sign").eq(i).attr("dir");
				sign.categoryId = $(".js_sign").eq(i).attr("fenlei");
				if($(".js_sign").eq(i).attr("productId") != "")
				{
					sign.productId = $(".js_sign").eq(i).attr("productId");
				};
				shaidanData.publishDetail[0].publishDetailTags.push(sign);
			};
			YIIGOO.setLocalStorage("shaidanData",shaidanData);
			window.location.href = "addcomment.html";
		}
	};
	addsign.init();
});