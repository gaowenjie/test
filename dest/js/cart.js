$(function()
{
  var manzengPrice      = 0,//满赠价格。
      jiajiagouPrice    = 0,//加价购价格。
      jjgdiscountPrice  = 0,
      totalPrice        = 0;//总价格。
  var ygCart = 
  {
    init:function()
    {
      ygCart.getManjian();
    },
    //获取满减优惠。
    getManjian:function()
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/promotion/findOwnPromotionList.do?",
          data:{},
          dataType: "jsonp",
          jsonp: "callback",
          success: function(data)
          {
            if(data.type == "success")
            {
              if(data.extra.ManJian)
              {
                var str = "购物满"+data.extra.ManJian.limitPrice+"减"+data.extra.ManJian.discountPrice;
                $("#js_manjian_type").html('<span>满减：</span><span >'+str+'元</span>');
              }else
              {
                $("#js_manjian_type").html("");
              };
              if(data.extra.ManZeng)
              {
                manzengPrice = data.extra.ManZeng.limitPrice;
              }else
              {
                $("#js_zengpin_type").hide();
              };
              if(data.extra.JiaJiaGou)
              {
                jiajiagouPrice = data.extra.JiaJiaGou.limitPrice;
                jjgdiscountPrice = data.extra.JiaJiaGou.discountPrice;
              }else
              {
                $("#js_jaijaigou_type").hide();
              };
              ygCart.getCartList();
            }else if(data.type == "error")
            {
              //登录判断
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
    //获取购物车列表
    getCartList:function()
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/shoppingcar/findShoppingCarList.do?",
          data:{},
          dataType: "jsonp",
          jsonp: "callback",
          success: function(data)
          {
            if(data.type == "success")
            {
              if(data.extra.length == 0)
              {
                $("#js_cart_empty").show();
                $("#yg-doc").hide();
              }else
              {
                $("#yg-doc").show();
                $("#js_cart_empty").hide();
                for(var i=0;i<data.extra.length;i++)
                {
                  data.extra[i].imagePath = YIIGOO.setImgUrl(data.extra[i].imagePath,"200*200");
                }
                ygCart.fxtplCartList(data);
              }
            }else if(data.type == "error")
            {
              //登录
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
    //渲染购物车列表
    fxtplCartList:function(data)
    {
      Fxtpl.render("js_product_list",data);
      $("#js_productlist").append($("#js_product_list").html());
      //用户选择改变。
      ygCart.selectChange();
      //点击删除。
      ygCart.clickDel();
      //加，减。
      ygCart.addAndReduce();
      //计算总价。
      ygCart.addTotalPrice();
      //结算。
      ygCart.cartJiesuan();
      //满赠。
      $("#js_zengpin_type").on("click",function()
      {
        ygCart.manzengLayer("ManZeng");
      });
      //加价购。
      $("#js_jaijaigou_type").on("click",function()
      {
        ygCart.jiajiagouLayer("JiaJiaGou");
      });
    },
    //点击删除。
    clickDel:function()
    {
      //点击删除。
      $("#js_productlist").delegate(".js_del","click",function(event)
      {
        var that = this;
        YIIGOO.delWindow("确定删除该商品吗？",function()
        {
            $("#js_del_layer").html("");
            var cartId = $(that).attr("id").split("_")[1];
            ygCart.delCartList(cartId);
            
        });
      });
    },
    //删除
    delCartList:function(carId)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/shoppingcar/delete.do",
          data:{carId:carId},
          dataType: "jsonp",
          jsonp: "callback",
          success: function(data)
          {
            if(data.type == "success")
            {
              console.log(data.type);
              $("#cartid_"+carId).remove();
              //YIIGOO.popWindow("删除成功！");
              ygCart.addTotalPrice();
              if($("#js_productlist").find("div").length == 0)
              {
                $("#js_cart_empty").show();
                $("#yg-doc").hide();
              }
            }else if(data.type == "error")
            {
              //登录
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
    //用户改变选择。全选，全不选。js_user_select
    selectChange:function()
    {
      //全选。
      $("#js_select_all").on("click",function()
      {
        if($(this).hasClass("on"))
        {
          $(this).removeClass("on");
          $(".js_user_select").removeClass("on");
        }else
        {
          $(this).addClass("on");
          $(".js_user_select").addClass("on");
        };
        ygCart.addTotalPrice();
      });
      //用户选择。
      $("#js_productlist").delegate(".js_user_select","click",function()
      {
        if($(this).hasClass("on"))
        {
          $(this).removeClass("on");
          $("#js_select_all").removeClass("on");
          ygCart.addTotalPrice1();
        }else
        {
          $(this).addClass("on");
          var selLength = $("#js_productlist .js_user_select").length;
          for(var i=0;i<selLength;i++)
          {
            if(!$("#js_productlist .js_user_select").eq(i).hasClass("on"))
            {
              ygCart.addTotalPrice1();
              return ;
            }
          };
          ygCart.addTotalPrice1();
          $("#js_select_all").addClass("on");
        }
      });
    },
    addAndReduce:function()
    {
      //加
      $("#js_productlist").delegate(".js_add_num","click",function(event)
      {
        var that = this;
        var num = Number($(that).prev().html());
        var skuId = $(that).attr("thisid");
        $.ajax(
        {
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/shoppingcar/updateNum.do?",
            data:{skuId:skuId,isAdd:true},
            dataType: "jsonp",
            jsonp: "callback",
            success: function(data)
            {
              if(data.type == "success")
              {
                $(that).prev().html(num+1);
                $(that).prev().prev().removeClass("not");
                ygCart.addTotalPrice();
              }else if(data.type == "error")
              {
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
      //减
      $("#js_productlist").delegate(".js_reduce_num","click",function(event)
      {
        
        var that = this;
        var num = Number($(that).next().html());
        var skuId = $(that).attr("thisid");
        if(num==1){return;}
        $.ajax(
        {
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/shoppingcar/updateNum.do?",
            data:{skuId:skuId,isAdd:false},
            dataType: "jsonp",
            jsonp: "callback",
            success: function(data)
            {
              if(data.type == "success")
              {
                $(that).next().html(num-1);
                if(num == 2)
                {
                  $(that).addClass("not");
                }
                ygCart.addTotalPrice();
              }else if(data.type == "error")
              {
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
    //满赠弹层。
    manzengLayer:function(pType)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/promotion/findPromotionItemList.do?",
          data:{pType:pType},
          dataType: "jsonp",
          jsonp: "callback",
          success: function(data)
          {
            if(data.type == "success")
            {
              var zengpinData = data.extra[0];
              for(var i=0;i<zengpinData.promotionProductList.length;i++)
              {
                zengpinData.promotionProductList[i].salesPrice = zengpinData.promotionProductList[i].promotionSkuList[0].salesPrice;
                zengpinData.promotionProductList[i].sizeName = zengpinData.promotionProductList[i].promotionSkuList[0].sizeName;
              }
              ygCart.fxtplZengpin(zengpinData);
              $("#js_manzeng_layer").show();
            }else if(data.type == "error")
            {
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
    //渲染满赠。
    fxtplZengpin:function(data)
    {
      //总价。
      var totalPrice = Number($("#js_total_priceAll").html());
      $("#js_manzeng_layer").html("");
      Fxtpl.render("js_manzeng_module",data);
      $("#js_manzeng_layer").append($("#js_manzeng_module").html());
      $("#js_manzeng_layer .layer-close").on("click",function()
      {
        $("#js_manzeng_layer").hide();
      });
      //页面已经有的满赠商品id。
      var manzengId = $("#js_productlist .js_zengpin_cart").eq(0).attr("productId");
      $("#js_manzeng_layer .js_zengpin_radio").each(function()
      {
        if($(this).attr("productId") == manzengId)
        {
          $(this).addClass("on");
        }
      });
      if(totalPrice<manzengPrice)
      {
        YIIGOO.popWindow("不满足满赠条件！");
        var chajia = manzengPrice-totalPrice;
        $("#js_manzeng_no").html("购物满"+manzengPrice+"可免费赠送以下商品，您还差"+chajia+"元");
        $("#js_manzeng_layer .js_zengpin_radio").addClass("no");
      }else
      {
        $("#js_manzeng_layer .js_zengpin_radio").on("click",function()
        {
          if(!$(this).hasClass("on"))
          {
             $("#js_manzeng_layer .js_zengpin_radio").removeClass("on");
            $(this).addClass("on");
          }else
          {
            $(this).removeClass("on");
          }
        });
        $(".js_zengpin_size").on("click",function()
        {
          var zengpinId = $(this).attr("id").split("_")[2];
          if($("#js_zengpinSizeCon_"+zengpinId).css("display")=="none")
          {
            $("#js_zengpinSizeCon_"+zengpinId).css("display","block");
          }else
          {
            $("#js_zengpinSizeCon_"+zengpinId).css("display","none");
          }
        });
        $("#js_manzeng_layer .js_select_zpsize").on("click",function()
        {
          $(".js_select_zpsize").removeClass("on");
          $(this).addClass("on");
          var listId = $(this).parent().attr("id").split("_")[2];
          $("#js_mzskuprice_"+listId).html($(this).attr("productPrice"));
          $($("#js_zengpinSizeA_"+listId).find(".shuzi").get(0)).html($(this).html());
          $(this).parent().hide();
        });
        $("#js_addZP_toCart").on("click",function()
        {
          if($("#js_manzeng_layer .js_zengpin_radio.on").length == 0)
          {
            $("#js_manzeng_layer").hide();
            return;
          };
          var skuIdParent = $("#js_manzeng_layer .js_zengpin_radio.on").eq(0).parent().next();
          var skuIdDOM    = $(skuIdParent).find(".js_select_zpsize.on").get(0);
          var skuId = $(skuIdDOM).attr("productSkuId");
          $.ajax(
          {
              type: "get",
              async: false,
              url: GLOBALURL.dataUrl+"mobile/shoppingcar/addPromotionItem.do?",
              data:{skuId:skuId,pType:"ManZeng",promotionPrice:0},
              dataType: "jsonp",
              jsonp: "callback",
              success: function(data)
              {
                if(data.type == "success")
                {
                  $("#js_manzeng_layer").hide();
                  $("#js_addZP_toCart").off("click");
                  Fxtpl.render("js_zengping_module",data.extra);
                  $($("#js_productlist .js_zengpin_cart").get(0)).remove();
                  $("#js_productlist").prepend($("#js_zengping_module").html());
                }else if(data.type == "error")
                {
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
      };
    },
    //加价购弹层。
    jiajiagouLayer:function(pType)
    {
      $.ajax(
      {
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/promotion/findPromotionItemList.do?",
          data:{pType:pType},
          dataType: "jsonp",
          jsonp: "callback",
          success: function(data)
          {
            if(data.type == "success")
            {
              var jiajiagouData = data.extra[0]; 
              for(var i=0;i<jiajiagouData.promotionProductList.length;i++)
              {
                jiajiagouData.promotionProductList[i].salesPrice = jiajiagouData.promotionProductList[i].promotionSkuList[0].salesPrice;
                jiajiagouData.promotionProductList[i].sizeName = jiajiagouData.promotionProductList[i].promotionSkuList[0].sizeName;
              }
              ygCart.fxtplJiajiagou(jiajiagouData);
              $("#js_jiajiagou_layer").show();
            }else if(data.type == "error")
            {
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
    //渲染加价购
    fxtplJiajiagou:function(data)
    {
      $("#js_discountmoney").hide();
      jjgdiscountPrice = data.discountPrice;
      $("#js_jiajiagou_layer").html("");
      Fxtpl.render("js_jiajiagou_module",data);
      $("#js_jiajiagou_layer").append($("#js_jiajiagou_module").html());
      $("#js_jiajiagou_layer .layer-close").on("click",function()
      {
        $("#js_jiajiagou_layer").hide();
      });
      //页面已经有的加价购商品id。
      var jjgId = $("#js_productlist .js_jiajiagou_cart").eq(0).attr("productId");
      $("#js_jiajiagou_layer .js_jiajiagou_radio").each(function()
      {
        if($(this).attr("productId") == jjgId)
        {
          $(this).addClass("on");
        }
      });
      var totalPrice = Number($("#js_total_priceAll").html());
      if(totalPrice<jiajiagouPrice)
      {
        var price = jiajiagouPrice-totalPrice;
        $("#js_discountmoney_con").html('<span class="c3">满<i class="brown">'+jiajiagouPrice+'</i>元加<i class="brown">'+jjgdiscountPrice+'</i>元换购以下商品<i class="brown" id="js_discountmoney">您还差'+price+'元</i></span>').show();
        $("#js_jiajiagou_layer .js_jiajiagou_radio").addClass("no");
        YIIGOO.popWindow("不满足加价购条件！");
      }
      else
      {
        $("#js_jiajiagou_layer .js_jiajiagou_radio").on("click",function()
        {
          if(!$(this).hasClass("on"))
          {
             $("#js_jiajiagou_layer .js_jiajiagou_radio").removeClass("on");
            $(this).addClass("on");
          }else
          {
            $(this).removeClass("on");
          }
        });
        $(".js_jiajiagou_size").on("click",function()
        {
          var zengpinId = $(this).attr("id").split("_")[2];
          if($("#js_jiajiagouSizeCon_"+zengpinId).css("display")=="none")
          {
            $("#js_jiajiagouSizeCon_"+zengpinId).css("display","block");
          }else
          {
            $("#js_jiajiagouSizeCon_"+zengpinId).css("display","none");
          }
        });
        $("#js_jiajiagou_layer .js_select_jjgsize").on("click",function()
        {
          $("#js_jiajiagou_layer .js_select_jjgsize").removeClass("on");
          $(this).addClass("on");
          var listId = $(this).parent().attr("id").split("_")[2];
          $("#skuprice_"+listId).html($(this).attr("productPrice"));
          $($("#js_jiajiagouSizeA_"+listId).find(".shuzi").get(0)).html($(this).html());
          $(this).parent().hide();
        });
        $("#js_addJJG_toCart").on("click",function()
        {
          console.log($("#js_jiajiagou_layer .js_jiajiagou_radio.on").length)
          if($("#js_jiajiagou_layer .js_jiajiagou_radio.on").length == 0)
          {
            $("#js_jiajiagou_layer").hide();
            return;
          };
          var skuIdParent = $("#js_jiajiagou_layer .js_jiajiagou_radio.on").eq(0).parent().next();
          var skuIdDOM    = $(skuIdParent).find(".js_select_jjgsize.on").get(0);
          var skuId = $(skuIdDOM).attr("productSkuId");
          $.ajax(
          {
              type: "get",
              async: false,
              url: GLOBALURL.dataUrl+"mobile/shoppingcar/addPromotionItem.do?",
              data:{skuId:skuId,pType:"JiaJiaGou",promotionPrice:jjgdiscountPrice},
              dataType: "jsonp",
              jsonp: "callback",
              success: function(data)
              {
                if(data.type == "success")
                {
                  $("#js_jiajiagou_layer").hide();
                  $("#js_addJJG_toCart").off("click");
                  Fxtpl.render("js_jiajiagoucart_module",data.extra);
                  $($("#js_productlist .js_jiajiagou_cart").get(0)).remove();
                  $("#js_productlist").prepend($("#js_jiajiagoucart_module").html());
                }else if(data.type == "error")
                {
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
      }
    },
    //结算
    cartJiesuan:function()
    {
      $("#js_jiesuan").on("click",function()
      {
        var $selectedList = $("#js_productlist .js_user_select.on");
        var skuIds = [];
        for(var i=0;i<$selectedList.length;i++)
        {
          skuIds.push($($selectedList.get(i)).parent().parent().attr("skuid"));
        }
        skuIdsStr = skuIds.join(",");
        $.ajax(
        {
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/order/toSettlementPage.do?",
            data:{skuIds:skuIdsStr},
            dataType: "jsonp",
            jsonp: "callback",
            success: function(data)
            {
              if(data.type == "success")
              {
                window.location.href = "../order/checkorder.html"
              }else if(data.type == "error")
              {
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
      })
    },
    //加价购选中的价格。
    calJiajiagouPrice:function()
    {
      //赠品选中。
      if($("#js_productlist .js_user_select_jiajiagou").eq(0).hasClass("on"))
      {
        return jjgdiscountPrice;
      }else 
      {
        return 0;
      }
    },
    //普通商品选中的价格。
    calUsualPrice:function()
    {
      var selectedList = $("#js_productlist .js_user_select_usual.on");
      var itemParent = null,price,num;
      var totalPrice1 = 0;
      for(var i=0;i<selectedList.length;i++)
      {
        itemParent = $(selectedList).eq(i).parent().parent();
        price = Number($(itemParent).find(".js_selcart_price").eq(0).html());
        num   = Number($(itemParent).find(".js_selcart_num").eq(0).html());
        totalPrice1+=price*num;
      };
      return totalPrice1;
    },
     //计算总价。
    addTotalPrice:function()
    {
      var calusualPrice = ygCart.calUsualPrice();
      var caljiajiagouPrice = ygCart.calJiajiagouPrice();
      if(calusualPrice<jiajiagouPrice)
      {
        $("#js_productlist .js_jiajiagou_cart .js_user_select_jiajiagou").removeClass("js_user_select").removeClass("on").addClass("no");
      }else
      {
        $("#js_productlist .js_jiajiagou_cart .js_user_select_jiajiagou").addClass("js_user_select on").removeClass("no");
      };
      if(calusualPrice+caljiajiagouPrice<manzengPrice)
      {
        $("#js_productlist .js_zengpin_cart .js_user_select_mz").removeClass("js_user_select").removeClass("on").addClass("no");
      }else
      { 
        $("#js_productlist .js_zengpin_cart .js_user_select_mz").addClass("js_user_select on").removeClass("no");
      };
      
      $("#js_total_priceAll").html(ygCart.calJiajiagouPrice()+ygCart.calUsualPrice());
    },
    addTotalPrice1:function()
    {
      var calusualPrice = ygCart.calUsualPrice();
      var caljiajiagouPrice = ygCart.calJiajiagouPrice();
      if(calusualPrice<jiajiagouPrice)
      {
        $("#js_productlist .js_jiajiagou_cart .js_user_select_jiajiagou").removeClass("js_user_select").removeClass("on").addClass("no");
      }else
      {
        $("#js_productlist .js_jiajiagou_cart .js_user_select_jiajiagou").addClass("js_user_select").removeClass("no");
      };
      if(calusualPrice+caljiajiagouPrice<manzengPrice)
      {
        $("#js_productlist .js_zengpin_cart .js_user_select_mz").removeClass("js_user_select").removeClass("on").addClass("no");
      }else
      { 
        $("#js_productlist .js_zengpin_cart .js_user_select_mz").addClass("js_user_select").removeClass("no");
      };
      
      $("#js_total_priceAll").html(ygCart.calJiajiagouPrice()+ygCart.calUsualPrice());
    }
  };
  ygCart.init();
});
