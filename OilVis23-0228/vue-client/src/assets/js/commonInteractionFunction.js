/*
*  课程名数组,年份,是否显示
*/
function highlightCourse(nameCour,year,flagClick,gradeCour){
    //console.log(nameCour,year,flagClick,gradeCour)
    var student_num = [44,45,39,34];
    var coor_x = [],
        coor_y = [];
    var rect_width = [],
        rect_height = [];

    var temp = [];

    for(var i = 0; i < nameCour.length; i++){
        if(nameCour[i]!=="NoCourse") temp.push(nameCour[i]);
    }
    nameCour = temp;

    temp = [];
    for(var i = 0; i < nameCour.length; i++){
        var rectClass = "." + nameCour[i];
        //console.log("---->22",gradeCour);
        if(gradeCour.length === 0 || gradeCour[i].contains(year)){
            heatmap_g.selectAll("#everyheatmap"+year).select(rectClass).filter(function(d){
                //console.log(this);
                //console.log(rectClass);
                //技巧：输出之后去开发者工具里面去扒
                /*console.log(this);
                console.log(this.attributes);
                console.log((this.attributes)[0]);
                console.log(this.outerHTML);
                console.log(this.x);
                coor_x = parseFloat(this.x.animVal.valueAsString);*/
                temp.push(this.className.baseVal)
                coor_x.push(parseFloat(this.x.animVal.valueAsString));
                coor_y.push(parseFloat(this.y.animVal.valueAsString));
                rect_width.push(parseFloat(this.width.animVal.valueAsString));
                rect_height.push(parseFloat(this.height.animVal.valueAsString));
            });
        }
    }

    nameCour = temp;
    if(flagClick&&coor_x.length!==0){
        heatmap_g.selectAll("#everyheatmap"+year)
                    .append("g")
                    .attr("class","highlightCourse")
                    .attr("transform","translate(0,0)")
                    .selectAll(".rect")
                    .data(nameCour)
                    .enter()
                    .append("rect")
                    .attr("x",function(d,i){
                        return coor_x[i] - 0.1;
                    })
                    .attr("y",function(d,i){
                        return coor_y[i] - 0.1;
                    })
                    .attr("width",function(d,i){
                        return rect_width[i]+0.2;
                    })
                    .attr("height",function(d,i){
                        return rect_height[i]*student_num[year-2007]+0.2;
                    })
                    .style("fill","none")
                    .attr("stroke-width","2px")
                    .attr("stroke","red");
    }
}

//选择课程圆、弧
function selectCourse(flagClick,nameCour,useful_courseName,useful_color){
	//console.log("73");
   // console.log("useful_courseName:",useful_courseName);
    /*console.log("nameCour",nameCour);
    */
    show_useful_LinkNode_Node(useful_courseName);
    if(flagClick){
		
		console.log("nameCour",nameCour);
		console.log("useful_color",useful_color);
        weaken_unuseful_LinkNode_Node(nameCour,useful_color);
    }
}

//绘制柱状图,表示统计信息
//此处将统计信息的绘制函数剥离出来
function drawHistogram_student(dataset,grade){
    var color60以下="hsl(0,100%,40%)",color60to69="hsl(60,100%,40%)",
        color70to79="hsl(80,100%,40%)",color80to89="hsl(190,100%,40%)",color90to100="hsl(210,100%,40%)";
    var binNum=20,rangeMin=0,rangeMax=100;
    var width=3,height=95;
    var w1=6,h1=1.8;
    var move = [[30,36,44],[135,36,45],[240,34,39],[330,33,34]]
    var histogram=d3.layout.histogram()
                    .range([rangeMin,rangeMax])
                    .bins([0,60,70,80,90,100])
                    .frequency(false);
    var hisData=histogram(dataset);
    var xAxisWidth=40,
        xTicks = hisData.map(function(d){return d.x});
    var xScale = d3.scale.ordinal()
                .domain(xTicks)
                .rangeRoundBands([0,xAxisWidth],0.1);
    var yAxisWidth=150;
    var yScale=d3.scale.linear()
                .domain([0,1])
                .range([0,yAxisWidth]);

    var nameG = [".g2007",".g2008",".g2009",".g2010"];
    var gRect= heatmap_g.select(nameG[grade-2007])
                    .append("g")
                    .attr("class","histogram")
                    .attr("id","histogram"+grade)
                    .attr("transform","translate("+width+","+move[grade-2007][0]+")");
        gRect.selectAll("rect")
            .data(hisData)
            .enter()
            .append("rect")
            .attr("class","rect")
            .attr("x",function(d,i){return xScale(d.x);})
            .attr("y",function(d,i){return move[grade-2007][2]*h1-yScale(d.y);})
            .attr("width",function(d,i){return xScale.rangeBand();})
            .attr("height",function(d){return yScale(d.y);})
            .style("fill",function(d,i){
                if(i==0) return color60以下;
                else if(i==1) return color60to69;
                else if(i==2) return color70to79;
                else if(i==3) return color80to89;
                else if(i==4) return color90to100;
            });
}

// 高亮被选取的课程
/*
*  flagClick: 是否点击 true:是 false:否
*  ifStudentNum: 是否显示学生人数 true:是 false:否
*  if_TeacherMap: 是否是教师视图 true:是 false:否
*  selected_circleId: 选取课程圆ID
*  selected_courName: 选取课程名
*/
function show_useful_courseCircle(flagClick,ifStudentNum,if_TeacherMap,selected_circleId,selected_courName){
    //console.log(selected_circleId);
    var this_year_selected_course = [];
    if(flagClick){
        main_view.selectAll("#NodeLinkGraph").selectAll("circle")
            .attr("opacity",function(d,i){
                /*console.log(d);
                console.log(this);*/
                if(selected_circleId.contains(d.id)){
                    this_year_selected_course.push(this.id.slice(6,-8));
                    return 0.8;
                }else{
                    return 0.3;
                }
                //return (selected_courName.contains(this.id.slice(6,-8))&&selected_circleId.contains(d.id))?0.8:0.3;
            });
        main_view.selectAll("#NodeLinkGraph").selectAll(".arcA")
            .attr("opacity",function(d,i){
                return this_year_selected_course.contains(this.id.slice(4))?0.8:0.3;
            });
        main_view.selectAll("#NodeLinkGraph").selectAll(".arcB")
            .attr("opacity",function(d,i){
                return this_year_selected_course.contains(this.id.slice(4))?0.8:0.3;
            });
        if(ifStudentNum){
            main_view.selectAll("#NodeLinkGraph").selectAll(".linkLine_stuNum")
                .attr("opacity",function(d,i){
                    return (selected_circleId.contains(d.source_id)&&selected_circleId.contains(d.target_id))?1:0;
                });
        }else{
            main_view.selectAll("#NodeLinkGraph")
                .selectAll(".linkLine")
                .attr("opacity",function(d,i){
                    if(if_TeacherMap) return (selected_circleId.contains(d.source_id)||selected_circleId.contains(d.target_id))?1:0;
                    else return (selected_circleId.contains(d.source_id)&&selected_circleId.contains(d.target_id))?1:0;
                });
        }
    }else{
        main_view.selectAll("#NodeLinkGraph").selectAll("circle").attr("opacity",1);
        main_view.selectAll("#NodeLinkGraph").selectAll(".arcA").attr("opacity",1);
        main_view.selectAll("#NodeLinkGraph").selectAll(".arcB").attr("opacity",1);
        if(ifStudentNum){
            main_view.selectAll("#NodeLinkGraph").selectAll(".linkLine_stuNum")
                .attr("opacity",function(d){
                    return (this.getAttribute("ifShow_begin") === "yes") ?"1":"0";
                });
        }else{
            main_view.selectAll("#NodeLinkGraph").selectAll(".linkLine").attr("opacity",1);
        }
    }
}

function show_rigth_LineType_NodeLink(ifStudentNum){
    if(ifStudentNum){
        main_view.selectAll("#NodeLinkGraph").selectAll(".linkLine").attr("opacity",0);
    }
    else{
        main_view.selectAll("#NodeLinkGraph").selectAll(".linkLine_stuNum").attr("opacity",0);
    }              
}