
//定义变量
var msgId="msg";

//注册页面手机获取验证码倒计时的变量名
var CONFIRG={
  msgShowTime:2000,    //提示信息显示时长
  msgOutSpeed:'fast',  //提示信息的隐藏动画
  codeTime:59          //验证码的倒计时时间
}

/**
* 验证码倒计时
* time :倒计时时间(秒)
* id ：倒计时按钮id
* author：尹园园
* date:2016-06-20
*/
function timeDown(id,time){
  var obj=$("#"+id);
  obj.val(time+'秒后重新发送');  
  obj.prop("disabled",true);
  var timer=setInterval(function(){
    time--;
    obj.val(time+'秒后重新发送');
    if(time==0){
      obj.val('获取验证码');
      obj.prop("disabled",false);
      clearInterval(timer);
    }
  },1000);
}

/**
* 提示消息框
* id :提示框的id
* msg ：提示内容
* author：尹园园
* date:2016-06-20
*/
function msgContent(id,msg){
    $("#"+id).text(msg).show().delay(CONFIRG.msgShowTime).fadeOut(CONFIRG.msgOutSpeed);
}

/**
* 验证手机号码格式是否正确
* phone ：手机号
* return: true 正确格式的手机号;false 错误格式的手机号
*/
function checkPhone(phone){
    if(!phone){//为空
      return false;
    }else if(phone.length!=11){
      return false;
    }
    return phone.match(/^(13|15|17|18)\d{9}$/);

}
/**
* 验证密码6-15位数字+字母
* pwd :密码
* return: true 正确格式的密码;false 错误格式的密码
*/
function checkPwd(pwd){
    if(!pwd){
      return false;
    }
    return pwd.match(/^[0-9A-Za-z]{6,15}$/);

}

/**
* 判断字符串是否为空，传一个参数验证str是否为空，传2个参数同时验证是否等于默认值
* str ：字符串
* defaultVal ：默认值
* return: true 传入的字符串为空;false 传入的字符串不为空
* author：尹园园
*/
function isNull(str,defaultVal){

    if(!str || str=='' || str=='undefined' ){
      return true;
    }
    if(arguments.length==2){//当传入了2个参数的时候
      if(str == defaultVal){
        return true;
      }
    }
    return false;
    
    
}