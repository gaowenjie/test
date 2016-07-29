//结算页的收货地址页面
$(function(){
  var addrNum =0;
  //获取结算页面跳转时给的参数
  var userAddressId=BOM.parseQueryStr(window.location.href).userAddressId;//地址id
  var couponDetailId=BOM.parseQueryStr(window.location.href).couponDetailId;
  var totalPrice=BOM.parseQueryStr(window.location.href).totalPrice;//总价

  var addr={

    init:function(){

      addr.addrList();
      addr.newAddr();
      
    },
    //获取收货地址列表
    addrList:function(){
      $.ajax({
        type:"get",
        async:"false",
        url:GLOBALURL.dataUrl+"mobile/userAddress/findUserAddressList.do",
        dataType: "jsonp",
        jsonpCallback: "callback",
        success:function(data){
          if(data.type == "success"){
            //判断页面是否有数据，没有数据就显示初始化提示
            addrNum=data.extra.length;
            if(data.extra.length == 0){
              $("#add_init").show();
              $("#addr_url").hide();
            }else{
              $("#addr_url").show();
              $("#add_init").hide();
              data["userAddressId"]=userAddressId;//把接收的参数存到data里面去
              Fxtpl.render('addr_url', data);
              //把默认勾选的地址放到第一条
             $($("dl[id^='add_list_']")[0]).before($("#add_list_"+userAddressId));

              //调用删除按钮的方法
              addr.delete();
              //调用修改按钮
              addr.modify();
              //调用默认方法
              addr.default();

             

            }
          }else if(data.type == "error"){
             //未登录。
            if(data.extra.key == "REDIRECT_LONGIN_PAGE")
            {
              window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
            }
          } 
        },
        error:function(){
          YIIGOO.popWindow('系统繁忙，请稍后再试…');
        }
      });
    },
    //勾选地址
    default:function(){
       $(".js_isOk").on("click",function(){
          var _this=$(this);
          if(!$(this).hasClass("ok")){
            $(".js_isOk").removeClass("ok");
            _this.addClass("ok");

            //跳回结算页[需要把选中的地址id传过去]
            var userAddressId = _this.attr("id").split("_")[1];

            window.location.href="../order/checkorder.html?userAddressId="+userAddressId+"&couponDetailId="+couponDetailId+"&totalPrice="+totalPrice;
          }else{
            _this.removeClass("ok");
            //跳回结算页[需要把选中的地址id传过去]
            var userAddressId = _this.attr("id").split("_")[1];
            window.location.href="../order/checkorder.html?userAddressId="+userAddressId+"&couponDetailId="+couponDetailId+"&totalPrice="+totalPrice;
          }

       });

    },
    //修改地址
    modify:function(){
      $(".edit-modify").on("click",function(){
        var _this = $(this);
        var addtId = _this.attr("id").split("_")[1];//当前点击的地址id
        var pageId='orderAddr';
        //点击修改地址的时候，跳转页面+传参[地址id]
        window.location.href="../user/editaddress.html?pageId="+pageId+"&addtId="+addtId+"&userAddressId="+userAddressId+"&couponDetailId="+couponDetailId+"&totalPrice="+totalPrice;

      });
    },
    //删除地址
    delete:function(){
      $(".edit-del").on("click",function(){
          var _this = $(this);
          var addtId = _this.attr("id").split("_")[1];
          YIIGOO.delWindow("确定删除该地址吗？",function(){
            $("#js_del_layer").html("");
            var addtId = _this.attr("id").split("_")[1];
            addr.delAddList(addtId);

          });
      });
    },
    //删除一条地址数据。
    delAddList:function(addressId){
      $.ajax({
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/userAddress/deleteUserAddress.do",
          data:{addressId:addressId},
          dataType: "jsonp",
          jsonp: "callback",
          success: function(data)
          {
            if(data.type == "success")
            {
              $("#add_list_"+addressId).remove();//删除页面的数据
              //判断是否是最后一条数据，如果是显示无数据提示
              if($("#addr_url").find("dl").length == 0)
              {
                $("#add_init").show();
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
    },

    //新增地址
    newAddr:function(){
      $("#newAddr").on("click",function(){
        if(addrNum>=20){
          YIIGOO.popWindow("最多添加20条地址");
          return false;
        }else{
          var pageId='orderAddr';
          window.location.href="../user/newddress.html?pageId="+pageId+"&userAddressId="+userAddressId+"&couponDetailId="+couponDetailId+"&totalPrice="+totalPrice;
        }
      });
          
    }
  };
  addr.init();//页面加载执行的函数方法

  

});
