$(function()
{
  //接收传过来的参数
  var pdtId = BOM.parseQueryStr(window.location.href).pdtId;
  var userNickName = decodeURI(BOM.parseQueryStr(window.location.href).userNickName);


  $("#shareId").text(userNickName+"的晒单");
  var product = 
  {
    //非售商品-头部 接口
    productHead:function(){
      $.ajax({
        type:"get",
        async:"false",
        url:GLOBALURL.dataUrl+"mobile/publish/notSaleHead.do?",
        data:{pdtId:pdtId},
        dataType: "jsonp",
        success:function(data){
          if(data.type=="success"){
             //Fxtpl 渲染HTML
             Fxtpl.render('js_goods_info', data.extra);
             var brandName=data.extra.brandName;
             var categoryId=data.extra.categoryId;
             //因为是同步请求，所以只有当非售头部执行完之后，才可以得到数据去执行相似晒单
             product.productLike(brandName,categoryId);  
             product.productXsi(brandName,categoryId);
          }
          
        },
        error:function(){
          YIIGOO.popWindow('系统繁忙，请稍后再试…');
        }
      });
    },

    //非售商品-相似晒单 
    productLike:function(categoryId,brandName){
      $.ajax({
        type:"get",
        async:"false",
        url:GLOBALURL.dataUrl+"mobile/publish/similarityPublish4NotSale.do?",
        data:{brandName:brandName,categoryId:categoryId},
        dataType: "jsonp",
        success:function(data){
          if(data.type=="success"){
            Fxtpl.render('js_list_product', data);  
            var swiper1 = new Swiper('.swiper-containerLst', {
              pagination: '.swiper-pagination',
              slidesPerView: 4,
              paginationClickable: true,
              spaceBetween: 5
             // width:4.1255
            });

          }
        },
        error:function(){
          YIIGOO.popWindow('系统繁忙，请稍后再试…');
        }
      });
    },
    
    //非售商品-相似商品
    productXsi:function(brandName,categoryId){
      $.ajax({
        type:"get",
        async:"false",
        url:GLOBALURL.dataUrl+"mobile/product/similarityProduct.do?",
        data:{brandName:brandName,categoryId:categoryId},
        dataType: "jsonp",
        success:function(data){
          if(data.type=="success"){
            if(data.extra.length<=0){
              $("#xsProduct").hide();
            }
            //添加图片尺寸            
            for(var i=0;i<data.extra.length;i++)
            {
              if(data.extra[i].image==null){
                data.extra[i].image="../images/400.jpg";
              }else{
                data.extra[i].image = YIIGOO.setImgUrl(data.extra[i].image,"400*400");  
              }
            }

            Fxtpl.render('js_product_lst_items', data);
            //图片滚动加载。
            YIIGOO.scrollLoad(); 

            
          }
        },
        error:function(){
          YIIGOO.popWindow('系统繁忙，请稍后再试…');
        }
      });
    }
  };

  product.productHead(pdtId);//这个地方应该是写初始化的第一个函数 pdtId应该是跳转页面过来的参数

});
