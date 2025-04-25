function drawTeacherMap(){
	$('#MainView');

	var color_opacity = [0.2,0.35,0.5,0.65,0.8,1];
	var color = ["blue","green","red"];
	// color60以下, color60to69, color70to79, color80to89, color90to100
	var color_bar = ["hsl(0,100%,40%)","hsl(60,100%,40%)","hsl(80,100%,40%)","hsl(190,100%,40%)","hsl(210,100%,40%)"];
	
	var color必修="hsl(90,100%,50%)",color选修="hsl(270,100%,50%)",
		color必修理论="hsl(45,100%,50%)",color必修实践="hsl(135,100%,50%)",
		color选修理论="hsl(315,100%,50%)",color选修实践="hsl(225,100%,50%)",
	    color必修理论低学分="hsl(22.5,100%,50%)",color必修理论高学分="hsl(67.5,100%,50%)", 
	    color必修实践低学分="hsl(157.5,100%,50%)",color必修实践高学分="hsl(112.5,100%,50%)",
	    color选修理论低学分="hsl(337.5,100%,50%)",color选修理论高学分="hsl(292.5,100%,50%)", 
	    color选修实践低学分="hsl(202.5,100%,50%)",color选修实践高学分="hsl(247.5,100%,50%)";

	var color教授="hsl(50,100%,25%)",color副教授="hsl(170,100%,25%)",
		color讲师="hsl(290,100%,25%)",color教授男="hsl(20,100%,25%)",
		color教授女="hsl(80,100%,25%)",color副教授男="hsl(140,100%,25%)",
		color副教授女="hsl(200,100%,25%)",color讲师男="hsl(260,100%,25%)",
		color讲师女="hsl(320,100%,25%)";

	var color2007="hsl(0,85%,35%)",color2008="hsl(45,85%,35%)",
		color2009="hsl(90,85%,35%)",color2010="hsl(135,85%,35%)";

	var info_data = [];
	var move_x = [72.5,130,165];

	var oldTeacher = "";
	var flagClick = false; 

	var LikeNode_node = [];
	var sem_Info = [];
	var nodeID_TM = [];
	var height = 75;

	var teacherMap = main_view.append("g")
							.attr("id", "overall_teacherMap_g")
							.attr("transform", "translate(1140,8)");
     //点击教师标签会显示该教师的成绩分布
	var tooltip_TeacherMap = d3.select("body").append("div")
								.attr("class", "tooltip_tm")
								//.attr("class", "tooltip")
								.attr("id","tooltip_TeacherMap")
								.style("opacity", 0);
		tooltip_TeacherMap.append("svg")
							.attr("class","histogram")
							.attr("width",0)
							.attr("height",0);

	d3.csv("data/new_scores_ER_New.csv", function (error,data){
		if(error) console.log(error);
		//console.log(data)
		var teacher_data = data;
		var tSquareLength = 22,	//教师矩形边长
			tSquareHight = 22;	//教师矩形高度,需要另外计算
		var t_padding = 5;		//教师间间隔

		var begin_x = 33,		//起始x
			begin_y = 5;		//起始y

		var item_padding = 5,			//组内元素间隔
			inner_item_padding = 2,		//组内元素子元素间隔
			ininner_item_padding = 1,	//组内元素子元素内间隔
			rect_width_c_t = 5;			//课程属性、年级宽度

		var height_rate = 4;	//授课详细信息的中矩形高度

		var sta_length = 60;

		var begin_sta_x = begin_x + rect_width_c_t + inner_item_padding,//成绩统计分布的起始x坐标
			begin_year_x = begin_sta_x + sta_length + inner_item_padding;//授课年级的起始x坐标

		var begin_courseNum_x = begin_year_x + 4*rect_width_c_t + 3*ininner_item_padding + item_padding,//教师授课数量的起始x坐标
			begin_post_x = begin_courseNum_x + tSquareLength + item_padding;//教师职称的起始x坐标
		
		var	begin_text_x = begin_post_x + tSquareLength + item_padding - 2,//教师编号的起始x坐标
			begin_text_y = 0;	//需要重新计算

		var background_width = tSquareLength*2 + sta_length + rect_width_c_t*5 + 
								inner_item_padding*2 + 3*ininner_item_padding + item_padding*2 + 1,
			background_height = tSquareHight + 1;	//需要重新计算

		var begin_y_g = 0;

			info_data = dealRawData(data);
			console.log("info_data1",info_data);
			info_data = reSortBycourseNum_6_to_1(info_data);//按照课程名排序
			console.log("info_data2",info_data);
			info_data = reSortByPost_A_to_Z(info_data);//按照职称排序
            console.log("info_data3",info_data);
			LikeNode_node = getNodeInfo_LinkNode();//获得节点链接图中的数据
			console.log("LikeNode_node",LikeNode_node);
			sem_Info = getSemesterInfo(data_cor,LikeNode_node);//课程上课学期
            console.log("sem_Info",sem_Info);

			teacherMap.append("g")
					.attr("id","itemInfo")
					.attr("transform", "translate(" + 0 + "," + -20 + ")")
					.selectAll(".text")
					.data(["成绩分布","授课数","职称"])
					.enter()
					.append("text")
					.attr("transform",function (d,i) {
						return "translate(" +(move_x[i]-12)+ "," + 22 + ")" + "rotate("+(-12)+")";
					})
					.text(function(d){
						return toEnglish(d);
					})
					.attr("font-size","7px")
			    	.attr("text-anchor","start")
			    	.style("fill", "block");

		// console.log(info_data);

		for(var n = 0; n < info_data.length; n++){
				tSquareHight = height_rate * info_data[n].courseNum + ininner_item_padding * ( info_data[n].courseNum - 1 );//计算每个教师矩形的起始y坐标
				background_height = (tSquareHight < 14)?14:(tSquareHight>22?22:tSquareHight);
				begin_text_y = (tSquareHight <= 14)?(16):(tSquareHight>=22?20:tSquareHight);

				//console.log(tSquareHight);
				//添加每个教师授课的背景
				teacherMap.append("rect")
						.attr("class",function(d){
							return "bg_class"/* + info_data[n].post*/; //背景色 class
						})
						.attr("id",function(d){
							return "bg_id_" + info_data[n].name;	//背景色 id
						})
						.attr("x",begin_x - 0.5)
						.attr("y",begin_y - 0.5 + begin_y_g)
						.attr("width",background_width)
						.attr("height",background_height)
						.attr("fill","gray")
						.attr("opacity",0.3);

			//添加一个教师的授课信息g元素
			var teacher_g = teacherMap.append("g")
						.attr("id", function(){
							return "teacherG_" + info_data[n].name;
						})
						.attr("class","teacherMap_g_"+info_data[n].post)
						.attr("ifchangeItemAttr","no")			//不能往d3属性中添加true或false
						.attr("transform", "translate(" + 0 + "," + begin_y_g + ")");

				//可视化教师授课数量
				teacher_g.append("rect")
						.attr("fill","red")
						.attr("class","courseNum_T")
						.attr("id",function(){
							return "courseNum_" + info_data[n].name;
						})
						.attr("x",begin_courseNum_x)
						.attr("y",begin_y)
						.attr("width",tSquareLength)
						.attr("height",background_height)
						.attr("opacity",color_opacity[info_data[n].courseNum - 1]);

				//可视化教师职位
				teacher_g.append("rect")
						.attr("fill",function(){
							return eval("color" + info_data[n].post);
						})
						.attr("x",begin_post_x)
						.attr("y",begin_y)
						.attr("width",tSquareLength)
						.attr("height",background_height);

				//添加教师编号,并添加交互响应
				teacher_g.append("text")
				    	.attr("transform",function () {
					        return "translate(" +begin_text_x+ "," + begin_text_y + ")";
					       })
				    	.attr("class","teacher_text")
						.attr("id",function(){
							return "teacherID_" + info_data[n].name;
						})
						.attr("style","cursor:pointer") 
				    	.text(function(d,i){
				    		return info_data[n].name;
				    	})
				    	.attr("font-size","12px")
				    	.attr("text-anchor","start")
				    	.style("fill", "block")
				    	.on("click",function(d){
				    		/*console.log(this);
				    		console.log(this.id);
				    		console.log(this.id.slice(-2));
				    		console.log(LikeNode_node);*/
				    		console.log(d);
				    		console.log(this);

				    		console.log(info_data);

				    		var teacher_id_click = this.id.slice(-2);	//存放teacher_id
				    		var selected_courName = [];
				    		var selected_courYear = [];
				    		var c_info = [];
                            	c_info = get_CourseInfo_Post(teacher_id_click,info_data);
                            console.log(c_info);

                            var courseName_arr = getCourseName_HighLightCourse_LinkNode(false);
                                nodeID_TM = [];

                            //console.log(LikeNode_node);
                            
                            //注释之间的代码大概还可以优化
                            selected_courName = c_info[0];
                            selected_courYear = c_info[1];
                            nodeID_TM = get_selected_courseID(selected_courName,selected_courYear);

                            /*for(var i = 0; i < c_info[0].length; i++){
                            	for(var j = 0; j < LikeNode_node.length; j++){
                            		if(c_info[0][i] === LikeNode_node[j].courseName){
                            			selected_courName.push(LikeNode_node[j].courseName);
                            			nodeID_TM.push(LikeNode_node[j].id);
                            		}
                            	}
                            }*/
                            // nodeID_TM = get_selected_courseID(selected_courName);
							teacherMap.selectAll(".bg_class").attr("opacity",0.3);
							heatmap_g.selectAll("g").selectAll(".highlightCourse").remove();
				    		if(oldTeacher === "" || oldTeacher !== teacher_id_click){
                                flagClick = true;
                                oldTeacher = teacher_id_click;
								 if_TeacherMap=true;
                            }else{
                                flagClick = false;
                                oldTeacher = "";
								 if_TeacherMap=false;
                            }
                            if(flagClick){
                            	teacherMap.select("#bg_id_"+teacher_id_click).attr("opacity",0.8);
                            	for(var k = 2007; k <= 2010; k++){
                            		highlightCourse(c_info[0],k,flagClick,c_info[1]);	//这个函数在drawLinkNode.js中
                            	}
                            }
                            else{
                            	teacherMap.selectAll(".bg_class").attr("opacity",0.3);
                            	for(var k = 2007; k <= 2010; k++){
                            		highlightCourse(c_info[0],k,flagClick,c_info[1]);
                            	}
                            }

                            console.log(nodeID_TM);
                            show_useful_courseCircle(flagClick,ifStudentNum,true,nodeID_TM,selected_courName);
							selected_node=nodeID_TM;
                            if(flagClick){
								tooltip_TeacherMap.select("svg").selectAll("path").remove();
								tooltip_TeacherMap.select("svg").selectAll("text").remove();
								tooltip_TeacherMap.select("svg").selectAll("rect").remove();
								tooltip_TeacherMap.select("g.flag").selectAll("#axis_te").remove();
								drawDetail_TM(teacher_id_click, info_data);
							}else{
								tooltip_TeacherMap.select("svg").attr("width",0).attr("height",0);
								tooltip_TeacherMap.style("opacity", 0.0);
								//清除提示
							}
							
   				    	});

			var height_rate = (tSquareLength - (info_data[n].teachInfo.length - 1))/info_data[n].teachInfo.length;
				height_rate = (height_rate>=4)?4:height_rate;

			for(var k = 0; k < info_data[n].teachInfo.length; k++){
				var dataset_a = [0,0,0];
				var dataset_b=[0,0,0];
				for(var l = 0; l < info_data[n].teachInfo[k].scoreRate.length; l++){
					dataset_a[0] = dataset_a[0] + info_data[n].teachInfo[k].scoreRate[l][0] + info_data[n].teachInfo[k].scoreRate[l][1];
					dataset_a[1] = dataset_a[1] + info_data[n].teachInfo[k].scoreRate[l][2] + info_data[n].teachInfo[k].scoreRate[l][3];
					dataset_a[2] = dataset_a[2] + info_data[n].teachInfo[k].scoreRate[l][4];
				}
				dataset_a[0] = dataset_a[0]/info_data[n].teachInfo[k].scoreRate.length;
				dataset_a[1] = dataset_a[1]/info_data[n].teachInfo[k].scoreRate.length;
				dataset_a[2] = dataset_a[2]/info_data[n].teachInfo[k].scoreRate.length;
				dataset_b[0]=dataset_a[2];
				dataset_b[1]=dataset_a[1];
				dataset_b[2]=dataset_a[0];
				//courseInfo_t.courseName = info_data[n].teachInfo.courseName; 
				/*console.log(info_data[k]);
				console.log(dataset_a);*/
				teacher_g.selectAll(".rect")
						.data(dataset_a)
						.enter()
						.append("rect")
						.attr("class","courseCredit")
						.attr("fill",function(d,i){
							return color[i];
						})
						.attr("x",function(d,i){
							var totle = d3.sum(dataset_a.slice(0,i));
							return begin_sta_x + sta_length * totle;
						})
						.attr("y",function(d,i){
							return rect_width_c_t + (height_rate+ininner_item_padding)*k;
						})
						.attr("width",function(d,i){
							return sta_length * d;
						})
						.attr("height",height_rate);

				teacher_g.append("rect")
						.attr("id",function(){
							return "courseType_" + info_data[n].teachInfo[k].courseName;
						})
						.attr("class","courseType")
						.attr("x",begin_x)
						.attr("y",function(){
							return rect_width_c_t + ( height_rate + ininner_item_padding)*k;
						})
						.attr("width",rect_width_c_t)
						.attr("height",height_rate)
						.attr("fill",function(){
							return eval("color"+info_data[n].teachInfo[k].courseAttribute);
						});

				teacher_g.selectAll(".rect")
						.data(info_data[n].teachInfo[k].courseYear)
						.enter()
						.append("rect")
						.attr("class","courseYear")
						.attr("id",function(d){
							return d + "_" + info_data[n].teachInfo[k].courseName;
						})
						.attr("fill",function(d,i){
							return eval("color" + d);
						})
						.attr("x",function(d,i){
							return begin_year_x + (rect_width_c_t+ininner_item_padding)*(d-2007);
						})
						.attr("y",function(d){
							return rect_width_c_t + (height_rate+ininner_item_padding)*k;
						})
						.attr("width",rect_width_c_t)
						.attr("height",height_rate);
			}

			begin_y_g = begin_y_g + background_height + t_padding;
			height_rate = 4;
		}
	});

	//将原始数据转化成自己需要的数据
	//同dealCourseInfo(teacherInfo,temp_teacherInfo,info_arr)的返回值
	function dealRawData(data){
		var temp_teacherInfo = [];
		var teacherInfo = [];
		var j = {};
		var info_arr = [];
		for(var i = 0; i < data.length; i++){
			j.name = data[i].授课教师;
			j.post = data[i].教师职称 + data[i].教师性别;
			j.courseNum = parseInt(data[i].授课数量);
			if(!temp_teacherInfo.contains(data[i].授课教师)){
				temp_teacherInfo.push(data[i].授课教师);
				teacherInfo.push(j);
			}
			j = {};
		}

		for(var i = 0; i < temp_teacherInfo.length; i++){
			var temp_info = [];
			for(var k = 0; k < data.length; k++){
				if(temp_teacherInfo[i] === data[k].授课教师){
					temp_info.push(data[k]);
				}
			}
			info_arr.push(temp_info);
			temp_info = [];
		}
		/*console.log(teacherInfo);
		console.log(temp_teacherInfo);
		console.log(info_arr);*/
		return dealCourseInfo(teacherInfo,temp_teacherInfo,info_arr);
	}

	//教师教授的将课程信息提取出来
	//返回对象数组
	/*
	*  	{
	*		courseNum: 1
	*		name: "f3"
	*		post: "讲师女"
	*		teachInfo:[	//数组,存放着课程信息{对象}
	*			{
	*				courseName: "C语言课程设计", 			
	*				courseAttribute: "必修实践低学分", 
	*				courseYear: [2007], 			//课程年级
	*				scoreRate: [[0.75, 0.25, 0]]	//各评分阶段人数占比
	*			}
	*		]
	*	}
	*/
	function dealCourseInfo(teacherInfo,temp_teacherInfo,info_arr){
		var courseInfo = [];	//存储着所需课程信息,目前还没什么有
		var temp_course = [];	//临时存放课程名
		var j = {};
		for(var i = 0; i < temp_teacherInfo.length; i++){
			var temp = [];		//临时存放着某位老师所授课程的课程信息
			for(var k = 0; k < info_arr[i].length; k++){
				var temp_score_rate = [];
				if(!temp_course.contains(info_arr[i][k].课程名)){
					temp_course.push(info_arr[i][k].课程名);
					j.courseName = info_arr[i][k].课程名;
					j.courseAttribute = info_arr[i][k].选修方式 +
										info_arr[i][k].课程类型 +  
										info_arr[i][k].学分;
					
					temp_score_rate.push(parseFloat(info_arr[i][k].分90_100));
					temp_score_rate.push(parseFloat(info_arr[i][k].分80_89));
					temp_score_rate.push(parseFloat(info_arr[i][k].分70_79));
					temp_score_rate.push(parseFloat(info_arr[i][k].分60_69));
					temp_score_rate.push(parseFloat(info_arr[i][k].分60以下));

					j.courseYear = [];
					j.courseYear.push(parseInt(info_arr[i][k].年级));
					j.scoreRate = [];
					j.scoreRate.push(temp_score_rate);
					j.teaEvaluationER = []
					j.teaEvaluationER.push(info_arr[i][k].评教优秀率)
					j.stuScoreER = []
					j.stuScoreER.push(info_arr[i][k].课程平均分优秀率)
					temp.push(j);
				}
				else{
					var index_cour = temp_course.indexOf(info_arr[i][k].课程名);

					temp_score_rate.push(parseFloat(info_arr[i][k].分90_100));
					temp_score_rate.push(parseFloat(info_arr[i][k].分80_89));
					temp_score_rate.push(parseFloat(info_arr[i][k].分70_79));
					temp_score_rate.push(parseFloat(info_arr[i][k].分60_69));
					temp_score_rate.push(parseFloat(info_arr[i][k].分60以下));

					temp[index_cour].courseYear.push(parseInt(info_arr[i][k].年级));
					temp[index_cour].scoreRate.push(temp_score_rate);
					temp[index_cour].teaEvaluationER.push(info_arr[i][k].评教优秀率)
					temp[index_cour].stuScoreER.push(info_arr[i][k].课程平均分优秀率)
				}
				j = {};
			}
			teacherInfo[i].teachInfo = reSortTeachInfo_A_to_Z(temp);
			courseInfo.push(temp);
			temp_course = [];
		}
		//console.log(teacherInfo)
		return teacherInfo;
	}

	//按授课数量排列授课教师
	function reSortBycourseNum_6_to_1(info_data){
		var temp = {}
		var index_info = [];
		for(var i = 0; i < info_data.length-1; i++){
			for(var j = 0; j < info_data.length - i - 1; j++){
				if(info_data[j].courseNum < info_data[j+1].courseNum){
					temp = info_data[j];
					info_data[j] = info_data[j+1];
					info_data[j+1] = temp;
				}
			}
		}
		return info_data;
	}

	//以职称排列授课教师,排列标准:post_info
	function reSortByPost_A_to_Z(info_data){
		var info = [];
		var post_info = ["教授男","教授女","副教授男","副教授女","讲师男","讲师女"];
		var index_info = [];
		for(var i = 0; i < post_info.length; i++){
			for(var j = 0; j < info_data.length; j++){
				if(info_data[j].post === post_info[i]){
					index_info.push(j);
				}
			}
		}
		for(var i = 0; i < index_info.length; i++){
			info.push(info_data[index_info[i]]);
		}
		return info;
	}

	//按课程属性排列授课教师的授课类型,排列标准:courseAttr_info
	function reSortTeachInfo_A_to_Z(temp){
		var info = [];
		var index_info = [];
		var courseAttr_info = ["必修理论高学分","必修理论低学分","必修实践高学分","必修实践低学分",
							   "选修理论高学分","选修理论低学分","选修实践高学分","选修实践低学分"];
		for(var i = 0; i < courseAttr_info.length; i++){
			for(var j = 0; j < temp.length; j++){
				if(courseAttr_info[i] === temp[j].courseAttribute){
					index_info.push(j);
				}
			}
		}
		for(var i = 0; i < index_info.length; i++){
			info.push(temp[index_info[i]]);
		}
		return info;
	}

	//获取某个教师的授课信息和职位、评分优秀率、学生平均分优秀率
	function get_CourseInfo_Post(teacher_name,info_data){
		var c_name = [];
		var c_garde = [];
		var te_ER = [];
		var stu_ER = [];
		var cour_Attr = [];
		var t_post = "";
		var temp = [];
		for(var i = 0; i < info_data.length; i++){
			if(info_data[i].name === teacher_name){
				t_post = info_data[i].post;
				for(var j = 0; j < info_data[i].teachInfo.length; j++){
					c_name.push(info_data[i].teachInfo[j].courseName);
					c_garde.push(info_data[i].teachInfo[j].courseYear);
					te_ER.push(info_data[i].teachInfo[j].teaEvaluationER);
					stu_ER.push(info_data[i].teachInfo[j].stuScoreER);
					cour_Attr.push(info_data[i].teachInfo[j].courseAttribute);
				}
				break;
			}
		}
		/*console.log(c_name);
		console.log(c_garde);*/
		temp.push(c_name,c_garde,t_post,te_ER,stu_ER,cour_Attr);
		return temp;
	}

	//分离出教师授课的课程
	function get_useful_info(course_name_grade,course_grade){
		/*console.log(course_grade);
		console.log(course_name_grade);*/
		var temp = [];
		for(var i = 0; i < course_name_grade.length; i++){
			for(var j = 0; j < course_name_grade[i].grade.length; j++){
				if(course_grade[i].contains(parseInt((course_name_grade[i].grade[j])))){
					temp.push((course_name_grade[i].grade)[j]);
				}
			}
			course_name_grade[i].grade = temp;
			temp = [];
		}
		//console.log(course_name_grade);
		return course_name_grade;
	}

	//抽取出教师教授课程成绩的分数段
	function get_course_sorce_statistical_data(teacher_name,info_data){
		var dataset = [];
		var temp = [0,0,0,0,0];
		for(var i = 0 ; i < info_data.length ; i++){
			if(teacher_name === info_data[i].name){
				for(var j = 0 ; j < info_data[i].teachInfo.length; j++){
					if(info_data[i].teachInfo[j].scoreRate.length === 1){
						dataset.push(info_data[i].teachInfo[j].scoreRate[0]);
					}
					else{
						for(var l = 0 ; l <info_data[i].teachInfo[j].scoreRate.length; l++){
							temp[0] = temp[0] + info_data[i].teachInfo[j].scoreRate[l][0];
							temp[1] = temp[1] + info_data[i].teachInfo[j].scoreRate[l][1];
							temp[2] = temp[2] + info_data[i].teachInfo[j].scoreRate[l][2];
							temp[3] = temp[3] + info_data[i].teachInfo[j].scoreRate[l][3];
							temp[4] = temp[4] + info_data[i].teachInfo[j].scoreRate[l][4];
						}
						temp[0] = temp[0]/info_data[i].teachInfo[j].scoreRate.length;
						temp[1] = temp[1]/info_data[i].teachInfo[j].scoreRate.length;
						temp[2] = temp[2]/info_data[i].teachInfo[j].scoreRate.length;
						temp[3] = temp[3]/info_data[i].teachInfo[j].scoreRate.length;
						temp[4] = temp[4]/info_data[i].teachInfo[j].scoreRate.length;
						dataset.push(temp);
						temp = [0,0,0,0,0];
					}
				}
				break;
			}
		}
		return dataset;
	}

	function drawDetail_TM(teacher_name,info_data){
		var course_grade = [];			//存储教师教授课程所在学期
		var course_name = [];			//存储某个类别中课程名字
		var course_name_grade = [];		//存储课程名字和对应的年级
		var course_SorceSets = [];		//存储某一个课程的学生成绩集合
		var course_DataCorr = [];		//存储所有课程的相关性
		var course_nowCorr = [];		//存储当前课程的相关性
		var course_str = []; 			//这个我也不太清楚是干啥的
		var course_Sorce_Static = [];	//存储各个分数段的统计量
		var teacher_post = "";			//存放教师职位
		var teacherEva_Er = [];			//存放教师评教得分优秀率
		var studentSco_Er = [];			//存放学生平均分优秀率
		var course_Attr = [];			//存储课程属性

		//console.log(info_data);

		var temp = [];

		//选取提取课程聚类包含的课程和索引
		temp = get_CourseInfo_Post(teacher_name,info_data);
		course_name = temp[0];
		course_grade = temp[1];
		teacher_post = temp[2];
		teacherEva_Er = temp[3];
		studentSco_Er = temp[4];
		course_Attr = temp[5];
		/*console.log(temp);
		console.log(course_name);
		console.log(course_grade);
		console.log(teacher_post);*/
		course_name_grade = get_Course_and_Grade(course_name);	//cou3
		course_name_grade = get_useful_info(course_name_grade,course_grade);
		course_SorceSets  = get_score_Set(course_name_grade);	//datasetHis2
		course_Sorce_Static = get_course_sorce_statistical_data(teacher_name,info_data);
		course_DataCorr = get_cor_Matrix();							//datacorr
		course_str = get_str(course_DataCorr,course_name_grade);
		course_nowCorr = get_courseCor(course_DataCorr,course_name,course_str);	//cor

		//设定提示框SVG长度、宽度,原来440
		tooltip_TeacherMap.select("svg")
					.attr("width",560).attr("height",function(){
						return 30 + height*course_name.length + 10;
					});

		tooltip_TeacherMap.select("svg")
					.append("g")
					.attr("class","flag")
					.attr("transform","translate(0,5)");

		tooltip_TeacherMap.style("opacity",1);
		for(var i = 0; i < course_name_grade.length; i++){
			Histogram_TM(course_SorceSets[i],course_name_grade[i].grade,course_name_grade[i].course,course_Sorce_Static[i],teacherEva_Er[i],studentSco_Er[i],course_Attr[i],i);
		}

		tooltip_TeacherMap.select("g.flag").append("g")
				.append("rect")
				.attr("x",function(){
					return 4*35+100;
				})
				.attr("y",function(){return 0;})
				.attr("width",20)
				.attr("height",10)
				.style("fill",eval("color"+teacher_post));		
		tooltip_TeacherMap.select("g.flag").append("g")
				.append("text")
				.attr("class","TeacherName_TM")
				.attr("font-size",12)
				.attr("dx",4*35+103)
				.attr("dy",function(){return 25;})
				.text(teacher_name)
				.style("fill","Black");
	}

	function Histogram_TM(dataset,grade,courseName,scoreStaticData,tea_Er,stu_Er,courseAttr,flag){
		/*console.log(dataset);
		console.log(grade);
		console.log(courseName);
		console.log(scoreStaticData);
		console.log(flag);
		console.log("aa");*/
		var first=0;
		for(var i=0;i<dataset.length;i++){
			for(var j=0;j<grade.length;j++){
				if(dataset[i][0]==grade[j]&&first==0){
					drawHistogram_TM(dataset[i],flag,true,courseName,courseAttr);
					first=1;
				}
				else if(dataset[i][0]==grade[j]&&first==1){
					drawHistogram_TM(dataset[i],flag,false,courseName,courseAttr);
					first=1;
				}
			}
		}
		drawBarGraph_TM(scoreStaticData,flag);

		//console.log("649-->",tea_Er);
		//存储有记录的变量
		var use_grade = [];
		var use_tea_Er = [];
		var use_stu_Er = [];
		for(var i = 0; i < tea_Er.length; i++){
			if(tea_Er[i]!==""){
				use_grade.push(grade[i]);
				use_tea_Er.push(tea_Er[i]);
				use_stu_Er.push(stu_Er[i]);
			}
		}
		if(use_grade.length!=0){
			drawbarER_TM(use_grade,use_tea_Er,use_stu_Er,flag);
		}
	}

	//绘制教师教学成绩成绩分布直方图
	function drawHistogram_TM(dataset,flag,firsttime,str,courseAttr){
		var dataset2 = dataset.slice(1,dataset.length);
		for(var i = dataset2.length-1 ; i > -1 ; i--){
			if(dataset2[i] == "") dataset2.pop();
		}
		var left = 30;	//学生成绩分布直方图g元素的左边位置
		var rangeMin = 0, rangeMax = 100;
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

		var yAxisWidth = 120;
		var yScale = d3.scale.linear()
						.domain([0,1])
						.range([0,yAxisWidth]);
		var lineGenerator = d3.svg.line()
								.x(function(d){return xScale(d.x)})
								.y(function(d){return height-yScale(d.y)})
								.interpolate("basis");

		var gLine = tooltip_TeacherMap.select("g.flag").append("g")
							.attr("transform","translate("+left+","+0+")");

			gLine.append("path")
					.attr("class","linePath")
					.attr("transform","translate("+0+","+(flag)*height+")")
					.attr("d",lineGenerator(hisData))
					.attr("stroke",eval("color"+dataset[0]))
					.attr("stroke-width","3px")
					.attr("fill","none");

		// 保证text绘制过程中，年份只绘制过一次
		var flag_text_year = 0;
		for(flag_text_year = 0; flag_text_year < d3.selectAll("text.yearText_TM")[0].length ; flag_text_year++)
			if(d3.selectAll("text.yearText_TM")[0][flag_text_year].textContent==dataset[0]) break;
		if((flag_text_year == 0 && d3.selectAll("text.yearText_TM")[0].length ==0 )||
			flag_text_year == d3.selectAll("text.yearText_TM")[0].length){
			gLine.append("rect")
				.attr("x",function(){
					return (dataset[0]-2007)*35+20;
				})
				.attr("y",function(){return 0;})
				.attr("width",20)
				.attr("height",10)
				.style("fill",eval("color"+dataset[0]));

			gLine.append("text")
				.attr("class","yearText_TM")
				.attr("font-size",12)
				.attr("dx",(dataset[0]-2007)*35+20-3)	//减3是为了对其
				.attr("dy",function(){return 25;})
				.text(dataset[0])
				.style("fill","Black");
		}

		var flag_text_name = 0;
		for(flag_text_name = 0; flag_text_name < d3.selectAll("text.nameText_TM")[0].length ; flag_text_name++){
			var rightCourseName = getRightName(str)
			if(d3.selectAll("text.nameText_TM")[0][flag_text_name].textContent == rightCourseName) break;
		}
		if((flag_text_name == 0 && d3.selectAll("text.nameText_TM")[0].length == 0 )||
			flag_text_name == d3.selectAll("text.nameText_TM")[0].length){
			tooltip_TeacherMap.select("g.flag").append("g")
						.attr("class","axis")
						.attr("transform","translate("+left+","+(flag+1)*height+")")
						.call(xAxis);
			gLine.append("text")
					.attr("class","nameText_TM")
					.attr("text-anchor", "middle")
					.attr("font-size",12)
					.attr("dx",100)
					.attr("dy",function(){return (flag+1)*height + 30;})
					.text(getRightName(str))
					.style("fill","Black");
			//添加课程属性
			gLine.append("circle")
					.attr("class","courseAttr_TM")
					.attr("cx",function(d){
						return -10;
						//return left;
					})
					.attr("cy",function(d){
						return (flag+1)*height;
					})
					.attr("r",5)
                    .attr("style","cursor:pointer")
					.attr("fill",function(d,i){
                        return eval("color"+courseAttr);
					});
		}
	}

	//绘制教师整体教学成绩分布直方图
	function drawBarGraph_TM(dataset,flag){
		var xAxisWidth = 200;
		var tick_me = ["0-59","60-69","70-79","80-89","90-100"];
		var move_me = [7,2,2,2,1];
		var left = 240;

		var xScale = d3.scale.ordinal()		//x轴比例尺(序数比例尺)
						.domain(d3.range(dataset.length))
						.rangeRoundBands([0,xAxisWidth],0.2);

		var yScale = d3.scale.linear()		//y轴比例尺(线性比例尺)
						.domain([0,d3.max(dataset)])
						.range([0,height-20]);

		var xAxis = d3.svg.axis()			//x轴
						.scale(xScale)
						.orient("bottom");
						/*.tickFormat(function(d,i){
							return tick_me(i);
						});*/
						//.tickValue(["0-59","60-69","70-79","80-89","90-100"]);

			tooltip_TeacherMap.select("g.flag").append("g")
								.attr("class","axis_b")
								.attr("transform","translate("+left+","+(flag+1)*height+")")
								.call(xAxis); 

			tooltip_TeacherMap.select("g.flag").append("g")
							.attr("class","new_tick")
							.attr("transform","translate("+left+","+((flag+1)*height+15)+")")
							.selectAll("text")
							.data(tick_me)
							.enter()
							.append("text")
							.attr("transform",function (d,i) {
								return "translate(" +(xScale(i)+move_me[i])+ "," + 0 + ")" + "rotate("+(-10)+")";
							})
							.text(function(d){
								return d;
							});

		var myBarGraph = tooltip_TeacherMap.select("g.flag").append("g")
							.attr("transform","translate("+left+","+(flag)*height+")");

		var rect = myBarGraph.selectAll("rect")
						.data(dataset)				//绑定数据
						.enter()					//获取enter部分
						.append("rect")				//添加rect元素,使其与绑定数组的长度一致
						.attr("fill",function(d,i){ //设置色彩为steelblue
							return color_bar[4-i];
						})
						.attr("x",function(d,i){	//设置矩形的x坐标
							return xScale(4-i);
						})
						.attr("y",function(d,i){	//设置矩形的y坐标
							return height - yScale(d);
						})
						.attr("width",xScale.rangeBand())	//设置矩形的宽度
						.attr("height",function(d){			//设置矩形的高度
							return yScale(d);
						});
		}

		//绘制教师评教排名直方图
		function drawbarER_TM(grade,tea_Er,stu_Er,flag){
			var xAxisWidth = 100;
			var tick_me = grade;
			var bar_width = 10;

			var xScale = d3.scale.ordinal()		//x轴比例尺(序数比例尺)
							.domain(d3.range(tea_Er.length))
							.rangeRoundBands([0,xAxisWidth],0.2);

			var yScale = d3.scale.linear()		//y轴比例尺(线性比例尺)
							.domain([0,1])
							.range([0,height-20]);

			var xAxis = d3.svg.axis()			//x轴
							.scale(xScale)
							.orient("bottom");

				tooltip_TeacherMap.select("g.flag").append("g")
									.attr("class","axis_b")
									.attr("id","axis_te")
									.attr("transform","translate("+450+","+(flag+1)*height+")")
									.call(xAxis);

				tooltip_TeacherMap.select("g.flag").append("g")
								.attr("class","new_tick")
								.attr("transform","translate("+450+","+((flag+1)*height+15)+")")
								.selectAll("text")
								.data(tick_me)
								.enter()
								.append("text")
								.attr("transform",function (d,i) {
									return "translate(" +(xScale(i)+ xScale.rangeBand()/4)+ "," + 0 + ")" + "rotate("+(-10)+")";
								})
								.text(function(d){
									// console.log(d);
									return d;
								});
			var myBarGraph = tooltip_TeacherMap.select("g.flag").append("g")
							.attr("transform","translate("+450+","+(flag)*height+")");

			var rect = myBarGraph.selectAll(".rect")
						.data(tea_Er)				//绑定数据
						.enter()					//获取enter部分
						.append("rect")				//添加rect元素,使其与绑定数组的长度一致
						.attr("fill",function(d,i){ //设置色彩为steelblue
							return color_bar[4-i];
						})
						.attr("x",function(d,i){	//设置矩形的x坐标
							return xScale(i) + xScale.rangeBand()/2 - bar_width/2;
						})
						.attr("y",function(d,i){	//设置矩形的y坐标
							return height - yScale(d);
						})
						.attr("width",bar_width)	//设置矩形的宽度
						//.attr("width",xScale.rangeBand()/3)	//设置矩形的宽度
						.attr("height",function(d){			//设置矩形的高度
							return yScale(d);
						});

			/*var rect = myBarGraph.selectAll(".rect")
						.data(stu_Er)				//绑定数据
						.enter()					//获取enter部分
						.append("rect")				//添加rect元素,使其与绑定数组的长度一致
						.attr("fill",function(d,i){ //设置色彩为steelblue
							return color_bar[4-i];
						})
						.attr("x",function(d,i){	//设置矩形的x坐标
							return (xScale(i)+12);
						})
						.attr("y",function(d,i){	//设置矩形的y坐标
							return height - yScale(d);
						})
						.attr("width",8)	//设置矩形的宽度
						.attr("height",function(d){			//设置矩形的高度
							return yScale(d);
						});*/
		}
}