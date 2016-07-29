//订单列表详情页面
$(function(){ 
    var orderId = BOM.parseQueryStr(window.location.href).orderId;
   //查询数据
   $.ajax({
      type: "get",
      async: false,
      url: GLOBALURL.dataUrl+"mobile/rebate/findOrderBalanceDetail.do",
      data:{orderId:orderId},
      dataType: "jsonp",
      success: function(data)
      {
        if(data.type == "success")
        {          
          data.extra.createTime = YIIGOO.getLocalTimeTwo(data.extra.createTime);  
          Fxtpl.render('js_orderdetail', data.extra);

        }
      },
      error: function()
      {
          YIIGOO.popWindow('系统繁忙，请稍后再试…');
      }
  });
   //分页效果
});

