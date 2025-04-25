function drawAllHeatMap(){
	//以下两个是js文件获取html中svg元素的方法
	$('#OverallSvg');			//jquery的方法
	//d3.select('.overallSvg');	//d3.js的方法
	$('#MainView');
	$('#ParallelCoordinates');
	var high2007,high2008,high2009,high2010;

	var m = [30, 10, 10, 10],
		w1=6,h1=1.8;

	var category_rect_x = 55,
		category_grade_x = 70;

	var data全局2,datacorr;
    var flagHeat=false;
	var line = d3.svg.line();

	var fadingColor="Yellow";
	var color60以下="hsl(0,100%,40%)",color60="hsl(60,100%,40%)",color69="hsl(60,100%,40%)",
		color70="hsl(80,100%,40%)",color79="hsl(80,100%,40%)",color80="hsl(190,100%,40%)",
		color89="hsl(190,100%,40%)",color90="hsl(210,100%,40%)",color100="hsl(210,100%,40%)";
	var color60to69="hsl(60,100%,40%)",color70to79="hsl(80,100%,40%)",color80to89="hsl(190,100%,40%)",color90to100="hsl(210,100%,40%)";
	var color2007="hsl(0,85%,35%)",color2008="hsl(45,85%,35%)",color2009="hsl(90,85%,35%)",color2010="hsl(135,85%,35%)";

	var opa1=d3.scale.linear()
			.domain([0,59])
			.range(["hsl("+0+","+"100%"+","+"40%"+")","hsl("+60+","+"100%"+","+"40%"+")"]);
	var opa2=d3.scale.linear()
			.domain([60,69])
			.range([color60,color69]);
	var opa3=d3.scale.linear()
			.domain([70,79])
			.range([color70,color79]);
	var opa4=d3.scale.linear()
			.domain([80,89])
			.range([color80,color89]);
	var opa5=d3.scale.linear()
			.domain([90,100])
			.range([color90,color100]);
	//聚类结果
	var cluster = [[2007081128,2007081123],[2008082211,2008082119],[2009082124,2009082225],[2010044208,2010044211]];
	var clusterNum = new Array(4);
	//var gHeatID = [];
	for(var i=0;i<clusterNum.length;i++)
		clusterNum[i]=[];
     var heatC=false;
	//与336行配对
	var move=[30,135,240,330];
	var height_rect = [];

	var dataset=["0-59","60-69","70-79","80-89","90-100"];

		category_g = overall_svg.append("g")
					.attr("id","ScoreCategory")
					.attr("transform", "translate(0,0)");
		category_g.selectAll("rect")
				.data(dataset)
				.enter()
				.append("rect")
				.attr("x",function(d,i){return category_rect_x+55*i;})
				.attr("y",5)
				.attr("width",10)
				.attr("height",10)
				.style("fill",function(d,i){
					if(i==0) return color60以下;
					else if(i==1) return color60to69;
					else if(i==2) return color70to79;
					else if(i==3) return color80to89;
					else if(i==4) return color90to100;
				});
		category_g.selectAll("text")
				.data(dataset)
				.enter()
				.append("text")
				.attr("x",function(d,i){return category_grade_x+55*i;})
				.attr("y",15)
				.text(String)
				.style("font-size","12px");

		heatmap_g = main_view.append("g")
						.attr("id","HeatMap")
						.attr("transform", "translate(10,0)");

		heatmap_g.selectAll("rect.back")
				//绘制矩形,底色
				.data([[30,36,44],[135,36,45],[240,34,39],[330,33,34]])
				.enter()
				.append("rect")
				.attr("x",80)
				.attr("y",function(d){return d[0];})
				.attr("width",function(d){return d[1]*w1})
				.attr("height",function(d){
					height_rect.push(d[2]*h1);
					return d[2]*h1;
				})
				.attr("class","back")
				.style("fill",fadingColor)
				.style("fill-opacity",0.3);
     heatmap_g.append("rect").attr("width",300).attr("height",400)
	          .attr("transform", "translate(10,10)")
			  .attr("opacity",0)
			  .on("click",function(){
			   //var year=2007;
	                  if(heatC){
	                  for(year=2007;year<=2010;year++){
						  var gheatid = [];
				          var dataRaw = [];
				          var datasetHist = [];
						  dataRaw = eval("data"+year);
		         heatmap_g.select(".g"+year)
		                  .selectAll("g.heat"+year)
						  .selectAll("rect")
						  .attr("opacity", 1);	
						  for(var i = 0; i < dataRaw.length-2;i++){
								datasetHist = datasetHist.concat(transform(dataRaw[i]).slice(1));
						}
						for(var i = 0; i < datasetHist.length; i++)
							if(datasetHist[i] == "" || typeof(datasetHist[i]) == "undefined"){
								datasetHist.splice(i,1);
							i = i-1;
						}
						heatmap_g.select("#grade"+year).select("g.histogram").remove(); //移除统计信息
						drawHistogram_student(datasetHist,year);
						
	         }
	parallel_coor_g.select(".foreground").selectAll("path").style("display",null);
	}
	heatC=false;
	oldYear="all";
	gHeatID = [[],[],[],[]];
		//gHeatID=[];		  
			  });
	d3.csv("data/new_scores.csv", function (cars) {
		//console.log(cars);
		data全局2=cars;
	});
	var datacorr = new Array();
	for(var i=0;i<56;i++) {
		var arr = [];
		for(var item in datacorr[i])
			arr.push(datacorr[i][item]);
		datacorr[i]=arr;
	}

	d3.csv("data/correlation.csv", function (cars) {datacorr=cars;});
	var year=new Array(6);
	for(var i=0;i<6;i++){
		year[i]=new Object();
		year[i].grade = i+2007;
		year[i].学期 = [];
	}
	for(var i=0;i<56;i++){
		var arr = [];
		for(var item in datacorr[i])
			arr.push(datacorr[i][item]);
		datacorr[i]=arr;
	}

	heatmap_g.append("g").attr("class","g2007").attr("id","grade2007");
	heatmap_g.append("g").attr("class","g2008").attr("id","grade2008");
	heatmap_g.append("g").attr("class","g2009").attr("id","grade2009");
	heatmap_g.append("g").attr("class","g2010").attr("id","grade2010");
	heatmap_g.append("text").attr("id","heatmapYear2007");
	heatmap_g.append("text").attr("id","heatmapYear2008");
	heatmap_g.append("text").attr("id","heatmapYear2009");
	heatmap_g.append("text").attr("id","heatmapYear2010");
	function drawHeatEverySession(d,class_year){
		d3.csv(d,function(cars){
			var yearNum = class_year;	//年级,如:2007
			var dataYear = cars;
			var data = cars;	//获取成绩数据
			var data3 = [],
				data2 = [];
			var course_name = [];
			for(var i = 0; i < dataYear.length; i++)
				data[i] = transform(data[i]);
			/*data,学生成绩数据集,二维数组:
				[["2007081221", "88", "97", "94", "90", "94", "89",...,"92"]
				 ,...,
			 	 ["2007081230", "37", "60", "65", "70", "85", "87",...,"78"]]*/
			data2.push(data[dataYear.length-2]);
			data2.push(data[dataYear.length-1]);
			highYear = data2;
			if(yearNum == 2007) high2007 = data2;
			else if(yearNum == 2008) high2008 = data2;
			else if(yearNum == 2009) high2009 = data2;
			else if(yearNum == 2010) high2010 = data2;
			
			for(var k = 1;k < data2[0].length;k++)
				for(var j=0;j<data全局2.length;j++)
					if(data2[0][k] == data全局2[j].课程名&&data全局2[j].年级 == class_year){
						course_name.push(data全局2[j].课程名);
						data3.push(+data全局2[j].上课学期);
					}
			//按学期排列学生课程以及课程成绩
			var temp_data3 = [];
			var temp_course_name = [];
			var index_sem = [];
			var temp_data = [];
			for(var sem = 1; sem < 9; sem++){
				for(var i = 0; i < data3.length; i++){
					if(sem === data3[i]){
						temp_data3.push(sem);
						temp_course_name.push(course_name[i]);
						index_sem.push(i);
					}
				}
			}
			for(k=0;k<8;k++)
				year[0].学期[k] = data3.eleNum(k+1);
			data = data.slice(0,dataYear.length-2);
			data.forEach(function(d){d.pop();});
			for(var i = 0; i < data.length; i++){
				var one_student = [];
				one_student.push(data[i][0]);
				for(var j = 0;j < index_sem.length; j++){
					one_student.push(data[i][index_sem[j]+1]);
				}
				temp_data.push(one_student);
			}
			data = temp_data;
			data2[0] = data2[0].slice(0,1).concat(temp_course_name);
			highYear[0] = highYear[0].slice(0,1).concat(temp_course_name);
			data = corr_semester(data,data2[0],year[0].学期,yearNum);
			drawHeatmap(data,highYear,yearNum,year[0].学期,dataYear.length-2);
		});
	}

	function drawHeat(){
		drawHeatEverySession("data/2007级每个学生成绩.csv",2007);
		drawHeatEverySession("data/2008级每个学生成绩.csv",2008);
		drawHeatEverySession("data/2009级每个学生成绩.csv",2009);
		drawHeatEverySession("data/2010级每个学生成绩.csv",2010);
	}
	drawHeat();

	/*
	* dataset,学生成绩数据集,二维数组:
	[["2007081221", "88", "97", "94", "90", "94", "89",...,"92"]
	,...,
	["2007081230", "37", "60", "65", "70", "85", "87",...,"78"]]
	* dataset3,课程和学号数据集,二维数组:
	[["学号  ", "C语言程序设计", "计算机导论", "数据结构", "数据结构课程设计", "C语言课程设计", "认识实习",...,"毕业设计"]
	["学号  ", "2007081101", "2007081103", "2007081104", "2007081105", "2007081106", "2007081107",...,"2007081204"]]
	* year2,年级学期的统计量,数组:
	[2, 2, 4, 5, 7, 13, 1, 2]对应
	[1, 2, 3, 4, 5, 6,  7, 8] 

	year,年级学期统计量,对象数组:(2007为准,觉得有问题)
	[{grade: 2007
	   学期: (8) [2, 2, 4, 5, 7, 13, 1, 2]}
	 {grade: 2008, 学期: Array(0)}
	 {grade: 2009, 学期: Array(0)}
	 {grade: 2010, 学期: Array(0)}
	 {grade: 2011, 学期: Array(0)}
	 {grade: 2012, 学期: Array(0)}]

	* num,该年级的学生人数:num
	*/
	function drawHeatmap(dataset,dataset3,year,year2,num){
		var dataset2 = [],dataset4 = [];
		for(var i = 0; i < dataset.length;i++)
			dataset2[i] = dataset[i].slice(1,dataset[i].length)
		for(var i = 0; i < dataset2.length; i++)
			dataset4 = dataset4.concat(dataset2[i]);
		for(var i = 0; i < dataset4.length; i++)
			if(dataset4[i] == "" || typeof(dataset4[i]) == "undefined"){
				dataset4.splice(i,1);
				i = i-1;
			}
		// var opa1=d3.scale.linear()
		// 				.domain([0,59])
		// 				.range(["hsl("+0+","+"100%"+","+"40%"+")","hsl("+60+","+"100%"+","+"40%"+")"]);
		// var opa2=d3.scale.linear()
		// 				.domain([60,69])
		// 				.range([color60,color69]);
		// var opa3=d3.scale.linear()
		// 				.domain([70,79])
		// 				.range([color70,color79]);
		// var opa4=d3.scale.linear()
		// 				.domain([80,89])
		// 				.range([color80,color89]);
		// var opa5=d3.scale.linear()
		// 				.domain([90,100])
		// 				.range([color90,color100]);
		var scale= d3.scale.linear()
						.domain([0,10])
						.range([0,22]);

		var heatMapGroup = heatmap_g.select(".g"+year)
									.append("g")
									.attr("id","everyheatmap"+year)
									.attr("class","everyheatmap")
									.attr("transform",function(d,i){return "translate("+80+","+move[year-2007]+")"});

		var group = heatMapGroup.selectAll("g.heat"+year)
					.data(dataset2)
					.enter()
					.append("g")
					.attr("class","heat"+year)
					.attr("id",function(d,i){
					return "studentHeat"+eval("data"+year)[i].name;
					})
					.attr("transform",function(d,i){return "translate("+0+","+h1*i+")"});
		
		//绘制灰色长条，统计每学学期课程数
		var rect2=heatmap_g.select(".g"+year)
						.selectAll("rect.bar"+year)
						.data(year2)
						.enter()
						.append("rect")
						.attr("class","bar"+year)
						.attr("x",function(d,i){
							var dataset = year2.slice(0,i);
							return 80+w1*d3.sum(dataset);
						})
						.attr("y",function(d){return move[year-2007]-scale(d);})
						.attr("width",5)
						.attr("height",function(d){return scale(d);})
						.style("fill","Grey");
		var year3 = year2.slice(0);
			year3.splice(0, 0, 0);
			//console.log(year3);
		var lines=heatmap_g.select(".g"+year)
					.selectAll("path.line"+year)
					.data(year3)
					.enter()
					.append("path")
					.attr("class","line"+year)
					.attr("d",function(d,i){
						var dataset=year3.slice(0,i+1);
						return line([[80+w1*d3.sum(dataset),move[year-2007]],[80+w1*d3.sum(dataset),move[year-2007]+h1*num]]);
					})
					.style("stroke",function(d,i){
						return "black";
					});

		//添加矩形统计信息
		//矩形统计信息删除
		/*heatmap_g.select(".g"+year)
			.append("g")
			.attr("class","cluster")
			.append("rect")
			.attr("x",71)
			.attr("y",move[year-2007])
			.attr("width",9)
			.attr("height",dataset.length*h1)
			.style("stroke","black")
			.style("fill","none");
		heatmap_g.select(".g"+year)
			.select("g.cluster")
			.selectAll("line")
			.data(cluster[year-2007])
			.enter()
			.append("line")
			.attr("x1",71)
			.attr("y1",function(d){
				for(var i=0;i<eval("data"+year).length;i++)
					if((+eval("data"+year)[i].name)==d){
						clusterNum[year-2007].push(i);
						return (i+1)*h1+move[year-2007];
					}
			})
			.attr("x2",80)
			.attr("y2",function(d){
				for(var i=0;i<eval("data"+year).length;i++)
					if((+eval("data"+year)[i].name)==d)
						return (i+1)*h1+move[year-2007];
			})
			.style("stroke","black")
			.style("stroke-width",2)*/
			
		var valueY = [move[year-2007],(clusterNum[year-2007][0]+1)*h1+move[year-2007],(clusterNum[year-2007][1]+1)*h1+move[year-2007]];
		//1至clusterNum[year-2007][0] 是优秀
		//(clusterNum[year-2007][0]+1) 至 clusterNum[year-2007][1] 是合格
		//(clusterNum[year-2007][1]+1) 以后是差
		var valueHeight = [(clusterNum[year-2007][0]+1)*h1,(clusterNum[year-2007][1]-clusterNum[year-2007][0])*h1,(eval("data"+year).length-2-(clusterNum[year-2007][1]+1))*h1];
		var valueColorIn = [color90to100,color70to79,color60以下];
		var valueColorOut = ["Blue", "Green", color60以下];
		for(var n = 0; n < 3; n++){
			//每学期的统计信息
			heatmap_g.select(".g"+year)
				.select("g.cluster")
				.append("rect")
				.attr("x",72)
				.attr("y",valueY[n])
				.attr("width",7)
				.attr("height",valueHeight[n])
				.style("fill",valueColorIn[n])
				.style("fill-opacity",0.3);
			//填充矩形边框
			heatmap_g.select(".g"+year)
				.select("g.cluster")
				.append("rect")
				.attr("class","back")
				.attr("x",72)
				.attr("y",valueY[n])
				.attr("width",7)
				.attr("height",valueHeight[n])
				.style("fill",valueColorOut[n])
				.style("fill-opacity",1.0);
		}

		drawHistogram_student(dataset4,year);

		/*var move = [30,135,240,330];*/
		//填充矩阵热力图
		//按行填充
		group.selectAll("rect")
			.data(function(d,i){
				//console.log(d);
				return d;
			})
			.enter()
			.append("rect")
			.attr("id",function(d){
				if(d===""){
					return "course_garde_"+"aa";
				}else{
					return "course_garde_"+d;
				}
			})
			.attr("class",function(d,j){
				//console.log(dataset3[0][j+1]);
				return dataset3[0][j+1];
			})
			.attr("x",function(d,i){
				return w1*i;
			})
			.attr("y",0)
			.attr("width",w1)
			.attr("height",h1)
			.style("fill",function(d){
				return get_rightColor(d);
			})
			.on("mouseover",function(d){
				if(!flagShowSankey){
					d3.select(this).attr("style","cursor:pointer")
								.style("fill",function(d){
									return get_rightColor(d);
								});
				}
			})
			.on("mouseout",function(d){
				d3.select(this).attr("style","cursor:default")
								.style("fill",function(d){
									return get_rightColor(d);
								});
			})
			.on("click",function(d,i){
				heatC=true;
				//矩阵热力图与平行坐标交互:点击矩阵热力图,显示某一学生的学习成绩和学业进展
				var gheatid = [];
				var dataRaw = [];
				var datasetHist = [];
				if(!flagShowSankey){
					flagHeat=true;
					if(oldYear !== "all"){
						year = oldYear;
					}
					if(oldYear === "all"||oldYear===year){
						dataRaw = eval("data"+year);
						gHeatID[year-2007].push(d3.select(this.parentNode)[0][0].id);
						for(var k = 2007; k <= 2010 ;k++)
							gheatid = gheatid.concat(gHeatID[k-2007]);
						//选取学生
						heatmap_g.select(".g"+year).selectAll("g.heat"+year)
									.filter(function(d,i){
										if(!gheatid.contains(this.id)) return d;
									})
									.selectAll("rect").attr("opacity", 0.1);
						heatmap_g.select(".g"+year).selectAll("g.heat"+year)
									.filter(function(d,i){
										if(gheatid.contains(this.id)) return d;
									})
									.selectAll("rect").attr("opacity", 1);
						//高亮选取的学生学业进展
						parallel_coor_g.select(".foreground").selectAll("path")
								.filter(function(d,i){
									if(!gheatid.contains("studentHeat"+this.id)){
										return d;
									}
								})
								.style("display","none");
						parallel_coor_g.select(".foreground").selectAll("path")
								.filter(function(d,i){
									if(gheatid.contains("studentHeat"+this.id)){
										return d;
									}
								})
								.style("display",null);
						//统计学生成绩数据
						for(var i = 0; i < dataRaw.length-2;i++){
							if(gHeatID[year-2007].contains("studentHeat"+dataRaw[i].name))
								datasetHist = datasetHist.concat(transform(dataRaw[i]).slice(1));
						}
						for(var i = 0; i < datasetHist.length; i++)
							if(datasetHist[i] == "" || typeof(datasetHist[i]) == "undefined"){
								datasetHist.splice(i,1);
							i = i-1;
						}
						heatmap_g.select("#grade"+year).select("g.histogram").remove(); //移除统计信息
						drawHistogram_student(datasetHist,year);
						console.log("gHeatID",gheatid);
						console.log("gHeatID",gHeatID);
						console.log("dataRaw",dataRaw);
						console.log("datasetHist",datasetHist);
						//gHeatID=[];
						
					}
				}
			});
		//加年级(07;08;09;10)
		heatmap_g.select("#heatmapYear"+year)
			.attr("x",50)
			.attr("y",function(d,i){
				return move[year-2007];
			})
			.text(function(d){
				return (""+year).slice(2,4)
			}) 
			.attr("opacity","1")
			.attr("style","cursor:pointer")
			.style("font-size","12px");
	}

	function get_rightColor(d){
		if(d == "") return "none";
		else if(d<60) return "hsl("+0+","+"100%"+","+"40%"+")";
		else if(d>=60&&d<=69) return opa2(d);
		else if(d>=70&&d<=79) return opa3(d);
		else if(d>=80&&d<=89) return opa4(d);
		else if(d>=90&&d<=100) return opa5(d);
	}

	function findPosition(d1,d2){
		for(var i=0;i<datacorr.length;i++){
			if(datacorr[i][0]==d1)
				for(var j=0;j<datacorr.length;j++)
					if(datacorr[j][0]==d2)
						return datacorr[i][j+1];
				}
	}

	function corr_semester(datas,datac,years,n){
		var data3=[];
		datac.splice(0,1);
		datac.removeByValue("");
		for(var i=0;i<years.length;i++){
			var data1=[];
			if(i==0){ 
				data1=datac.slice(0,years[i]);
			}
			else if(i>0){
				var c=years.slice(0,i);
				var b=d3.sum(c);
				for(var k=b;k<b+years[i];k++)
					data1.push(datac[k]);
			}
			var	data2=new Array(data1.length);
			for(var j=0;j<data1.length;j++){
				data2[j]=[];
				data2[j].push(data1[j]);
			}
			for(var j=0;j<data2.length;j++)
				for(var k=0;k<data1.length;k++){
					data2[j].push(findPosition(data1[j],data1[k]));
				}
				data1=a(data1,data2);
				data3=data3.concat(data1);
			}

			function a(datae,datacorr){
				for(var i=0;i<datacorr.length;i++)
					datacorr[i][datacorr.length+1]=i;

				function calaverage(data,i){
					var k=0,average=0;
					var	sum=data[i][datacorr.length+1];
					for(var j=1;j<datacorr.length+1;j++){
						sum+=data[j-1][datacorr.length+1];
						k++;
					}
					average=sum/(k+1);
					return average;
				}
				function myObject(position,num){
					this.position=position;
					this.num=num;

				}
				var temp=[];
				for(var j=0;j<datacorr.length;j++)
					temp.push(new myObject(datacorr[j][datacorr.length+1],j));

				for(i=0;i<datacorr.length;i++){
					var ave=calaverage(datacorr,i);
					temp[i].position=ave;
					temp.sort(function(a,b){
						return a.position-b.position;
					});

					for(var j=0;j<datacorr.length;j++)
						temp[j].position=j;
					temp.sort(function(a,b){
						return a.num-b.num;
					});
				}
				for(var i= 0;i<datacorr.length; i++)
					datacorr[i][datacorr.length+1]=temp[i].position;
				datacorr.sort(function(a,b){
					return a[datacorr.length+1]-b[datacorr.length+1];
				});
				datae=datacorr.map(function(d){return d[0]})
				return datae;
			}
			var dataf=new Array(datas.length);
			for(var i=0;i<dataf.length;i++){
				dataf[i]=[];
				dataf[i].push(datas[i][0]);
			}

			var data6=[];
			data6[0]=name;
			for(var k=1;k<data3.length+1;k++)
				data6[k]=data3[k-1];

			if(n==2007) high2007[0]=data6;
			else if(n==2008) high2008[0]=data6;
			else if(n==2009) high2009[0]=data6;
			else if(n==2010) high2010[0]=data6;

			for(var i=0;i<data3.length;i++)
				for(var j=0;j<datac.length;j++){
					if(data3[i]==datac[j])
						for(var k=0;k<dataf.length;k++)
							dataf[k].push(datas[k][j+1]);
					}
			return dataf;
	}
}