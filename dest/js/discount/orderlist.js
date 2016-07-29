//订单列表页面
$(function(){ 
    var orderSum = BOM.parseQueryStr(window.location.href).orderSum;
    var orderPrice = BOM.parseQueryStr(window.location.href).orderPrice;
    $("#orderSum").text(orderSum);
    $("#orderAmount").text(orderPrice);
    //var orderAmount=0;
    var shaidanPageIndex = 0,//晒单页数.
        scroolTimes      = 0,//滚动次数
        shaidanNum       = 10;//晒单每次请求的个数。

    var order={
      init:function(){
        $("#js_preloading").hide();
        order.getList(shaidanPageIndex,shaidanNum);
        //  滚动加载。滚动到最底部，加载新数据。
        $(window).on("scroll",function ()
        {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) 
            {
                $("#js_preloading").show();//触发滚动，显示底部滚动加载信息
                order.getList(shaidanPageIndex,shaidanNum);
            }
        });
      },
      //查询数据
      getList:function(){
         $.ajax({
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/rebate/findOrderList.do",
            dataType: "jsonp",
            success: function(data)
            {
              shaidanPageIndex += shaidanNum;
              if(data.type == "success")
              {
                if(scroolTimes == 0 && data.extra.length == 0)
                { 
                  $("#list_init").show();
                  $("#js_orderList").hide();
                  $(window).off("scroll");
                }else if(data.extra.length == 0)
                {
                  $(window).off("scroll");
                  $("#js_preloading").html('<p class="load jbc"><em>已经加载到最底部了</em></p>');
                  return;
                }else{
                  scroolTimes++;
                  //有数据就显示内容区域
                  $("#js_orderList").show();
                  $("#list_init").hide();
                }
                
                //遍历json数据，修改时间格式
                for(var i=0;i<data.extra.length;i++){
                  //orderAmount+=data.extra[i].totalPrice;//设置总金额
                  data.extra[i].createTime = YIIGOO.getLocalTimeTwo(data.extra[i].createTime);
                }
                //$("#orderAmount").text(orderAmount);
                //渲染页面[创建时间转换]
                Fxtpl.render('js_orderList', data);
                order.orderList();

              }
            },
            error: function()
            {
                 YIIGOO.popWindow('系统繁忙，请稍后再试…');
            }
        });
      },
      orderList:function(){
        $(".orderList").click(function(){
          //获取当前点击对象的orderId 
          var orderId=$(this).find(".js_orderId").text();
          //点列表行进入订单详情页
          window.location.href="orderdetail.html?orderId="+orderId;
        })
      }
    }
    order.init();
});

