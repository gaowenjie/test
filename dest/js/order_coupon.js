//结算页优惠券页面
$(function(){
  
  //获取结算页面跳转时给的+地址参数+优惠券参数
  var userAddressId=BOM.parseQueryStr(window.location.href).userAddressId;//地址id
  var couponDetailId=BOM.parseQueryStr(window.location.href).couponDetailId;//优惠券的ID
  var productPrice=BOM.parseQueryStr(window.location.href).totalPrice;//商品价格

  var coupon={
    init:function(){
     coupon.seletCoupon(productPrice);
     $($("#js-mycoupon a")[0]).trigger("click");//解决页面初始化的点击事件
    },
    //获取优惠券列表接口
    seletCoupon:function(productPrice){
      $('#js-mycoupon a').click(function () {  
              var _this=$(this);
              $(".on").removeClass("on");    //移除选项卡的特效  
              $(_this).addClass("on");       //给当前点击的按钮添加样式 
              var cStatus = _this.attr("value");
              //alert(cStatus)
              $.ajax({
                  type: "get",
                  async: false,
                  url: GLOBALURL.dataUrl+"mobile/coupon/findCouponListForPay.do",
                  data:{productPrice:productPrice,cStatus:cStatus},
                  dataType: "jsonp",
                  jsonp: "callback",
                  success: function(data)
                  {
                    if(data.type == "success")
                    { 
                      //判断有没有优惠券
                      if(data.extra.length==0){
                        if(cStatus=="Usable"){
                          $("#js_not_coupon_p").text("您没有可用优惠券~");
                        }else{
                          $("#js_not_coupon_p").text("您没有不可用优惠券~~");
                        }
                        
                        //显示隐藏域
                        $("#js_not_coupon").show();
                        $(".coupon-lst").hide();
                        $("#js_edbut").hide();

                      }else{
                        $("#js_not_coupon").hide();
                        $(".coupon-lst").show();
                      }

                      data["cStatus"]=cStatus;
                      //遍历json数据，修改时间格式
                      for(var i=0;i<data.extra.length;i++){
                        data.extra[i].startDate = coupon.getLocalTime(data.extra[i].startDate);
                        data.extra[i].endDate = coupon.getLocalTime(data.extra[i].endDate);
                        data["couponDetailId"]=couponDetailId;
                      }
                      Fxtpl.render('js_coupon_list', data);

                      //如果返回的为0时，设置文本
                      for(var i=0;i<data.extra.length;i++){
                        if(data.extra[i].limitPrice == 0){
                          $("#zeroPrice_"+data.extra[i].couponCode).text("无门槛优惠券");
                        }
                        
                      }
                      if(cStatus=="UnUsable"){
                        $("#js_edbut").hide();
                      }else if(cStatus=="Usable" && data.extra.length>0){
                        $("#js_edbut").show();
                      }
                      coupon.default();
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
    //勾选默认优惠券
    default:function(){
      //如果当前点击的对象有ok就删除，如果没有就添加ok[添加之前删掉所有的]
       $(".js_ok").on("click",function(){
        var _this=$(this);
        if(!$(this).hasClass("ok")){
          $(".js_ok").removeClass("ok");
          _this.addClass("ok");
          $("#js_edbut").click(function(){
            //跳回结算页[需要把选中的地址id传过去]
            var couponDetailId = _this.attr("id").split("_")[1];
            window.location.href="../order/checkorder.html?userAddressId="+userAddressId+"&couponDetailId="+couponDetailId+"&productPrice="+productPrice;
          })
          
        }

       });

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
