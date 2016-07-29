$(function()
{
  var publishData      = {},//晒单每次请求的数据。
      publishIds       = [2],//赞。评论，数量。
      publishId        = [];//晒单id。
  var ygIndex = 
  {
    init:function()
    {
      publishId =BOM.parseQueryStr(window.location.href).publishId;
      //晒单列表接口。
      ygIndex.getShaidan(publishId);
    },
    // 晒单列表接口。
    getShaidan:function(publishId)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/publish/findDetailModel.do?",
          data:{publishId:publishId},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          success: function(data)
          {
            if(data.type == "success")
            {
              //园园+title
              $("#titleId").text(data.extra.userNickName+"的晒单评论");
              publishData = data.extra;
              publishData.tags = publishData.tags.split(",");
              // for(var i=0;i<publishData.publishDetail.length;i++)
              // {
              //   publishData.publishDetail[i].imagePath = YIIGOO.setImgUrl(publishData.publishDetail[i].imagePath,"800*800");
              // }
              //ygIndex.fxtpl_shaidan(publishData);
              ygIndex.getComment(publishId); 
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //赞和评论数量。
    getZanAndComment:function()
    {
      $.ajax(
      {
          type: "get",
          async: true,
          url: GLOBALURL.dataUrl+"mobile/publish/getCommentAndNiceCount.do?",
          data:{publishIds:publishId},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          success: function(data)
          {
            if(data.type == "success")
            {
              //评论数量
              if(data.extra.commentResult.length == 0)
              {
                publishData.commentResult = 0;
              }else
              {
                publishData.commentResult = data.extra.commentResult[0].count;
              }
              //赞的数量
              if(data.extra.praiseResult.length == 0)
              {
                publishData.praiseResult = 0;
              }else
              {
                publishData.praiseResult = data.extra.praiseResult[0].count;
                publishData.currentUserIsPraise = data.extra.praiseResult[0].currentUserIsPraise;
              }
              ygIndex.fxtpl_shaidan(publishData); 
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //评论接口。
    getComment:function(publishId)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/publish/findCommentByPublishId.do?",
          data:{publishId:publishId},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          success: function(data)
          {
            if(data.type == "success")
            {
              publishData.comments=data.extra;
              ygIndex.getZanAndComment();
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //晒单。数据渲染，开启轮播图。方法。
    fxtpl_shaidan:function(data)
    {
      //渲染插入晒单数据。。
      Fxtpl.render("js_shaidan_con",data);
      //取消加载loading。显示页面。
      $("#loading").hide();
      $("#yg-doc").show();
      //启动轮播图。
      var swiper = new Swiper('.swiper-container-1', {
          pagination: '.swiper-pagination',
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          paginationType: 'progress',
          paginationClickable: true,
          //spaceBetween: 30,
          centeredSlides: true,
          autoplay: 0,
          autoplayDisableOnInteraction: false,
          onSlideChangeEnd: function(swiper)
          {
            
          }
      });
      $(".swiper-container-1").each(function()
      {
        if($(this).find(".swiper-slide").length == 1)
        {
          $(this).find(".swiper-pagcon").hide();
        }
      });
      $("#js_jubao").on("click",function()
      {
        $("#js_jubao_con").show();
        $(".layer-close").on("click",function()
        {
          $("#js_jubao_con").hide();
        });
        $("#js_jubao_type a").on("click",function()
        {
          $("#js_jubao_type a").removeClass("on");
          $(this).addClass("on");
          if($(this).html() == "其他")
          {
            $("#js_jubao_des").show();
          }else
          {
            $("#js_jubao_des").hide();
          }
        });
        $("#js_jubao_btn").on("click",function()
        {
          if($("#js_jubao_type a.on").eq(0).html() == "其他")
          {
            if($("#js_jubao_des").val() == "")
            {
              YIIGOO.popWindow("请填写举报原因。");return;
            };
            var des = $("#js_jubao_des").val();
          }else
          {
            var des = $("#js_jubao_type a.on").eq(0).html();
          }
          ygIndex.jubao(publishId,des);
          $("#js_jubao_type a").removeClass("on");
          $("#js_jubao_type a").eq(0).addClass("on");
          $("#js_jubao_des").val("");
          $("#js_jubao_des").hide();
          $("#js_jubao_con").hide();
        });
      });
    },
    //举报。
    jubao:function(publishId,remark)
    {
      $.ajax(
      {
        type: "get",
        async: false,
        url: GLOBALURL.dataUrl+"mobile/publish/pushNice.do?",
        data:{publishId:publishId,remark:remark},
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
    }
  };
  ygIndex.init();
});