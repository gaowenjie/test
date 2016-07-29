$(function()
{
  var manzengPrice   = 0,//满赠价格。
      jiajiagouPrice = 0,//加价购价格。
      jjgdiscountPrice = 0
      totalPrice     = 0;//总价格。
  var ygCart = 
  {
    init:function()
    {
      ygCart.getManjian();
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
      //是否满足条件
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
                $("#js_manjian_type").html('<span>满减：</span><span >'+str+'</span>');
              }else
              {
                $("#js_manjian_type").html("");
              }
              manzengPrice = data.extra.ManZeng.limitPrice;
              jiajiagouPrice = data.extra.JiaJiaGou.limitPrice;
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
    //点击删除。
    clickDel:function()
    {
      //点击删除。
      $("#js_productlist").delegate(".js_del","click",function(event)
      {
        var that = this;
        YIIGOO.delWindow("确定删除该商品吗？",function()
        {
          $("#js_sure_del").on("click",function()
          {
            $("#js_del_layer").html("");
            var cartId = $(that).attr("id").split("_")[1];
            ygCart.delCartList(cartId);
            $("#cartid_"+cartId).remove();
          });
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
              YIIGOO.popWindow("删除成功！");
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
    //用户改变选择。
    selectChange:function()
    {
      //全选。
      $("#js_select_all").on("click",function()
      {
        if($(this).hasClass("on"))
        {
          $(this).removeClass("on");
          $(".js_user_secect").removeClass("on");
        }else
        {
          $(this).addClass("on");
          $(".js_user_secect").addClass("on");
        };
        ygCart.addTotalPrice();
      });
      $(".js_user_secect").on("click",function()
      {
        if($(this).hasClass("on"))
        {
          $(this).removeClass("on");
          $("#js_select_all").removeClass("on");
          ygCart.addTotalPrice();
        }else
        {
          $(this).addClass("on");
          var selLength = $("#js_productlist .js_user_secect").length;
          for(var i=0;i<selLength;i++)
          {
            if(!$($("#js_productlist .js_user_secect").get(i)).hasClass("on"))
            {
              ygCart.addTotalPrice();
              return ;
            }
          };
          ygCart.addTotalPrice();
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
    fxtplZengpin:function(data)
    {
      $("#js_manzeng_layer").html("");
      Fxtpl.render("js_manzeng_module",data);
      $("#js_manzeng_layer").append($("#js_manzeng_module").html());
      $("#js_manzeng_layer .layer-close").on("click",function()
      {
        $("#js_manzeng_layer").hide();
      });
      if(totalPrice<manzengPrice)
      {
        alert("不满足满赠");
      }else
      {
        $("#js_manzeng_layer .js_zengpin_radio").on("click",function()
        {
          if(!$(this).hasClass("on"))
          {
             $("#js_manzeng_layer .js_zengpin_radio").removeClass("on");
            $(this).addClass("on");
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
        });
        $("#js_addZP_toCart").on("click",function()
        {
          var skuIdParent = $($("#js_manzeng_layer .js_zengpin_radio.on").get(0)).parent().next();
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
      if(totalPrice<jiajiagouPrice)
      {
        var price = jiajiagouPrice-totalPrice;
        $("#js_discountmoney").html("Äú»¹²î"+price+"Ôª").show();
      }
      else
      {
        $("#js_jiajiagou_layer .js_jiajiagou_radio").on("click",function()
        {
          if(!$(this).hasClass("on"))
          {
             $("#js_jiajiagou_layer .js_jiajiagou_radio").removeClass("on");
            $(this).addClass("on");
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
        });
        $("#js_addJJG_toCart").on("click",function()
        {
          var skuIdParent = $($("#js_jiajiagou_layer .js_jiajiagou_radio.on").get(0)).parent().next();
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
    addTotalPrice:function()
    {
      if(totalPrice<manzengPrice)
      {
        $("#js_productlist .js_zengpin_cart .js_user_select_mz").removeClass("js_user_secect").removeClass("on");
      }else
      { 
        $("#js_productlist .js_zengpin_cart .js_user_select_mz").addClass("js_user_secect");
      }
      if(totalPrice<jiajiagouPrice)
      {
        $("#js_productlist .js_jiajiagou_cart .js_user_select_jiajiagou").removeClass("js_user_secect").removeClass("on");
      }else
      {
        $("#js_productlist .js_jiajiagou_cart .js_user_select_jiajiagou").addClass("js_user_secect");
      }
      var selectedList = $("#js_productlist .js_user_secect.on");
      var itemParent = null,price,num;
      totalPrice = 0;
      for(var i=0;i<selectedList.length;i++)
      {
        itemParent = $($(selectedList).get(i)).parent().parent();
        if(itemParent.hasClass("js_zengpin_cart"))
        {
          totalPrice+=Number($($(itemParent).find(".js_selcart_price").get(0)).html());
        }else
        if(itemParent.hasClass("js_jiajiagou_cart"))
        {
          totalPrice+=Number($($(itemParent).find(".js_selcart_price").get(0)).html());
        }else
        {
          price = Number($($(itemParent).find(".js_selcart_price").get(0)).html());
          num   = Number($($(itemParent).find(".js_selcart_num").get(0)).html());
          totalPrice+=price*num;
        }
      };
      $("#js_total_priceAll").html(totalPrice);
      if(totalPrice<manzengPrice)
      {
        $("#js_productlist .js_zengpin_cart .js_user_select_mz").removeClass("js_user_secect").removeClass("on");
      }else
      {
        $("#js_productlist .js_zengpin_cart .js_user_select_mz").addClass("js_user_secect");
      }
      if(totalPrice<jiajiagouPrice)
      {
        $("#js_productlist .js_jiajiagou_cart .js_user_select_jiajiagou").removeClass("js_user_secect").removeClass("on");
      }else
      {
        $("#js_productlist .js_jiajiagou_cart .js_user_select_jiajiagou").addClass("js_user_secect");
      }
    },
    //结算
    cartJiesuan:function()
    {
      $("#js_jiesuan").on("click",function()
      {
        var $selectedList = $("#js_productlist .js_user_secect.on");
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
    }
  };
  ygCart.init();
});
