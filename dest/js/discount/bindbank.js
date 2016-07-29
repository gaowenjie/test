//订单列表页面
$(function(){ 
    var source = BOM.parseQueryStr(window.location.href).sourceCode;
    var bank={
      init:function(){
        bank.selectBank();        
      },
      //查询用户的银行卡信息
      selectBank:function(){
       $.ajax({
            type: "get",
            async: false,
            url: GLOBALURL.dataUrl+"mobile/rebate/findBankInfo.do",
            dataType: "jsonp",
            success: function(data)
            {
              if(data.type == "success")
              {
                if(!data.extra){ //如果data里面没有数据，造空数据
                  data.extra={id:"",bankAccount:"",bankName:"",bankBranch:"",bankNo:""};
                }else{ //有数据，设置用户名只读
                  $("#js_name").attr("readonly",true);
                }
                
                Fxtpl.render('js_bank', data.extra);
                bank.submitBank();//绑定事件

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
      //点击绑定银行卡
      submitBank:function(){
        $("#suBtn").click(function(){
            var id=$("#bankId").val();
            var bankAccount=$("#js_name").val();
            var bankName=$("#js_openBank").val();
            var bankBranch=$("#js_branch").val();
            var bankNo=$("#js_cardNumber").val();

            if(bankAccount==""||bankAccount==null){
              YIIGOO.popWindow("用户名不能为空！");
              $("#js_name").focus();
              return false;
            }else if(bankName==""||bankName==null||bankName.trim()==""){              
              YIIGOO.popWindow("开户行不能为空！");
              $("#js_openBank").focus();
              return false;        
            }else if(bankBranch==""||bankBranch==null||bankBranch.trim()==""){
              YIIGOO.popWindow("开户支行不能为空！");
              $("#js_branch").focus();
              return false;       
            }else if(bankNo==""||bankNo==null){
              YIIGOO.popWindow("银行卡号不能为空！");
              $("#js_cardNumber").focus(); 
              return false;
            }
            //验证成功，进入提交接口
            $.ajax({
                type: "get",
                async: false,
                url: GLOBALURL.dataUrl+"mobile/rebate/bindBank.do",
                data:{bankId:id,bankAccount:bankAccount,bankName:bankName,bankBranch:bankBranch,bankNo:bankNo},
                dataType: "jsonp",
                success: function(data)
                {
                  if(data.type == "success")
                  {
                    //跳转到返利首页
                    window.location.href="../discount/index.html?sourceCode="+source;
                  }
                },
                error: function()
                {
                   YIIGOO.popWindow('系统繁忙，请稍后再试…');
                }
            });

        });
      }

    }

    bank.init();
    
    
    
});