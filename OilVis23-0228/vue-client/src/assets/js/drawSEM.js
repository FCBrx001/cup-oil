function drawSEM() {
	$('#MainView');

	/*var worldCloud = main_view.append("g")
						.attr("id","wordCloud")
						.attr("transform","translate("+layout.size()[0]/2+","+(layout.size()[1]/2 + 555)+")");*/

	var width_BarChart = 360;   //SVG绘制区域的高度
    var height_BarChart = 200;  //SVG绘制区域的宽度

    var svg = main_view.append("g")
    				.attr("id","SEQ_g")
                    .attr("transform","translate(0,548)");

    var RectTooltip = d3.select("body")
                        .append("div")
                        .attr("id","yuan_RectDiv")
                        .attr("class","RectTooltip") 
                        .style("opacity",0);
   
    var color_type = d3.scale.category10();
        /*console.log(color_type);
        console.log(color_type(1));*/

    var RectColor = d3.scale.ordinal()
                        .domain(["A","B","C","E"])
                        //.range([color_type(0),color_type(1),color_type(2),color_type(3)]);
                        .range(["#d62728","#ff7f0e","#fdd0a2","#17becf"]);
    
    var LineColor = d3.scale.ordinal()
    					.domain(["teacher","student"])
    					.range(["Blue","Red"]);

    var tipsWidth_w = 8;
    var data_path = "BarChartData/CSV/BarChartData_Use_All.csv";

        svg.selectAll(".text")
            .data(["All","1-4","5-8"])
            .enter() 
            .append("text")
            .attr("class","sem_text")
            .attr("id",function(d,i){
                return "sem_text_" + d;
            })               
            .attr("transform",function(d,i){
                return "translate("+( 242 + 35 *i)+",10)";
            })
            .attr("text-anchor","left")
            .attr("font-size","10px")
            .text(function(d){
                //if(d === "5-7") return "5-8";
                return d;
            })
            .attr("style","cursor:pointer")
            .attr("opacity",function(d,i){
                if(d === "All"){
                    return 1;
                }else{
                    return 0.3;
                }
            })
            .on("click",function(d,i){
                svg.selectAll("g").remove();
                var sem_id = this.id.slice(-3);
                //console.log(sem_id);
                //console.log(this.id);
                //console.log(data_path.slice(0,-7));
                data_path = data_path.slice(0,-7) + sem_id+".csv";
                drawBarChart(data_path);
                d3.selectAll("text.sem_text").filter(function(d){
                    if(this.id.slice(-3) === sem_id){
                        d3.select(this).attr("opacity",1);
                    }else{
                        d3.select(this).attr("opacity",0.3);
                    }
                })
                d3.selectAll("rect.sem_rect").filter(function(d){
                    if(this.id.slice(-3) === sem_id){
                        d3.select(this).attr("opacity",1);
                    }else{
                        d3.select(this).attr("opacity",0.3);
                    }
                })
            });
        svg.selectAll(".rect")
            .data(["All","1-4","5-7"])
            .enter()
            .append("rect")
            .attr("class","sem_rect")
            .attr("id",function(d,i){
                /*if(d === "5-7") return "sem_rect_"+"5-8";
                else */return "sem_rect_" + d;
            })                
            .attr("fill",function(d){
                return "DarkRed";    //设置色彩
            })      
            .attr("x",function(d,i){    //设置矩形的x坐标
                return 231 + 35*i;
            })
            .attr("y",0)
            .attr("width",tipsWidth_w)    //设置矩形的宽度
            .attr("height",tipsWidth_w)
            .attr("style","cursor:pointer")
            .attr("opacity",function(d,i){
                if(d === "All"){
                    return 1;
                }else{
                    return 0.3;
                }
            })
            .on("click",function(d,i){
                svg.selectAll("g").remove();
                var sem_id = this.id.slice(-3);
                //console.log(sem_id);
                //console.log(this.id);
                //console.log(data_path.slice(0,-7));
                data_path = data_path.slice(0,-7) + sem_id+".csv";
                drawBarChart(data_path);
                d3.selectAll("text.sem_text").filter(function(d){
                    if(this.id.slice(-3) === sem_id){
                        d3.select(this).attr("opacity",1);
                    }else{
                        d3.select(this).attr("opacity",0.3);
                    }
                })
                d3.selectAll("rect.sem_rect").filter(function(d){
                    if(this.id.slice(-3) === sem_id){
                        d3.select(this).attr("opacity",1);
                    }else{
                        d3.select(this).attr("opacity",0.3);
                    }
                })
				//console.log("lineChartS",lineChartS);
				/*if(lineChartS){
					console.log("135");
					d3.select("#line_g_teacher").selectAll("circle").attr("opacity",0.8);
                    d3.select("#line_g_teacher").selectAll("path").attr("opacity",0.8);
                    d3.select("#line_g_student").selectAll("circle").attr("opacity",0.8);
                    d3.select("#line_g_student").selectAll("path").attr("opacity",0.8);		
				}*/
            });

    drawBarChart(data_path);

    function drawBarChart(path){
        d3.csv(path, function (error,data){
            data_var = [];

            //转换csv文件
            data_var.push(Object.keys(data[0]));        //获取csv文件头
            for(var i = 0; i < data.length;i++){
                data_var.push(Object.values(data[i]));  //获取csv文件中每行数据
            }
            
            var title = get_Var_Data(data_var,0,0);     //获取csv头部索引以及元素位置
            var data_tea = get_Var_Data(data_var,1,1);  //教师方程系数
           	var data_stu = get_Var_Data(data_var,3,3);  //学生方程系数
            var data_t_test_t = get_Var_Data(data_var,5,5);  //教师方程系数
            var data_t_test_s = get_Var_Data(data_var,6,6);  //教师方程系数

            var max = Math.max(data_tea[data_tea.length-1][0],data_stu[data_tea.length-1][0]);
            var min = Math.min(data_tea[data_stu.length-1][1],data_stu[data_stu.length-1][1]);

            //定义上下左右
            var padding = { top: 35, right: 55, bottom: 13, left: 35};

            var xAxisWidth = width_BarChart - (padding.left + padding.right);   //x轴宽度
            var yAxisWidth = 200 - (padding.top + padding.bottom);              //y轴长度

            //x轴比例尺(序数比例尺)
            var xPadding = 0.2;
            var xScale = d3.scale.ordinal()
                            .domain(d3.range(title[2].length))
                            .rangeRoundBands([0,xAxisWidth],xPadding);   
                            /*.domain(title[2])
                            .rangeRoundBands([0,xAxisWidth],xPadding);*/
            
                xDomain = xScale.domain();      //x定义域
                xRange = xScale.range();        //x值域
                xStep = (xRange[xRange.length - 1] - xRange[0])/(xRange.length - 1);

            //y正半轴比例尺(线性比例尺)
            var yScalePlus = d3.scale.linear()
                                .domain([0,max+1/10*max])
                                .range([0,yAxisWidth*(Math.abs(max)/(Math.abs(max)+Math.abs(min)))]);

            //y负半轴比例尺(线性比例尺)
            var yScaleMinus =  d3.scale.linear()
                                .domain([0,Math.abs(min+1/10*min)])
                                .range([0,yAxisWidth*(Math.abs(min)/(Math.abs(max)+Math.abs(min)))]);

            var t_test_max =   Math.max(Math.max(...data_t_test_t[data_t_test_t.length-1]),Math.max(...data_t_test_s[data_t_test_s.length-1]));
            var t_test_min =   Math.min(Math.min(...data_t_test_t[data_t_test_t.length-1]),Math.min(...data_t_test_s[data_t_test_s.length-1]));

            var yScale_t_test = d3.scale.linear()
                                .domain([t_test_min,t_test_max+1/10*t_test_max])
                                .range([0,yAxisWidth*(Math.abs(max)/(Math.abs(max)+Math.abs(min)))]);
           	var tTicks = [];
           		tTicks.push(t_test_min,t_test_min+(t_test_max - t_test_min)/3,t_test_min+(t_test_max - t_test_min)*2/3,t_test_max);
       		var tScale = d3.scale.ordinal()
            			.domain(tTicks)
            			.rangePoints([yAxisWidth*(Math.abs(max)/(Math.abs(max)+Math.abs(min))),0]);
            var tAxis = d3.svg.axis()
	                        .scale(tScale)
	                        .orient("right")
	                        .tickFormat(d3.format(".2f"));

            //矩形所占的宽度(包括空白),单位为像素
            var rectWidth = Math.floor(xStep/3.5);
            var xAxis_yPos = height_BarChart - padding.bottom - yAxisWidth*(Math.abs(min)/(Math.abs(max)+Math.abs(min)));

                drawAuxiliarline();

                drawBar(data_tea,xRange,rectWidth,xAxis_yPos);
                drawBar(data_stu,xRange,rectWidth,xAxis_yPos);

                drawLine(data_t_test_t,xRange,rectWidth,xAxis_yPos);
                drawLine(data_t_test_s,xRange,rectWidth,xAxis_yPos);
 
                xScale.domain(title[2])
                    .rangeRoundBands([0,xAxisWidth],xPadding);

            var yTicksUp = [];
            	yTicksUp.push(0,(max+1/10*max)/3,(max+1/10*max)*2/3,(max+1/10*max));

            var yTicksDown = [];
            	yTicksDown.push((min+1/10*min),(min+1/10*min)*2/3,(min+1/10*min)/3,0);
            
            var yScaleUp = d3.scale.ordinal()
                			.domain(yTicksUp)
                			.rangePoints([yAxisWidth*(Math.abs(max)/(Math.abs(max)+Math.abs(min))),0]);
    		var yAxisUp = d3.svg.axis()
	                        .scale(yScaleUp)
	                        .orient("left")
	                        .tickFormat(d3.format(".1f"));

	        var yScaleDown = d3.scale.ordinal()
                			.domain(yTicksDown)
                			.rangePoints([yAxisWidth*(Math.abs(min)/(Math.abs(max)+Math.abs(min))),0]);
    		var yAxisDown = d3.svg.axis()
	                        .scale(yScaleDown)
	                        .orient("left")
	                        .tickFormat(d3.format(".1f"));

            var xAxis = d3.svg.axis()           //x轴
                            .scale(xScale)
                            .orient("bottom");

                svg.append("g")
                    .attr("class","axis")
                    .attr("transform","translate(" + padding.left +"," 
                        + (height_BarChart - padding.bottom - yAxisWidth*(Math.abs(min)/(Math.abs(max)+Math.abs(min))))+")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class","axis")
                    .attr("transform","translate(" + padding.left +"," + (height_BarChart - padding.bottom - yAxisWidth)+")")
                    .call(yAxisUp);

                svg.append("g")
                    .attr("class","axis")
                    .attr("transform","translate(" + padding.left +"," 
                        + (height_BarChart - padding.bottom - yAxisWidth + yAxisWidth*(Math.abs(max)/(Math.abs(max)+Math.abs(min))))+")")
                    .call(yAxisDown);

               svg.append("g")
                    .attr("class","axis")
                    .attr("transform","translate(" + (width_BarChart - padding.right) +"," 
                        + (height_BarChart - padding.bottom - yAxisWidth)+")")
                    .call(tAxis);

            drawTips(); 

            //绘制辅助线
            //没有实现
            function drawAuxiliarline(){
                var dataset = [(max+1/10*max)*2/3,(max+1/10*max)/3,(min+1/10*min)/3,(min+1/10*min)*2/3];

                var line_g = svg.append("g")
                                .attr("transform","translate("+padding.left+",0)")
                                .attr("id","line_g");
                var linePath = d3.svg.line();

                    line_g.selectAll(".line")
                        .data(dataset)
                        .enter()
                        .append("line")
                        .attr("x1",0)
                        .attr("y1",function(d){
                            if(d >= 0){
                                return (xAxis_yPos - yScalePlus(d)) ;
                            }else{
                                return xAxis_yPos + yScaleMinus(Math.abs(d));
                            }
                        })
                        .attr("x2",xAxisWidth)
                        .attr("y2",function(d){
                            if(d >= 0){
                                return (xAxis_yPos - yScalePlus(d)) ;
                            }else{
                                return xAxis_yPos + yScaleMinus(Math.abs(d));
                            }
                        })
                        .attr("stroke","black")
                        .attr("stroke-width","1.0px")
                        .attr("fill","none")
                        .attr("opacity",0.2);
            }
/*function semEnglish(d){
	if(d==="评分")
		return "score";
	else if(d==="教师")
		return "teacher";
	else if(d==="课程")
		return "course";
	else if(d==="数量")
		return "account";
	else if(d==="学生")
		return "student";
	else 
		return "no";
	
}*/
            //绘制注释框
            function drawTips(){
                var tipsWidth = 11;
                var LineColor = d3.scale.ordinal()
    					.domain(["teacher","student"])
    					.range(["Blue","Red"]);


                var tip_g = svg.append("g")
                                .attr("transform","translate(29,17)")
                                .attr("id","tip_g");
                    tip_g.selectAll(".rect")
                        .data(["E","A","B","C"])
                        .enter() 
                        .append("rect")                
                        .attr("fill",function(d){
                            return RectColor(d);    //设置色彩
                        })      
                        .attr("x",function(d,i){    //设置矩形的x坐标
                            return 49*i;
                        })
                        .attr("y",0)
                        .attr("width",tipsWidth-2)    //设置矩形的宽度
                        .attr("height",tipsWidth-2);

                     tip_g.selectAll(".text")
                        .data(["评分","教师","课程","数量"])
                        .enter() 
                        .append("text")                
                        .attr("transform",function(d,i){
                            return "translate(" + (12 + i*49) +",7)";
                        })
                        .attr("text-anchor","left")
                        .attr("font-size","10px")
                        .text(function(d){
                            return semEnglish(d);
                        });


                	/*tip_g.selectAll(".line")
                        .data(["teacher","student"])
                        .enter() 
                        .append("line")                
                        .attr("x1",function(d,i){    //设置矩形的x坐标
                            return 6 + 40 * 4 + 18 * i + 30 * i;
                        })
                        .attr("y1",5)
                        .attr("x2",function(d,i){    //设置矩形的x坐标
                            return 6 + 40 * 4 + 18 * (i+1) + 30 * i;
                        })
                        .attr("y2",5)
                        .attr("stroke",function(d){
                			return LineColor(d);
                		})
                        .attr("stroke-width","1.3px")
                		.attr("fill","none")
                		.attr("opacity", 0.8);

                     tip_g.selectAll(".text")
                        .data(["教师","学生"])
                        .enter() 
                        .append("text")                
                        .attr("transform",function(d,i){
                            return "translate(" + (-6 + 40 * 4 + 18 * i + 32 *(i+1)) +",10)";
                        })
                        .attr("text-anchor","left")
                        .attr("font-size","12px")
                        .text(function(d){
                            return semEnglish(d);
                        });                

                var LineColor = d3.scale.ordinal()
    					.domain(["teacher","student"])
    					.range(["Blue","Red"]);
*/
//function createDiv(){
/*var tTest=d3.select("body")
            .attr("id","t-testLabel")
            .append("label")
			.html("t-test:")
			.style("left","237px")
			.style("top","581px")
			.style("font-size","5px")
			.style("position","absolute");*/
/*var linchartRect=d3.select("body")
                        .append("div")
                        .attr("id","linchartRect1")
                        .attr("class","linchartRect") 
						.style("width","11px")
						.style("height","11px")
                        .style("opacity",1)
						.style("background","url("+"imge/2.png"+")")
						.style("left","274px")
						.style("top","583px")
						.style("position","absolute")
						.style("border","1px solid black")
						.style("border-radius","3px")
						.style("style","cursor:pointer");
}
createDiv();
d3.select("div.linchartRect").on("click",function(){
	if(lineChartS){
		lineChartS=false;	
	}
	else{	
		lineChartS=true;
	}
	if(lineChartS){
	d3.select(this).style("background","url("+"imge/1.7.png"+")");
	d3.select("#line_g_teacher").selectAll("circle").attr("opacity",0.8);
    d3.select("#line_g_teacher").selectAll("path").attr("opacity",0.8);
    d3.select("#line_g_student").selectAll("circle").attr("opacity",0.8);
    d3.select("#line_g_student").selectAll("path").attr("opacity",0.8);	
	}
   else{
	d3.select(this).style("background","url("+"imge/2.png"+")");
    d3.select("#line_g_teacher").selectAll("circle").attr("opacity",0);
    d3.select("#line_g_teacher").selectAll("path").attr("opacity",0);
    d3.select("#line_g_student").selectAll("circle").attr("opacity",0);
    d3.select("#line_g_student").selectAll("path").attr("opacity",0);	
    }	
});*/
                   /* tip_g.append("rect")                
                        .attr("fill",function(d){
                            return "DarkRed";    //设置色彩
                        })      
                        .attr("x",function(d,i){    //设置矩形的x坐标
                            return 250;
                        })
                        .attr("y",0)
						.attr("rx",2)
                        .attr("opacity",0.8)
                        .attr("width",tipsWidth*4)    //设置矩形的宽度
                        .attr("height",tipsWidth);
                    tip_g.append("rect")                
                        .attr("fill","white")      
                        .attr("x",252)
                        .attr("y",2)
                        .attr("opacity",1)
                        .attr("width",tipsWidth*4-4)    //设置矩形的宽度
                        .attr("height",tipsWidth-4)
                        .attr("style","cursor:pointer")
                        .on("click",function(d){
                            if(this.getAttribute("opacity") === "1"){
                                d3.select("#line_g_teacher").selectAll("circle").attr("opacity",0.8);
                                d3.select("#line_g_teacher").selectAll("path").attr("opacity",0.8);
                                d3.select("#line_g_student").selectAll("circle").attr("opacity",0.8);
                                d3.select("#line_g_student").selectAll("path").attr("opacity",0.8);
                                d3.select(this).attr("opacity",0);
                            }else if(this.getAttribute("opacity") === "0"){
                                d3.select("#line_g_teacher").selectAll("circle").attr("opacity",0);
                                d3.select("#line_g_teacher").selectAll("path").attr("opacity",0);
                                d3.select("#line_g_student").selectAll("circle").attr("opacity",0);
                                d3.select("#line_g_student").selectAll("path").attr("opacity",0);
                                d3.select(this).attr("opacity",1);
                            }
                        });*/

					tip_g.append("text")                
                        .attr("transform",function(d){
                            return "translate(208,7)";
                        })
                        .attr("text-anchor","left")
                        .attr("font-size","10px")
                        .text("t-test:"); 
                    
            }

            /*
                绘制矩形
                dataset:传入数据集
                xRange:x轴的取值范围
                rectWidth:柱状图宽度
                xAxis_yPos:x轴绘制y坐标
            */
            function drawBar(dataset,xRange,rectWidth,xAxis_yPos){
                //这一步没什么必要
                var rect_g = svg.append("g")
                                .attr("transform","translate(0,0)")
                                .attr("id",function(d){
                                    return "rect_g_" + dataset[0][0];
                                });

                //直接用 svg 代替 rect_g 即可
                var rect = rect_g.selectAll(".rect")
                                .data(dataset[1])               //绑定数据
                                .enter()                        //获取enter部分
                                .append("rect")                 //添加rect元素,使其与绑定数组的长度一致
                                .attr("fill",function(d,i){
                                    return RectColor(dataset[3][i]);    //设置色彩
                                })
                                .attr("stroke",function(d,i){
                                    return RectColor(dataset[3][i]);    //设置色彩
                                })       
                                .attr("x",function(d,i){        //设置矩形的x坐标
                                    if(dataset[0][0] === "teacher"){
                                        return padding.left + xRange[d-1] + 2;
                                    }else{
                                        return padding.left + xRange[d-1] + 2 + rectWidth + 3;
                                    }
                                })
                                .attr("y",function(d,i){        //设置矩形的y坐标
                                    if(dataset[2][i] == 0){
                                        return xAxis_yPos - 1.5;
                                    }else if(dataset[2][i] > 0){
                                    	//console.log(xAxis_yPos - yScalePlus(dataset[2][i]));
                                        return xAxis_yPos - yScalePlus(dataset[2][i]);
                                    }else{
                                        return xAxis_yPos;
                                    }
                                })
                                /*.attr("opacity",function(d,i){
                                    if(dataset[0][0] === "teacher"){
                                        return 0.7;
                                    }else{
                                        return 1;
                                    }
                                })*/
                                .attr("width",rectWidth)       //设置矩形的宽度
                                .attr("height",function(d,i){     //设置矩形的高度
                                    if(dataset[2][i] == 0){
                                        return 1.5;
                                    }else if(dataset[2][i] > 0){
                                        return yScalePlus(dataset[2][i]);
                                    }else{
                                        return yScaleMinus(Math.abs(dataset[2][i]));
                                    }
                                })
                                .attr("stroke",function(d,i){
                                    if(dataset[0][0] === "teacher"){
                                        return "black";
                                    }else{
                                        //return RectColor(dataset[3][i]);
                                    }
                                    //return "black";
                                })
                                .attr("stroke-width","0.75px")
                                .attr("style","cursor:pointer")
                                .on("mousemove",function(d,i){
                                	var item;
                                	if(dataset[0][0] === "teacher") item = "teacher Eq";
                                	else item = "student Eq";
                                    d3.select(this)
                                        .attr("stroke",RectColor(dataset[3][i]))
                                        .attr("stroke-width","4.5px");
                                    d3.select("div.RectTooltip")
                                        .html(item+"</br>"+"coefficient:"+dataset[2][i]+"</br>")
                                        .style("left", (d3.event.pageX + 15) + "px")
                                        .style("top", (d3.event.pageY - 2) + "px")
                                        .style("opacity",1);
                                })
                                .on("mouseout",function(d,i){
                                    d3.select("div.RectTooltip").style("opacity", 0.0);
                                    document.getElementById("yuan_RectDiv").innerHTML = "";
                                    d3.select(this).attr("stroke-width","0.75px")
                                                    .attr("stroke",function(d,i){
                                                        if(dataset[0][0] === "teacher"){
                                                            return "black";
                                                        }/*else{
                                                            return RectColor(dataset[3][i]);
                                                        }*/
                                                        //return "black";
                                                    });
                                });
            }

            function drawLine(data_t_test,xRange,rectWidth,xAxis_yPos){
            	var rect_g = svg.append("g")
                                .attr("transform","translate(0,0)")
                                .attr("class","t_test_g")
                                .attr("id",function(d){
                                    //console.log("line_g_" + data_t_test[0][0]);
                                    return "line_g_" + data_t_test[0][0];
                                });

                var linePath = d3.svg.line()
                					.x(function(d,i){
                						if(data_t_test[0][0] === "teacher"){
                                        	return padding.left + xRange[data_t_test[1][i]-1] + 2 + rectWidth/2;
                                        }else{
                                            return padding.left + xRange[data_t_test[1][i]-1] + 2 + rectWidth/2 + rectWidth + 3;
                                        } 
                					})
                					.y(function(d,i){        //设置矩形的y坐标
                                        return xAxis_yPos - yScale_t_test(d);
                                    });
            	    rect_g.append("path")
                		.attr("d",linePath(data_t_test[data_t_test.length - 1]))
                		.attr("stroke",function(){
                			//console.log(data_t_test[0][0]);
                			return LineColor(data_t_test[0][0]);
                		})
                		.attr("stroke-width","1.3px")
                		.attr("fill","none")
                		.attr("opacity", 0);

                	rect_g.selectAll("circle")
						.data(data_t_test[data_t_test.length - 1])
						.enter()
						.append("circle")
						.attr("cx",function(d,i){
							if(data_t_test[0][0] === "teacher"){
                            	return padding.left + xRange[data_t_test[1][i]-1] + 2 + rectWidth/2;
                            }else{
                                return padding.left + xRange[data_t_test[1][i]-1] + 2 + rectWidth/2 + rectWidth + 3;
                            } 
						})
						.attr("cy",function(d){
							return xAxis_yPos - yScale_t_test(d);
						})
						.attr("r",4)
                        .attr("style","cursor:pointer")
						.attr("fill",function(d,i){
                            return "Green";
						})
                        .attr("opacity", 0)
                        .attr("stroke","white")
                        .attr("stroke-width","1px")
                        .on("mousemove",function(d,i){
                            if(this.getAttribute("opacity") === "0.8"){
                                d3.select(this)
                                    .attr("stroke-width","3px");
                                d3.select("div.RectTooltip")
                                    .html("t-test:"+d)
                                    .style("left", (d3.event.pageX + 15) + "px")
                                    .style("top", (d3.event.pageY - 2) + "px")
                                    .style("opacity",1);
                            }
                        })
                        .on("mouseout",function(d){
                            d3.select("div.RectTooltip").style("opacity", 0.0);
                            document.getElementById("yuan_RectDiv").innerHTML = "";
                            d3.select(this).attr("stroke-width","0px");
                        });
    		}
        });
    }

    

    //获取元素的系数
    /*
        [
            ["title/teacher/student"],  标记
            [], 系数索引
            [], 系数
            [], 显著性
            [max,min]   最大值最小值
        ]
        data_v: 系数矩阵数据集
        idx_b:起始位置
        idx_e:结束位置
    */
    function get_Var_Data(data_v,idx_b,idx_e){	
        firstItem = data_v[idx_b][0];
        var idx = [];
        var par_var = [];
        var data_e = [];
        if(firstItem === "variate"){
            var title = [];
            title.push(["title"]);

            for(var i = 1; i < data_v[0].length; i++){
                idx.push(i);
            }
            title.push(idx);
            title.push(data_v[0].slice(1));

            return title;
        }else{
        	if(firstItem.slice(-1) === "T"){
                data_e.push(["teacher"]);
            }else{
                data_e.push(["student"]);
            }

            idx = [];
            max_min = [];
            max = 0;
            min = 0;
            if(firstItem === "t_test_T"||firstItem === "t_test_S"){
                for(var i = idx_b ; i <= idx_e; i = i + 2 ){
                    data_mid = [];
                    for(var j = 1; j < data_v[i].length; j++){
                        if(data_v[i][j] !== ""){
                            if(i === idx_b){
                                idx.push(j);
                            }
                            data_mid.push(Math.abs(Number(data_v[i][j])));
                        }   
                    }
                    if(i === idx_b){
                        data_e.push(idx);
                    }
                    data_e.push(data_mid);
                    return data_e;
                }
            }else{
                for(var i = idx_b ; i <= idx_e; i = i + 2 ){
                    data_mid = [];
                    data_sign_t = [];
                    for(var j = 1; j < data_v[i].length; j++){
                        if(data_v[i][j] !== ""){
                            if(i === idx_b){
                                idx.push(j);
                            }
                            data_mid.push(Number(data_v[i][j]));
                            data_sign_t.push(data_v[i+1][j])
                        }   
                    }
                    if(i === idx_b){
                        data_e.push(idx);
                    }
                    max_min.push(Math.max(...data_mid));
                    max_min.push(Math.min(...data_mid));
                    data_e.push(data_mid);
                    data_e.push(data_sign_t);
                    data_e.push(max_min);
                }
                return data_e;
            }
        } 
    }
}