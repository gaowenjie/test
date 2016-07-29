$(function(){
  //接收列表页面传过来的id地址参数
  var userAddressId = BOM.parseQueryStr(window.location.href).userAddressId;
  var pageId=BOM.parseQueryStr(window.location.href).pageId;
  var couponDetailId=BOM.parseQueryStr(window.location.href).couponDetailId;
  var totalPrice=BOM.parseQueryStr(window.location.href).totalPrice;
  var addtId=BOM.parseQueryStr(window.location.href).addtId;

  //页面加载的时候隐藏遮罩层
  $("#js_mask").hide();

  var update={
     addrSelet:function(userAddressId){
        //查询数据
        $.ajax({
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/userAddress/findUserAddressById.do",
            data:{userAddressId:addtId},
            dataType: "jsonp",
            success: function(data)
            {
              if(data.type == "success")
              {
                Fxtpl.render('update', data.extra);
                //数据渲染之后，给添加事件
                update.updateAddr();
                update.province();
                update.setDefaul();
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
    },
    //点击选择省市区的时候
    province:function(){
      $(".provinceBtn").click(function(){
        $("#ssq").css("z-index","2");
        $("#js_mask").show();

        //点击弹层的时候，获取areaName 
          var js_province=$("#js_province").text();
          var js_city=$("#js_city").text();
          var js_area=$("#js_area").text();

          var spanProvice=$("#spanProvice");
          var spanCity=$("#spanCity");
          var spanArea=$("#spanArea");
          
          //设置地址默认值
          addressInit("cmbProvince","cmbCity","cmbArea","spanProvice","spanCity","spanArea",js_province,js_city,js_area);

          $("#cmbArea").click(function(){ 
            //把数据返回到页面
            var js_province=$("#spanProvice").text();
            var js_city=$("#spanCity").text();
            var js_area=$("#spanArea").text();
            
            $("#js_province").text(js_province);
            $("#js_city").text(js_city);
            $("#js_area").text(js_area);

            $("#ssq").hide();
            $("#js_mask").hide();
           
          });

          //点击省市区，显示弹层
          $("#ssq").show();
          //2.点击关闭按钮，隐藏内容
          $("#js_area_close").on("click",function(){
            $("#ssq").hide();
            $("#js_mask").hide();
          });
      })
    },
    //给[设置默认] 注册click事件
    setDefaul:function(){
      $("#isDefual").on("click",function(){
          $(this).toggleClass("ok");//来回切换
      });
    },
    
    //修改
    updateAddr:function(){
          //点击提交按钮，发请求到后台
          $("#submitBtn").on("click",function(){        
            //获取所有input的参数
            var provinceName = $("#js_province").text();
            var cityName = $("#js_city").text();
            var areaName = $("#js_area").text();

            var addressId=addtId;
            
            var receiver=$("#receiver").val();
            var telPhone= $("#phone").val();
            var address= $("#detailAdder").val();
            var isDefault=$("#isDefual").hasClass("ok");
            
            //判断手机号是否正确
            if(isNull(telPhone)){
                YIIGOO.popWindow("手机号不能为空！");
                $("#phone").focus();
                return false;
            }else if(!checkPhone(telPhone)){
                YIIGOO.popWindow("请输入正确的手机号！");
                $("#phone").focus();
                return false;
            }else{
                //修改地址按钮的接口
                $.ajax({
                      type: "get",
                      async: false,
                      url: GLOBALURL.dataUrl+"mobile/userAddress/updateUserAddress.do",
                      data:{addressId:addressId,receiver:receiver,telPhone:telPhone,provinceName:provinceName,cityName:cityName,areaName:areaName,address:address,isDefault:isDefault},
                      dataType: "jsonp",
                      success: function(data)
                      {
                        if(data.type == "success")
                        { 
                          //判断要跳的是结算页,还是列表页
                          if(pageId=="addAddr"){
                            window.location.href="address.html";
                          }else{      
                                        
                            window.location.href="../order/address.html?userAddressId="+userAddressId+"&couponDetailId="+couponDetailId+"&totalPrice="+totalPrice;
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
            }
            
          });
    }

  };

  update.addrSelet(userAddressId);
});


