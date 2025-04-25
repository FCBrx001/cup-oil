function drawWordCloud(){
	$('#MainView');
	var pathWord = "data/dataCourseCluster.json";
	var data  = [];
	var old_cluName = "";
	var old_fill;
	var LikeNode_node = [];
	var tooltip_wordCloud = d3.select("body").append("div")
									.attr("class", "tooltip_wc")
									.attr("id","tooltip_wordCloud")
									.style("opacity", 0);
		tooltip_wordCloud.append("svg")
							.attr("class","histogram")
							.attr("width",0)
							.attr("height",0);

	var color2007="hsl(0,85%,35%)",color2008="hsl(45,85%,35%)",
		color2009="hsl(90,85%,35%)",color2010="hsl(135,85%,35%)";
	
	var fill = d3.scale.category20();
	var ordinal = d3.scale.ordinal()
                        .domain([2,3,4,9,10])
                        .range([10,15,20,25,30]);
						//.range([10,15,20,22,26]);.domain([2,3,4,9,10])
						//.range([10,15,20,22,26]);.range([10,15,20,22,26]);
                        //.range([10,15,20,35,40]);

	var layout = d3.layout.cloud()
						.size([340,190]);

	var worldCloud = main_view.append("g")
						.attr("id","wordCloud")
						.attr("transform","translate("+layout.size()[0]/2+","+(layout.size()[1]/2 + 555)+")");
						//.attr("transform","translate(165,652)");
/*

123 0.6795546036318458
drawWordCloud.js:51 123 0.38922345161932714
drawWordCloud.js:51 123 0.6656358708643515
drawWordCloud.js:51 123 0.11808536573069439
drawWordCloud.js:51 123 0.7168811577577634
drawWordCloud.js:51 123 0.6559981174368321
drawWordCloud.js:51 123 0.03124154712260574
drawWordCloud.js:51 123 0.38900026843084645
drawWordCloud.js:51 123 0.503411280321034
drawWordCloud.js:51 123 0.4365755974014349
drawWordCloud.js:51 123 0.04319320808672367
*/
var t=[0.6795546036318458,0.38922345161932714,0.6656358708643515,0.11808536573069439,0.7168811577577634,0.6559981174368321,0.03124154712260574,0.38900026843084645,0.503411280321034,0.4365755974014349,0.04319320808672367];
	d3.json(pathWord, function(error,json){
		if(error) console.log(error);
		data = json.Cluster;
		data_WC = json.Cluster;
		//console.log(data_WC);

		var data_clu = data.map(function(d){
			console.log("d.course_Num",d.course_Num);
			console.log("d.courseCluster",d.courseCluster);
			return {text:themeEnglish(d.courseCluster),size:ordinal(d.course_Num)};
		});
		layout.words(data_clu)
				.padding(0)
				.rotate(function(d,i){
					return ~~(t[i]*2)*90;
				})
				.font("Impact")
				.fontSize(function(d){
					return d.size;
				})
				.on("end",draw);

		layout.start();
		LikeNode_node = getNodeInfo_LinkNode();
		//sem_Info = getSemesterInfo(data_cor,LikeNode_node);
	});
	function themeEnglish(d){
	if(d === "程序设计") return "Program design";
	if(d === "应用技术") return "Applied technology";
	if(d === "数据库") return "Database";
	if(d === "计算机组成") return "Computer composition";
	if(d === "计算机网络") return "Computer network";
	if(d === "操作系统") return "Operating system";
	if(d === "基础理论") return "Basic theory";
	if(d === "计算机硬件") return "Computer hardware";
	if(d === "工程实习") return "Engineering practice";
	if(d === "数据结构") return "Data structure";
	if(d === "导学课程") return "Guidance course";
	
}

	function draw(words){
		worldCloud.selectAll("text")
			.data(words)
			.enter()
			.append("text")
			.attr("id",function(d,i){
				return "cluster_" + d.text;
			})
            .attr("style","cursor:pointer")
			.style("font-size",function(d){
				return d.size +"px";
			})
			.style("fill",function(d,i){  //填充颜色
				return fill(i);
			})
			.style("font-family","Impact")//字体
			.attr("text-anchor","middle") //防止字重合
			.attr("transform",function(d){
				//console.log(d.x);
				//console.log(d.y);
				//console.log(d.rotate);
				return "translate("+[d.x,d.y]+")rotate("+d.rotate+")";

			})
			.text(function(d){
				//console.log(d.text);
				
				return d.text;
			})
			.on("click",function(d){
				var clu_name = d.text;
				var selected_courName = [];
				var selected_circleId = [];

				if(old_cluName === "" || old_cluName !== d.text){
					if(old_cluName !== ""){
						worldCloud.selectAll("text").style("fill",function(d,i){
							if(d.text === old_cluName) return old_fill;
							else return this.style.fill;
						})					
					}
                    ifClick_WordCloud = true;
                    filter_selected_flag = true;
                    nameCour = [];
                    nodeID = [];
                    commonCour = [];
                    old_cluName = d.text;
                    old_fill = this.style.fill;
					d3.select(this).style("fill","black");
                }
                else{
                    if(old_cluName !== ""){
						worldCloud.selectAll("text").style("fill",function(d,i){
							if(d.text === old_cluName) return old_fill;
							else return this.style.fill;
						})					
					}
                    ifClick_WordCloud = false;
                    old_cluName = "";
                    old_fill = "";
                }

        		selected_courName = get_selected_courseName(ifclick_CourseTree,ifClick_WordCloud);
				selected_circleId = get_selected_courseID(selected_courName,[]);
				show_useful_courseCircle((ifclick_CourseTree||ifClick_WordCloud),ifStudentNum,false,selected_circleId,selected_courName);
				selected_node=selected_circleId;
				selected_circleId = [];
				console.log("selected_node",selected_node);
				/*if(ifClick_WordCloud){
					tooltip_wordCloud.select("svg").selectAll("path").remove();
					tooltip_wordCloud.select("svg").selectAll("text").remove();
					tooltip_wordCloud.select("svg").selectAll("rect").remove();
					tooltip_wordCloud.select("svg").selectAll("g").remove();
					drawDetail_WC(clu_name);
				}else{
					tooltip_wordCloud.select("svg").attr("width",0).attr("height",0);
					tooltip_wordCloud.style("opacity", 0.0);
				}*/
			});
	}

	function drawDetail_WC(clu_name){
		var course_index = [];		//存储某个类别中课程在data_cor(读取correlation.csv)索引
		var course_name = [];		//存储某个类别中课程名字
		var course_name_grade = [];	//存储课程名字和对应的年级
		var course_SorceSets = [];	//存储某一个课程的学生成绩集合
		var course_DataCorr = [];	//存储所有课程的相关性
		var course_nowCorr = [];	//存储当前课程的相关性
		var course_str = []; 		//这个我也不太清楚是干啥的

		//选取提取课程聚类包含的课程和索引
		for(var i = 0; i < data.length; i++){
			if(data[i].courseCluster === clu_name){
				course_index = data[i].cour_index;
				course_name = data[i].courseName;
			}
		}
		course_name_grade = get_Course_and_Grade(course_name);	//cou3
		course_SorceSets = get_score_Set(course_name_grade);	//datasetHis2
		course_DataCorr = get_cor_Matrix();						//datacorr
		course_str = get_str(course_DataCorr,course_name_grade);
		course_nowCorr = get_courseCor(course_DataCorr,course_name,course_str);	//cor

		//设定SVG长度、宽度
		tooltip_wordCloud.select("svg")
					.attr("width",220).attr("height",function(){
						return 30 + 70*course_name.length + 10;
					});

		tooltip_wordCloud.select("svg")
					.append("g")
					.attr("class","flag")
					.attr("transform","translate(0,5)");

		tooltip_wordCloud.style("opacity",1);

		console.log(course_SorceSets,course_name_grade,i);

		for(var i = 0; i < course_name_grade.length; i++){
			Histogram_TM(course_SorceSets[i],course_name_grade[i].grade,course_name_grade[i].course,i);
		}

	}

	function Histogram_TM(dataset,grade,courseName,flag){
		var first=0;
		for(var i=0;i<dataset.length;i++){
			for(var j=0;j<grade.length;j++){
				if(dataset[i][0]==grade[j]&&first==0){
					drawHistogram(dataset[i],flag,true,courseName);
					first=1;
				}
				else if(dataset[i][0]==grade[j]&&first==1){
					drawHistogram(dataset[i],flag,false,courseName);
					first=1;
				}
			}
		}
	}

	function drawHistogram(dataset,flag,firsttime,str){
		var dataset2 = dataset.slice(1,dataset.length);

		for(var i = dataset2.length-1 ; i > -1 ; i--){
			if(dataset2[i] == "") dataset2.pop();
		}
		var left = 10;
		
		var rangeMin = 0, rangeMax = 100;
		var height = 70, width = 120;
		var histogram = d3.layout.histogram()
								.range([rangeMin,rangeMax])
								.bins([0,60,65,70,75,80,85,90,95,100,105])
								.frequency(false);
		var hisData = histogram(dataset2);
		var xAxisWidth = 200,xTicks = hisData.map(function(d){return d.x});
		var xScale = d3.scale.ordinal()
					.domain(xTicks)
					.rangePoints([0,xAxisWidth],0.5);
		var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.tickFormat(d3.format(".0f"));
			tooltip_wordCloud.select("g.flag").append("g")
					.attr("class","axis")
					.attr("transform","translate("+left+","+(flag+1)*height+")")
					.call(xAxis);

		var yAxisWidth = 120;
		var yScale = d3.scale.linear()
						.domain([0,1])
						.range([0,yAxisWidth]);
		var lineGenerator = d3.svg.line()
								.x(function(d){return xScale(d.x)})
								.y(function(d){return height-yScale(d.y)})
								.interpolate("basis");

		var gLine = tooltip_wordCloud.select("g.flag").append("g")
							.attr("transform","translate("+left+","+0+")");

			gLine.append("path")
					.attr("class","linePath")
					.attr("transform","translate("+0+","+(flag)*height+")")
					.attr("d",lineGenerator(hisData))
					.attr("stroke",eval("color"+dataset[0]))
					.attr("stroke-width","3px")
					.attr("fill","none");

		// 保证text绘制过程中，每次只绘制过一次
		var flag_text_year = 0;
		for(flag_text_year = 0; flag_text_year < d3.selectAll("text.yearText")[0].length ; flag_text_year++)
			if(d3.selectAll("text.yearText")[0][flag_text_year].textContent==dataset[0]) break;
		if((flag_text_year == 0 && d3.selectAll("text.yearText")[0].length ==0 )||
			flag_text_year == d3.selectAll("text.yearText")[0].length){
			gLine.append("rect")
				.attr("x",function(){
					return (dataset[0]-2007)*35+20;
				})
				.attr("y",function(){return 0;})
				.attr("width",20)
				.attr("height",10)
				.style("fill",eval("color"+dataset[0]));

			gLine.append("text")
				.attr("class","yearText")
				.attr("font-size",12)
				.attr("dx",(dataset[0]-2007)*35+20)
				.attr("dy",function(){return 25;})
				.text(dataset[0])
				.style("fill","Black");
		}

		var flag_text_name = 0;
		for(flag_text_name = 0; flag_text_name < d3.selectAll("text.nameText")[0].length ; flag_text_name++){
			var rightCourseName = getRightName(str)
			if(d3.selectAll("text.nameText")[0][flag_text_name].textContent == rightCourseName) break;
		}
		if((flag_text_name == 0 && d3.selectAll("text.nameText")[0].length == 0 )||
			flag_text_name == d3.selectAll("text.nameText")[0].length)
			gLine.append("text")
				.attr("class","nameText")
				.attr("text-anchor", "middle")
				.attr("font-size",12)
				.attr("dx",100)
				.attr("dy",function(){return (flag+1)*height + 30;})
				.text(getRightName(str))
				.style("fill","Black");
	}
}