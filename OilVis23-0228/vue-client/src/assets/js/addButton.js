function DrawButton(){
	$('#ButtonView');

	//添加三个底色按钮
	/*button_g.append("rect")
			.attr("id","SK_to_PL_Button_A")
			.attr({
				"x":0,
				"y":-10,
				"width":60,
				"height":20,
				"rx":5,
				"ry":5
			})
			.style({
				"fill":"gold",
				"opacity":0.7
			});

	button_g.append("rect")
			.attr("id","linkNodeButton_A")
			.attr({
				"x":0,
				"y":30,
				"width":60,
				"height":20,
				"rx":5,
				"ry":5
			})
			.style({
				"fill":"red",
				"opacity":0.7
			});

	button_g.append("rect")
			.attr("id","Per_to_Sum_Button_A")
			.attr({
				"x":0,
				"y":70,
				"width":60,
				"height":20,
				"rx":5,
				"ry":5
			})
			.style({
				"fill":"Green",
				"opacity":0.7
			});
*/
/*button_g.append("rect")
			.attr("id","WorldCloud_to_SEM_Button_A1")
			.attr({
				"x":-2,
				"y":108,
				"width":84,
				"height":24,
				"rx":5,
				"ry":5
			})
			.style({
				"fill":"#d7d7d7",
				"opacity":0.7
				
			});*/
	/*button_g.append("rect")
			.attr("id","WorldCloud_to_SEM_Button_A")
			.attr({
				"x":0,
				"y":110,
				"width":80,
				"height":20,
				"rx":5,
				"ry":5
			})
			.style({
				"fill":"#39ae52",
				"opacity":0.7
				
			})
			 .style("storke-width", "2") //宽度
          .style("stroke","#41bf5c")//颜色;*/
/*

*/
	//添加按钮文字
	/*button_g.append("text")
			.attr("id","SK_to_PL_Button_Text")
			.attr("font-size","14px")
			.attr("x","2")
			.attr("y","5")
			.text("平行坐标");

	button_g.append("text")
			.attr("id","linkNodeButton_Text")
			.attr("font-size","14px")
			.attr("x","2")
			.attr("y","45")
			.text("学生流量");

	button_g.append("text")
			.attr("id","Per_to_Sum_Button_Text")
			.attr("font-size","14px")
			.attr("x","8")
			.attr("y","85")
			.text("每学期");
*/
	/*button_g.append("text")
			.attr("id","WorldCloud_to_SEM_Text")
			.attr("font-size","10px")
			.attr("x","5")
			.attr("y","124")
			.style("fill","#ffffff")
			.text("Course Theme");*/
	//桑基图与平行坐标切换
	/*button_g.append("rect")
			.attr("id","SK_to_PL_Button_B")
			.attr({
				"x":0,
				"y":-10,
				"width":60,
				"height":20,
				"rx":5,
				"ry":5
			})
			.style({
				"fill":"gold",
				"stroke-opacity":0,
				"opacity":0,
				"cursor":"pointer"
			})
			.on("click",function(){
				overall_svg.select("#HeatMap").selectAll("text").attr("opacity","1");
				//切换采用的是移除g元素
				if(flagShowSankey){
					//dataPathPC = "data/ParallelCoorData/sum_GPA_all.csv";
					//console.log(dataPathSK.slice(-8,-5));
					dataPathPC = "data/ParallelCoorData/"+dataPathSK.slice(-8,-5)+"_GPA_all.csv";
					drawParallelCoordinates(dataPathPC);
					overall_svg.selectAll("g").select("#SanKey").remove();
					button_g.select("#SK_to_PL_Button_Text")
							.attr("x","8")
							.attr("y","5")
							.text("桑基图");
					/*if(nameCour.length !== 0){
						heatmap_g.selectAll("text").filter(function(d){
							console.log(this);
                            if((this.getAttribute("opacity")==="1")){
                            	console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                                highlightCourse(nameCour,parseInt(this.id.slice(-4)),true);
                                showStuAcademicProPCP(nameCour,parseInt(this.id.slice(-4)),true,nameCour,flagShowSankey);
                                
                            }
                            if(this.getAttribute("opacity")==="0.295"){
                            	console.log("ddddddddddddddddddddddddddddddd");
                            }
                        });
					}
					flagShowSankey = false;
				}
				else{
					for(var year = 2007; year <= 2010; year++){
						showHeatMapScore(year,year);
						heatmap_g.select("#grade"+year)
									.selectAll("rect")
									.attr("opacity", 1);
					}
					button_g.select("#SK_to_PL_Button_Text")
							.attr("x","2")
							.attr("y","5")
							.text("平行坐标");
					/*dataPathSK = "data/SankeyData/AcademicProgressPathsum.json";
					dataPathSK = "data/SankeyData/AcademicProgressPath"+dataPathPC.slice(22,25)+".json";
					drawSankey(dataPathSK);
					overall_svg.selectAll("g").select("#ParallelCoordinates").remove();
					overall_svg.selectAll("g").selectAll(".highlightCourse").remove();
					flagShowSankey = true;
				}
				for(var k = 2007; k <= 2010; k++){
					gHeatID[k-2007] = [];
				}
			});

	//节点连接图模式的切换
	button_g.append("rect")
			.attr("id","linkNodeButton_B")
			.attr({
				"x":0,
				"y":30,
				"width":60,
				"height":20,
				"rx":5,
				"ry":5
			})
			.style({
				"fill":"red",
				"stroke-opacity":0,
				"opacity":0,
				"cursor":"pointer"
			})
			.on("click",function(d){
				var selected_courName = [];
				var selected_circleId = [];
				if(!ifStudentNum){
					button_g.select("#linkNodeButton_Text")
							.attr("x","8")
							.attr("y","45")
							.text("相关性");
				}
				if(ifStudentNum){
					button_g.select("#linkNodeButton_Text")
							.attr("x","2")
							.attr("y","45")
							.text("学生流量");
				}
				ifStudentNum = !ifStudentNum;
				nameCour = [];
    			nodeID = [];
    			commonCour = [];
    			heatmap_g.selectAll("g").selectAll(".highlightCourse").remove();
    			overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path").style("display",null);
    			//parallel_coor_g.select(".foreground").selectAll("path").style("display",null);
    			for(var year = 2007; year <= 2010; year++){
					heatmap_g.selectAll("text").filter(function(d){
                        if((this.getAttribute("opacity")==="1" || this.getAttribute("opacity")==="0.295") && parseInt(this.id.slice(-4)) === year){
							showHeatMapScore(year,year);
							heatmap_g.select("#grade"+year).selectAll("rect").attr("opacity", 1);
							heatmap_g.select("#heatmapYear"+year).attr("opacity", 1);
                        }
                    });
				}

				selected_courName = get_selected_courseName(ifclick_CourseTree,ifClick_WordCloud);
				selected_circleId = get_selected_courseID(selected_courName,[]);
				show_rigth_LineType_NodeLink(ifStudentNum);
				show_useful_courseCircle((ifclick_CourseTree||ifClick_WordCloud),ifStudentNum,false,selected_circleId,selected_courName);
				for(var k = 2007; k <= 2010; k++){
					gHeatID[k-2007] = [];
				}
			});

	//每学期到总年级的切换
	button_g.append("rect")
			.attr("id","Per_to_Sum_Button_B")
			.attr({
				"x":0,
				"y":70,
				"width":60,
				"height":20,
				"rx":5,
				"ry":5
			})
			.style({
				"fill":"Green",
				"stroke-opacity":0,
				"opacity":0,
				"cursor":"pointer"
			})
			.on("click",function(d){
				var strsub = null;
					strsub = dataPathPC.slice(22,25);
				if(flagSumToPer){
					dataPathPC = dataPathPC.slice(0,22)+"per" + dataPathPC.slice(25);
					dataPathSK = dataPathSK.slice(0,36)+"per" + dataPathSK.slice(39);
					flagSumToPer = false;
					button_g.select("#Per_to_Sum_Button_Text")
							.attr("x","8")
							.attr("y","85")
							.text("总学期");
				}else{
					dataPathPC = dataPathPC.slice(0,22)+"sum" + dataPathPC.slice(25);
					dataPathSK = dataPathSK.slice(0,36)+"sum" + dataPathSK.slice(39);
					button_g.select("#Per_to_Sum_Button_Text")
							.attr("x","8")
							.attr("y","85")
							.text("每学期");
					flagSumToPer = true;
				}
				/*console.log(strsub);
				console.log(dataPathPC+"\n" + dataPathSK);
				//切换采用的是移除g元素
				if(flagShowSankey){
					overall_svg.selectAll("g").select("#SanKey").remove();
					drawSankey(dataPathSK);
					flagShowSankey = true;
				}
				else{
					overall_svg.selectAll("g").select("#ParallelCoordinates").remove();
					overall_svg.selectAll("g").selectAll(".highlightCourse").remove();
					drawParallelCoordinates(dataPathPC);
					flagShowSankey = false;
				}
			});
*/
	//每学期到总年级的切换
	/*button_g.append("rect")
			.attr("id","WorldCloud_to_SEM_Button_B")
			.attr({
				"x":0,
				"y":110,
				"width":60,
				"height":20,
				"rx":5,
				"ry":5
			})
			.style({
				"fill":"#6f6f6f",
				"stroke-opacity":0,
				"opacity":0,
				"cursor":"pointer"
			})
			.on("click",function(d){
				var text_innerHTML = button_g.select("#WorldCloud_to_SEM_Text")[0][0].innerHTML;
				if(text_innerHTML === "Course Theme"){
					button_g.select("#WorldCloud_to_SEM_Text")
							.attr("x","14")
							.attr("y","125")
							.text("SEM Graph");
					
					d3.select("div.linchartRect").style("visibility","visible");
					overall_svg.selectAll("g").select("#wordCloud").remove();
					
					drawSEM();
				}else{
					button_g.select("#WorldCloud_to_SEM_Text")
							.attr("x","5")
							.attr("y","125")
							.text("Course Theme");
					overall_svg.selectAll("g").select("#SEQ_g").remove();
					d3.select("div.linchartRect").style("visibility","hidden");
					drawWordCloud();
				}
			});*/
}