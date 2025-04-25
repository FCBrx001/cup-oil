function drawHistogram2(name1,dataset,flag,firsttime,str,cor){

		var v=[[115,40],[148,-20]];
		var y=d3.scale.linear().domain([d3.min(cor),d3.max(cor)]).range([4,8]);
		var dataarc={startAngle:Math.PI*(-5/6),endAngle: Math.PI*(-1/6)};
		var dataset2 = dataset.slice(1,dataset.length);

		for(var i=dataset2.length-1;i>-1;i--){
			if(dataset2[i]=="") dataset2.pop();
		}
		
		var binNum=20,rangeMin=0,rangeMax=100;
		var height=100,width=120;
		var histogram=d3.layout.histogram()
						.range([rangeMin,rangeMax])
						.bins([0,60,65,70,75,80,85,90,95,100,105])
						.frequency(false);
		var hisData=histogram(dataset2);
		var xAxisWidth=200,
			xTicks=hisData.map(function(d){return d.x});
		var xScale=d3.scale.ordinal()
					.domain(xTicks)
					.rangePoints([0,xAxisWidth],0.5);
		var xAxis=d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.tickFormat(d3.format(".0f"));
		tooltip.select("g.flag"+flag).append("g")
				.attr("class","axis")
				.attr("transform","translate("+width+","+height+")")
				.call(xAxis);
		//绘制圆形
		var cir = tooltip.select("g.flag"+flag).append("circle")
						.attr("cx",width-10)
						.attr("cy",height)
						.attr("r",function(d){
							var cor=0;
							svg3.select("g."+name1+"star")
								.selectAll("circle.course").filter(function(a) {
									if(a.课程名==str)
										cor=+eval("a."+name1);
								})
							if(cor<0.5) return 3;
							else return scalecor(cor);
						})
						.style("fill",function(){
							var c;
							svg3.select("g."+name1+"star")
								.selectAll("circle.course").filter(function(a) {
									if(a.课程名==str)
										c="color"+a.选修方式+a.课程类型+a.学分;
								})
							return eval(c);
						});

		console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
		
		console.log(cor);
		if(flag==1){
			if(firsttime){
				tooltip.select("g.flag1").append("path")
				.attr("class","cor")
				.datum(cor)
				.attr("d",function(d){
					if(d>0){
						var arcPath = d3.svg.arc()
											.innerRadius(60/Math.cos(1*Math.PI/6))
											.outerRadius(60/Math.cos(1*Math.PI/6)+y(d));
						return arcPath(dataarc);
					}
					else return "none";
				})
				.attr("transform",function(d,i){
					return "translate("+140+","+40+")";
				})
				.style("stroke","Grey")
				.style("stroke-opacity",0.6)
				.style("fill","Grey")
				.style("fill-opacity",0.6);
				flag1=1;
			}
		}
		else if(flag==2){
			if(firsttime){
				tooltip.select("g.flag2").selectAll("path.cor")
				.data(cor).enter()
				.append("path")
				.attr("class","cor")
				.attr("d",function(d,i){
					if(d>0){
						var arcPath=d3.svg.arc()
								.innerRadius(60*(2-i)/Math.cos(1*Math.PI/6))
								.outerRadius(60*(2-i)/Math.cos(1*Math.PI/6)+y(d));
						return arcPath(dataarc);
					}
					else return "none";
				})
				.attr("transform",function(d,i){
					if(i==0)return "translate("+178+","+(-20)+")";
					else if(i==1)return "translate("+140+","+40+")";
				})
				.style("stroke","Grey")
				.style("stroke-opacity",0.6)
				.style("fill","Grey")
				.style("fill-opacity",0.6);   flag2=1;
			}
		}
		tooltip.selectAll("path.cor").on("mouseover",function(d){
					var cor ;
					var infor_path;
					if(parseFloat(d.slice(4,5)) < 5)
						cor = d.slice(0,4) + "";
					else cor = (parseFloat(d.slice(0,4))+0.01) + "";
					d3.select(this).style("fill","Blue");

					infor_path = d3.select(this)[0][0].getBoundingClientRect();
					tooltip.select("g.showCor")
						.append("text")
						.attr("class","cornum")
						.attr("transform","translate("+(infor_path.x-30)+","
							+(infor_path.y+infor_path.height/2)+")")
						.style("fill","Black")
						.style("font-weight",900)
						.style("font-size",15)
						.text((+cor).toFixed(2));
				})
				.on("mouseout",function(d){
					d3.select(this).style("fill","Grey");
					tooltip.select("g.showCor").select("text.cornum").remove();
				});
		var yAxisWidth=150;
		var yScale=d3.scale.linear()
				.domain([0,1])
				.range([0,yAxisWidth]);
		var lineGenerator=d3.svg.line()
							.x(function(d){return xScale(d.x)})
							.y(function(d){return height-yScale(d.y)})
							.interpolate("basis");
		if(flag==0)
			var gLine= tooltip.select("g.flag0").append("g")
							.attr("transform","translate("+width+","+0+")");
		else if(flag==1)
			var gLine= tooltip.select("g.flag1").append("g")
							.attr("transform","translate("+width+","+0+")");
		else if(flag==2)
			var gLine= tooltip.select("g.flag2").append("g")
							.attr("transform","translate("+width+","+0+")");

		gLine.append("path")
			.attr("class","linePath")
			.attr("d",lineGenerator(hisData))
			.attr("stroke",function(){
				if(dataset[0]==2007) return color2007;
				else if(dataset[0]==2008) return color2008;
				else if(dataset[0]==2009) return color2009;
				else if(dataset[0]==2010) return color2010;
				else if(dataset[0]==2011) return color2011;
				else if(dataset[0]==2012) return color2012;

			})
			.attr("stroke-width","3px")
			.attr("fill","none");

		gLine.append("rect")
			.attr("x",function(){
				return (dataset[0]-2007)*35-80;
			})
			.attr("y",function(){return -flag*120;})
			.attr("width",20)
			.attr("height",10)
			.style("fill",function(){
				if(dataset[0]==2007) return color2007;
				else if(dataset[0]==2008) return color2008;
				else if(dataset[0]==2009) return color2009;
				else if(dataset[0]==2010) return color2010;
				else if(dataset[0]==2011) return color2011;
				else if(dataset[0]==2012) return color2012;

			});

		//保证text绘制过程中，每次只绘制过一次
		//绘制年份
		var flag_text_year = 0;
		for(flag_text_year = 0; flag_text_year < d3.selectAll("text.yearText")[0].length;flag_text_year++)
			if(d3.selectAll("text.yearText")[0][flag_text_year].textContent == dataset[0]) break;
		if((flag_text_year == 0 && d3.selectAll("text.yearText")[0].length == 0 )||
			flag_text_year == d3.selectAll("text.yearText")[0].length)
			gLine.append("text")
				.attr("class","yearText")
				.attr("font-size",12)
				.attr("dx",(dataset[0]-2007)*35-80)
				.attr("dy",function(){return 30-flag*120;})
				.text(dataset[0])
				.style("fill","Black");

		//绘制课程名
		var flag_text_name = 0;
		for(flag_text_name = 0; flag_text_name < d3.selectAll("text.nameText")[0].length;flag_text_name++)
			if(d3.selectAll("text.nameText")[0][flag_text_name].textContent == courseEnglish(str)) break;
		if((flag_text_name == 0 && d3.selectAll("text.nameText")[0].length == 0 )||
			flag_text_name == d3.selectAll("text.nameText")[0].length)
			gLine.append("text")
				.attr("class","nameText")
				.attr("text-anchor", "middle")
				.attr("font-size",12)
				.attr("dx",100)
				.attr("dy",function(){return height+30;})
				.text(function(){
					return courseEnglish(str);
				})
				.style("fill","Black");
}

function drawHistogram3(name1,dataset,flag,firsttime,str,cor){
		
		var y=d3.scale.linear().domain([d3.min(cor),d3.max(cor)]).range([3,8]);
		var dataarc={startAngle:Math.PI*(-5/6),endAngle: Math.PI*(-1/6)};
		var dataset2=dataset.slice(1,dataset.length);
		var binNum=20,rangeMin=0,rangeMax=100;
		var height=60,width1=147,width2=147;
		var histogram = d3.layout.histogram()
						.range([rangeMin,rangeMax])
						.bins([0,60,65,70,75,80,85,90,95,100,105])
						.frequency(false);
		var hisData = histogram(dataset2);
		var xAxisWidth=160,xTicks=hisData.map(function(d){return d.x});
		var xScale = d3.scale.ordinal()
						.domain(xTicks)
						.rangePoints([0,xAxisWidth],0.5);
		var xAxis=d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.tickFormat(d3.format(".0f"));

			tooltip.select("g.flag"+(flag+3)).append("g")
					.attr("class","axis")
					.attr("transform","translate("+width1+","+height+")")
					.call(xAxis);

		var lineGenerator=d3.svg.line()
							.x(function(d){return xScale(d.x)})
							.y(function(d){return height-yScale(d.y)})
							.interpolate("basis");
		if(flag==0)
			var gLine= tooltip.select("g.flag3").append("g")
								.attr("transform","translate("+width1+","+0+")");
		else if(flag==1)
			var gLine= tooltip.select("g.flag4").append("g")
								.attr("transform","translate("+width2+","+0+")");
		else if(flag==2)
			var gLine= tooltip.select("g.flag5").append("g")
								.attr("transform","translate("+width1+","+0+")");
		else if(flag==3)
			var gLine= tooltip.select("g.flag6").append("g")
								.attr("transform","translate("+width2+","+0+")");
		else if(flag==4)
			var gLine= tooltip.select("g.flag7").append("g")
								.attr("transform","translate("+width1+","+0+")");
		else if(flag==5)
			var gLine= tooltip.select("g.flag8").append("g")
								.attr("transform","translate("+width2+","+0+")");
		else if(flag==6)
			var gLine= tooltip.select("g.flag9").append("g")
								.attr("transform","translate("+width2+","+0+")");
		else if(flag==7)
			var gLine= tooltip.select("g.flag10").append("g")
								.attr("transform","translate("+width2+","+0+")");
		else if(flag==8)
			var gLine= tooltip.select("g.flag11").append("g")
								.attr("transform","translate("+width2+","+0+")");


		gLine.append("path")
			.attr("class","linePath")
			.attr("d",lineGenerator(hisData))
			.attr("stroke",function(){
				if(dataset[0]==2007) return color2007;
				else if(dataset[0]==2008) return color2008;
				else if(dataset[0]==2009) return color2009;
				else if(dataset[0]==2010) return color2010;
				else if(dataset[0]==2011) return color2011;
				else if(dataset[0]==2012) return color2012;

			})
			.attr("stroke-width","3px")
			.attr("fill","none");

		gLine.append("rect")
			.attr("x",function(){
				return (dataset[0]-2007)*35-100;

			})
			.attr("y",function(){return -5-flag*70;})
			.attr("width",20)
			.attr("height",10)
			.style("fill",function(){
				if(dataset[0]==2007) return color2007;
				else if(dataset[0]==2008) return color2008;
				else if(dataset[0]==2009) return color2009;
				else if(dataset[0]==2010) return color2010;
				else if(dataset[0]==2011) return color2011;
				else if(dataset[0]==2012) return color2012;

			});

		var flag_text_year = 0;
		for(flag_text_year = 0; flag_text_year < d3.selectAll("text.yearText")[0].length ; flag_text_year++)
			if(d3.selectAll("text.yearText")[0][flag_text_year].textContent==dataset[0]) break;
		if((flag_text_year == 0 && d3.selectAll("text.yearText")[0].length ==0 )||
			flag_text_year == d3.selectAll("text.yearText")[0].length)
			gLine.append("text")
				.attr("class","yearText")
				.attr("font-size",12)
				.attr("dx",(dataset[0]-2007)*35-100)
				.attr("dy",function(){return 20-flag*70;})
				.text(dataset[0])
				.style("fill","Black");

		var flag_text_name = 0;
		for(flag_text_name = 0; flag_text_name < d3.selectAll("text.nameText")[0].length;flag_text_name++)
			if(d3.selectAll("text.nameText")[0][flag_text_name].textContent==courseEnglish(str)) break;
		if((flag_text_name == 0 && d3.selectAll("text.nameText")[0].length ==0 )||
			flag_text_name == d3.selectAll("text.nameText")[0].length)
			gLine.append("text")
				.attr("class","nameText")
				.attr("text-anchor", "middle")
				.attr("font-size",12)
				.attr("weight",20)
				.attr("dx",80)
				.attr("dy",function(){return height+30;})
				.text(function(){
						return courseEnglish(str);
				})
				.style("fill","Black");*/
}