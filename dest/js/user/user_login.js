//登录页面
$(function(){

  var pageBack = window.location.href.split("pageBack=")[1];
  //判断页面是否在微信浏览器打开
  function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        $(".yg-login-ally").show();
      } else {
        $(".yg-login-ally").hide();
      }
    }
  is_weixn();

  $("#loginBtn").click(function(){
    //1.点击登录按钮时：判断手机是否为空，格式是否正确
    var phoneVal=$("#iphoneNum").val();
    var psVal=$("#setPassWord").val();
    //input框没输入完时，注册按钮不可以点击
    if(phoneVal=="" || psVal==""){
      return;
    };

    //验证手机号码
    if(phoneVal.length<11){
       YIIGOO.popWindow("请输入正确手机号");
        $("#iphoneNum").focus();
        return false;
     }else if(!checkPhone(phoneVal)){
        YIIGOO.popWindow("手机号码格式不正确！");
        $("#iphoneNum").focus();
        return false;
     }

    //2.密码验证()
    if(!checkPwd(psVal)){
        YIIGOO.popWindow("请输入正确的密码");
        $("#setPassWord").focus();
        return false;
     }

    //3.验证成功后，发请求，成功做跳转
    $.ajax({
          type:"get",
          async:"false",
          url:GLOBALURL.dataUrl+"mobile/admin/login.do?",
          data:{username:phoneVal,password:psVal},
          dataType: "jsonp",
          success:function(data){
            if(data.type=='success'){
              //保存id，昵称
              var userId=data.extra.user.id;
              var nickName=data.extra.user.nickName;
              YIIGOO.setLoginId(userId);
              YIIGOO.setLocalStorage("nickName",nickName);
              //登录成功后跳转到相对应的页面
              switch(pageBack)
              {                
                //进入用户中心。
                case "userCenter":
                window.location.href = "index.html";
                break;
                //进入首页
                case  "index" :
                window.location.href = "../index.html";
                break;
                //返回购物车。
                case  "cart" :
                window.location.href = "../cart/cart.html";
                break;
                //如果为空就走首页
                case undefined:
                window.location.href="../index.html";
                break;
                default :
                window.location.href = pageBack;
                break;
              }

              
            }else{
              YIIGOO.popWindow("您输入的用户名或密码有误！");
              $("#iphoneNum").focus();
            }
          },
          error:function(){
            YIIGOO.popWindow('系统繁忙，请稍后再试…');
          }
    });

  });
  
  //微信联合登录
  $("#weiBtn").click(function(){    
    window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx563327e8dd35e422&redirect_uri=http://m.yg.com/user/bindmobile.html&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
    //window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx563327e8dd35e422&redirect_uri=http://m.yiigoo.com/action/join/index.html&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
  });
  //给所有的input注册keyup事件
  $("input").keyup(function(){
    var phoneVal=$("#iphoneNum").val();
    var psVal=$("#setPassWord").val();

    //只要有一个input框为空就让按钮颜色变成灰色
    if(phoneVal=="" || psVal==""){
      $("#sBtnParent").removeClass("ok");
    }else{
      $("#sBtnParent").addClass("ok");
    }
  });

});
