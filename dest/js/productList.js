//商品列表页面
$(function(){
  //获取查询条件
  var sortKey="",
      dir="",
      sum=0;
 var  shaidanPageIndex = 0,//列表页数.
      shaidanNum      = 10,//列表每次请求的个数。
      shaidanId       = [],//所有的列表id。
      shaidanData    = {extra:[]},//所有数据集合
      isMoreData = true;//是否还有更多数据,true表示有,false表示没有

  var proList={
    init:function(){
      proList.selectList(shaidanPageIndex,shaidanNum);
      proList.sortList();
      proList.newPro();
      //  滚动加载。滚动到最底部，加载新数据。
      $(window).scroll(function () 
      {
          var scrollTop = $(this).scrollTop();
          var scrollHeight = $(document).height();
          var windowHeight = $(this).height();
          if (scrollTop + windowHeight == scrollHeight) 
          {  
              $("#js_preloading").show();
              //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
              proList.selectList(shaidanPageIndex,shaidanNum);
          }
      });

    },
    //页面加载数据请求[默认是按照上架时间倒序排列]
    selectList:function(start,limit){
        if(!isMoreData){//isMoreData=false 表示没有更多数据了,无需请求
          return;
        }
        $.ajax({
          type:"get",
          async:"false",
          url:GLOBALURL.dataUrl+"mobile/product/list.do?",
          data:{start:start,limit:limit,sortKey:sortKey,dir:dir},
          dataType: "jsonp",
          success:function(data){
            shaidanPageIndex += 10; //列表页数.
            if(data.type=="success"){
              //判断数据是不是最后一条
              if(data.extra.length == 0)
              {
                $(window).off("scroll");
                $("#js_preloading").html('<p class="load jbc"><em>已经加载到最底部了</em></p>');
                return;
              };
              //添加图片尺寸
              for(var i=0;i<data.extra.length;i++)
              {
                if(data.extra[i].imageUrl==null){
                  data.extra[i].imageUrl="../images/400.jpg";
                }else{
                  data.extra[i].imageUrl = YIIGOO.setImgUrl(data.extra[i].imageUrl,"400*400");  
                }
              }
              //去掉跟页面重复的数据
              for(var m=0;m<shaidanId.length;m++)
              {
                for(var n=0;n<data.extra.length;n++)
                {
                  if(shaidanId[m] == data.extra[n].id)
                  {
                    //去掉重复的数据。
                    data.extra.splice(n,1); //将删除位于 n个元素删掉,每次删掉1个
                    n--;
                  }
                }
              };
              for (var i=0;i<data.extra.length;i++) 
              {
                shaidanId.push(data.extra[i].id);
                shaidanData.extra.push(data.extra[i]);
              };

              //渲染数据。
              Fxtpl.render("js_productList",shaidanData);
              //图片滚动加载。
              YIIGOO.scrollLoad(); 

            }
          },
          error:function(){
            YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
      });
    },
    //点击按钮排序
    sortList:function(){
      $("#sortBtn").click(function(){
        var _this=$(this);
        sum++;
        if(sum%2==0){
          //asc低到高
          _this.addClass("on");
          shaidanPageIndex=0;
          shaidanId = []; 
          shaidanData    = {extra:[]};
          sortKey = "price";
          dir = "asc";
          proList.selectList(0,10);
        }else{
          //desc高到低
          _this.removeClass("on");
          shaidanPageIndex=0;
          shaidanId = []; 
          shaidanData    = {extra:[]};
           sortKey = "price";
           dir = "desc";
           proList.selectList(0,10);
        }
      });
    },
    
    newPro:function(){
      $("#newBtn").click(function(){
        shaidanPageIndex=0;
        sortKey = "";
        dir = "";
        shaidanId = []; 
        shaidanData    = {extra:[]};
        proList.selectList(0,10);
      });
    }


  }
  proList.init();//页面加载执行的函数方法

});
