//个人中心页优惠券页面
$(function(){

  var coupon={
    init:function(){
      coupon.initCoupon();
      $($("#js-mycoupon a")[0]).trigger("click");
    },
    initCoupon:function(){
      //给每个a标签绑定click事件 
      $("#js-mycoupon a").click(function(){
        var _this = $(this);
        $(".on").removeClass("on");    //移除选项卡的特效  
        $(_this).addClass("on");       //给当前点击的按钮添加样式
        var cStatus = _this.attr("value");
        //这里请求后台，在回调里渲染页面，给后台的参数cStatus
        $.ajax({
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/coupon/findOwnCouponList.do",
            data:{cStatus:cStatus},
            dataType: "jsonp",
            jsonp: "callback",
            success: function(data)
            {
              if(data.type == "success")
              { 
                //判断有没有优惠券
                if(data.extra.length==0){
                  //判断状态显示相应的无数据提示
                  var js_not_coupon_p="";
                  if(cStatus=="UnUsed"){
                    js_not_coupon_p="您没有可使用的优惠券";
                  }else if(cStatus=="Used"){
                    js_not_coupon_p="您没有已使用的优惠券";
                  }else{
                    js_not_coupon_p="您没有已过期的优惠券";
                  }
                  $("#js_not_coupon_p").text(js_not_coupon_p);

                  $("#js_not_coupon").show();
                  $(".coupon-lst").hide();
                }else{
                  $("#js_not_coupon").hide();
                  $(".coupon-lst").show();
                }
                data["cStatus"]=cStatus;
                //遍历json数据，修改时间格式
                for(var i=0;i<data.extra.length;i++){
                  data.extra[i].startDate = coupon.getLocalTime(data.extra[i].startDate);
                  data.extra[i].endDate = coupon.getLocalTime(data.extra[i].endDate);
                }

                Fxtpl.render('js_coupon_list', data);
                
                //如果返回的为0时，设置文本
                for(var i=0;i<data.extra.length;i++){
                  if(data.extra[i].limitPrice == 0){
                    $("#zeroPrice_"+data.extra[i].couponCode).text("无门槛优惠券");
                  }
                  
                }
                
              }else if(data.type == "error"){
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

      });
    },
    findInArr:function(arr,n){
      for(var i=0; i<arr.length; i++){
        if(arr[i]==n){
          return true;
        }
      }
      return false;
    },
    //把毫秒转成时间对象
    getLocalTime:function (ms) 
    { 
      var now = new Date(ms);
      var   year=now.getFullYear();     
      var   month=now.getMonth()+1;     
      var   date=now.getDate();     
      var   hour=now.getHours();     
      var   minute=now.getMinutes();     
      var   second=now.getSeconds();     
      return   year+"."+coupon.toDou(month)+"."+coupon.toDou(date);         
    }, 

    //补零方法
    toDou:function(iNum){
      return iNum<10?'0'+iNum:''+iNum;
    }
  }
  coupon.init();//页面加载执行的函数方法

  

});
