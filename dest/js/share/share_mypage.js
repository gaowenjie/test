$(function()
{
  var userId           = "",//用户id
      userMsg          = {},//用户信息。
      shaidanPageIndex = 0,//晒单页数.
      shaidanNum       = 5,//晒单每次请求的个数。
      shaidanData      = {},//晒单每次请求的数据。
      scroolTimes1     = 0,//滚动加载的次数
      scroolTimes2     = 0,//滚动加载的次数
      curShaidanId     = [],//当次晒单id。
      taLovePageIndex  = 0,//晒单页数.
      taLoveNum        = 2,//晒单每次请求的个数。
      taLoveData       = {},//他的喜欢数据。
      curtaLoveId      = [];
      
  var ygIndex = 
  {
    init:function()
    {      
      userId =BOM.parseQueryStr(window.location.href).userId;
     
      ygIndex.getUserMsg(userId);

      loginId = YIIGOO.getLoginId();

      if(userId==loginId)
      {
        //用户id等于登录id。
        str = "";
        str+='<p class="visit" id="js_type0"><span>WO的晒单</span></p>';
        str+='<i class="tline"></i>';
        str+='<p id="js_type1"><span>WO的喜欢</span></p>';
        $("#js_shaidan_type").html(str);
      }else
      {
        //用户id不等于登录id。
        str = "";
        str+='<p class="visit" id="js_type0"><span>TA的晒单</span></p>';
        str+='<i class="tline"></i>';
        str+='<p id="js_type1"><span>TA的喜欢</span></p>';
        $("#js_shaidan_type").html(str);
      }
       //选项卡切换。
      $("#js_type0").on("click",function()
      {
        $(this).addClass("visit");
        $("#js_type1").removeClass("visit");
        $("#js_ta_shaidan").show();
        $("#js_ta_love").hide();
        ygIndex.getShaidan(shaidanPageIndex,shaidanNum);
        $(window).off("scroll");
        //  滚动加载。滚动到最底部，加载新数据。
        YIIGOO.scrollLoad();  
        $(window).on("scroll",function () 
        {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) 
            {
                //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
                ygIndex.getShaidan(shaidanPageIndex,shaidanNum);
            }
        });
      });
      $("#js_type1").on("click",function()
      {
        $(this).addClass("visit");
        $("#js_type0").removeClass("visit");
        $("#js_ta_love").show();
        $("#js_ta_shaidan").hide();
        ygIndex.getLoveShaidan(taLovePageIndex,taLoveNum);
        $(window).off("scroll");
        //  滚动加载。滚动到最底部，加载新数据。
        YIIGOO.scrollLoad();  
        $(window).on("scroll",function () 
        {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) 
            {
                //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
                ygIndex.getLoveShaidan(taLovePageIndex,taLoveNum);
            }
        });
      });
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
              //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
              ygIndex.getShaidan(shaidanPageIndex,shaidanNum);
          }
      });
    },
    // 他的晒单列表接口。
    getShaidan:function(start,limit)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/publish/newSearch4User.do?",
          data:{start:start,limit:limit,userId:userId},
          dataType: "jsonp",
          success: function(data)
          {
            if(data.type == "success")
            {
              if(scroolTimes1 == 0 && data.extra.length == 0)
              {
                $(window).off("scroll");
                $("#js_ta_shaidan").html('<div class="no-car-date">还没有晒单哦~</div>');
                $("#js_preloading").hide();
                return;
              }else if(data.extra.length == 0)
              {
                $(window).off("scroll");
                $("#js_preloading").html('<p class="load jbc"><em>已经加载到最底部了</em></p>');
                return;
              }
              scroolTimes1++;
              shaidanData = data;
              for (var i=0;i<shaidanData.extra.length;i++) 
              {
                curShaidanId.push(shaidanData.extra[i].publishId);
                //晒单数据。重构。
                shaidanData.extra[i].tags = shaidanData.extra[i].tags.split(",");
                shaidanData.extra[i].createMonth = YIIGOO.getLocalTime(shaidanData.extra[i].createTimeDate,"m");
                shaidanData.extra[i].createDay   = YIIGOO.getLocalTime(shaidanData.extra[i].createTimeDate,"d");
                for(var j=0;j<shaidanData.extra[i].publishDetail.length;j++)
                {
                  shaidanData.extra[i].publishDetailLength = shaidanData.extra[i].publishDetail.length;
                }
              };
              //晒单初始id。
              shaidanPageIndex += shaidanNum;
              //渲染晒单数据。
              ygIndex.fxtpl_shaidan(shaidanData,"js_ta_shaidan");
              //根据当前晒单id获取晒单赞数和评论数量。
              ygIndex.getZanAndComment(curShaidanId.join(","));
              
            }else if(data.type == "error")
            {
              //未登录。
              if(data.extra.key == "REDIRECT_LONGIN_PAGE")
              {
                //window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
              }
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //用户信息。
    getUserMsg:function(userId)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/admin/findUserById.do",
          data:{userId:userId},
          dataType: "jsonp",
          success: function(data)
          {
            if(data.type == "success")
            {
              //data.extra.babyBirthday = YIIGOO.getLocalTime(data.extra.babyBirthday,"ymd");
              //园园 设置title
              $("#titleId").html(data.extra.nickName+"的个人主页");
              Fxtpl.render("js_user_msg",data.extra); 
              //取消加载loading。显示页面。
              $("#loading").hide();
              $("#yg-doc").show();
              
            }else if(data.type == "error")
            {
              //未登录。
              if(data.extra.key == "REDIRECT_LONGIN_PAGE")
              {
                //window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
              }
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    // 他的喜欢列表接口。
    getLoveShaidan:function(start,limit)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/publish/newSearchModel4Praise.do?",
          data:{start:start,limit:shaidanNum,userId:userId},
          dataType: "jsonp",
          success: function(data)
          {
            if(data.type == "success")
            {
              if(scroolTimes2 == 0 && data.extra.length == 0)
              {
                $(window).off("scroll");
                $("#js_ta_love").html('<div class="no-car-date">还没有晒单哦~</div>');
                $("#js_preloading").hide();
                return;
              }else if(data.extra.length == 0)
              {
                $(window).off("scroll");
                $("#js_preloading").html('<p class="load jbc"><em>已经加载到最底部了</em></p>');
                return;
              }
              scroolTimes2++;
              taLoveData = data;
              for (var i=0;i<taLoveData.extra.length;i++) 
              {
                curtaLoveId.push(taLoveData.extra[i].publishId);
                //晒单数据。重构。
                taLoveData.extra[i].tags = taLoveData.extra[i].tags.split(",");
                taLoveData.extra[i].createMonth = taLoveData.extra[i].createTime.split("-")[1];
                taLoveData.extra[i].createDay   = taLoveData.extra[i].createTime.split("-")[2];
                for(var j=0;j<taLoveData.extra[i].publishDetail.length;j++)
                {
                  taLoveData.extra[i].publishDetailLength = taLoveData.extra[i].publishDetail.length;
                }
              };
              //晒单初始id。
              taLovePageIndex += taLoveNum;
              //渲染晒单数据。
              ygIndex.fxtpl_loveShaidan(taLoveData,"js_ta_love");   
              //根据当前晒单id获取晒单赞数和评论数量。
              console.log(123);
              ygIndex.getZanAndComment(curtaLoveId.join(","));          
            }else if(data.type == "error")
            {
              //未登录。
              if(data.extra.key == "REDIRECT_LONGIN_PAGE")
              {
                //window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
              }
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
          success: function(data)
          {
            if(data.type == "success")
            {
              var data1 = data.extra;
              ygIndex.fxtpl_zanAndComment(data1);
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
    //晒单。数据渲染，开启轮播图。方法。
    fxtpl_shaidan:function(data,id)
    {
      //渲染插入晒单数据。。
      Fxtpl.render("js_shaidan_list",data);
      $("#"+id).append($("#js_shaidan_list").html());
      //图片滚动加载。
      YIIGOO.scrollLoad();  
      
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
    //晒单。数据渲染，开启轮播图。方法。
    fxtpl_loveShaidan:function(data,id)
    {
      //渲染插入晒单数据。。
      Fxtpl.render("js_loveShaidan_list",data);
      $("#"+id).append($("#js_loveShaidan_list").html());
      //图片滚动加载。
      YIIGOO.scrollLoad();  
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
    },
    //渲染赞和评论的数量。以及点赞数量加一，减一。
    fxtpl_zanAndComment:function(data)
    {
      for(var i = 0;i<data.commentResult.length;i++)
      {
        var str = "";
        str+='<i class="iconfont">&#xe621;</i><span>'+data.commentResult[i].count+'</span>';
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