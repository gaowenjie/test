//修改昵称资料
$(function(){ 
   //接收传过来的昵称
   var mSex=decodeURI(BOM.parseQueryStr(window.location.href).babyGender);
    
   //设置默认
   if(mSex=='男宝'){
    $("#boy").addClass("on");
    $("#girl").removeClass("on");
   }else{
    $("#boy").removeClass("on");
    $("#girl").addClass("on");
   }
   
   $(".js_mSex").click(function(){
      $(".js_mSex").removeClass("on");
      $(this).addClass("on");
      
      var babyGender=$(this).text();
      if(babyGender=='男宝'){
        babyGender=0;
      }else{
        babyGender=1;
      }
     
      $.ajax({
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/userCentre/updateUserInfo.do",
            data:{babyGender:babyGender},
            dataType: "jsonp",
            success: function(data)
            {
              if(data.type == "success")
              {
                window.location.href="modifieddata.html";
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
   })
});

