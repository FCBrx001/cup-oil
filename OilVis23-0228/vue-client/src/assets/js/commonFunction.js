function getRightName(course_Name){
    if(course_Name === "C__面向对象分析与设计") return "C#面向对象分析与设计";
    else if(course_Name === "NET程序设计") return ".NET程序设计";
    else if(course_Name === "C加加面向对象程序设计") return "C++面向对象程序设计";
    else if(course_Name === "数据库管理_Oracle") return "数据库管理(Oracle)";
    else if(course_Name === "Windows程序设计") return "Windows程序设计(VisualC++)";
    else return course_Name;
}

/*
*	cou:存储一个对象数组：[{},{},{}......]
*		对象A：{ grade: "2010", course: "Windows程序开发" }
*		对象B：{ grade: "2010", course: "Windows程序开发" }
*		对象C：{ grade: "2007", course: "C语言程序设计" }
*
*	参数：course_name,课程名数组[]
*/
function get_Course_and_Grade(course_name){
	var cou = [];
	for(var j = 0 ; j < course_name.length ; j++){
		for(var i = 0; i < data_scores.length ; i++){
			if( data_scores[i].课程名 === course_name[j] ){
				cou.push({ grade:data_scores[i].年级 , course:data_scores[i].课程名 });
			}
		}
	}
	return deal_Course_and_Grade(cou,course_name);
}

/*
*	返回一个对象数组：[{},{},{}......]
*		对象A：{ grade: ["2010","2011"], course: "Windows程序开发" }
*		对象C：{ grade: ["2007"], course: "C语言程序设计" }
*
*	参数：course_name,课程名数组[]
*	参数：cou：get_Course_and_Grade(course_name)返回值
*/
function deal_Course_and_Grade(cou,course_name){
	var cou3 = [];
	for(var i = 0 ; i < course_name.length ; i++){
		cou3[i] = new Object();
		cou3[i].course = course_name[i];
		cou3[i].grade = [];
		for(var j = 0 ; j < cou.length ; j++ )
			if( cou[j].course == course_name[i] )
				cou3[i].grade = cou3[i].grade.concat([cou[j].grade]);
	}
	return cou3;
}

/*
*	课程的学生成绩数组：
*	[[课程A][课程B][课程C][课程D]...]
*	[课程A]:["2007", "86", "80", "75", "94", "78", "78", "80", "77", "69", "75", "75"......]
*	[课程B]:[[][][][]]
*		[["2009", "90", "80", "80", "83", "88", "76", "88", "86", "76", "85", "73", "74"......],
*		 ["2010", "77", "82", "90", "85", "73", "71", "87", "69", "72", "73", "65", "74"......],
*		 ["2011", "91", "95", "85", "95", "87", "87", "81", "93", "89", "83", "86", "80"......],
*		 ["2012", "92", "96", "87", "86", "84", "85", "77", "80", "92", "72", "78", "92"......]]
*
*	参数：cou3
*		函数：deal_Course_and_Grade(cou,course_name)的返回值
*/
function get_score_Set(cou3){
	var scoreSet = [];
	for( var i = 0 ; i < cou3.length ; i++ ){
		scoreSet.push([]);
	}
	for(var i=0;i<cou3.length;i++ ){
		for(var j=0;j<cou3[i].grade.length;j++){
			switch(cou3[i].grade[j]) {
				case "2007":
					var a = data2007.map(function(p){return  p[cou3[i].course];});
					var b = transform5(a);
						scoreSet[i].push(["2007"].concat(b));
						break;
				case "2008":
					var a = data2008.map(function(p){return  p[cou3[i].course];});
					var b = transform5(a);
						scoreSet[i].push(["2008"].concat(b));
						break;
				case "2009":
					var a = data2009.map(function(p){return  p[cou3[i].course];});
					var b = transform5(a);
						scoreSet[i].push(["2009"].concat(b));
						break;
				case "2010":
					var a =	data2010.map(function(p){return  p[cou3[i].course];});
					var b = transform5(a);
						scoreSet[i].push(["2010"].concat(b));
						break;
			}
		}
	}
	return scoreSet;
}

/*
* 获取所有课程相关性
*/
function get_cor_Matrix(){
	var datacorr = [];
	for(var i = 0;i < data_cor.length - 7;i++){
		datacorr.push([]);
	}
	for(var i = 0;i < data_cor.length - 7;i++) {
		var arr = [];
		for(var item in data_cor[i]){
			arr.push(data_cor[i][item]);
		}
		datacorr[i]=arr;
	}
	return datacorr;
}

/*
* 获取课程的序号,大概不对
*  str: [[48],
*		[48, 45],
*		[48, 45, 19],
*		[48, 45, 19, 14],
*		[48, 45, 19, 14, 20],
*		[48, 45, 19, 14, 20, 16],
*		[48, 45, 19, 14, 20, 16, 21],
*		[48, 45, 19, 14, 20, 16, 21, 18],
*		[48, 45, 19, 14, 20, 16, 21, 18, 10]]
*/
function get_str(datacorr,cou3){
	var str=[];
	for(var i = 0; i < cou3.length ; i++ ){
		str.push([]);
	}
	for(var i = 0 ; i < cou3.length ; i++ ){
		for(var k = 0;k <= i; k++){
			for(j = 0;j < datacorr.length ; j++){
				if( datacorr[j][0] == cou3[k].course )
					str[i].push(j);
			}

		}
	}
	return str;
}

/*
* 获取当前课程的相关性
*	[[],
*	["0.617267693"], 
*	[0, 0],
*	[0, 0, "0.806202059"],
*	[0, "0.527097672", "0.679059325", 0],
*	["0.53089712", "0.773737812", 0, 0, "0.751662575"],
*	[0, "0.655215868", 0, "0.584679932", 0, "0.552689562"],
*	["0.540278797", "0.812530283", "0.670345429", "0.714358687", "0.653242714", "0.750631316", "0.699529318"],
*	[0, 0, 0, 0, "0.64114885", 0, "0.515049967", "0.736188585"]]
*/
function get_courseCor(datacorr,cou3,str){
	var cor=[];
	for(var i=0;i<cou3.length;i++){
		cor.push([]);
	}
	for(var i = 1; i < str.length; i++){
		for(var j = 0; j < str[i].length-1;j++){
			if( datacorr[str[i][str[i].length-1]][str[i][j]+1] >= 0.5)
				cor[i].push(datacorr[str[i][str[i].length-1]][str[i][j]+1]);
			else cor[i].push(0);
		}
	}
	return cor;
}

//显示节点链接图中的被选中的课程圆、弧
function showCircle_Arc(nodeArr,circleId,nodes,useful_courseName,useful_color){
    var nodeCourseName = [];
    var nodeNameClicked = [];

    for(var i = 0; i < nodes.length; i++){
        if(nodeArr.contains(nodes[i].id.toString()))
            nodeCourseName.push(nodes[i].courseName);

        if(circleId.contains(nodes[i].id))
            nodeNameClicked.push(nodes[i].courseName);
    }
    main_view.select("#NodeLinkGraph").selectAll(".circleCourse")
            .attr("opacity",function(d){
                if(circleId.contains(d.id)) return 1
                else return nodeArr.contains(d.id.toString())?0.8:0.3;
            });
    main_view.select("#NodeLinkGraph").selectAll(".arcA")
            .attr("opacity",function(d){
            	if(nodeNameClicked.contains(this.id.slice(4))){
                    var idx = nodeNameClicked.indexOf(this.id.slice(4));
                    if(this.attributes.fill.value === useful_color[idx]||useful_color[idx] === "All"){
                        return 1;
                    }else return nodeCourseName.contains(this.id.slice(4))?0.8:0.3;
                }else return nodeCourseName.contains(this.id.slice(4))?0.8:0.3;
                
            });

    main_view.select("#NodeLinkGraph").selectAll(".arcB")
            .attr("opacity",function(d){
                if(nodeNameClicked.contains(this.id.slice(4))) return 1;
                else return nodeCourseName.contains(this.id.slice(4))?0.8:0.3;
            });
}

function getNodeInfo_LinkNode(){
	var node = [];
		main_view.select("#NodeLinkGraph").selectAll("circle").filter(function(d){
			node.push(d);
		});
	return node;
}

function getSemesterInfo(dataCor,json_nodes){
	var len_data = dataCor.length;
	var year = 0;
	var len = 0;

	var time_info = [];
	var course_info = [];
	var node_id = [];

	var name_course = getCourseName(dataCor,len_data);
	var info_data = getInfoData(dataCor,name_course,len_data);
    var info_semester = getInfoSemester(name_course,info_data,len_data);
	    main_view.select("#NodeLinkGraph").select(".gradeYear").filter(function(d){
	    	year = parseInt(this.id.slice(-4));
	    });
    var info = computeInfo(info_semester,info_data,name_course,len_data,year);

		course_info = info[0];
	    course_index = info[1];
	    time_info = info[2];
	    //按学期获取课程id
	    for(var i = 0; i < time_info.length; i++){
	        var temp = [];
	        var max_index = len;
	        for(var j = len; j < len + time_info[i].count;j++){
	            if(course_info[j].numCor >= course_info[max_index].numCor){
	                max_index = j
	            }
	            temp.push(json_nodes[j].id);
	        }
	        len = len + time_info[i].count;
	        node_id.push(temp);
	    }
    return node_id;
}

/*
*	flag = true  : 返回高亮的课程
*	flag = false : 返回所有课程
*/
function getCourseName_HighLightCourse_LinkNode(flag){
	var node = [];
	if(flag){
		main_view.select("#NodeLinkGraph").selectAll("circle").filter(function(d){
			if(this.getAttribute("opacity") === "0.8") {
				node.push(this.id.slice(6,-8));
			} 
		});
	}
	else{
		main_view.select("#NodeLinkGraph").selectAll("circle").filter(function(d){
			node.push(this.id.slice(6,-8));
		});
	}
	return node;
}

//获取交互,节点链接图中以后高亮的课程ID
function get_courseID_NodeLink(nodes,useful_courseName){
	var courseID = [];
	for(var i = 0 ; i < nodes.length; i++){
		if(useful_courseName.contains(nodes[i].courseName)){
			courseID.push(nodes[i].id);
		}
	}
	return courseID;
}

//获取交互,节点链接图中以后高亮的课程名
function get_useful_CourseName(){
    var useful_courName = [];
    var useful_courName_WC = [];
    var useful_courName_Tree = [];
    if(ifClick_WordCloud||ifclick_CourseTree){
        if(filter_selected_flag){
            if(ifClick_WordCloud){
            	useful_courName_WC = get_selected_courseName_WordCould();
            	useful_courName = useful_courName_WC;
            }
            if(ifclick_CourseTree){
            	useful_courName_Tree = get_selected_courseName_CourseTree();
            	useful_courName = useful_courName_Tree;
            }
            if(ifClick_WordCloud&&ifclick_CourseTree){
            	useful_courName = merge_courseName(useful_courName_WC,useful_courName_Tree)
            }
            // useful_courName = getCourseName_HighLightCourse_LinkNode(ifClick_WordCloud||ifclick_CourseTree);
            selected_course_name = useful_courName;
            filter_selected_flag = false;
        }
        else{
            useful_courName = selected_course_name;
        }
    }
    else{
        useful_courName = getCourseName_HighLightCourse_LinkNode(false);
    }
    return useful_courName;
}

function get_selected_courseName_WordCould(){
	var wc_text_arr = main_view.select("#wordCloud").selectAll("text")[0];
	var selected_course_clu = "";
	var index_fill = 0;
	// for(var i = 0; i < wc_text_arr[0].getAttribute("style").replace(/\s*/g,"").split(";").length; i++ ){
	// 	if(wc_text_arr[0].getAttribute("style").replace(/\s*/g,"").split(";")[i].indexOf("fill") !== -1){
	// 		index_fill = i;
	// 	} 
	// }
	for(var i = 0; i < wc_text_arr.length ; i++){
		//if(wc_text_arr[i].getAttribute("style").replace(/\s*/g,"").split(";")[index_fill].slice(-5) === "black"){
		if(wc_text_arr[i].getAttribute("style").replace(/\s*/g,"").split(";")[2].slice(-5) === "black"){
			selected_course_clu = wc_text_arr[i].id.slice(8);
			break;
		}
	}
	for(var i = 0 ; i < data_WC.length; i++){
		if(data_WC[i].courseCluster === themeChinese(selected_course_clu)){
			return data_WC[i].courseName;
		}
	}
}
function themeChinese(d){
	if(d === "Program design") return "程序设计";
	if(d === "Applied technology") return "应用技术";
	if(d === "Database") return "数据库";
	if(d === "Computer composition") return "计算机组成";
	if(d === "Computer network") return "计算机网络";
	if(d === "Operating system") return "操作系统";
	if(d === "Basic theory") return "基础理论";
	if(d === "Computer hardware") return "计算机硬件";
	if(d === "Engineering practice") return "工程实习";
	if(d === "Data structure") return "数据结构";
	if(d === "Guidance course") return "导学课程";
	
}
function get_selected_courseName_CourseTree(){
	var c_text_arr = main_view.select("#NodeLinkTree_course").selectAll(".course_text")[0];	//获取连接树得课程圆
	var c_cir_arr = main_view.select("#NodeLinkGraph").selectAll("circle")[0];				//获取节点连接图得课程圆
	/*console.log(main_view.select("#NodeLinkGraph"));
	console.log(main_view.select("#NodeLinkGraph").selectAll("circle"));
	console.log(main_view.select("#NodeLinkGraph").selectAll(".circleCourse"));*/

	//console.log(c_text_arr);
	//console.log(c_cir_arr);
	var selected_course_type = [];
	var temp = [];
	var course_Name = [];
	for(var i = 0; i < c_text_arr.length; i++){
		if(c_text_arr[i].getAttribute("opacity") === "1"){
			temp.push(c_text_arr[i].id.slice(6));
		}
	}
/*	console.log(temp);*/

	var selected_course_type = temp.sort(function (a, b) { return b.length - a.length; });
	var longest_Str = selected_course_type[0];
	//for(var i = 0)
	for(var i = 0 ; i < c_cir_arr.length; i++){
		for(var j = 0; j < selected_course_type.length ; j++){
			if( selected_course_type[j].length === longest_Str.length && c_cir_arr[i].id.indexOf(selected_course_type[j])!== -1){
				course_Name.push(c_cir_arr[i].id.slice(6,-8));
			}
		}
	}
	return course_Name;
}

function merge_courseName(courName_A,courName_B){
	var common_cour = [];
	for(var i = 0; i < courName_A.length; i++){
		if(courName_B.contains(courName_A[i])){
			common_cour.push(courName_A[i]);
		}
	}
	for(var i = 0; i < courName_B.length; i++){
		if(courName_A.contains(courName_B[i])&&!common_cour.contains(courName_B[i])){
			common_cour.push(courName_B[i]);
		}
	}
	return common_cour;
}

function get_selected_courseName(ifclick_CourseTree,ifClick_WordCloud){
	//console.log("--->386",ifclick_CourseTree,ifClick_WordCloud);
	var courName_CT = [];   //存放点击课程树之后获取的课程名称
	var courName_WC = [];   //存放点击字符云之后获取的课程名称
	if(ifclick_CourseTree&&ifClick_WordCloud){
		courName_CT = get_selected_courseName_CourseTree();
		courName_WC = get_selected_courseName_WordCould();
		return merge_courseName(courName_CT,courName_WC);
	}
	else if(ifclick_CourseTree&&!ifClick_WordCloud){
		return get_selected_courseName_CourseTree();
	}
	else if(!ifclick_CourseTree&&ifClick_WordCloud){
		return get_selected_courseName_WordCould();
	}
	else if(!ifclick_CourseTree&&!ifClick_WordCloud){
		return getCourseName_HighLightCourse_LinkNode(false);
	}
}

function get_selected_courseID(selected_courName,selected_year){
	var selected_circleId = [];
	/*console.log("--->407",selected_courName);
	console.log("--->408",selected_year);
	var temp_name = [];
	var temp_year = [];
	for(var i = 0 ; i < selected_courName.length; i++){
		if(temp_name.length === 0){
			temp_name.push(selected_courName[i]);
			temp_year.push(selected_year[i]);
		}else{
			if(temp_name.contains(selected_courName[i])){
				var idx_name = temp_name.indexOf(selected_courName[i]);
					temp_year[idx_name].concat(selected_year[i]);
			}else{
				temp_name.push(selected_courName[i]);
				temp_year.push(selected_year[i]);
			}
		}
	}
	console.log("--->425",selected_courName);
	console.log("--->426",selected_year);*/
	/*console.log(selected_circleId);
	console.log(main_view.selectAll("#NodeLinkGraph").selectAll("text.gradeYear"));*/
	var	the_year;
	var count;
	main_view.selectAll("#NodeLinkGraph").selectAll("text.gradeYear").filter(function(){
		the_year = this.id.slice(5);	
	})
	//console.log("--->416",the_year);
	main_view.selectAll("#NodeLinkGraph").selectAll("circle")
            .attr("opacity",function(d,i){
				//console.log("coursename",this.id.slice(6,-8));
                if(selected_courName.contains(this.id.slice(6,-8))){
                	//console.log("---->420",d);
					//console.log("selected_year.length",selected_year.length);
                	if(selected_year.length === 0){
						selected_circleId.push(d.id);
                	}else{
						//console.log("selected_courName.lenght",selected_courName.length);
						for(var i=0;i<=selected_courName.length;i++){
							
								//console.log(this.id.slice(6,-8),selected_courName[i]);
							if(selected_courName[i]===this.id.slice(6,-8)){
								console.log(selected_year[i],the_year,selected_courName[i],this.id.slice(6,-8),i);
								if(selected_year[i].contains(the_year)||selected_year[i].contains(Number(the_year))){
                			//console.log("---->428",selected_courName[idx],selected_year[idx],this.id.slice(6,-8));
                			selected_circleId.push(d.id);
                		}
								
								
							}
							
							
						}
                		/*var idx = selected_courName.indexOf(this.id.slice(6,-8));
						console.log("idx",idx);
						console.log("selected_year[idx]",selected_year[idx]);
						console.log("selected_year",selected_year);
                		//console.log("---->426",selected_courName[idx],selected_year[idx],this.id.slice(6,-8));
                		if(selected_year[idx].contains(the_year)||selected_year[idx].contains(Number(the_year))){
                			//console.log("---->428",selected_courName[idx],selected_year[idx],this.id.slice(6,-8));
                			selected_circleId.push(d.id);
                		}*/
                	}
                    
                }
            });
    //console.log(selected_circleId,selected_circleId.length);
    return selected_circleId;
}