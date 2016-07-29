//新建地址页面
$(function(){
  //获取上一个页面的参数
  var pageId=BOM.parseQueryStr(window.location.href).pageId;
  var userAddressId=BOM.parseQueryStr(window.location.href).userAddressId;//地址id
  var couponDetailId=BOM.parseQueryStr(window.location.href).couponDetailId;
  var totalPrice=BOM.parseQueryStr(window.location.href).totalPrice;//总价

  $("#js_mask").hide();//页面加载的时候隐藏遮罩层

  var newAddress={
    //点击选择省市区
    province:function(){
      $(".provinceBtn").click(function(){
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
            //alert(js_province+js_city+js_area)

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
    
    //新建地址
    newAddr:function(){
          //点击提交按钮，发请求到后台
          $("#subBtn").on("click",function(){
            //获取所有input的参数
            var provinceName = $("#js_province").text();
            var cityName = $("#js_city").text();
            var areaName = $("#js_area").text();

            var addressId=$("#addtId").val();
            var receiver=$("#receiver").val();
            var telPhone= $("#phone").val();
            var address= $("#detailAdder").val();
            var isDefault=$("#isDefual").hasClass("ok");

            //判断收件人，手机号，具体地址是否为空
            if(isNull(receiver)){
                YIIGOO.popWindow("联系人不能为空！");
                $("#receiver").focus();
                return false;
            }else if(isNull(telPhone)){
                YIIGOO.popWindow("手机号错误,请重新输入！");
                $("#phone").focus();
                return false;
            }else if(!checkPhone(telPhone)){
                YIIGOO.popWindow("手机号错误,请重新输入！");
                $("#phone").focus();
                return false;
            }else if(isNull(provinceName) ||isNull(cityName) ||isNull(areaName)){
                YIIGOO.popWindow("请选择省市区！");
                $("#js_pro").focus();
                return false;
            }else if(isNull(address)){
                YIIGOO.popWindow("请填写具体的收货地址！");
                $("#detailAdder").focus();
                return false;
            }else{
                //修改地址按钮的接口
                $.ajax({
                      type: "get",
                      async: false,
                      url: GLOBALURL.dataUrl+"mobile/userAddress/addUserAddress.do",
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
                            window.location.href="../order/address.html?userAddressId="+userAddressId+"&couponDetailId="+couponDetailId+"&totalPrice="+totalPrice;;
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

  newAddress.province();
  newAddress.setDefaul();
  newAddress.newAddr();
  
  


});


