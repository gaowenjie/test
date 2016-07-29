//我的消息页面
$(function(){ 
   var sum=0;
   var shaidanPageIndex = 0,//晒单页数.
        scroolTimes    = 0,//滚动次数
       shaidanNum       = 10;//晒单每次请求的个数。
   var releationId=[];  //跳转页面时所需要的publishId

   var message={
    //页面初始化
    init:function(){
      $("#js_preloading").hide();
      message.getNews(shaidanPageIndex,shaidanNum);
      //  滚动加载。滚动到最底部，加载新数据。
      $(window).on("scroll",function ()
      {
          var scrollTop = $(this).scrollTop();
          var scrollHeight = $(document).height();
          var windowHeight = $(this).height();
          if (scrollTop + windowHeight == scrollHeight) 
          {
              $("#js_preloading").show();//触发滚动，显示底部滚动加载信息
              message.getNews(shaidanPageIndex,shaidanNum);
          }
      });

    },
    //获取消息列表数据
    getNews:function(start,limit){
        $.ajax({
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/message/findUserMessageList.do",
            data:{start:start,limit:limit},
            dataType: "jsonp",
            success: function(data){
              shaidanPageIndex += shaidanNum;
              if(data.type == "success"){

                if(scroolTimes == 0 && data.extra.length == 0)
                {
                  $(window).off("scroll");
                  $("#message_init").show();
                  $("#js_messagebox").hide();
                }else if(data.extra.length == 0)
                { 
                  $(window).off("scroll");
                  $("#js_preloading").html('<p class="load jbc"><em>没有更多数据了~</em></p>');
                  return;
                }else{
                  //有数据就显示内容区域
                  $("#js_messagebox").show();
                  $("#message_init").hide();
                }
                 scroolTimes++;

                /*如果时间等于当前天的就只显示一条时间，展示数据*/
                var mydata = {};
                var msgs = [];//对象里的外层数组
                var submsg = {};//里层对象
                var submsgs = [];//里层数组
                mydata.extra = msgs;
                var tempTime = "";//时间的临时变量,当前循环对象的时间与上一个时间比较,如果相同代表是同一天,否则是另起一天(里层数组重新开始)
                //i:控制整个循环,j:外层数组索引,k:里层数组索引
                var mydata = {};
                var msgs = [];//对象里的外层数组
                var submsg = {};//里层对象
                var submsgs = [];//里层数组
                mydata.extra = msgs;
                var tempTime = "";//时间的临时变量,当前循环对象的时间与上一个时间比较,如果相同代表是同一天,否则是另起一天(里层数组重新开始)
                //i:控制整个循环,j:外层数组索引,k:里层数组索引
                for (var i = 0 ,j=0,k=0; i<data.extra.length; i++,k++) {
                  var msg = data.extra[i];
                  if(i==0){
                    tempTime = msg.createTimeString;//初始化临时时间变量
                    submsgs[k]=msg;//对象追加到里层数组
                    submsg.createTimeString = msg.createTimeString;//
                    submsg.submsgs = submsgs;//里层数组
                    msgs[j]=submsg;//将里层对象追加到外层数组
                  }else{
                    if(tempTime != msg.createTimeString){
                      tempTime = msg.createTimeString;//重置临时时间变量
                      j++;//外层数组+1
                      k=0;//里层数组重置
                      submsgs=[];//重置里层数组
                      submsg={};//重置里层对象
                      submsgs[k]=msg;//对象追加到里层数组
                      submsg.createTimeString = msg.createTimeString;//
                      submsg.submsgs = submsgs;//里层数组和里层对象建立
                      msgs[j]=submsg;//将里层对象追加到外层数组
                    }else{
                      submsgs[k]=msg;//对象追加到里层数组
                    }
                  }
                }

                Fxtpl.render('js_messagebox', mydata); 

                
                $(".date-message-lst").click(function(){
                    var messageId = $(this).attr("id").split("_")[1];
                    var releationId = $(this).attr("id").split("_")[2];
                    //1.调用后台已读接口
                    $.ajax({
                        type: "get",
                        async: false,
                        url: GLOBALURL.dataUrl+"mobile/message/readMessage.do",
                        data:{messageId:messageId},
                        dataType: "jsonp",
                        success: function(data)
                        {
                          if(data.type == "success")
                          {
                            //2.成功之后跳转到晒单详情页面 
                            window.location.href="../share/comment.html?publishId="+releationId;
                          }   
                        },
                        error: function()
                        {
                             YIIGOO.popWindow('系统繁忙，请稍后再试…');
                        }
                    });
                    
                });  
                
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

   }
   message.init();
});



