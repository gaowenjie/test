//修改昵称资料
$(function(){ 
   //接收传过来的昵称
   var nickName=decodeURI(BOM.parseQueryStr(window.location.href).nickName);
   
   //把值设置给文本
   $("#name").val(nickName);
   $("#nBtn").click(function(){
    var nName=$("#name").val();
    $.ajax({
          type: "get",
          async: false,
          url: GLOBALURL.dataUrl+"mobile/userCentre/updateUserInfo.do",
          data:{nickName:nName},
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

