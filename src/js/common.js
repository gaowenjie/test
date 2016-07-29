//全局数据接口。
var GLOBALURL = 
{
	dataUrl:"127.0.0.1"
};
var UIX=
{
	getType:function(e){return Object.prototype.toString.call(e).slice(8,-1);},
	isPostCode: function(zip) 
	{
    	var reg = /^[1-9]\d{5}(?!\d)$/;
   	 	return reg.test(zip);
	},
	isEmail:function(email) 
	{
		if (email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) 
		{
      	 return true;
  		}
    	else 
        return false;
    },
	addZero:function(num,n)
	{
		if(!n){n=2;};
		return Array(Math.abs((''+num).length-(n+1))).join(0)+num;
	},
	formatDate:function(v,f)
	{
		var F=f.replace(/\W/g,","),format=['yyyy','MM','dd','hh','mm','ss','ww'];
		var date = 
		{
			y:v.getFullYear(),
			M:v.getMonth()+1,
			d:v.getDate(),
			h:v.getHours(),
			m:v.getMinutes(),
			s:v.getSeconds(),
			w:v.getDay()
		};
		for(var i =0,num=F.length;i<num;i++)
		{
			var o=F[i];
			for(var j=0;j<7;j++)
			{
				var S=format[j].slice(-1);
				if(o.hasString(S))
				{
					if(S=="w"&&date[S]==0){data[S]=7;}
					if(o.hasString(format[j]))
					{
						f=f.replace(RegExp(format[j],'g'),this.addZero(date[S]));
					}else
					{
						f=f.replace(RegExp(format[j].slice(format[j].length/2),'g'),date[S]);
					}
				}
			}
		};
		return f;
	},
	parseDate:function(v,f)
	{
		if(!f){f="yyyy-mm-dd";};
		f=f.replace(/\W/g,',').split(',');
		v=v.replace(/\D/g,',').split(',');
		var y=2000,M=0,d=1,h=0,m=0,s=0,D=true;
		UIX.each(f,function(o,i)
		{
			if(v[i]!=''&&!isNan(v[i]))
			{
				if (o.hasString('y')) y = Number(v[i]);
                if (o.hasString('M')) M = Number(v[i])-1;
                if (o.hasString('d')) d = Number(v[i]);
                if (o.hasString('h')) h = Number(v[i]);
                if (o.hasString('m')) m = Number(v[i]);
                if (o.hasString('s')) s = Number(v[i]);
                if (o.hasString('w')) s = Number(v[i]);
			}
		});
		if(!D){return false;}
		return new Date(y,M,d,h,m,s);
	}
};
//添加<script>标签的方法
function addScriptTag(src)
{
	var script = document.createElement('script');
      	script.setAttribute("type","text/javascript");
      	script.src = src;
    document.body.appendChild(script);
}
String.prototype.hasString=function(o)
{
	if(typeof o=="object")
	{
		for(var i=0,n=o.length;i<n;i++)
		{
			if(!this.hasString(o[i]))
			{
				return false;
			}
		}
		return true;
	}else if(this.indexOf(o)!=-1)
	{
		return true;
	} 
};
String.prototype.subStr2=function(len)
{
	return this.substr(0,len);
};
/*去掉字符串前后的空格。*/
String.prototype.trim=function()
{
	var reg=/^\s+|\s+$/g;
	return this.replace(reg,"");
};
//取字符串长度。后面加...
String.prototype.shujusub=function(len)
{
	var content=this;var str="";var n=0;
	for(var i=0;i<content.length;i++)
	{
		var c=content.charCodeAt(i);
		if((c>=0x0001&&c<=0x007e)||(c>=0xff60&&c<=0xff9f))
		{
			n+=1;
		}else{n+=2;} 
		if(n>len){str+="...";break;}
		else{str+=content.charAt(i);}
	}
	return str;
};
/**
* 截取字符串长度。
* @param len 需要截取的长度。
* copyright 
**/
String.prototype.shujusub2=function(len)
{
	var content=this;var str="";var n=0;;
	for(var i=0;i<content.length;i++)
	{
		var c=content.charCodeAt(i);
		if((c>=0x0001&&c<=0x007e)||(c>=0xff60&&c<=0xff9f))
		{
			n+=1;
		}else{n+=2}
		if(n>len){break;}
		else{str+=content.charAt(i);}
	}
};
//回到顶部
function goTop(acceleration, time) 
{
    acceleration = acceleration || 0.1;
    time = time || 16;
    var x1 = 0;
    var y1 = 0;
    var x2 = 0;
    var y2 = 0;
    if (document.documentElement) 
    {
        x1 = document.documentElement.scrollLeft || 0;
        y1 = document.documentElement.scrollTop || 0;
    }
    if (document.body) 
    {
        x2 = document.body.scrollLeft || 0;
        y2 = document.body.scrollTop || 0;
    }
    var x3 = window.scrollX || 0;
    var y3 = window.scrollY || 0;
    // 滚动条到页面顶部的水平距离
    var x = Math.max(x1, Math.max(x2, x3));
    // 滚动条到页面顶部的垂直距离
    var y = Math.max(y1, Math.max(y2, y3));
    // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
    var speed = 1 + acceleration;
    window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
    // 如果距离不为零, 继续调用迭代本函数
    if (x > 0 || y > 0) 
    {
        var invokeFunction = "goTop(" + acceleration + ", " + time + ")";
        window.setTimeout(invokeFunction, time);
    }
}


