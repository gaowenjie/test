//注册页面
var hasRegist = true;//控制注册按钮是否可用，默认ture，[true表示注册按钮可用，false表示不可用]
$(function(){ 
    var sourceCode=BOM.getCookie("sourceCode");
    $("#jumpBtn").hide();     
    //初始按钮不可用
    $("#getCodeBtn").attr("disabled", true);

    //手机号输入完毕让按钮高亮
    $("#iphoneNum").keyup(function(){
      $("#getCodeBtn").addClass("ok");
      $("#getCodeBtn").removeAttr("disabled");
    })
    
    //判断手机号是否注册[失去焦点时判断]
    $("#getCodeBtn").click(function(){ 
        var phone=$("#iphoneNum").val();   
        if(!checkPhone(phone)){
            YIIGOO.popWindow("请输入正确的手机号");
            $("#iphoneNum").focus();
            return false;
         }

        $.ajax({
          type:"get",
          async:"false",
          url:GLOBALURL.dataUrl+"mobile/admin/userIsExist.do?",
          data:{username:phone},
          dataType: "jsonp",
          success:function(data){
            if(data.extra==true){//true用户已经存在
               YIIGOO.popWindow("您输入的手机号码已注册");
               $("#iphoneNum").focus();
               return false;
            }else if(data.extra==false){
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
                  }
              });
            }
              
          },
          error:function(){
            YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
        });
    });


    //点击注册
    $("#sbBtn").click(function(){//
      if(!hasRegist){//表示按钮不可用
        return;
      }
      
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
          url:GLOBALURL.dataUrl+"mobile/admin/register.do",
          data:{username:phoneVal,password:psVal,validateCode:codeVal,fromCode:sourceCode},
          dataType: "jsonp",
          success:function(data){
            if(data.type=='error'){
             if(data.extra=="VALIDATE_CODE_NO_MATCHING"){//验证码不匹配 
                YIIGOO.popWindow(data.content);
                $("#setCode").focus();
             }               
            }else{
              //成功注册跳登录页面
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

    //点击同意切换按钮
    $("#agreeBtn").click(function(){
       if($(this).hasClass("ok")){
         $("#sBtnParent").removeClass("ok");
         $(this).removeClass("ok");    
         hasRegist = false;    //不可用      
         //$("#sBtnParent").prop("disabled",true);   
         return false;
       }else{
         $(this).addClass("ok");
         $("#sBtnParent").addClass("ok");
         //$("#sBtnParent").prop("disabled", false);  
         hasRegist = true;  //可用    
       }
    });

    //点击注册协议
    $("#agreement").click(function(){
       $("#jumpBtn").show();
    });

    $("#closeBtn").click(function(){
      $("#jumpBtn").hide();
    })
   
  });

