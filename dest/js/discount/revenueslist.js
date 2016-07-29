//预收入详细列表
$(function(){ 
    var revenues = BOM.parseQueryStr(window.location.href).revenues;
    $("#disCount").text(revenues);
    var shaidanPageIndex = 0,//晒单页数.
        scroolTimes      = 0,//滚动次数
        shaidanNum       = 10;//晒单每次请求的个数。
    var revenues={
      init:function(){
        $("#js_preloading").hide();
        revenues.selectReventList(shaidanPageIndex,shaidanNum);
        //  滚动加载。滚动到最底部，加载新数据。
        $(window).on("scroll",function ()
        {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) 
            {
                $("#js_preloading").show();//触发滚动，显示底部滚动加载信息
                revenues.selectReventList(shaidanPageIndex,shaidanNum);
            }
        });
      },
      //查询数据
      selectReventList:function(){
         $.ajax({
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/rebate/findBalanceDetails.do",
            dataType: "jsonp",
            success: function(data)
            {
              shaidanPageIndex += shaidanNum;
              if(data.type == "success")
              {
                if(scroolTimes == 0 && data.extra.length == 0)
                { 
                  $("#list_init").show();
                  $("#js_disCountList").hide();
                  $(window).off("scroll");
                }else if(data.extra.length == 0)
                {
                  $(window).off("scroll");
                  $("#js_preloading").html('<p class="load jbc"><em>已经加载到最底部了</em></p>');
                  return;
                }else{
                  scroolTimes++;
                  //有数据就显示内容区域
                  $("#js_disCountList").show();
                  $("#list_init").hide();
                }

                for(var i=0;i<data.extra.length;i++){
                  data.extra[i].createTime = YIIGOO.getLocalTimeTwo(data.extra[i].createTime);
                }
                
                Fxtpl.render('js_disCountList', data);
              }
            },
            error: function()
            {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
            }
        });
      }
    }
    revenues.init();
});

