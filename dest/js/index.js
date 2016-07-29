$(function()
{
  var shaidanPageIndex = 0,//晒单页数.
      shaidanNum       = 5,//晒单每次请求的个数。
      shaidanData      = {},//晒单每次请求的数据。
      shaidanId        = [],//所有的晒单id。
      scroolTimes      = 0,//滚动加载的次数
      curShaidanId     = [];//当次晒单id。
  var ygIndex = 
  {
    init:function()
    {
      // 首页轮播图数据，本地存储。
      var ls_index_lunbo = window.localStorage.getItem("index_lunbo");
      if(ls_index_lunbo)
      {
        ygIndex.fxtpl_lunbo(JSON.parse(ls_index_lunbo)); 
      };
      //轮播图
      ygIndex.getLunbo();
      //晒单列表接口。
      ygIndex.getShaidan(shaidanPageIndex,shaidanNum);
      //  滚动加载。滚动到最底部，加载新数据。
      $(window).on("scroll",function ()
      {
          var scrollTop = $(this).scrollTop();
          var scrollHeight = $(document).height();
          var windowHeight = $(this).height();
          if (scrollTop + windowHeight == scrollHeight) 
          {
            $("#js_preloading").show();
              //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
              ygIndex.getShaidan(shaidanPageIndex,shaidanNum);
          }
      });
    },
    //轮播图接口数据。
    getLunbo:function()
    {
      // 轮播图接口。
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/focus/list.do?",
          data:{start:0,limit:10,pageKey:"Index"},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
          success: function(data)
          {
            if(data.type == "success")
            {
              for(var i=0;i<data.extra.length;i++)
              {
                data.extra[i].imagePath = YIIGOO.setImgUrl(data.extra[i].imagePath,"800*800");
              }
              window.localStorage.setItem("index_lunbo",JSON.stringify(data));
              ygIndex.fxtpl_lunbo(data);
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    // 晒单列表接口。
    getShaidan:function(start,limit)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/publish/newSearch4Index.do?",
          data:{start:start,limit:limit},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          //jsonpCallback:"fn1",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
          success: function(data)
          {
            shaidanPageIndex += shaidanNum;
            if(data.type == "success")
            {
              if(scroolTimes == 0 && data.extra.length == 0)
              {
                $(window).off("scroll");
                $("#js_product_common").html('<div class="no-car-date">该商品还没有评论哦~</div>');
              }else if(data.extra.length == 0)
              {
                $(window).off("scroll");
                $("#js_preloading").html('<p class="load jbc"><em>已经加载到最底部了</em></p>');
                return;
              }
              scroolTimes++;
              //每次都清空。
              curShaidanId     = [];
              //晒单数组去重。
              for(var m=0;m<shaidanId.length;m++)
              {
                for(var n=0;n<data.extra.length;n++)
                {
                  if(shaidanId[m] == data.extra[n].publishId)
                  {
                    //去掉重复的晒单数据。
                    data.extra.splice(n,1);
                    n--;
                  }
                }
              };
              shaidanData = data;
              for (var i=0;i<shaidanData.extra.length;i++) 
              {
                
                shaidanId.push(shaidanData.extra[i].publishId);
                curShaidanId.push(shaidanData.extra[i].publishId);
                //晒单数据。重构。
                shaidanData.extra[i].tags = shaidanData.extra[i].tags.split(",");
                // for(var j=0;j<shaidanData.extra[i].publishDetail.length;j++)
                // {
                //   //图片重构。
                //   shaidanData.extra[i].publishDetail[j].imagePath = YIIGOO.setImgUrl(shaidanData.extra[i].publishDetail[j].imagePath,"800*800");
                // }
              };
              //渲染晒单数据。
              ygIndex.fxtpl_shaidan(shaidanData);
              //根据当前晒单id获取晒单赞数和评论数量。
              ygIndex.getZanAndComment(curShaidanId.join(","));
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //赞和评论数量。
    getZanAndComment:function(data)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/publish/getCommentAndNiceCount.do?",
          data:{publishIds:data},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          //jsonpCallback:"fn1",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
          success: function(data)
          {
            if(data.type == "success")
            {
              var data1 = data.extra;
              ygIndex.fxtpl_zanAndComment(data1);
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //轮播图。数据渲染，开启轮播图。方法。
    fxtpl_lunbo:function (data)
    {
      //轮播图。
      Fxtpl.render("js_index_lunbo",data);
      //图片滚动加载。
      YIIGOO.scrollLoad();  
      //启动轮播图。
      var swiperLunbo = new Swiper('.swiper-container-0', {
          pagination: '.swiper-pagination',
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          paginationClickable: true,
          //spaceBetween: 30,
          centeredSlides: true,
          autoplay: 3000,
          autoplayDisableOnInteraction: false,
          onInit: function(swiper){
          
          }
      });
      
    },
    //晒单。数据渲染，开启轮播图。方法。
    fxtpl_shaidan:function(data)
    {
      //渲染插入晒单数据。。
      Fxtpl.render("js_shaidan_list",data);
      $("#js_shaidan").append($("#js_shaidan_list").html());
      
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
    },
    //渲染赞和评论的数量。以及点赞数量加一，减一。
    fxtpl_zanAndComment:function(data)
    {
        for(var i = 0;i<data.commentResult.length;i++)
        {
          var str = "";
          str+='<i class="iconfont ">&#xe621;</i><span>'+data.commentResult[i].count+'</span>';
          $("#js_pinglun_"+data.commentResult[i].publishId).html(str);
        };
        for(var i = 0;i<data.praiseResult.length;i++)
        {
          var str = "";
          str+='<i class="iconfont zan"></i><span>'+data.praiseResult[i].count+'</span>';
          if(data.praiseResult[i].currentUserIsPraise)
          {
            $("#js_zan_"+data.praiseResult[i].publishId).addClass("on");
          };
          $("#js_zan_"+data.praiseResult[i].publishId).html(str);
        };
    },
    //点赞和取消赞。
    setZanType:function(publishId,userId)
    {
      $.ajax(
      {
        type: "get",
        async: false,
        url: GLOBALURL.dataUrl+"mobile/publish/pushNice.do?",
        data:{publishId:publishId,userId:userId},
        dataType: "jsonp",
        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
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