//cps首页[我的返利页面]
$(function(){ 
   //获取带有该用户source值
  var sourceCode = BOM.parseQueryStr(window.location.href).sourceCode;
  $("#sourceId").text(sourceCode);
   var pro=
   {
    init:function(){
      //隐藏遮罩层
      $(".clicklayer").hide();
      pro.seletPro();
      
    },
    //获取页面信息接口
    seletPro:function(){    
      $.ajax({
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/rebate/findMyRebate.do",
          dataType: "jsonp",
          success: function(data)
          {
            if(data.type == "success")
            { 
             //设置推广方式2的短链接url
             $("#shareHref").html(data.extra.promotionLink);

              //渲染页面
              Fxtpl.render('js_discount', data.extra);
              //调用方法
              pro.order();
              pro.revenues();
              pro.cashLayer();
              pro.promotion();
              pro.bank();

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
    
    //订单量+订单金额 =>调列表页面
    order:function(){
      $("#orderBtn,#orderPriceBtn").click(function(){
        var sum=$("#orderCount").text();
        var orderPrice=$("#orderPrice").text();
        window.location.href="orderlist.html?orderSum="+sum+"&orderPrice="+orderPrice;
      })
    },
    //预收入
    revenues:function(){
      $("#revenuesBtn").click(function(){
        var revenues=$("#revenues").text();
        window.location.href="revenueslist.html?revenues="+revenues;
      })
    },
    //申请提现
    cashLayer:function(){
      /*1)  申请提现，点击【申请提现】，判断用户是否已经绑定银行卡，
          如果已经绑定，进入提现页面。
          如果没有绑定，进入绑定银行卡页面。
        2)  绑定银行卡：点击进入绑定银行卡页面。*/


      $("#cashLayerBtn").click(function(){
        $("body").css({overflow:"hidden"});    //禁用滚动条
        $("#cash_layer").show();
        $('#js_inputnum').attr("readonly",true); //并且让input框不可编辑
        $("#qrBtn").removeClass('ok').attr("disabled","true");//让按钮变灰，并不可用
        $(".clicklayer").show();
        $(".layer-close").click(function(){
          $("body").css({overflow:"auto"});    //恢复滚动条
          $("#cash_layer").hide();
          $(".clicklayer").hide();
        })
      })
    },
    //推广方式
    promotion:function(){
      $("#promotionBtn").click(function(){
        //请求数据URL的图片
        $.ajax({
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/rebate/getQRCodeUrl.do",
          dataType: "jsonp",
          success: function(data)
          {
            if(data.type == "success")
            {
              //成功提取codeUrl，设置到img的src中去
              var codeUrl=data.extra.codeUrl;
              $("#js_code").attr("src",codeUrl);
              //点击二维码放大图片
              $("#js_code").click(function(){
                //1.创建一个div，一个层，一个图片 2.把图片路径放到img的src中去，显示；3、点击图片的任何地方，关闭
                pro.popWindow(codeUrl);

              })

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

        $("#js_disLayer").show();
        $(".clicklayer").show();
        //关闭按钮
        $(".layer-close").click(function(){
           $("#js_disLayer").hide();
           $(".clicklayer").hide();
        });
        //点击复制按钮，复制文本内容？？
        /*$("#copyMes").click(function(){


        });*/

      })
    },
    popWindow:function(msg)
    {
      var str="";
      str+='<div class="popWindow yg-login-layer" id="popWindow">';
      str+='</div>';
      str+='<img src="'+msg+'" alt="" class="yg-login-hint" id="msg">';
      var popLayer = document.createElement("div");
      popLayer.id = "popLayer";
      popLayer.innerHTML = str;
      document.body.appendChild(popLayer);
      popLayer.onclick = function()
      {
        document.body.removeChild(popLayer);
      }
    },
    //绑定银行卡
    bank:function(){
      $("#bankBtn").click(function(){
        //跳转到绑定银行卡页面
        window.location.href="bindbank.html?sourceCode="+sourceCode;
      })
    }


  }
  pro.init();
   
});

