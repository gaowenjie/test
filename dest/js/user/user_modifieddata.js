//修改个人资料
$(function(){ 
   var updateUser={
    //页面初始化
    init:function(){
      updateUser.seletUser();
      updateUser.exit();
    },
    //获取用户信息
    seletUser:function(){
        $.ajax({
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/userCentre/findUserInfo.do",
            dataType: "jsonp",
            success: function(data)
            {
              if(data.type == "success")
              {
                //调用渲染模板
                Fxtpl.render('js_userCenter', data.extra);
                updateUser.modifyNews();
                //初始化日历控件
                var t=updateUser.getLocalTime(data.extra.babyBirthday); //把毫秒数转换成日期对象：2015/04/12
                //console.log(t)
                var cyear=t.split("/")[0];//得到年2015 
                var cmonth=t.split("/")[1];//得到月04
                var cday=t.split("/")[2];//得到日12
                //把接收的参数存到data里面去
                data["cyear"]=cyear;
                data["cmonth"]=cmonth;
                data["cday"]=cday;
                updateUser.initDate(cyear,cmonth,cday);

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
    },
    //修改用户信息
    modifyNews:function(){
      $("#js_nickname").click(function(){
        //修改昵称
        var nName=$("#nName").text();
        window.location.href="modifieddata-name.html?nickName="+decodeURIComponent(nName);
      });
      //修改性别
      $("#js_sex").click(function(){
        var mSex=$("#uSex").text();
        window.location.href="modifieddata-sex.html?babyGender="+decodeURIComponent(mSex);
      });
    },
    //修改年龄:请求后台&把数据传给后台[传时间格式是Date类型:babyBirthday=2015/04/12]*/
    initDate:function(cyear,cmonth,cday){
      $('#beginTime').date({"cyear":cyear,"cmonth":cmonth,"cday":cday},function(date){
        
        $.ajax({
              type: "get",
              async: false,
              url: GLOBALURL.dataUrl+"mobile/userCentre/updateUserInfo.do",
              data:{babyBirthday:date},
              dataType: "jsonp",
              success: function(data)
              { 
                if(data.type=='success'){
                  //用来设置默认值
                  $("#beginTime").val(data.cyear,data.cmonth,data.cday);
                  updateUser.seletUser();
                }else if(data.type == "error"){
                   //未登录。
                  if(data.extra.key == "REDIRECT_LONGIN_PAGE")
                  {
                    window.location.href  = GLOBALURL.pageUrl+"user/login.html?pageBack="+window.location.href;
                  }
                }
              },
              error:function(data){
                YIIGOO.popWindow('系统繁忙，请稍后再试…');
              }
        });
      },function(){
        //alert("点击取消按钮")
      });
    },
    //把毫秒转成时间对象
    getLocalTime:function (ms) 
    { 
      var now = new Date(ms);
      var   year=now.getFullYear();     
      var   month=now.getMonth()+1;     
      var   date=now.getDate();     
      var   hour=now.getHours();     
      var   minute=now.getMinutes();     
      var   second=now.getSeconds();     
      return   year+"/"+updateUser.toDou(month)+"/"+updateUser.toDou(date);             
    }, 

    //补零方法
    toDou:function(iNum){
      return iNum<10?'0'+iNum:''+iNum;
    },
    //退出【点击退出返回到个人中心首页】
    exit:function(){
      $("#exitBtn").click(function(){
          $.ajax({
              type: "get",
              async: false,
              url: GLOBALURL.dataUrl+"mobile/admin/logout.do",
              dataType: "jsonp",
              success: function(data)
              {
                if(data.type == "success")
                {
                  //跳转页面到首页
                  window.location.href="../index.html";
                  YIIGOO.clearLogin();//清除登录状态
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
    }
   }
   updateUser.init();
});
//上传图片的方法
function previewImage(file)
{
  if (file.files && file.files[0])
  {
      var reader = new FileReader();
      $("#js_img").name = file.files[0].name;
      reader.onload = function(evt){
        $.post(GLOBALURL.dataUrl+"mobile/file/uploadBase64Image.do", {uploadFile: evt.target.result,fileName:file.files[0].name,fileType:"HeadImage",isFill:"false"}, function (data) 
        {
          //200的图片设置
          //alert(data.fileUrl);
          var temp = data.fileUrl;
          temp= YIIGOO.setImgUrl(temp,"200*200");
          $("#js_img").attr("src",temp); 

          //原图
          /*var temp = data;
          $("#js_img").attr("src",temp.fileUrl); */ 

          //提交图片
          $.ajax({
              type: "get",
              async: false,
              url: GLOBALURL.dataUrl+"mobile/userCentre/updateUserInfo.do?userLogo="+temp,
              dataType: "jsonp",
              success: function(data)
              {
                if(data.type == "success")
                {
                  //设置到头图上面
                } 
              },
              error: function()
              {
                   YIIGOO.popWindow('系统繁忙，请稍后再试…');
              }
          });
        });
      }
     
      reader.readAsDataURL(file.files[0]);
  };
}
