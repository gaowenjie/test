// 纯JS省市区三级联动
/**
* _cmbProvince 省ul的id
* _cmbCity 市ul的id
* _cmbArea 区县ul的id
* _spanPro 顶端请选择省(span)的id
* _spanCity 顶端请选择市(span)的id
* _spanArea 顶端请选择区县(span)的id
* defaultProvince 省名称的默认值
* defaultCity 市名称的默认值
* defaultArea 区县名称的默认值
*/
var addressInit = function(_cmbProvince, _cmbCity, _cmbArea,_spanPro,_spanCity,_spanArea, defaultProvince, defaultCity, defaultArea)
{
	var cmbProvince = $(document.getElementById(_cmbProvince));//省ul对象
	var cmbCity = $(document.getElementById(_cmbCity));//地市ul对象
	var cmbArea = $(document.getElementById(_cmbArea));//区县ul对象
	var spanPro = $(document.getElementById(_spanPro));//请选择省span
	var spanCity = $(document.getElementById(_spanCity));//请选择地市span
	var spanArea = $(document.getElementById(_spanArea));//请选择区县span

	//给顶端3个span注册事件,控制下面ul显示隐藏问题 bigen
	spanPro.click(function(){
		
	    cmbCity.hide();
	    cmbArea.hide();
	    cmbProvince.show();
	    $("span").removeClass("on");
	    $(this).addClass("on");
	});
	spanCity.click(function(){

	    cmbProvince.hide();
	    cmbArea.hide();
	    cmbCity.show();
	    $("span").removeClass("on");
	    $(this).addClass("on");
	});
	spanArea.click(function(){

	    cmbCity.hide();
	    cmbProvince.hide();
	    cmbArea.show();
	    $("span").removeClass("on");
	    $(this).addClass("on");
	});
	//给顶端3个span注册事件,控制下面ul显示隐藏问题 end

	cmbCity.hide();
	cmbArea.hide();
	spanCity.hide();
	spanArea.hide();
	/**
	* 将cmb下li有名称等于str的设置选中效果
	* str 名字
	*/
	function cmbSelect(cmb, str)
	{
		var lis = cmb.find("li");
		for(var i=0; i<lis.length; i++)
		{
			if($(lis[i]).text() == str){//当前选中项
				lis.removeClass("on");
				$(lis[i]).addClass("on");
				return;
			}
		}
	}
	/**
	* 追加li
	* cmb ul对象-jquery
	* val 区域id
	* str 区域名字
	* obj 当前区域所属对象-json
	*/
	function cmbAddLi(cmb,val,str,obj)
	{
		var li = '<li value="'+val+'" >'+str+'<i></i></li>';//创建li
		cmb.append(li);
		//将当前对象数据存储到LI中
		cmb.find("li[value='"+val+"']").data("item",obj);
	}
	//地市li改变事件
	function changeCity()
	{
		//清空区县原来所有li
		cmbArea.html("");
		//检查地市li是否有选中项
		var lis = cmbCity.find("li");
		var item;
		for(var i=0;i<lis.length;i++){
		
			if($(lis[i]).hasClass("on")){
				item = $(lis[i]).data("item");
				break;
			};
		}
		if(!item)return;
		//
		spanCity.text(item.cityName);
		spanArea.text("请选择");
		//园园2016-7-19
		spanPro.removeClass("on");
		spanCity.removeClass("on");
		spanArea.addClass("on");
		//动态追加该地市下的所有区县
		for(var i=0; i<item.areaList.length; i++)
		{
			cmbAddLi(cmbArea, item.areaList[i].areaId, item.areaList[i].areaName, item.areaList[i]);
			//如果当前区县名字等于默认区县名,则设置到顶端span上
			if(defaultArea == item.areaList[i].areaName){
				spanArea.text(item.areaList[i].areaName);
			}
		}
		//动态追加完区县后给所有区县li注册click事件
		cmbArea.find("li").click(function(){
			cmbArea.find("li").removeClass("on");
			var _this = $(this);
			_this.addClass("on");
			//把当前选中的区县名称设置到顶端span上
			spanArea.text(_this.text());
		});
		//给默认值设置选中效果
		cmbSelect(cmbArea, defaultArea);
		//控制ul显示隐藏问题
		cmbCity.hide();
		cmbProvince.hide();
		cmbArea.show();
		spanArea.show();

	}
	//省li改变事件
	function changeProvince()
	{
		//清空之前的li
		cmbCity.html("");
		
		//验证省li是否有被选中的 bigen
		var lis = cmbProvince.find("li");
		var item;//之前存储的某个省对象数据
		for(var i=0;i<lis.length;i++){
			if($(lis[i]).hasClass("on")){
				item = $(lis[i]).data("item");
				break;
			};
		}
		if(!item)return;
		//验证省li是否有被选中的 end
		
		spanPro.text(item.provinceName);
		spanCity.text("请选择");
		spanArea.text("请选择");
		//园园2016-7-19
		spanPro.removeClass("on");
		spanCity.addClass("on");
		spanArea.removeClass("on");

		//追加地市li
		for(var i=0; i<item.cityList.length; i++)
		{
			cmbAddLi(cmbCity, item.cityList[i].cityId, item.cityList[i].cityName, item.cityList[i]);
		}
		//动态追加完地市li后注册click事件
		cmbCity.find("li").click(function(){
			cmbCity.find("li").removeClass("on");
			var _this = $(this);
			_this.addClass("on");
			changeCity();
		});
		cmbSelect(cmbCity, defaultCity);
		
		cmbProvince.hide();
		cmbCity.show();
		spanCity.show();
		changeCity();
		//cmbCity.change = changeCity;
		
		
	}
	//动态生成省列表
	for(var i=0; i<provinceList.length; i++)
	{
		cmbAddLi(cmbProvince,provinceList[i].provinceId,provinceList[i].provinceName, provinceList[i]);
	}
	//动态生成省li后 给所有省li注册click事件
	cmbProvince.find("li").click(function(){
		//处理选中效果 bigen
		cmbProvince.find("li").removeClass("on");
		var _this = $(this);
		_this.addClass("on");
		//处理选中效果 end
		changeProvince();
	});
	cmbSelect(cmbProvince, defaultProvince);

	changeProvince();
	


}

