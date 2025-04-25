function drawNodeLinkGraph(year){
    $('#MainView');
    $('#ParallelCoordinates');
    $('#OverallSvg');
    var sum = function(x,y){ return x+y;};　　//求和函数
    var square = function(x){ return x*x;};　　//数组中每个元素求它的平方
    var compare = function (x, y) {//比较函数
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    }

    var width_node_link = 820;
    var height_node_link = 315;
    var flagClick = true;
	var flagDetailA=false;
	var flagDetailC=false;
    var oldCourse = undefined;
    var oldColor = undefined;
    var selected_course_name = 0;

    var student_num = [44,45,39,34];

    var xAxisWidth = 200;
    /*var rect_width = 6,
        rect_height = 1.8;*/

    var color = ["Blue","Green","Red"];
    var color必修="hsl(90,100%,50%)",color选修="hsl(270,100%,50%)",
        color必修理论="hsl(45,100%,50%)",color必修实践="hsl(135,100%,50%)",
        color选修理论="hsl(315,100%,50%)",color选修实践="hsl(225,100%,50%)",
        color必修理论低学分="hsl(22.5,100%,50%)",color必修理论高学分="hsl(67.5,100%,50%)", 
        color必修实践低学分="hsl(157.5,100%,50%)",color必修实践高学分="hsl(112.5,100%,50%)",
        color选修理论低学分="hsl(337.5,100%,50%)",color选修理论高学分="hsl(292.5,100%,50%)", 
        color选修实践低学分="hsl(202.5,100%,50%)",color选修实践高学分="hsl(247.5,100%,50%)";

    var color2007="hsl(0,85%,35%)",color2008="hsl(45,85%,35%)",
        color2009="hsl(90,85%,35%)",color2010="hsl(135,85%,35%)";

    var this_courseName ;
    var this_courseAttr ;
    var useful_courName  ; 
    var stu_IdSco_info ;
    var this_color ;
    var use_nodeID ;
    var tooltip_LinkNode = d3.select("body").append("div")
                                    .attr("class", "tooltip_ln")
                                    .attr("id","tooltip_LinkNode")
                                    .style("opacity", 0);
        tooltip_LinkNode.append("svg")
                            .attr("class","histogram")
                            .attr("width",0)
                            .attr("height",0);
     var semesterText=["1","2","3","4","5","6","7","8"];
    d3.csv("data/correlation.csv", function (error,data) {
        // console.log(data);
    	if(error) console.log(error);
        var threshold = d3.scale.threshold()
                        .domain([0.6,0.65,0.7,0.75,0.8])
                        .range([0.2,0.5,1.5,2.5,3.5,4.5]);

        var dataRaw = eval("data"+year);
        var datasetCourse_Arc = dealRawScore(dataRaw);

    	var len_data = data.length;     //存储csv长度
    	var name_course = [];			//存储课程名字
    	var info_data = [];		        //存储课程相关性
        var info_semester = [];         //存储课程学期
        var info_course_attr = [];      //存储课程属性
    	var num_cor_info_score = [];	//存储相关课程个数,没啥用,什么鬼
    	var time_info = []; 			//存储时间个数
    	var centre_point = [];			//存储圆心坐标
        var common_course_name = [];    //存储公共课程名
        var common_course_index = [];   //存储公共课程索引
        var course_info_by_semester=[]; //按学期获取的课程索引等信息
        var info_node_link = {
        		"nodes":[],
        		"links":[],
                "links_StuNum":[]
        	};			//存储节点连接图的信息

        var course_info = [];  //存储课程信息{courseIndex:1,semester:'1',courseName:'courseName'}
        var course_index = []; //存储课程索引
        var centre_point = []; //存储圆心坐标

    	var left = 30;
    	var right = 30;
    	var top = 10;
    	var bottom = 10;
    	var width = width_node_link - left - right;
    	var height = height_node_link - top - bottom;
    	var linePath = d3.svg.line()

        var termPadding = 10;
        var termWidth = (width_node_link - termPadding*7)/8;
        var termColor = "yellow";

	   var group = main_view.append("g")
                        .attr("id", "NodeLinkGraph")
						.attr("transform", "translate(" + 350+ "," + 425 + ")");
	
       var group=main_view.select("#NodeLinkGraph");
            name_course = getCourseName(data,len_data);
            info_data = getInfoData(data,name_course,len_data);
            info_semester = getInfoSemester(name_course,info_data,len_data);
            info_course_attr =  getCourseAttitude(info_data,name_course,len_data);
            num_cor_info_score = getNumCor(info_data,name_course);

        var temp_array = commonCourseIndex(info_semester,name_course);  //存储公共课程索引和对应课程名称
            common_course_index = temp_array[0];
            common_course_name = temp_array[1];

        var info = computeInfo(info_semester,info_data,name_course,len_data,year);
            course_info = info[0];
            course_index = info[1];
            time_info = info[2];

            course_info  = resortNode(time_info,course_info);
            centre_point = computePointCenter(time_info,height,termWidth,termPadding);
            info_node_link.nodes = computeNode(course_info,name_course,centre_point,datasetCourse_Arc,common_course_name);
        	info_node_link.links = computeLink(info_data,info_node_link.nodes);

            // console.log("course_info",course_info);
            // console.log("info_node_link.links",info_node_link.links);
            // console.log("centre_point",centre_point);
            // console.log("info_node_link.nodes",info_node_link.nodes);
            // console.log("info_node_link.links",info_node_link.links);
            temp_array = computeLinkStuNum(info_node_link.nodes,name_course,year,time_info,course_info);
            info_node_link.links_StuNum = temp_array[0];
        var courseName=d3.select("body").append("div").attr("id","courseNameRect").attr("class","courseRectDiv").style("opacity",0);
        var maxStudentNum = Math.max(...datasetCourse_Arc[2]);
        var minStudentNum = Math.min(...datasetCourse_Arc[2]);
        var rScale = d3.scale.linear().domain([minStudentNum,maxStudentNum]).range([10,14]);

        var max_StuNum = Math.max(...temp_array[1]);
        var min_StuNum = Math.min(...temp_array[1]);
        var widthScale = d3.scale.linear().domain([min_StuNum,max_StuNum]).range([1,5]);

        var arcPathA = d3.svg.arc().innerRadius(5);

        var arcPathB = d3.svg.arc();
        info_node_link1=info_node_link;
		
        //绘制学期
        var semester = group.selectAll("rect")
                        .data(time_info)
                        .enter()
                        .append("rect")
						.attr("class","semesterBg")
                        .attr("x",function(d,i){
                            return 0 + i*termWidth + (i-1)*termPadding;
                        })
                        .attr("y",0)
                        .attr("width",termWidth)
                        .attr("height",height_node_link)
                        .style("fill",termColor)
                        .style("fill-opacity",0.4)
						.on("click",function(){
		                     //console.log("flagDetail",flagDetail);
		                 if(flagDetailC){
							 /*if(!flagShowSankey){
                                overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path").style("display",null);
                            }
							 main_view.select("#NodeLinkGraph").selectAll(".circleCourse").attr("opacity",1);
                             main_view.select("#NodeLinkGraph").selectAll(".arcA").attr("opacity",1);
                              main_view.select("#NodeLinkGraph").selectAll(".arcB").attr("opacity",1);
							 heatmap_g.selectAll("g").selectAll(".highlightCourse").remove();
			                  tooltip_LinkNode.select("svg").attr("width",0).attr("height",0);
			                  tooltip_LinkNode.style("opacity", 0.0);*/
							  if(!ifStudentNum){
                                if(oldCourse === undefined || oldCourse !== this_courseName||oldColor=== undefined ||oldColor !== this_color){
                                    flagClick = true;
                                    oldCourse = this_courseName;
                                    oldColor = this_color;
                                }
                                else{
                                    flagClick = false;
                                    oldCourse = undefined;
                                    oldColor = undefined;
                                }
                            }

                            else{
                                flagClick = true;
                            }
		                  
						  heatmap_g.selectAll("g").selectAll(".highlightCourse").remove();
                            if(!flagShowSankey){
                                overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path").style("display",null);
                            }
                            //console.log("---->401",deepCopy(nodeID));
                            selectCourse(flagClick,nameCour,useful_courName,deepCopy(colorCour));
                            selectLinkLine(flagClick,ifStudentNum,deepCopy(nodeID),info_node_link.nodes,temp_array[2],useful_courName,deepCopy(colorCour));
                            heatmap_g.selectAll("text").filter(function(d){
                                if(this.getAttribute("opacity")==="1" || this.getAttribute("opacity")==="0.295"){
                                    if(parseInt(this.id.slice(-4)) === year){
                                        highlightCourse(nameCour,parseInt(this.id.slice(-4)),flagClick,[]);
                                        info_temp = showStuAcademicProPCP(nameCour,parseInt(this.id.slice(-4)),flagClick,nameCour,flagShowSankey,deepCopy(colorCour),this_courseName);
                                    }
                                    else{
                                        highlightCourse(commonCour,parseInt(this.id.slice(-4)),flagClick,[]);
                                        info_temp =  showStuAcademicProPCP(commonCour,parseInt(this.id.slice(-4)),flagClick,nameCour,flagShowSankey,deepCopy(colorCour),this_courseName);
                                    }
                                    stu_IdSco_info.push(info_temp);
                                }
                            });

                            if(flagClick){
                                tooltip_LinkNode.select("svg").selectAll("path").remove();
                                tooltip_LinkNode.select("svg").selectAll("text").remove();
                                tooltip_LinkNode.select("svg").selectAll("rect").remove();
                                tooltip_LinkNode.select("svg").selectAll("g").remove();
                                tooltip_LinkNode.select("svg").selectAll("line").remove();
                                drawDetail_LN(stu_IdSco_info,this_courseName,this_courseAttr);
								flagDetailC=true;
                            }
                            else{
                                tooltip_LinkNode.select("svg").attr("width",0).attr("height",0);
                                tooltip_LinkNode.style("opacity", 0.0);
								flagDetailC=false;
                            }
                            
                            if(!ifStudentNum){
                                nameCour = [];
                                nodeID = [];
                                commonCour = [];
                                colorCour = [];
                            }
							flagDetailC=false;
							}
							if(flagDetailA){
					            
                                
                    if(!ifStudentNum){
                        if(oldCourse === undefined || oldCourse !== this_courseName||oldColor=== undefined ||oldColor !== this_color){
                            flagClick = true;
                            oldCourse = this_courseName;
                            oldColor = this_color;
                        }
                        else{
                            flagClick = false;
                            oldCourse = undefined;
                            oldColor = undefined;
                        }
                    }
                    else{
                        flagClick = true;
                    }
                    heatmap_g.selectAll("g").selectAll(".highlightCourse").remove();
                    if(!flagShowSankey){
                        overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path").style("display",null);
                    }
                    //console.log("colorCour",colorCour);
                    selectCourse(flagClick,nameCour,useful_courName,deepCopy(colorCour));
                    selectLinkLine(flagClick,ifStudentNum,deepCopy(nodeID),info_node_link.nodes,temp_array[2],useful_courName,deepCopy(colorCour));
                    heatmap_g.selectAll("text").filter(function(d){
                        if(this.getAttribute("opacity")==="1" || this.getAttribute("opacity")==="0.295"){
                            if(parseInt(this.id.slice(-4)) === year){
                                highlightCourse(nameCour,parseInt(this.id.slice(-4)),flagClick,[]);
                                info_temp = showStuAcademicProPCP(nameCour,parseInt(this.id.slice(-4)),flagClick,nameCour,flagShowSankey,deepCopy(colorCour),this_courseName);
                            }
                            else{
                                highlightCourse(commonCour,parseInt(this.id.slice(-4)),flagClick,[]);
                                info_temp =  showStuAcademicProPCP(commonCour,parseInt(this.id.slice(-4)),flagClick,nameCour,flagShowSankey,deepCopy(colorCour),this_courseName);
                            }
                            stu_IdSco_info.push(info_temp);
                        }
                    });

                    if(flagClick){
                        tooltip_LinkNode.select("svg").selectAll("path").remove();
                        tooltip_LinkNode.select("svg").selectAll("text").remove();
                        tooltip_LinkNode.select("svg").selectAll("rect").remove();
                        tooltip_LinkNode.select("svg").selectAll("g").remove();
                        tooltip_LinkNode.select("svg").selectAll("line").remove();
                        drawDetail_LN(stu_IdSco_info,this_courseName,this_courseAttr);
						flagDetailA=true;
                    }
                    else{
                        tooltip_LinkNode.select("svg").attr("width",0).attr("height",0);
                        tooltip_LinkNode.style("opacity", 0.0);
						flagDetailA=false;
                    }
                    
                    if(!ifStudentNum){
                        nameCour = [];
                        nodeID = [];
                        commonCour = [];
                        colorCour = [];
                    }
								
						flagDetailA=false;		
								
							}
					
							});
						

d3.select(".semesterBg");
            //绘制课程相关性
            group.selectAll(".path")
                .data(info_node_link.links)
                .enter()
                .append("path")
                .attr("id",function(d){
                    if(parseFloat(d.cor)>=newCor) return d.source_id + "to" + d.target_id;
                    else return "unreal_line";
                })
                .attr("class","linkLine")
                .attr("d",function(d){
                    if(parseFloat(d.cor)>=newCor) return linePath([d.source_point,d.target_point]);
                })
                .attr("stroke-width",function(d){
                    return threshold(parseFloat(d.cor));
                })
                .attr("stroke","#2F4F4F")
                .attr("fill","none");

            group.selectAll(".linkLine").filter(function(){
                if(this.id === "unreal_line") return this;
            })
            .remove();

            //绘制人数走向
            group.selectAll(".path")
                .data(info_node_link.links_StuNum)
                .enter()
                .append("path")
                .attr("id",function(d){
                    return d.source_id + "to" + d.target_id +"tostuNum";
                })
                .attr("class","linkLine_stuNum")
                .attr("d",function(d){
                    return linePath([d.source_point,d.target_point]);
                })
                .attr("stroke-width",function(d){
                    return widthScale(parseFloat(d.stuNum));
                })
                .attr("ifShow_begin",function(d){   //绘制第一次显示情况
                    return d.ifHighCor?"yes":"no";
                })
                .attr("stroke","#2F4F4F")
                .attr("fill","none")
                .attr("opacity",function(d){
                    return d.ifHighCor?1:0;
                });

            if(!ifStudentNum){
                main_view.selectAll("#NodeLinkGraph")
                        .selectAll(".linkLine_stuNum")
                        .attr("opacity",0);
            }
            else{
                main_view.selectAll("#NodeLinkGraph")
                        .selectAll(".linkLine")
                        .attr("opacity",0);
            }

        for(var m = 0; m < info_node_link.nodes.length; m++){
            //console.log(info_node_link.nodes[m].studentNum);
            arcR = rScale(info_node_link.nodes[m].studentNum);
            arcPathA.outerRadius(arcR);
            arcPathB.innerRadius(arcR+1.5).outerRadius(arcR+1.5);

            //绘制不同区域得扇形
            group.selectAll(".path")
                .data(info_node_link.nodes[m].arcAngle)
                .enter()
                .append("path")
                .attr("class","arcA")
                .attr("id","arcA"+info_node_link.nodes[m].courseName)
                .attr("d",function(d,i){
                    return arcPathA(d);
                })
                .attr("transform",function(){
                    return "translate("+info_node_link.nodes[m].centrePoint[0]+","+info_node_link.nodes[m].centrePoint[1]+")";
                })
                .attr("fill",function(d,i){
                    return color[i];
                })
                .attr("opacity", 1)
                .attr("stroke","white")
                .attr("stroke-width","0.35px")
                .attr("style","cursor:pointer")
                .on("click",function(d){
                       this_courseName = this.id.slice(4);
                       this_courseAttr ;
                    /*技巧,如下,一点点扒取
                    console.log(this);
                    console.log(this.attributes);*/
                      this_color = this.attributes.fill.value;
                    main_view.select("#NodeLinkGraph").selectAll(".circleCourse").filter(function(d){
                        if(this.id.slice(6,-8) === this_courseName){
                            this_courseAttr = this.id.slice(-7);
                            getCourse_Name_Id_Common(d,this_courseName,temp_array[2],this_color);
                        }
                    });

                    /*console.log(nameCour);
                    console.log(commonCour);*/
                       useful_courName = get_useful_CourseName();  
                       stu_IdSco_info = [];
                    if(!useful_courName.contains(this_courseName)){
                        return null;
                    }
                    if(!ifStudentNum){
                        if(oldCourse === undefined || oldCourse !== this_courseName||oldColor=== undefined ||oldColor !== this_color){
                            flagClick = true;
                            oldCourse = this_courseName;
                            oldColor = this_color;
                        }
                        else{
                            flagClick = false;
                            oldCourse = undefined;
                            oldColor = undefined;
                        }
                    }
                    else{
                        flagClick = true;
                    }
                    heatmap_g.selectAll("g").selectAll(".highlightCourse").remove();
                    if(!flagShowSankey){
                        overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path").style("display",null);
                    }
                    //console.log("colorCour",colorCour);
                    selectCourse(flagClick,nameCour,useful_courName,deepCopy(colorCour));
                    selectLinkLine(flagClick,ifStudentNum,deepCopy(nodeID),info_node_link.nodes,temp_array[2],useful_courName,deepCopy(colorCour));
                    heatmap_g.selectAll("text").filter(function(d){
                        if(this.getAttribute("opacity")==="1" || this.getAttribute("opacity")==="0.295"){
                            if(parseInt(this.id.slice(-4)) === year){
                                highlightCourse(nameCour,parseInt(this.id.slice(-4)),flagClick,[]);
                                info_temp = showStuAcademicProPCP(nameCour,parseInt(this.id.slice(-4)),flagClick,nameCour,flagShowSankey,deepCopy(colorCour),this_courseName);
                            }
                            else{
                                highlightCourse(commonCour,parseInt(this.id.slice(-4)),flagClick,[]);
                                info_temp =  showStuAcademicProPCP(commonCour,parseInt(this.id.slice(-4)),flagClick,nameCour,flagShowSankey,deepCopy(colorCour),this_courseName);
                            }
                            stu_IdSco_info.push(info_temp);
                        }
                    });

                    if(flagClick){
                        tooltip_LinkNode.select("svg").selectAll("path").remove();
                        tooltip_LinkNode.select("svg").selectAll("text").remove();
                        tooltip_LinkNode.select("svg").selectAll("rect").remove();
                        tooltip_LinkNode.select("svg").selectAll("g").remove();
                        tooltip_LinkNode.select("svg").selectAll("line").remove();
                        drawDetail_LN(stu_IdSco_info,this_courseName,this_courseAttr);
						flagDetailA=true;
                    }
                    else{
                        tooltip_LinkNode.select("svg").attr("width",0).attr("height",0);
                        tooltip_LinkNode.style("opacity", 0.0);
						flagDetailA=false;
                    }
                    
                    if(!ifStudentNum){
                        nameCour = [];
                        nodeID = [];
                        commonCour = [];
                        colorCour = [];
                    }
                });

            //绘制代表公共课程得圆环
            if(info_node_link.nodes[m].ifcommonCourse){
                group.selectAll(".path")
                    .data([{startAngle:0 , endAngle:Math.PI*2}])
                    .enter()
                    .append("path")
                    .attr("class","arcB")
                    .attr("id","arcB"+info_node_link.nodes[m].courseName)
                    .attr("d",function(d){
                        return arcPathB(d);
                    })
                    .attr("transform",function(){
                        return "translate("+info_node_link.nodes[m].centrePoint[0]+","+info_node_link.nodes[m].centrePoint[1]+")";
                    })
                    .attr("stroke","black")
                    .attr("stroke-width","1.5px")
                    .attr("opacity", 0.8);
            }
        }
        
        //绘制圆
		var circle = group.selectAll("circle")
						.data(info_node_link.nodes)
						.enter()
						.append("circle")
                        .attr("id",function(d){
                            //console.log(d);
                            indexC = d.courseIndex;
                            return "circle"+d.courseName+"_"+info_course_attr[0][indexC]
                                +info_course_attr[1][indexC]+info_course_attr[2][indexC];
                        })
                        .attr("class",function(d){
                            //indexC = d.courseIndex;
                            return "circleCourse";
                        })
						.attr("cx",function(d){
							return d.centrePoint[0];
						})
						.attr("cy",function(d){
							return d.centrePoint[1];
						})
						.attr("r",5)
                        .attr("style","cursor:pointer")
						.attr("fill",function(d,i){
                            indexC = d.courseIndex;
                            return eval("color"+info_course_attr[0][indexC]
                                +info_course_attr[1][indexC]+info_course_attr[2][indexC]);
						})
                        .attr("opacity", 0.8)
                        .attr("stroke","white")
                        .attr("stroke-width","1px")
                        .on("click",function(d){
							//console.log("flagClick",flagClick);
                             this_courseName = this.id.slice(6,-8);
                             this_courseAttr = this.id.slice(-7);
                             useful_courName = get_useful_CourseName();  
                             stu_IdSco_info = [];
                             this_color = "All";
                             use_nodeID = [];
                            if(useful_courName.contains(this_courseName)){
                                getCourse_Name_Id_Common(d,this_courseName,temp_array[2],this_color);
                            }
                            else{
                                return null;
                            }
                            if(!ifStudentNum){
                                if(oldCourse === undefined || oldCourse !== this_courseName||oldColor=== undefined ||oldColor !== this_color){
                                    flagClick = true;
                                    oldCourse = this_courseName;
                                    oldColor = this_color;
                                }
                                else{
                                    flagClick = false;
                                    oldCourse = undefined;
                                    oldColor = undefined;
                                }
                            }

                            else{
                                flagClick = true;
                            }
                            heatmap_g.selectAll("g").selectAll(".highlightCourse").remove();
                            if(!flagShowSankey){
                                overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path").style("display",null);
                            }
                            //console.log("---->401",deepCopy(nodeID));
                            selectCourse(flagClick,nameCour,useful_courName,deepCopy(colorCour));
                            selectLinkLine(flagClick,ifStudentNum,deepCopy(nodeID),info_node_link.nodes,temp_array[2],useful_courName,deepCopy(colorCour));
                            heatmap_g.selectAll("text").filter(function(d){
                                if(this.getAttribute("opacity")==="1" || this.getAttribute("opacity")==="0.295"){
                                    if(parseInt(this.id.slice(-4)) === year){
                                        highlightCourse(nameCour,parseInt(this.id.slice(-4)),flagClick,[]);
                                        info_temp = showStuAcademicProPCP(nameCour,parseInt(this.id.slice(-4)),flagClick,nameCour,flagShowSankey,deepCopy(colorCour),this_courseName);
                                    }
                                    else{
                                        highlightCourse(commonCour,parseInt(this.id.slice(-4)),flagClick,[]);
                                        info_temp =  showStuAcademicProPCP(commonCour,parseInt(this.id.slice(-4)),flagClick,nameCour,flagShowSankey,deepCopy(colorCour),this_courseName);
                                    }
                                    stu_IdSco_info.push(info_temp);
                                }
                            });

                            if(flagClick){
                                tooltip_LinkNode.select("svg").selectAll("path").remove();
                                tooltip_LinkNode.select("svg").selectAll("text").remove();
                                tooltip_LinkNode.select("svg").selectAll("rect").remove();
                                tooltip_LinkNode.select("svg").selectAll("g").remove();
                                tooltip_LinkNode.select("svg").selectAll("line").remove();
                                drawDetail_LN(stu_IdSco_info,this_courseName,this_courseAttr);
								flagDetailC=true;
                            }
                            else{
                                tooltip_LinkNode.select("svg").attr("width",0).attr("height",0);
                                tooltip_LinkNode.style("opacity", 0.0);
								flagDetailC=false;
                            }
                            
                            if(!ifStudentNum){
                                nameCour = [];
                                nodeID = [];
                                commonCour = [];
                                colorCour = [];
                            }
                        }).on("mouseover",function(d){
							//console.log("coursename",d.courseName);
							d3.select("div.courseRectDiv").html(courseEnglishAll(d.courseName))
							.style("left",(d3.event.pageX + 15) + "px")
							.style("top",(d3.event.pageY - 2) + "px")
							.style("opacity",1)
							.style("font-size","8px");
							
							
						}).on("mouseout",function(d){
                            d3.select("div.courseRectDiv").style("opacity", 0.0);
                            document.getElementById("courseNameRect").innerHTML = "";
                           
                        });
        //绘制文字
       var text = group.selectAll("text")
                        .data(info_node_link.nodes)
                        .enter()
                        .append("text")
                        .attr("class","courseName")
                        .attr("x",function(d){
                            return d.centrePoint[0];
                        })
                        .attr("y",function(d){
                            if(d.ifcommonCourse){
                                return d.centrePoint[1] + 10.5 + rScale(d.studentNum);
                            }else{
                                return d.centrePoint[1] + 9 + rScale(d.studentNum);
                            }
                        })
                        .attr("font-size","8px")
                        .attr("text-anchor","middle")
                        .text(function(d){ 
						   //console.log(d.courseName+","+courseEnglish(d.courseName));
						   return courseEnglish(getRightName(d.courseName));//}
                         })
                        .attr("opacity", 0.9);
						console.log("info_node_link.nodes",info_node_link.nodes);
var semester_t=group.selectAll("text.sText").data(semesterText).enter().append("text").attr("class","sText")
									.attr("x",function(d,i){
										return termWidth/2 + i*termWidth + (i-1)*termPadding;		  
											  })
											  .attr("y",height_node_link)
											  .text(function(d){
												  console.log("semester",semester);
												  return d;
											  });
   /* for(var i=0;i<info_node_link.nodes.length;i++){
	var str=courseEnglish(getRightName(info_node_link.nodes[i].courseName));
     var left=info_node_link.nodes[i].centrePoint[1]+ 10.5 + rScale(info_node_link.nodes[i].studentNum);
	 var tops=info_node_link.nodes[i].centrePoint[1] + 9 + rScale(info_node_link.nodes[i].studentNum);
	var textCourse=appendMultiText(group,str,left,tops,50,12);
	}
	
	
}*/
        var text = group.append("text")
                        .attr("class","gradeYear")
                        .attr("id",function(d){
                            return "grade" + year.toString();
                        })
                        .attr("x",8)
                        .attr("y",15)
                        .attr("font-size","12px")
                        .attr("text-anchor","end")
                        .text(year.toString().slice(2))
                        .attr("opacity", 1)
                        .on("click",function(d){
                            var useful_courName = get_useful_CourseName();
                            var useful_courseID = get_courseID_NodeLink(info_node_link.nodes,useful_courName);
                            //点击节点节点链接图, 重绘矩阵热力图、平行坐标
                            if( oldYear === "all" ){
                                for(var k = 2007; k < 2011; k++){
                                    show_All_HeatMap_PC(k);
                                    showHeatMapScore(k,k);
                                    if(!flagShowSankey){
                                        overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path").style("display",null);
                                    }
                                }
                            }
                            if(oldYear !== "all"){
                                show_All_HeatMap_PC(oldYear);
                                showHeatMapScore(oldYear,oldYear);
                                if(!flagShowSankey){
                                    overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path").style("display",null);
                                }
                            }
                            if(ifStudentNum){
                                main_view.selectAll("#NodeLinkGraph").selectAll(".linkLine_stuNum").attr("opacity",function(d){
                                    if(useful_courseID.length === info_node_link.nodes.length){
                                        if(this.getAttribute("ifShow_begin") === "yes"){
                                            return 1;
                                        }
                                        else{
                                            return 0;
                                        }
                                    }else{
                                        var begin_id = parseInt(this.id.split("to")[0]);
                                        var end_id = parseInt(this.id.split("to")[1]);
                                        return (useful_courseID.contains(begin_id)&&useful_courseID.contains(end_id))?1:0;
                                    }
                                });
                            }
                            else{
                                show_useful_LinkNode_Line(useful_courseID);
                            }
                            show_useful_LinkNode_Node(useful_courName);
                            nameCour = [];
                            nodeID = [];
                            commonCour = [];
                        });
    });
    
    /*
    * d 是点击到的课程圆的详细信息
    * this_courseName 是点击圆的课程名
    * index_array 是该年级所有课程在原始课程相关性表中索引
    */
	
    function getCourse_Name_Id_Common(d,this_courseName,index_array,the_color){
        var temp = [];
        var index_d_id = 0;
        if(nameCour.length === 0){
            nameCour.push(d.courseName);
            nodeID.push(d.id);
            colorCour.push(the_color);
            //只能存放公共课程
            if(d.ifcommonCourse){
                commonCour.push(d.courseName);
            }
            else{
                commonCour.push("NoCourse");
            }
        }
        else{
            var flag = false;
            for(var i = 0; i < index_array.length; i++){
                if(index_array[i].contains(d.id)){
                    //console.log("540");
                    index_d_id = i;
                    break;
                }
            }

            for(var k = 0; k < nodeID.length; k++){
                if(index_array[index_d_id].contains(nodeID[k])){
                    flag = true;
                    nodeID[k] = d.id;
                    nameCour[k] = d.courseName
                    colorCour[k] = the_color;
                    if(d.ifcommonCourse){
                            commonCour[k] = d.courseName
                    }
                    else{
                        commonCour[k] = "NoCourse";
                    }
                    break;
                }
            }
            if(!flag){
                nodeID.push(d.id);
                nameCour.push(this_courseName);
                colorCour.push(the_color);
                if(d.ifcommonCourse){
                    commonCour.push(this_courseName);
                }
                else{
                    commonCour.push("NoCourse");
                }
            }
        }
    }
	
/*function courseEnglishAll(d){
	//Object-Oriented Program === OOP
	if(d === "C语言程序设计") return "Programming with C Language";
	if(d === "计算机导论") return "Introduction to Computers";
	if(d === "数据结构") return "Data Structure";
	if(d === "数据结构课程设计") return "Course Design of Data Structure";
	if(d === "C语言课程设计") return "Course Design of C Language";
	//认识实习
	if(d === "认识实习") return "Cognition practice";
	if(d === "离散数学") return "Discrete Mathematics";
	if(d === "C加加面向对象程序设计"||d==="C++面向对象程序设计") return "C++ OOP Design";
	//数字逻辑
	if(d === "数字逻辑") return "Digital logic";
	if(d === "汇编语言程序设计") return "Assembly Language programming";
	if(d === "Java语言程序设计") return "Java Language programming";
	if(d === "Windows程序设计(VisualC++)"||d === "Windows程序设计") return "Windows programming(VisualC++)";
	if(d === "面向对象软件设计实习") return "Object Oriented Soft Design Practice";
	if(d === "操作系统课程设计") return "Course Design of Operating System";
	if(d === "计算机组成原理与汇编语言课程设计") return "Course Design of Computer Composition Principle and Assembly Language";
	if(d === "UML与系统建模") return "UML and System Modeling";
	if(d === "数据库原理") return "Principle of Database";
	if(d === "计算机组成原理") return "Computer Composition Principle";
	if(d === "计算机网络原理") return "Principle of Computer Network";
	if(d === "C__面向对象分析与设计"||d==="C#面向对象分析与设计") return "C# OOP Design";
	if(d === "操作系统") return "Operatom Systems";
	if(d === "软件工程") return "Soft Engineering";
	if(d === "编译原理") return "Principle of Compiling";
	if(d === "Unix/Linux系统管理"||d === "UnixLinux系统管理") return "Unix/Linux System Management";
	if(d === "嵌入式系统") return "Embedded System";
	if(d === "数据库管理(Oracle)"||d === "数据库管理_Oracle") return "Database Management(Oracle)";
	if(d === "多媒体技术") return "Multimedia Technology";
	if(d === "计算机接口技术") return "Computer Interface Technology";
	if(d === "人工智能导论") return "Introduction of Artificial Intelligence";
	if(d === "软件设计与体系结构") return "Soft Design and Architecture";
	if(d === "计算机图形学") return "Computer Graphics";
	if(d === "数据库课程设计") return "Course Design of Database";
	if(d === "计算机网络实习") return "The Computer Network Practice";
	if(d === "计算机系统结构") return "Computer Architecture";
	if(d === "软件工程实习") return "Soft Engineering Practice";
	if(d === "计算机硬件认识和使用") return "The Understanding and Use of Computer Hardware";
	if(d === "计算机组成原理与汇编语言") return "Computer Composition Principle and Assembly Language";
	if(d === "数据库管理") return "Database Principle";
	if(d === "局域网组网技术实验") return "LAN Technology Experiment";
	if(d === "软件测试") return "Soft Testing";
	if(d === "信息安全") return "Information Security";
	if(d === "Windows程序开发") return "Windows Program Design";
	if(d === "动态网页设计与网站建设") return "Web Design and Website Construction";
	if(d === ".NET程序设计") return ".NET Program Design";
	if(d === "专业实习") return "Profession Practice";
	if(d === "软件工程实践") return "Soft Engineering Practice";
	if(d === "高级语言程序设计（Ⅰ）") return "High Level Language Program Design(I)";
	if(d === "离散数学（I）") return "Discrete Mathematics(I)";
	if(d === "离散数学（II）") return "Discrete Mathematics(II)";
	if(d === "算法设计与分析") return "Algorithm Design and Analysis";
	if(d === "Android移动终端开发") return "Android Mobile Terminal Development";
	if(d === "毕业设计") return "Graduation project";
	if(d===".NET程序设计"||d==="NET程序设计") return ".Net programming";
	return d;
}*/

/*function courseEnglish(d){
	//Object-Oriented Program === OOP
	if(d === "C语言程序设计") return "C Program";//
	if(d === "计算机导论") return "Intro to Computers";
	if(d === "数据结构") return "Data Structure";//
	if(d === "数据结构课程设计") return "CD of Data Structure";//
	if(d === "C语言课程设计") return "CD of C Language";//
	//认识实习
	if(d === "认识实习") return "Cognition practice";
	if(d === "离散数学") return "Discrete Mathematics";
	if(d === "C加加面向对象程序设计"||d==="C++面向对象程序设计") return "C++ Programing";
	//数字逻辑
	if(d === "数字逻辑") return "Digital logic";
	if(d === "汇编语言程序设计") return "Assembly Programing";
	if(d === "Java语言程序设计") return "Java Programing";     
	if(d === "Windows程序设计"||d === "Windows程序设计(VisualC++)") return "Windows Programing";
	if(d === "面向对象软件设计实习") return "OOP Practice";
	if(d === "操作系统课程设计") return "CD of OS";
	if(d === "计算机组成原理与汇编语言课程设计") return "CD of Composition and Assembly";//
	if(d === "UML与系统建模") return "UML and System Modeling";
	if(d === "数据库原理") return "Principle of Database";
	if(d === "计算机组成原理") return "Computer Composition"; 
	if(d === "计算机网络原理") return "Computer Network";
	if(d === "C__面向对象分析与设计"||d==="C#面向对象分析与设计") return "C# Programing";
	if(d === "操作系统") return "OS";
	if(d === "软件工程") return "SE";
	if(d === "编译原理") return "Principle of Compiling";
	if(d === "Unix/Linux系统管理"||d === "UnixLinux系统管理") return "Unix/Linux System MGT";
	if(d === "嵌入式系统") return "Embedded System";
	if(d === "数据库管理(Oracle)"|| d==="数据库管理_Oracle") return "Database MGT(Oracle)";
	if(d === "多媒体技术") return "Multimedia Tech";
	if(d === "计算机接口技术") return "Computer Interface Tech";
	if(d === "人工智能导论") return "Intro of AI";
	if(d === "软件设计与体系结构") return "Soft Design and Arch";
	if(d === "计算机图形学") return "Computer Graphics";
	if(d === "数据库课程设计") return "CD of Database";
	if(d === "计算机网络实习") return "Network Practice";
	if(d === "计算机系统结构") return "Computer Arch";
	if(d === "软件工程实习") return "SE Practice";
	if(d === "毕业设计") return "Graduation proj";
	if(d === "离散数学") return "Discrete Mathematics";
	if(d==="计算机硬件认识和使用") return "hardware understand and use";
	if(d==="数据库管理") return "Database MGT";
	if(d==="计算机组成原理与汇编语言") return "Prin of Composition and Assembly";
	if(d==="局域网组网技术实验") return "LAN networking tech";
	if(d==="信息安全") return "information security";
	if(d==="软件测试") return "software test";
	if(d==="专业实习") return "Professional internship";
	if(d===".NET程序设计") return ".Net programming";
	if(d==="Windows程序开发") return "windows program development";
	if(d==="动态网页设计与网站建设") return "Dynamic web design and construction";
	return d;
}*/
/*function typeEnglish(d){
	if(d === "必修") return "compulsory";
	if(d === "选修") return "elective";  
	if(d === "理论") return "theoretical";
	if(d === "实践") return "practical";
	if(d === "低学分") return "low";
	if(d === "高学分") return "high";
}*/
    function drawDetail_LN(stu_IdSco_info,this_courseName,this_courseAttr){
        //console.log(stu_IdSco_info,this_courseName,this_courseAttr);
        var course_name_grade = []; //存储课程名字和对应的年级
        var course_SorceSets = [];  //存储某一个课程的学生成绩集合
        var course_Mean_Dev = [];   //年级、储存方差和平均值
        var course_Mean = [];       //储存平均值
        var course_Dev = [];        //存储方差
        var course_year = [];       //存储年级
        var temp = {};
        var temp_sco = [];
        var left = 10;

        var grade_num = 0;          //记录年级的个数
        //到下一段空白,选取提取课程聚类包含的课程和索引
        for(var i = 0; i < stu_IdSco_info.length; i++){
            var point_Mean_SteDev = [];
                temp = {};
            if(stu_IdSco_info[i].numStu !== 0 && stu_IdSco_info[i].numStu !== 1){
                var Mean = stu_IdSco_info[i].Sco.reduce(sum)/stu_IdSco_info[i].numStu;  //求均值
                var deviations = stu_IdSco_info[i].Sco.map(function(x){return x-Mean;});
                var SteDev = Math.sqrt(deviations.map(square).reduce(sum)/(stu_IdSco_info[i].numStu-1));   //求标准差
                grade_num++;
                point_Mean_SteDev.push(Mean.toFixed(2));
                point_Mean_SteDev.push(SteDev.toFixed(2));

                course_Mean.push(Mean.toFixed(2));
                course_Dev.push(SteDev.toFixed(2));
                
                temp.year = stu_IdSco_info[i].year;
                temp.point = point_Mean_SteDev;
                course_Mean_Dev.push(temp);

                temp_sco.push(stu_IdSco_info[i].Sco);
                temp_sco[i].unshift(stu_IdSco_info[i].year);

                course_year.push(stu_IdSco_info[i].year);
            }
        }
        temp = {};
        temp.course = this_courseName;
        temp.grade = course_year;
        course_name_grade.push(temp);
        course_SorceSets.push(temp_sco);

        //设定SVG长度、宽度
        tooltip_LinkNode.select("svg")
                    .attr("width",235)
                    .attr("height",function(){
                        if(grade_num === 4){
                            return 480;
                        }else if(grade_num === 1){
                            return 390;
                        }
                    });

        tooltip_LinkNode.select("svg")
                    .append("g")
                    .attr("class","flag")
                    .attr("transform","translate(0,5)");

        tooltip_LinkNode.style("opacity",1);

        for(var i = 0; i < course_name_grade.length; i++){
            Histogram_TM(course_SorceSets[i],course_name_grade[i].grade,course_name_grade[i].course,i,110);
        }
        drawCourseInfo(this_courseName,this_courseAttr,);
        draw_Mean_SteDev(course_Mean_Dev,course_Mean,course_Dev,310);
        if(grade_num === 4){
            draw_BoxPlot(course_SorceSets[0],430);
        }else if(grade_num === 1){
            draw_BoxPlot(course_SorceSets[0],360);
        }
        
    }

    function draw_BoxPlot(SorceSets,begin_y){
        var padding = 25;
        var dataSet = [];
        var temp = {};
        var min_sco = 200;
        var max_sco = -1;
        var padding_x = 0.5;
        var padding_y = 0.3;
        var year = [];
        var left_BoxPlot = 35;

        for(var i = 0; i < SorceSets.length; i++){
            var data = SorceSets[i].slice(1);
                temp.year = SorceSets[i][0];
                temp.BoxPlotData = get_BoxPlot_data(data);
                dataSet.push(temp);
                temp = {};
            if(min_sco > Math.min(...data)){
                min_sco = Math.min(...data);
            }
            if(max_sco < Math.max(...data)){
                max_sco = Math.max(...data);
            }
            year.unshift(SorceSets[i][0]);
        }

        var x_point = [];       //[[[],[],[]]]
        var x_point_A = [];     //[[],...,[]]
        var temp_p = [];
        var y_step = (xAxisWidth/2)/(year.length - 1 + padding_y);
        var yScale = d3.scale.ordinal()
                        .domain(year)
                        .rangePoints([0,padding*year.length],1);
        var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .tickFormat(d3.format(".0f"));
        var gBoxPlot = tooltip_LinkNode.select("g.flag").append("g")
                        .attr("class","axis")
                        .attr("transform","translate("+left_BoxPlot+","+(begin_y-padding*year.length)+")")
                        .call(yAxis); 
        if(min_sco < 60){
            var xTicks = [0,60,65,70,75,80,85,90,95,100];
            var xScale = d3.scale.ordinal()
                        .domain(xTicks)
                        .rangePoints([0,xAxisWidth-10],0.5);
            var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .tickFormat(d3.format(".0f"));
                tooltip_LinkNode.select("g.flag").append("g")
                        .attr("class","axis")
                        .attr("transform","translate("+left_BoxPlot+","+(begin_y)+")")
                        .call(xAxis);
            var x_step = (xAxisWidth)/(xTicks.length - 1 + padding_x);
            var x_Scale_A = d3.scale.linear()
                            .domain([0,60])
                            .range([x_step/2*padding_x,x_step + x_step/2*padding_x]);
            var x_Scale_B = d3.scale.linear()
                            .domain([60,100])
                            .range([x_step + x_step/2*padding_x,(xAxisWidth-10) - x_step/2*padding_x]);
            function getRightX(data){
                if(data < 60){
                    return x_Scale_A(data);
                }else{
                    return x_Scale_B(data);
                }
            }

            for(var i = 0; i < dataSet.length; i++){
                var temp = [];
                for(var j = 0; j < 4; j++){
                    if(j === 0 || j === 3){
                        temp_p.push(getRightX(dataSet[i].BoxPlotData[j]));
                        temp_p.push(getRightX(dataSet[i].BoxPlotData[j+1]));
                        temp.push(temp_p);
                    }else if(j === 1){
                        temp_p.push(getRightX(dataSet[i].BoxPlotData[j]));
                        temp_p.push(getRightX(dataSet[i].BoxPlotData[j+2]));
                        temp.push(temp_p);
                        temp.push(temp_p);
                    }
                    temp_p = [];
                }
                x_point.push(temp);
                temp = [];
                for(var j = 0; j < dataSet[i].BoxPlotData.length; j++){
                    temp.push(getRightX(dataSet[i].BoxPlotData[j]))
                }
                x_point_A.push(temp);
                temp = [];
            }
        }else{
            var xTicks = [];
            var min_sc = Math.ceil(min_sco/10 - 1);
            var max_sc = Math.floor(max_sco/10 + 1);

            for(var i = min_sc;i<= max_sc; i++){
                xTicks.push(i*10);
            }
            var xScale = d3.scale.ordinal()
                        .domain(xTicks)
                        .rangePoints([0,xAxisWidth-10],padding_x);
            var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .tickFormat(d3.format(".0f"));
                tooltip_LinkNode.select("g.flag").append("g")
                        .attr("class","axis")
                        .attr("transform","translate("+left_BoxPlot+","+(begin_y)+")")
                        .call(xAxis);

            var x_step = (xAxisWidth)/(xTicks.length - 1 + padding_x);
            var x_Scale = d3.scale.linear()
                            .domain([min_sc*10,max_sc*10])
                            .range([0 + x_step/2*padding_x,(xAxisWidth-10) - x_step/2*padding_x]);

            for(var i = 0; i < dataSet.length; i++){
                var temp = [];
                for(var j = 0; j < 4; j++){
                    if(j === 0 || j === 3){
                        temp_p.push(x_Scale(dataSet[i].BoxPlotData[j]));
                        temp_p.push(x_Scale(dataSet[i].BoxPlotData[j+1]));
                        temp.push(temp_p);
                    }else if(j === 1){
                        temp_p.push(x_Scale(dataSet[i].BoxPlotData[j]));
                        temp_p.push(x_Scale(dataSet[i].BoxPlotData[j+2]));
                        temp.push(temp_p);
                        temp.push(temp_p);
                    }
                    temp_p = [];
                }
                x_point.push(temp);
                temp = [];
                for(var j = 0; j < dataSet[i].BoxPlotData.length; j++){
                    temp.push(x_Scale(dataSet[i].BoxPlotData[j]))
                }
                x_point_A.push(temp);
                temp = [];
            }
        }

        var gA = tooltip_LinkNode.select("g.flag").append("g")
                            .attr("transform","translate("+left_BoxPlot+","+(begin_y-padding*year.length)+")");
        for(var i = 0 ; i < year.length;i++){
            gA.selectAll(".line")
                    .data(x_point_A[i])
                    .enter()
                    .append("line")
                    .attr("x1",function(d){
                        return d;
                    })
                    .attr("y1",function(d){
                        return yScale(year[year.length - 1 - i])+6;
                    })
                    .attr("x2",function(d){
                        return d;
                    })
                    .attr("y2",function(d){
                        return yScale(year[year.length - 1 - i])-6;
                    })
                    .attr("stroke","black")
                    .attr("stroke-width","1px")
                    .attr("fill","nones");

                gA.selectAll(".line")
                    .data(x_point[i])
                    .enter()
                    .append("line")
                    .attr("x1",function(d){
                        return d[0];
                    })
                    .attr("y1",function(d,j){
                        if(j!==1&&j!==2) return yScale(year[year.length - 1 - i]);
                        else if(j===1)return yScale(year[year.length - 1 - i]) - 6;
                        else return yScale(year[year.length - 1 - i])+6;
                    })
                    .attr("x2",function(d){
                        return d[1];
                    })
                    .attr("y2",function(d,j){
                        if(j!==1&&j!==2) return yScale(year[year.length - 1 - i]);
                        else if(j===1)return yScale(year[year.length - 1 - i]) - 6;
                        else return yScale(year[year.length - 1 - i])+6;
                    })
                    .attr("stroke","black")
                    .attr("stroke-width","1px")
                    .attr("fill","nones");
        }
    }


    function get_BoxPlot_data(data){
        var four_num = [];
        var max_sco = Math.max.apply(null,data);
        var min_sco = Math.min.apply(null,data);
        var up_four_num = 0;
        var down_four_num = 0;
        var mid; //中位数
            data.sort(compare); //数组排序
        if (data.length%2==0){
            mid = (data[data.length/2]+data[data.length/2+1])/2
        }
        if (data.length%2!=0){
            mid = data[(data.length+1)/2]
        }
        if(data.length%4 === 0){
            up_four_num = data[Math.ceil(data.length/4)];
            down_four_num = data[Math.floor(data.length/4*3)];
        }else{
            up_four_num = data[Math.ceil(data.length/4)]*(data.length/4 - Math.floor(data.length/4))
                    + data[Math.floor(data.length/4)]*(Math.ceil(data.length/4) - data.length/4);
            down_four_num = data[Math.ceil(data.length/4*3)] *(Math.ceil(data.length/4*3) - data.length/4*3)
                        + data[Math.floor(data.length/4*3)] *(data.length/4*3 - Math.floor(data.length/4*3));
        }
        
        four_num.push(min_sco,up_four_num,mid,down_four_num,max_sco);
        //console.log(four_num);
        return four_num;
    }

    function Histogram_TM(dataset,grade,courseName,flag,begin_y){
        for(var i=0;i<dataset.length;i++){
            drawHistogram(dataset[i],flag,true,courseName,begin_y);
        }
    }

    function drawHistogram(dataset,flag,firsttime,str,begin_y){
        //console.log(dataset);
        var eve_Pro = [];
        var A = 0;
        var B = 0;
        var C = 0;

        for(var i = 1; i < dataset.length; i++){
            if(dataset[i]>=80) A++;
            else if(dataset[i]>=60) B++;
            else C++;
        }
        eve_Pro.push((C/(dataset.length-1)).toFixed(2),(B/(dataset.length-1)).toFixed(2),(A/(dataset.length-1)).toFixed(2));
        //console.log(eve_Pro);
        var dataset2 = dataset.slice(1,dataset.length);

        for(var i = dataset2.length-1 ; i > -1 ; i--){
            if(dataset2[i] == "") dataset2.pop();
        }
        var left = 18;
        var top = begin_y;  //控制起始位置
        
        var rangeMin = 0, rangeMax = 100;
        var height = 70, width = 120;
        var histogram = d3.layout.histogram()
                                .range([rangeMin,rangeMax])
                                .bins([0,60,65,70,75,80,85,90,95,100,105])
                                .frequency(false);
        var hisData = histogram(dataset2);
        var xAxisWidth = 200,xTicks = hisData.map(function(d){return d.x});
        //console.log(hisData,xTicks);
        var xScale = d3.scale.ordinal()
                    .domain(xTicks)
                    .rangePoints([0,xAxisWidth],0.5);
        var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickFormat(d3.format(".0f"));
            tooltip_LinkNode.select("g.flag").append("g")
                    .attr("class","axis")
                    .attr("transform","translate("+left+","+(top+(flag+1)*height+10)+")")
                    .call(xAxis);

        var yAxisWidth = 120;
        var yScale = d3.scale.linear()
                        .domain([0,1])
                        .range([0,yAxisWidth]);
        var lineGenerator = d3.svg.line()
                                .x(function(d){return xScale(d.x)})
                                .y(function(d){return height-yScale(d.y)})
                                .interpolate("basis");

        var gLine = tooltip_LinkNode.select("g.flag").append("g")
                            .attr("transform","translate("+left+","+top+")");

            gLine.append("path")
                    .attr("class","linePath")
                    .attr("transform","translate("+0+","+((flag)*height+10)+")")
                    .attr("d",lineGenerator(hisData))
                    .attr("stroke",eval("color"+dataset[0]))
                    .attr("stroke-width","3px")
                    .attr("fill","none");

        // 保证text绘制过程中，每次只绘制过一次
        gLine.append("rect")
                .attr("x",function(){
                    return (dataset[0]-2007)*35 + left/2 - 5;
                })
                .attr("y",function(){return 0;})
                .attr("width",20)
                .attr("height",10)
                .style("fill",eval("color"+dataset[0]));

        gLine.append("text")
                .attr("class","yearText")
                .attr("font-size",12)
                .attr("dx",(dataset[0]-2007)*35 + left/2 - 5)
                .attr("dy",function(){return 25;})
                .text(dataset[0])
                .style("fill","Black");
    }
	/*function themeEnglish(d){
	if(d === "程序设计") return "program design";
	if(d === "应用技术") return "applied technology";
	if(d === "数据库") return "database";
	if(d === "计算机组成") return "computer composition";
	if(d === "计算机网络") return "computer network";
	if(d === "操作系统") return "operating system";
	if(d === "基础理论") return "basic theory";
	if(d === "计算机硬件") return "computer hardware";
	if(d === "工程实习") return "engineering practice";
	if(d === "数据结构") return "data structure";
	if(d === "导学课程") return "guidance course";
}*/
    //绘制课程文字信息
    function drawCourseInfo(this_courseName,this_courseAttr){
        var top = 10;
        var left_Info = 20;
        var pos = 18;
        var data_group = [];
        var ob_group = 0;

        d3.json("data/dataCourseCluster.json", function(error,json){
            if(error) console.log(error);
            data_WC = json.Cluster;
        });
        data_group = data_WC;
        for(var i = 0; i < data_group.length; i++){
            if(data_group[i].courseName.contains(this_courseName)){
                ob_group = data_group[i].courseCluster;
                break;
            }
        }
		//console.log("data_group",data_group);
        var gCourseInfo = tooltip_LinkNode.select("g.flag").append("g")
                            .attr("transform","translate(0,0)");

            gCourseInfo.append("text")
                    .attr("class","nameText")
                    .attr("text-anchor", "middle")
                    .attr("font-size",12)
                    .attr("dx",110)
                    .attr("dy",top)
                    .attr("style","cursor:pointer")
                    .text("Course Information")
                    .style("fill","Black")
                    .on("click",function(){
                        tooltip_LinkNode.select("svg").selectAll("path").remove();
                        tooltip_LinkNode.select("svg").selectAll("text").remove();
                        tooltip_LinkNode.select("svg").selectAll("rect").remove();
                        tooltip_LinkNode.select("svg").selectAll("g").remove();
                        tooltip_LinkNode.select("svg").selectAll("line").remove();
                        tooltip_LinkNode.select("svg").attr("width",0).attr("height",0);
                        tooltip_LinkNode.style("opacity", 0.0);
                    });

         /*var textCourse=gCourseInfo.append("text")
                    .attr("class","nameText")
                    .attr("text-anchor", "left")
                    .attr("font-size",12)
                    .attr("dx",left_Info)
                    .attr("dy",top + pos)
                    .text(function(){
                        return "course name: "+courseEnglish(getRightName(this_courseName));
                    })
                    .style("fill","Black");*/
			var str="course name: "+courseEnglishAll(getRightName(this_courseName));
		var textCourse=appendMultiText(gCourseInfo,str,left_Info,top + pos-20,180,12);
		//var tc=document.querySelector("#");
			/*var strs=courseEnglish(getRightName(this_courseName)).split(" ");
			console.log("strs",strs);
			
			var textCourse=gCourseInfo.append("text")
                    .attr("class","nameText")
                    .attr("text-anchor", "left")
                    .attr("font-size",12)
                    .attr("dx",left_Info)
                    .attr("dy",top + pos);
					
				textCourse.selectAll("tspan").data(strs).enter().append("tspan").attr("dx",0)
				          .attr("dy","1em").text(function(d){
							  return d;
							  
						  }).style("fill","Black");*/
		
/*var strs=courseEnglish(getRightName(this_courseName)).split(" ");
console.log("strs",strs);
var textCourse=gCourseInfo.append("text")
                    .attr("class","nameText")
                    .attr("text-anchor", "left")
                    .attr("font-size",12)
                    .attr("dx",left_Info)
                    .attr("dy",top + pos)
                    .text(strs)
                    .style("fill","Black");
	textCourse.selectAll("tspan").data(strs).enter().append("tspan").attr("x",text.attr("dx")).attr("dy",1em).text(function(d){
		return d;
	})*/
            gCourseInfo.append("text")
                    .attr("class","nameText")
                    .attr("text-anchor", "left")
                    .attr("font-size",12)
                    .attr("dx",left_Info)
                    .attr("dy",top + 2*pos+textCourse.attr("height"))
                    .text(function(){
                        return "elective type: "+typeEnglish(this_courseAttr.slice(0,2));
                    })
                    .style("fill","Black");

            gCourseInfo.append("text")
                    .attr("class","nameText")
                    .attr("text-anchor", "left")
                    .attr("font-size",12)
                    .attr("dx",left_Info)
                    .attr("dy",top + 3*pos)
                    .text(function(){
                        return "course type: "+typeEnglish(this_courseAttr.slice(2,4));
                    })
                    .style("fill","Black");

            gCourseInfo.append("text")
                    .attr("class","nameText")
                    .attr("text-anchor", "left")
                    .attr("font-size",12)
                    .attr("dx",left_Info)
                    .attr("dy",top + 4*pos)
                    .text(function(){
                        return "credit: "+typeEnglish(this_courseAttr.slice(4));
                    })
                    .style("fill","Black");

            gCourseInfo.append("text")
                    .attr("class","nameText")
                    .attr("text-anchor", "left")
                    .attr("font-size",12)
                    .attr("dx",left_Info)
                    .attr("dy",top + 5*pos)
                    .text(function(){
						//console.log("ob_group",ob_group);
                        return "category: "+themeEnglish(ob_group);
                    })
                    .style("fill","Black");
    }

    function draw_Mean_SteDev(course_Mean_Dev,course_Mean,course_Dev,begin_y){
        var max_Mean = Math.max.apply(null,course_Mean);
        var min_Mean = Math.min.apply(null,course_Mean);

        var max_Dev = Math.max.apply(null,course_Dev);
        var min_Dev = Math.min.apply(null,course_Dev);
        var Ridus = 3;
        
        var left_Mean_SteDev = 35;
        var flag = 2;
        var height = 70, width = 120;

        var padding_x = 0.5;
        var padding_y = 0.3;
        var xTicks = [];
            xTicks.push(min_Mean-3);
            xTicks.push(min_Mean-3+(max_Mean - min_Mean + 10)/3);
            xTicks.push(min_Mean-3+(max_Mean - min_Mean + 10)/3*2);
            xTicks.push(max_Mean+3);
        var yTicks = [];
            yTicks.push(max_Dev+1);
            yTicks.push(min_Dev-1+(max_Dev - min_Dev + 2)/2);
            yTicks.push(min_Dev-1);

        var xScale = d3.scale.ordinal()
                    .domain(xTicks)
                    .rangePoints([0,xAxisWidth - 10],padding_x);

        var yScale = d3.scale.ordinal()
                    .domain(yTicks)
                    .rangePoints([0,xAxisWidth/2],padding_y);

        var mean_Axis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .tickFormat(d3.format(".0f"));
        var mean_Dev = d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .tickFormat(d3.format(".0f"));         
        var xAxis_g_Mean_SteDev = tooltip_LinkNode.select("g.flag").append("g")
                                    .attr("class","axis")
                                    .attr("transform","translate("+left_Mean_SteDev+","+begin_y+")");
            xAxis_g_Mean_SteDev.call(mean_Axis);
            /*xAxis_g_Mean_SteDev.append("text")
                                .attr("class","nameText")
                                .attr("text-anchor", "left")
                                .attr("font-size",12)
                                .attr("dx",xAxisWidth - 30)
                                .attr("dy",0)
                                .text(function(){
                                    return "平均分";
                                })
                                .style("fill","Black");*/
        var yAxis_g_Mean_SteDev = tooltip_LinkNode.select("g.flag").append("g")
                                    .attr("class","axis")
                                    .attr("transform","translate("+left_Mean_SteDev+","+(begin_y-xAxisWidth/2)+")");
            yAxis_g_Mean_SteDev.call(mean_Dev);

        var x_step = (xAxisWidth - 10)/(xTicks.length - 1 + padding_x);
        var y_step = (xAxisWidth/2)/(xTicks.length - 1 + padding_y);
        var mean_Scale = d3.scale.linear()
                            .domain([min_Mean - 5,max_Mean + 5])
                            .range([0 + x_step/2*padding_x,(xAxisWidth - 10) - x_step/2*padding_x]);
        var dev_Scale = d3.scale.linear()
                            .domain([max_Dev + 1,min_Dev - 1])
                            .range([0 + y_step/2*padding_y,xAxisWidth/2 - y_step/2*padding_y]);

        var gMeanDev_g_test = tooltip_LinkNode.select("g.flag").append("g")
                        .attr("transform","translate("+left_Mean_SteDev+","+(begin_y-xAxisWidth/2)+")");

        var tooltip_LinkNode_detail = d3.select("body").append("div")
                        .attr("id","yuanDiv_ln")
                        .attr("class", "tooltip_detail")
                        .style("opacity", 0.0);
        
            gMeanDev_g_test.selectAll("circle")
                        .data(course_Mean_Dev)
                        .enter()
                        .append("circle")
                        .attr("cx",function(d){
                            return mean_Scale(d.point[0]);
                        })
                        .attr("cy",function(d){
                            return dev_Scale(d.point[1]);
                        })
                        .attr("r",5)
                        .attr("style","cursor:pointer")
                        .attr("fill",function(d,i){
                            return eval("color"+d.year);
                        }).on("mouseover",function(d){
                            d3.select("div.tooltip_detail")
                                .html("average: "+d.point[0]+"</br>"+"variance: "+d.point[1]+"</br>")
                                .style("padding-left","5px")
                                .style("padding-right","5px")
                                .style("left", (d3.event.pageX -10) + "px")
                                .style("top", (d3.event.pageY+14) + "px")
                                .style("opacity",1);
                        }).on("mouseout",function(d){
                            d3.select("div.tooltip_detail").style("opacity", 0.0);
                            document.getElementById("yuanDiv_ln").innerHTML = "";
                        });
    }


    /**
     * 深拷贝
     * @param {*} obj 拷贝对象(object or array)
     * @param {*} cache 缓存数组
     */
    function deepCopy (obj, cache = []) {
      // typeof [] => 'object'
      // typeof {} => 'object'
      if (obj === null || typeof obj !== 'object') {
        return obj
      }
      // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
      /**
       * 类似下面这种
       * var a = {b:1}
       * a.c = a
       * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
       */
      const hit = cache.filter(c => c.original === obj)[0]
      if (hit) {
        return hit.copy
      }

      const copy = Array.isArray(obj) ?  [] :   {}
      // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
      cache.push({
        original: obj,
        copy
      })
      Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
      })

      return copy
    }
}