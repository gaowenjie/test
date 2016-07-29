//注册页面
$(function(){ 
    var pageBack = BOM.parseQueryStr(window.location.href).pageBack;

    //点击获取验证码
    $("#getCodeBtn").click(function(){
      var phone=$("#iphoneNum").val();
      //1.验证手机号码是否正确
       if(!checkPhone(phone)){
          YIIGOO.popWindow("请输入正确的手机号");
          $("#iphoneNum").focus();
          return false;
       }else{ 
          //请求验证之前，先判断手机是否注册了，如果没注册，则发送验证码
          $.ajax({
              type:"get",
              async:"false",
              //url:GLOBALURL.dataUrl+"mobile/admin/sendValidateCode.do?",
              url:"http://192.168.1.195:8080/yg_mobile/mobile/admin/userIsExist.do?",
              data:{username:phone},
              dataType: "jsonp",
              success:function(data){
                //用户已经存在
                if(data.extra=='true'){
                   YIIGOO.popWindow("手机号已注册");//true
                }else{
                  //false 用户不存在，发送验证码
                   $.ajax({
                      type:"get",
                      async:"false",
                      //url:GLOBALURL.dataUrl+"mobile/admin/sendValidateCode.do?",
                      url:"http://192.168.1.195.:8080/yg_mobile/mobile/admin/sendValidateCode.do?",
                      data:{username:phone},
                      dataType: "jsonp",
                      success:function(data){
                        if(data.type=='success'){
                           YIIGOO.popWindow(data.content);
                          //倒计时
                          timeDown("getCodeBtn",CONFIRG.codeTime);
                        }
                      }
                  });

                }
              },
              error:function(){
                YIIGOO.popWindow('系统繁忙，请稍后再试…');
              }
          });
      }
    });
    //点击注册
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
          YIIGOO.popWindow("手机号码格式不正确！");
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
       //验证完了 可以发ajax了

       $.ajax({
              type:"get",
              async:"false",
              url:"http://192.168.1.195:8080/yg_mobile/mobile/admin/register.do?",
              //url:GLOBALURL.urseUrl+"mobile/admin/register.do",
              data:{username:phoneVal,password:psVal,validateCode:codeVal},
              dataType: "jsonp",
              success:function(data){
                if(data.type=='error'){
                 YIIGOO.popWindow(data.content);//验证码不匹配
                 $("#setCode").focus();
                }else{
                  //注册成功 [成功后直接跳转想对应的页面]
                  switch(pageBack)
                  {
                    //进入用户中心。
                    case "userCenter":
                    window.location.href = GLOBALURL.pageUrl+"user/index.html";
                    break;
                    //进入首页
                    case  "index" :
                    window.location.href = GLOBALURL.pageUrl+"index.html";
                    break;
                    //其它...
                  }

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

    //点击同意切换按钮
    $("#agreeBtn").click(function(){
       $("#agreeBtn").toggleClass("ok");
    });

     
   
  });

