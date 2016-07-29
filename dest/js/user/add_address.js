//我的收货地址页面

$(function(){
  var addrNum =0;
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
              
              
              //Fxtpl 渲染HTML
              Fxtpl.render('addr_url', data);
              //调用默认方法
              addr.default();
              //调用删除按钮的方法
              addr.delete();
              //调用修改按钮
              addr.modify();

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
    //设为默认
    default:function(){
      $(".js_addr").on("click",function(){
        var _this = $(this);
        var addtId = _this.attr("id").split("_")[1];
        
        if(!$(this).hasClass("ok")){
          $.ajax({
              type: "get",
              async: false,
              url: GLOBALURL.dataUrl+"mobile/userAddress/setDefault.do",
              dataType: "jsonp",
              data:{addressId:addtId,isDefault:true},
              success: function(data)
              {

                if(data.type == "success")
                { 
                  $(".js_addr").removeClass("ok");
                  _this.addClass("ok");
                  
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

    },
    //修改地址
    modify:function(){
      $(".edit-modify").on("click",function(){
        var _this = $(this);
        var addtId = _this.attr("id").split("_")[1];
        var pageId='addAddr';
        //点击修改地址的时候，跳转页面+传参[地址id]
        window.location.href="editaddress.html?addtId="+addtId+"&pageId="+pageId;

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
      /*3、  新建地址：用户点击【新建地址】，系统判断已有地址条数，
          1)  如果已有20条弹层提示“最多添加20条地址”，2秒消失。
          2)  如果小于20条，弹层显示新建页面：*/
          $("#newAddr").on("click",function(){
            if(addrNum>=20){
              YIIGOO.popWindow("最多添加20条地址");
              return false;
            }else{
              var pageId='addAddr';
              window.location.href="newddress.html?pageId="+pageId;
            }
          });
          
    }
  };
  addr.init();//页面加载执行的函数方法

});
