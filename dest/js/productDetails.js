$(function()
{
  var commentIndex     = 0,//评论每页开始的id。
      commentCount     = 10,//评论每次请求的个数。
      productImgData   = {},//商品详情图片数据。
      groupData     = {},// 同组商品数据。
      productgroupId   = 1,//商品分类id。
      productId        = 1,//商品id。
      scroolTimes      = 0,//滚动加载的次数
      hasProductMsg    = false,
      productPrice     = 0;
  var ygProductDet = 
  {
    init:function()
    {
      productId =BOM.parseQueryStr(window.location.href).productId;
      //轮播图
      ygProductDet.getProductData();
      //获取相关晒单。
      ygProductDet.getGroupData();
      //获取购物车数量
      $.ajax(
      {
        type: "get",
        async: false,
        url: GLOBALURL.dataUrl+"mobile/admin/isLogin.do",
        data:{},
        dataType: "jsonp",
        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data)
        {
            if(data.type == "success")
            {
              if(data.extra.key == "LOGIN_SUCCESS")
              {
                ygProductDet.getCartNum();
              }
            }
        },
        error: function()
        {
            YIIGOO.popWindow('系统繁忙，请稍后再试…');
        }
      });
      //图片滚动加载。
      YIIGOO.scrollLoad();  
    },
    //单品详情,轮播图。
    getProductData:function()
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/product/detail.do?",
          data:{id:productId},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
          success: function(data)
          {
            if(data.type == "success")
            {
              //园园 设置title
              $("#titleId").text(data.extra.productName+"-壹果");
              $("#keywordsId").attr('content',data.extra.productName)
              $("#descriptionId").attr('content',data.extra.productName);

              var data = data.extra;
              productgroupId = data.groupId;
              productPrice   = data.productSalePrice;
              for(var i=0;i<data.productImages.length;i++)
              {
                data.productImages[i].imagePath = YIIGOO.setImgUrl(data.productImages[i].imagePath,"800*800");
              }
              //商品详情图片。
              productImgData.imgData = data.detailImagePath.split(",");
              ygProductDet.fxtpl_productData(data,productImgData);
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //渲染商品数据。
    fxtpl_productData:function(lunboData,productImgData)
    {
      Fxtpl.render("js_product_details",lunboData);
      if(lunboData.promotionType == "JiaJiaGou")
      {
        $("#js_addbtn").removeClass("js_add_carBtn").css("background","#ccc");
        $("#js_usersel_result").html('<a href="javascript:;" class="fselect"><p class="goods-info-style">加价购商品不能单独购买</p></a>');
      };
      if(lunboData.promotionType == "JiaJiaGou")
      {
        $("#js_addbtn").removeClass("js_add_carBtn").css("background","#ccc");
        $("#js_usersel_result").html('<a href="javascript:;" class="fselect"><p class="goods-info-style">赠品不能单独购买</p></a>');
      };
      // if(lunboData.promotionType == "JiaJiaGou" || lunboData.promotionType == "ManZeng")
      // {
      //   $("#yg-fd").hide();
      //   $("#js_usersel_result").hide();
      // };
      ;$(function()
      {
        var title = lunboData.productName,
          desc  = '我在壹果Yiigoo发现了【'+ lunboData.productName+'】，壹果主打有机婴儿用品，舒适安全。',
          link  = window.location.href,
          imgUrl= lunboData.detailImagePath.split(",")[0];
        share(title,desc,link,imgUrl);
      });
      //取消加载loading。显示页面。
      $("#loading").hide();
      $("#yg-doc").show();
      var swiper = new Swiper('.swiper-container-0', {
          pagination: '.swiper-pagination',
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          paginationClickable: true,
          //spaceBetween: 30,
          centeredSlides: true,
          autoplayDisableOnInteraction: false,
          onInit: function(swiper){
          }

      });
      Fxtpl.render("js_productImg",productImgData);
      //加入购物车弹层。
      $(".js_add_carBtn").on("click",function()
      {
        if(!hasProductMsg)
        {
           YIIGOO.getLoginType(window.location.href,function()
          {
            ygProductDet.getShoppingCar(productId);
          });
        }else
        {
          $("#js_add_shoppingCar").show();
        }
       
      });
       //返回头部
      $(window).on("scroll",function()
      {
        if($(document).scrollTop()>100)
        {
          $("#js_goTop").css("display","block");
        }else
        {
          $("#js_goTop").css("display","none");
        }
      });
      $("#js_goTop").click(function()
      {
        $("html,body").animate({"scrollTop":0});
      });
      //选项卡切换。
      $("#js_proTab").on("click",function()
      {
        $(this).addClass("visit");
        $("#js_commonTab").removeClass("visit");
        $("#js_productImg").show();
        $("#js_product_common").hide();
        $(window).off("scroll");
      });
      $("#js_commonTab").on("click",function()
      {
        $(this).addClass("visit");
        $("#js_proTab").removeClass("visit");
        $("#js_product_common").show();
        $("#js_productImg").hide();
        //商品详情渲染完毕后，加载评论数据。
        ygProductDet.getComment(commentIndex);
        // 滚动加载。滚动到最底部，加载新数据。
        $(window).on("scroll",function() 
        {
          var scrollTop = $(this).scrollTop();
          var scrollHeight = $(document).height();
          var windowHeight = $(this).height();
          if (scrollTop + windowHeight == scrollHeight) 
          {
              $("#js_preloading").show();
              //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
              ygProductDet.getComment(commentIndex);
          }
        });

      });
    },
    // 商品评论，数据。
    getComment:function(start)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/productComent/list.do?",
          data:{start:commentIndex,limit:commentCount+commentIndex,productId:productId},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
          success: function(data)
          {
            if(data.type == "success")
            {
              if(scroolTimes == 0 && data.extra.length == 0)
              {
                $(window).off("scroll");
                $("#js_product_common").html('<div class="no-car-date">该商品还没有评论哦~</div>');
                $("#js_preloading").hide();
                return;
              }else if(data.extra.length == 0)
              {
                console.log(4564651);
                $(window).off("scroll");
                $("#js_product_common").show();
                $("#js_preloading").show();
                $("#js_preloading").html('<p class="load jbc"><em>已经加载到最底部了</em></p>');
                return;
              }
              scroolTimes++;
              commentIndex += commentCount;
              for(var i=0;i<data.extra.length;i++)
              {
                if(data.extra[i].images)
                {
                  data.extra[i].images = data.extra[i].images.split(",");
                };
                data.extra[i].commentTag = data.extra[i].commentTag.split(",");
                data.extra[i].createTime = YIIGOO.getLocalTime(data.extra[i].createTime,'ymd');
              };
              ygProductDet.fxtpl_comment(data);
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //渲染商品评论数据。
    fxtpl_comment:function(data)
    {
      Fxtpl.render("js_commentData",data);

      $("#js_product_common_con").append($("#js_commentData").html());
      
    },
    //加入购物车。
    shoppingCar:function()
    {
      //隐藏弹层。
      $("#js_layer_close").click(function()
      {
        $("#js_add_shoppingCar").hide();
      });
      $(".js_reduce_num").off("click");
      $(".js_add_num").off("click");
      //数量减。
      $(".js_reduce_num").on("click",function()
      {
        var num = Number($("#js_count_num").val());
        var price = Number($("#js_one_price").html());
        if($(this).hasClass("not"))
        {
          return;
        }
        if(num==1)
        {
          $(this).addClass("not");return;
        }else
        {
          $("#js_count_num").val((num--)-1);
          $(".js_add_num").removeClass("not");
        }
      });
      //数量加。
      $(".js_add_num").on("click",function()
      {
        var num = Number($("#js_count_num").val());
        var price = Number($("#js_one_price").html());
        var stockNum = Number($("#js_one_stockNum").html());
        if($(this).hasClass("not"))
        {
          return;
        }
        if(stockNum==null)
        {
          stockNum=0;
        }
        if(num==stockNum)
        {
          $(this).addClass("not");return;
        }else
        {
          $("#js_count_num").val((num++)+1);
          $(".js_reduce_num").removeClass("not");
        }
      });
      //加入购物车
      $("#js_addto_shopcar").on("click",function()
      {
        var totalMoney = $("#js_count_num").val();
        var productName = $("#js_product_name").html();
        var productNum = $("#js_count_num").val();
        var productSkuId = $("#js_one_skuId").html();
        var selColorAndType = $("#js_colorAndType_result").html();
        var selSizeAndLength = $("#js_sizeAndLength_result").html();
        //添加成功后，设置页面，还是之前。
        var str = "";
        str+='<a href="javascript:;" class="fselect">';
          str+='<p class="goods-info-style"><span class="gsy">已选："'+selColorAndType+'</span>"</p>';
          str+='<i class="i">&nbsp;</i>';
          str+='<p class="goods-info-style">"<span class="gsy">'+selSizeAndLength+'</span>"</p>';
          str+='<i class="gkIcon iconfont">&#xe600;</i>';
        str+='</a>';
        $("#js_add_shoppingCar").hide();
        $("#js_usersel_result").html(str);
        ygProductDet.addToShoppCar(productSkuId,productNum);
        //$("#js_addto_shopcar").off("click");
      });
    },
    //获取添加购物车商品信息
    getShoppingCar:function(productId)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/product/selectProductByGroup.do?",
          data:{id:productId,groupId:productgroupId},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
          success: function(data)
          {
            if(data.type == "success")
            {
              groupData = data.extra;
              for(var i=0;i<data.extra.length;i++)
              {
                // if(data.extra[i].id == Number(productId))
                // {
                //    data.extra.unshift(data.extra[i]);
                // }
              };
              //重构图片
              for(var i=0;i<data.extra.length;i++)
              {
                for(var j=0;j<data.extra[i].productImages.length;j++)
                {
                    data.extra[i].productImages[j].imagePath = YIIGOO.setImgUrl(data.extra[i].productImages[j].imagePath,"200*200");
                  }
              }
              ygProductDet.fxtpl_product_msg(data.extra[0]);
              ygProductDet.fxtpl_colorAndType_msg(data);
              ygProductDet.fxtpl_sizeAndLength_msg(data.extra[0]);
              ygProductDet.shoppingCar();
              $("#js_add_shoppingCar").show();
              hasProductMsg = true;
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //渲染加入购物车 商品基本信息。
    fxtpl_product_msg:function(data)
    {
      Fxtpl.render("js_product_msg",data);
    },
    //渲染加入购物车 颜色规格信息。
    fxtpl_colorAndType_msg:function(data)
    {
      Fxtpl.render("js_colorAndType",data);
      //颜色规格。
      $("#js_colorAndType a").on("click",function()
      {
        if(!$(this).hasClass("active"))
        {
          $(this).addClass("active").siblings().removeClass("active");
          $("#js_colorAndType_result").html($(this).html());
          $("#js_product_name").html($(this).attr("productname"));
          $("#js_product_img").attr("src",$(this).attr("productimg"));
          ygProductDet.fxtpl_sizeAndLength_msg(groupData[$(this).attr("skus")]);
          $("#js_count_num").val(1);
        };
      });
    },
    //渲染加入购物车 尺寸大小信息。
    fxtpl_sizeAndLength_msg:function(data)
    {
      Fxtpl.render("js_sizeAndLength",data);
      $("#js_sizeAndLength a.forsale").eq(0).addClass("active");
      //价格联动。
      $("#js_count_money").html($("#js_sizeAndLength a.forsale").eq(0).attr("productPrice"));
      $("#js_sizeAndLength_result").html($("#js_sizeAndLength a.forsale").eq(0).html());
      $("#js_one_skuId").html($("#js_sizeAndLength a.forsale").eq(0).attr("productSkuId"));
      //尺码大小
      $("#js_sizeAndLength a").on("click",function()
      {
        if($(this).hasClass("not"))
        {
          return;
        };
        //点击尺码大小的时候，存储当前尺码的：价格，库存，id。并且设置数量为1.
        if(!$(this).hasClass("active"))
        {
          $(this).addClass("active").siblings().removeClass("active");
          $("#js_sizeAndLength_result").html($(this).html());
          $("#js_count_money").html($(this).attr("productPrice"));
          $("#js_one_price").html($(this).attr("productPrice"));
          $("#js_one_stockNum").html($(this).attr("productStockNum"));
          $("#js_one_skuId").html($(this).attr("productSkuId"));
          $("#js_count_num").val(1);
        };
      });
    },
    //获取同组商品晒单。
    getGroupData:function()
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/publish/similarityPublish.do?",
          //参数未定。
          data:{productId:productId,groupId:productgroupId},
          dataType: "jsonp",
          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
          success: function(data)
          {
            if(data.type == "success")
            { 
              ygProductDet.fxtpl_groupData(data);
            }  
          },
          error: function()
          {
               YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //渲染同组商品晒单数据。
    fxtpl_groupData:function(data)
    {
      Fxtpl.render("js_sameShaidan",data);
      var swiper1 = new Swiper('.swiper-containerLst', {
        pagination: '.swiper-pagination',
        slidesPerView: 4,
        paginationClickable: true,
        spaceBetween: 20
       // width:4.1255
      });
    },
    //添加选中的商品到购物车。
    addToShoppCar:function(skuId,quantity)
    {
      $.ajax(
      {
        type:"get",
        async: false,
        url: GLOBALURL.dataUrl+"mobile/shoppingcar/addOrdinaryItem.do?",
        //参数未定。
        data:{skuId:skuId,quantity:quantity},
        dataType: "jsonp",
        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data)
        {
          if(data.type == "success")
          {
            //获取购物车数量
            ygProductDet.getCartNum();
          }  
        },
        error: function()
        {
             YIIGOO.popWindow('系统繁忙，请稍后再试…');
        }
      });
    },
    //获取购物车数量。
    getCartNum:function()
    {
      $.ajax(
      {
        type:"get",
        async: false,
        url: GLOBALURL.dataUrl+"mobile/shoppingcar/findCount.do",
        //参数未定。
        data:{},
        dataType: "jsonp",
        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        //jsonpCallback:"fn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data)
        {
          if(data.type == "success" && data.extra != 0)
          {
            if(data.extra >= 100)
            {
              data.extra = "..";
            }
            $("#js_shoppingNum").html('<em class="num">'+data.extra+'</em>&#xe64c;');
          }  
        },
        error: function()
        {
             YIIGOO.popWindow('系统繁忙，请稍后再试…');
        }
      });
    }
  };
  ygProductDet.init();
});