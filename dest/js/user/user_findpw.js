//找回手机密码
$(function(){ 
    //初始按钮不可用
    $("#getCodeBtn").attr("disabled", true);

    //手机号输入完毕让按钮高亮
    $("#iphoneNum").keyup(function(){
      $("#getCodeBtn").addClass("ok");
      $("#getCodeBtn").removeAttr("disabled");
    })
    
    //点击获取验证码
    $("#getCodeBtn").click(function(){
      var phone=$("#iphoneNum").val();
      //1.验证手机号码是否正确
       if(!checkPhone(phone)){
          YIIGOO.popWindow("请输入正确的手机号！");
          $("#iphoneNum").focus();
          return false;
       }else{ 
          $.ajax({
              type:"get",
              async:"false",
              url:GLOBALURL.dataUrl+"mobile/admin/sendValidateCode.do?",
              data:{username:phone},
              dataType: "jsonp",
              success:function(data){
                if(data.type=='success'){
                   YIIGOO.popWindow(data.content);
                   //倒计时
                   timeDown("getCodeBtn",CONFIRG.codeTime);
                   $("#setCode").focus();
                }  
              },
              error:function(){
                YIIGOO.popWindow('系统繁忙，请稍后再试…');
              }
          });

        

      }
    });
    //点击确定
    $("#sbBtn").click(function(){//
      var phoneVal=$("#iphoneNum").val();
      var codeVal=$("#setCode").val();
      var psVal=$("#setPassWord").val();
      var psToVal=$("#setPassTo").val();
      //input框没输入完时，注册按钮不可以点击
      if(phoneVal=="" || codeVal=="" || psVal=="" || psToVal==""){
        return;
      }

      //验证手机号码
      if(!checkPhone(phoneVal)){
          YIIGOO.popWindow("请输入正确的手机号！");
          $("#iphoneNum").focus();
          return false;
       }
       //验证码
       if(codeVal<6){
          YIIGOO.popWindow("请输入正确的验证码");
          $("#setCode").focus();
          return false;
       }
       // 验证6-15位数字、字母：/^[0-9A-Za-z]{6,15}$/
       if(!checkPwd(psVal)){
          YIIGOO.popWindow("请输入正确的密码");
          $("#setPassWord").focus();
          return false;
       }
       
       if(psToVal !=psVal ){
          YIIGOO.popWindow("您两次输入的密码不一致");
          $("#setPassTo").val("");
          $("#setPassWord").focus();
          $("#setPassWord").val("");
          return false;
       }
       //验证完发ajax

       $.ajax({
              type:"get",
              async:"false",
              url:GLOBALURL.dataUrl+"mobile/admin/forgetPassword.do",
              data:{username:phoneVal,validateCode:codeVal,password:psVal},
              dataType: "jsonp",
              success:function(data){
                if(data.type == "error"){
                  YIIGOO.popWindow(data.content);//验证码不匹配
                  $("#setCode").focus();
                  //未登录。
                  if(data.extra.key == "REDIRECT_LONGIN_PAGE")
                  {
                    window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
                  }
                }else{
                  window.location.href="login.html";
                }
              },
              error:function(){
                YIIGOO.popWindow('系统繁忙，请稍后再试…');
              }
        });

    });

    //给所有的input注册keyup事件
    $("input").keyup(function(){
      var phoneVal=$("#iphoneNum").val();
      var codeVal=$("#setCode").val();
      var psVal=$("#setPassWord").val();
      var psToVal=$("#setPassTo").val();

      //只要有一个input框为空就让按钮颜色变成灰色
      if(phoneVal=="" || codeVal=="" || psVal=="" || psToVal==""){
        $("#sBtnParent").removeClass("ok");

      }else{
        $("#sBtnParent").addClass("ok");

      }
      
    });
   
  });

