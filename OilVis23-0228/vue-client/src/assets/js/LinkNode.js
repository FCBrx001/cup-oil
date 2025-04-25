//获取课程名称
function getCourseName(data,len_data){
    var name_course = [];
    for(var i = 0;i < len_data - 7; i++)
        name_course.push(data[i].course)
    return name_course;
}

//获取相关性数据
//将相关性存入到[[],...,[]]
function getInfoData(data,name_course,len_data){
    var info_data = [];
    for(var i = 0;i < len_data;i++){
        var cor_course = [];
        //获取每一行的相关性,存入cor_course
        for(j = 0; j < name_course.length; j++){
            /*
            * "C__面向对象分析与设计" 是 "C#面向对象分析与设计"
            * "NET程序设计" 是 ".NET程序设计"
            * "C加加面向对象程序设计" 是 "C++面向对象程序设计"
            * "数据库管理_Oracle" 是 "数据库管理(Oracle)"
            */
            cor_course.push(eval("data[i]." + name_course[j]));
        }
        info_data.push(cor_course);
    }
    return info_data;
}

//提取学期信息
function getInfoSemester(name_course,info_data,len_data){
    var info_semester = [];
    for(var i = len_data - 7; i < len_data - 3; i++){
        var temp = [];
        for(var j = 0; j < name_course.length; j ++)
            temp.push(info_data[i][j])
        info_semester.push(temp);
    }
    return info_semester;
}

function getCourseAttitude(info_data,name_course,len_data){
	console.log("info_data",info_data);
    var info_course_attr = [];
    //提取课程属性信息
    for(var i = len_data - 3; i < len_data; i++){
        var temp = [];
        for(var j = 0; j < name_course.length; j ++)
            temp.push(info_data[i][j])
        info_course_attr.push(temp);
    }
    return info_course_attr;
}

//获取相关课程个数,目前还没用
function getNumCor(info_data,name_course){
    var num_cor_info_score = [];
    for(var i = 0; i < name_course.length ; i++){
        var num = 0;
        for(var j = 0; j < name_course.length ; j++){
            if(info_data[i][j] != '0') num++;
        }
        num_cor_info_score.push(num - 1);
    }
    return num_cor_info_score;
}

//计算相关信息
/*info_semester:学期信息;   [[],[],...,[]]
**info_data:学期信息;       [[],[],...,[]]
**name_course:课程名数组;   [[],[],...,[]]
**len_data:数据长度
**year:年级
** course_info=[];course_index = [{},{},...,{}];time_info=[{},...,{}]
**return [course_info,course_index,time_info]
*/
function computeInfo(info_semester,info_data,name_course,len_data,year){
    var course_info = [];  //存储课程信息{courseIndex:1,semester:'1',courseName:'courseName'}
    var cour = {};
    var course_index = [];
    var time_info = [];
    var numCor = 0;        //统计某一课程相关大于等于0.6的累计数量
    //处理上课时间
    for(var i = 0; i < info_semester[year-2007].length; i++){
        for(var j = 0; j <len_data - 7; j++)
            if(parseFloat(info_data[i][j]) >= 0.60 && info_semester[year-2007][j]!="")
                numCor++;

        numCor = numCor - 1;
        if(info_semester[year-2007][i]!=""){
            if(time_info.length == 0){
                time_info.push({
                    semester:info_semester[year-2007][i],
                    count:1
                })
            }
            else{
                var flag = true;
                for(var j = 0; j < time_info.length; j++){
                    if(time_info[j].semester == info_semester[year-2007][i]){
                        time_info[j].count ++;
                        flag = false;
                    }  
                }
                if(flag){
                    time_info.push({
                        semester:info_semester[year-2007][i],
                        count:1
                    })
                }
            }
            cour.courseIndex = i;
            cour.semester = info_semester[year-2007][i];
            cour.numCor = numCor;
            cour.courseName = name_course[i];
            course_info.push(cour);
            course_index.push(i);
            cour = {};
        }
        numCor = 0;
    }
    return mySort(course_index,course_info,time_info);
}

//排序函数
function mySort(course_index,course_info,time_info){
    var info = [];
    //对JS中对象按data排序
    course_index.sort(function(a,b){
        return a - b;
    });

    time_info.sort(function(a,b){
        return a.semester-b.semester;
    });

    course_info.sort(function(a,b){
        return a.numCor-b.numCor;
    });

    course_info.sort(function(a,b){
        return a.semester-b.semester;
    });
    info.push(course_info);
    info.push(course_index);
    info.push(time_info);
    return info;
}

//重新排序列每学期的课程
//将与其他课程相关性高于0.6课程数,课程放在中间
//类似与 123456 变成 135642
function resortNode(time_info,course_info){
    //将相关性高的课程放在学期中央
    var num_semester = 0;
    var begin_index = 0;
    for(var i = 0; i < time_info.length; i++){
        begin_index = begin_index + num_semester;
        if(time_info[i].count>2){
            var temp_arr = course_info.slice(begin_index,begin_index+time_info[i].count); 
            var index_a = begin_index;
            var index_b = begin_index + time_info[i].count - 1;
            for(var j = 0; j < temp_arr.length; j = j + 2){
                if(index_a != index_b){
                    course_info[index_a] = temp_arr[j];
                    course_info[index_b] = temp_arr[j+1];
                }
                else course_info[index_a] = temp_arr[j];
                index_a++;
                index_b--;
            }

        }
        num_semester = time_info[i].count;
        console.log(begin_index,num_semester);
    }
    console.log(course_info);
    return course_info;
}

function computePointCenter(time_info,height,termWidth,termPadding){
    var centre_point = [];
    //计算圆心坐标
    for(var i = 0; i < time_info.length ; i++){
        var h = height/time_info[i].count;
        var w = termWidth/2 
        var j = 0;
        var random_y = 0;
        while(j < time_info[i].count){
            var random_x = Math.random() * 24 - 12;
            random_y = Math.random() * 10 - 5;
            if(time_info[i].count >= 4){
                if(j%2 == 0)
                    centre_point.push([w +(termWidth+termPadding)* i + 15 + random_x,h*(j+1/2)+random_y]);
                else
                    centre_point.push([w +(termWidth+termPadding)* i - 30 + random_x,h*(j+1/2)+random_y]);
            }
            else if(time_info[i].count != 1){
                random_y = Math.random() * 20 - 10;
                h = height/5;
                var temp_t = (5 - time_info[i].count)/time_info[i].count;
                if(time_info[i].count % 2 == 0){
                    if(j%2 == 0){
                        centre_point.push([w +(termWidth+termPadding)* i + 15,h*(j+1/2+temp_t)+random_y,i]);
                    }   
                    else{
                        centre_point.push([w +(termWidth+termPadding)* i - 30,h*(j+1/2+temp_t)+random_y,i]);
                    }
                }else{
                    if(j%2 == 0){
                        centre_point.push([w +(termWidth+termPadding)* i + 15,h*(j+1+temp_t)+random_y,i]);
                    }   
                    else{
                        centre_point.push([w +(termWidth+termPadding)* i - 30,h*(j+1+temp_t)+random_y,i]);
                    }
                }
            }else{
                centre_point.push([w +(termWidth+termPadding)* i,h*(j+1/2),i]);
            }
            j ++
        }
    }
    return centre_point;
}

//将数据改成json文件
//转化为节点
/*course_info:课程信息;name_course:课程名字;centre_point:节点中心*/
//返回节点
function computeNode(course_info,name_course,centre_point,datasetCourse_Arc,common_course_name){
    var json_nodes = [];
    var j = {};

    for(var i = 0; i < course_info.length; i++){
        j.id = i;
        j.courseIndex = course_info[i].courseIndex;
        j.courseName = name_course[course_info[i].courseIndex];
        j.centrePoint = centre_point[i];
        for(var k = 0; k < datasetCourse_Arc[0].length; k++){
            if(datasetCourse_Arc[0][k]===j.courseName){
                j.arcAngle = datasetCourse_Arc[1][k];
                j.studentNum = datasetCourse_Arc[2][k];
            }
            else{
                /*
                * "C__面向对象分析与设计" 是 "C#面向对象分析与设计"
                * "NET程序设计" 是 ".NET程序设计"
                * "C加加面向对象程序设计" 是 "C++面向对象程序设计"
                * "数据库管理_Oracle" 是 "数据库管理(Oracle)"
                * "Windows程序设计" 是 "Windows程序设计(VisualC++)"
                */
                if((j.courseName === "C__面向对象分析与设计"&&datasetCourse_Arc[0][k] === "C#面向对象分析与设计")
                    ||(j.courseName === "NET程序设计"&&datasetCourse_Arc[0][k] === ".NET程序设计")
                    ||(j.courseName === "C加加面向对象程序设计"&&datasetCourse_Arc[0][k] === "C++面向对象程序设计")
                    ||(j.courseName === "数据库管理_Oracle"&&datasetCourse_Arc[0][k] === "数据库管理(Oracle)")
                    ||(j.courseName === "Windows程序设计"&&datasetCourse_Arc[0][k] === "Windows程序设计(VisualC++)")){
                    //console.log(datasetCourse_Arc[0][k]);
                    j.arcAngle = datasetCourse_Arc[1][k];
                    j.studentNum = datasetCourse_Arc[2][k];
                }
            }
        }
        if(common_course_name.contains(j.courseName)){
            //console.log(j.courseName);
            j.ifcommonCourse = true;
        }
        else j.ifcommonCourse = false;
        //console.log(j);
        json_nodes.push(j);
        j = {};
    }
    return json_nodes;
}

//计算节点间连线
/*info_data:数据信息,json_nodes:节点信息*/
//返回路径
function computeLink(info_data,json_nodes){
    var json_links = [];
    var j_links = {};
    for(var i = 0; i < json_nodes.length; i++){
        for(var j = 0; j < json_nodes.length; j++){
            if(i == j || json_nodes[i].courseIndex > json_nodes[j].courseIndex)
                continue;
            else{
                j_links.source_id = json_nodes[i].id;
                j_links.target_id = json_nodes[j].id;
                j_links.source_point = json_nodes[i].centrePoint;
                j_links.target_point = json_nodes[j].centrePoint;
                j_links.cor = info_data[json_nodes[i].courseIndex][json_nodes[j].courseIndex];
                json_links.push(j_links);
                j_links = {};
            }
        }
    }
    return json_links;
}

function computeLinkStuNum(json_nodes,name_course,year,time_info,course_info){
    var len = 0,
        num_student = [],
        LinkStuNum = [];

    var node_id = [],
        node_index = [],
        node_point = [],
        node_index_corMax = [];

    var temp_obj = {},
        temp_arr = [];

    var dataRawScore = eval("data"+year);   //获取原始成绩
    var dataScore = [];                     //存取数据
    var centerID = [];
    for(var i = 0; i < dataRawScore.length; i++){
        dataScore.push(transform(dataRawScore[i]));
    }

    //获取课程索引和对应的圆心点
    for(var i = 0; i < json_nodes.length; i++){
        node_index.push(dataScore[dataScore.length-2].indexOf(name_course[json_nodes[i].courseIndex]));
        node_point.push(json_nodes[i].centrePoint);
    }
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
        //node_index_corMax.push(course_info[max_index]);
        node_index_corMax.push(dataScore[dataScore.length-2].indexOf(course_info[max_index].courseName));
    }

    for(var i = 0; i < node_id.length-1; i ++){
        var corMax_index = node_index_corMax[i];
        for(var j = 0; j < node_id[i].length; j++){
            var source_index = node_index[node_id[i][j]];
            if(node_index[node_id[i][j]]===corMax_index) centerID.push(node_id[i][j]);

            for(var k = 0; k < node_id[i+1].length; k++){
                var target_index = node_index[node_id[i+1][k]];
                var num_stu = 0;

                temp_obj.source_id = node_id[i][j];
                temp_obj.target_id = node_id[i+1][k];
                temp_obj.ifHighCor = (node_index[node_id[i][j]]===corMax_index)?true:false;
                temp_obj.source_point = node_point[node_id[i][j]];
                temp_obj.target_point = node_point[node_id[i+1][k]];
                for(var m = 0; m < dataScore.length - 2; m++){
                    if(dataScore[m][source_index] !== "" && dataScore[m][source_index] !== undefined &&
                        dataScore[m][target_index] !== "" && dataScore[m][target_index] !== undefined){
                        num_stu += 1;
                    }
                }
                if(!num_student.contains(num_stu)){
                    num_student.push(num_stu);
                }
                temp_obj.stuNum = num_stu;
                LinkStuNum.push(temp_obj);
                temp_obj = {};
            } 
        }
    }
    temp_arr.push(LinkStuNum);
    temp_arr.push(num_student);
    temp_arr.push(node_id);
    temp_arr.push(centerID);
    return temp_arr;
}

/*获取公共课程信息
* return [公共课程索引,公共课程名];
* 公共课程索引 = [],公共课程名 = [];
*/
function commonCourseIndex(info_semester,name_course){
    var num_course = name_course.length;
    var num_semester = info_semester.length;
    var common_course_index = [];
    var common_course_name = [];
    var common_course_info = [];
    for(var i = 0; i < num_course; i++){
        var flag_semester = true;
        var j = 0;
        for(j = 0; j < num_semester;j++){
            if(info_semester[j][i] === "" || info_semester[j][i] === undefined){
                flag_semester = false;
                break;
            }
        }
        if( flag_semester && j=== num_semester ){
            common_course_index.push(i);
            common_course_name.push(name_course[i]);
        }
    }
    common_course_info.push(common_course_index);
    common_course_info.push(common_course_name);
    return common_course_info;
}

//处理原始成绩,返回课程和弧度
//[课程,弧度]
//课程 = []; 弧度 = [{},...,{}]
function dealRawScore(dataRaw){
    var dataRawArray = Array(dataRaw.length-1);   //存放转化后数组
    var datasetArc ;    //存放没门课程的弧度
    var datasetCourse_Arc = [[],[],[]];
    var studentNum;
    var temp_A = 0,     //优秀学生数
        temp_B = 0,     //合格学生数
        temp_C = 0;     //差的学生数
    //将对象转换成数组
    for(var i = 0; i < dataRaw.length - 1; i++ ){
        var arr = [];
        for(var item in dataRaw[i]){
            if(item!==""&&item!==undefined) 
                arr.push(dataRaw[i][item]);
        }
        dataRawArray[i] = arr;
    }
    datasetArc = Array(dataRawArray[0].length-1);
    numCourse = dataRawArray[0].length;
    studentNum = Array(dataRawArray[0].length-1);
    for(var i = 1 ; i < dataRawArray[0].length; i++){
        temp_A = 0,temp_B = 0,temp_C = 0;
        for(var j = 0; j < dataRawArray.length - 1; j++){
            if(dataRawArray[j][i] === ""|| dataRawArray[j][i] === undefined){
                continue;
            }else{
                if(parseInt(dataRawArray[j][i]) >= 80 && parseInt(dataRawArray[j][i]) <= 100){
                    temp_A += 1;
                }else if(parseInt(dataRawArray[j][i]) >= 60 && parseInt(dataRawArray[j][i]) <= 79){
                    temp_B += 1;
                }else temp_C += 1;
            }
        }
        datasetArc[i-1] = transformToArcAngle(temp_A,temp_B,temp_C);
        studentNum[i-1] = temp_A + temp_B + temp_C;
    }
    datasetCourse_Arc[0] = dataRawArray[dataRawArray.length-1].slice(1);
    datasetCourse_Arc[1] = datasetArc;
    datasetCourse_Arc[2] = studentNum;
    //console.log(datasetCourse_Arc);
    return datasetCourse_Arc;
}

//将人数转化成弧度
function transformToArcAngle(temp_A,temp_B,temp_C){
    var obj_arc = {};
    var datasetArc = [];
    var endAngle_last = 0;
    if(temp_A === 0){
        obj_arc.startAngle = 0;
        obj_arc.endAngle = obj_arc.startAngle + 0.005*Math.PI*2;
        endAngle_last = obj_arc.endAngle;
        datasetArc.push(obj_arc);
    }
    else{
        obj_arc.startAngle = 0;
        if(temp_B === 0){
            obj_arc.endAngle = temp_A/(temp_A + temp_B + temp_C)*Math.PI*2 - 0.005*Math.PI*2;
        }
        else{
            obj_arc.endAngle = temp_A/(temp_A + temp_B + temp_C)*Math.PI*2;
        }
        endAngle_last = obj_arc.endAngle;
        datasetArc.push(obj_arc);
    }

    obj_arc = {};
    if(temp_B === 0){
        obj_arc.startAngle = endAngle_last;
        obj_arc.endAngle = obj_arc.startAngle + 0.005*Math.PI*2;
        endAngle_last = obj_arc.endAngle;
        datasetArc.push(obj_arc);
    }
    else{
        obj_arc.startAngle = endAngle_last;
        if(temp_C === 0){
            obj_arc.endAngle = obj_arc.startAngle + temp_B/(temp_A + temp_B + temp_C)*Math.PI*2 - 0.005*Math.PI*2;
        }
        else{
            obj_arc.endAngle = obj_arc.startAngle + temp_B/(temp_A + temp_B + temp_C)*Math.PI*2;
        }
        endAngle_last = obj_arc.endAngle;
        datasetArc.push(obj_arc);
    }

    obj_arc = {};
    if(temp_C === 0){
        obj_arc.startAngle = endAngle_last;
        obj_arc.endAngle = obj_arc.startAngle + 0.005*Math.PI*2;
        endAngle_last = obj_arc.endAngle;
        datasetArc.push(obj_arc);
    }
    else{
        obj_arc.startAngle = endAngle_last;
        obj_arc.endAngle = obj_arc.startAngle + temp_C/(temp_A + temp_B + temp_C)*Math.PI*2 ;
        endAngle_last = obj_arc.endAngle;
        datasetArc.push(obj_arc);
    }
    return datasetArc;
}

function selectLinkLine(flagClick,ifStudentNum,circleId,nodes,info_num,useful_courseName,useful_color){
    var nodeArr = [];
    var temp_A = [];
    var useful_courseID = get_courseID_NodeLink(nodes,useful_courseName);
    if(!ifStudentNum) show_useful_LinkNode_Line(useful_courseID);
    if(flagClick&&!ifStudentNum){
        main_view.select("#NodeLinkGraph").selectAll(".linkLine")
            .attr("opacity",function(d){
                var begin_id = parseInt(this.id.split("to")[0]);
                var end_id = parseInt(this.id.split("to")[1]);
                if((circleId.contains(begin_id)||circleId.contains(end_id))&&useful_courseID.contains(begin_id)&&useful_courseID.contains(end_id)){
                    if(!nodeArr.contains(this.id.split("to")[0])) nodeArr.push(this.id.split("to")[0]);
                    if(!nodeArr.contains(this.id.split("to")[1])) nodeArr.push(this.id.split("to")[1]);
                }
                return (circleId.contains(begin_id)||circleId.contains(end_id))&&useful_courseID.contains(begin_id)&&useful_courseID.contains(end_id)?1:0;
            });
        showCircle_Arc(nodeArr,circleId,nodes,useful_courseName,useful_color);
    }
    if(flagClick&&ifStudentNum){
        circleId.sort(function(a,b){
            return a - b;
        });
        for(var i = 0; i < info_num.length; i++){
            for(var j = 0; j < info_num[i].length; j++){
                if(circleId.contains(info_num[i][j])){
                    temp_A = temp_A.concat(info_num[i]);
                    break;
                }
            }
        }

        main_view.select("#NodeLinkGraph").selectAll(".linkLine_stuNum")
                .attr("opacity",function(d){
                    var index_id = circleId.indexOf(parseInt(this.id.split("to")[0]));
                    var begin_id = parseInt(this.id.split("to")[0]);
                    var end_id = parseInt(this.id.split("to")[1]);
                    if(index_id === circleId.length-1 &&useful_courseID.contains(begin_id)&&useful_courseID.contains(end_id)){
                        if(!nodeArr.contains(this.id.split("to")[0])) nodeArr.push(this.id.split("to")[0]);
                        if(!nodeArr.contains(this.id.split("to")[1])) nodeArr.push(this.id.split("to")[1]);
                        // console.log("nodeArr:532",nodeArr);
                        return 1;
                    }
                    else{
                        var ind_a = 0;
                        var ind_b = 0;
                        for(var i = 0; i < info_num.length; i++){
                            if(info_num[i].contains(circleId[index_id])) ind_a = i;
                            if(info_num[i].contains(circleId[index_id+1])) ind_b = i;
                        }
                        if((ind_b - ind_a >= 2)&&circleId.contains(begin_id)&&useful_courseID.contains(begin_id)&&useful_courseID.contains(end_id)){
                            if(!nodeArr.contains(this.id.split("to")[0])) nodeArr.push(this.id.split("to")[0]);
                            if(!nodeArr.contains(this.id.split("to")[1])) nodeArr.push(this.id.split("to")[1]);
                            // console.log("nodeArr:545",nodeArr);
                            return 1;
                        }
                        else if(circleId.contains(begin_id)&&circleId.contains(end_id)&&useful_courseID.contains(begin_id)&&useful_courseID.contains(end_id)){
                            if(!nodeArr.contains(this.id.split("to")[0])) nodeArr.push(this.id.split("to")[0]);
                            if(!nodeArr.contains(this.id.split("to")[1])) nodeArr.push(this.id.split("to")[1]);
                            // console.log("nodeArr:551",nodeArr);
                            return 1;
                        }
                        else return 0;
                    }
                });
        // console.log("nodeArr",nodeArr);
        main_view.select("#NodeLinkGraph").selectAll(".linkLine_stuNum")
                .filter(function(d){
                    var begin_id = parseInt(this.id.split("to")[0]);
                    var end_id = parseInt(this.id.split("to")[1]);
                    if(ifClick_WordCloud||ifclick_CourseTree){
                        if(!temp_A.contains(begin_id)&&useful_courseID.contains(begin_id)&&useful_courseID.contains(end_id)){
                            if(!nodeArr.contains(this.id.split("to")[0])) nodeArr.push(this.id.split("to")[0]);
                            if(!nodeArr.contains(this.id.split("to")[1])) nodeArr.push(this.id.split("to")[1]);
                            d3.select(this).attr("opacity",1);
                        }
                    }else{
                        if(!temp_A.contains(begin_id)&&this.getAttribute("ifShow_begin") === "yes"&&useful_courseID.contains(begin_id)&&useful_courseID.contains(end_id)){
                            if(!nodeArr.contains(this.id.split("to")[0])) nodeArr.push(this.id.split("to")[0]);
                            if(!nodeArr.contains(this.id.split("to")[1])) nodeArr.push(this.id.split("to")[1]);
                            d3.select(this).attr("opacity",1);
                        }
                    }
                });
        showCircle_Arc(nodeArr,circleId,nodes,useful_courseName,useful_color);
    }
}

/*
*  nameCour是显示学被选中的课程
*  compareCour是用于对比的课程
*/
function showStuAcademicProPCP(nameCour,year,flagClick,compareCour,flagShowSankey,useful_color,this_courseName){
    /*console.log("--->576",nameCour);
    console.log("--->577",compareCour);
    console.log("--->578",year);
    console.log("--->579",flagClick);
    console.log("--->580",compareCour);*/
    var student_num = [44,45,39,34];
    var stuID = [];
    var stuSco = [];
    var temp = [];
    var stu_IdSco_info = {};
    for(var i = 0; i < nameCour.length; i++){
        if(nameCour[i]!=="NoCourse"){
            temp.push(nameCour[i]);     //获取选取课程
            stuID.push([]);             //设置数组
            //stuSco.push([]);          //设置数组
        }
    }
    nameCour = temp;
    if(!flagClick){ 
        overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path").style("display",null);
    }

    if(nameCour.length !== 0 && flagClick){
    //if(nameCour.length !== 0){
        //获取每门选取课程的学生id,且学生在
        for(var i = 0; i < nameCour.length; i++){
            var rectClass = "." + nameCour[i];
            heatmap_g.selectAll("#everyheatmap"+year).selectAll(rectClass).filter(function(d){
                //console.log("---->632",this);
                /*console.log("---->633",this.getAttribute("opacity"));
                console.log("---->634",this.getAttribute("opacity") === "1");
                console.log("---->635",this.style.display !== "none");
                console.log("---->636",d);*/
                if(d !== "" && this.style.display !== "none"){
                    if(useful_color[i] === "All"){
                        stuID[i].push(this.parentNode.id.slice(11));
                        //stuSco[i].push(d);
                        if(nameCour[i] === this_courseName){
                            stuSco.push(parseInt(d));
                        }
                    }else if(useful_color[i] === "Blue" && d>=80){
                        stuID[i].push(this.parentNode.id.slice(11));
                        //stuSco[i].push(d);
                        if(nameCour[i] === this_courseName){
                            stuSco.push(parseInt(d));
                        }
                    }else if(useful_color[i] === "Green" && d>=60 && d<80){
                        stuID[i].push(this.parentNode.id.slice(11));
                        //stuSco[i].push(d);
                        if(nameCour[i] === this_courseName){
                            stuSco.push(parseInt(d));
                        }
                    }else if(useful_color[i] === "Red" && d<60){
                        stuID[i].push(this.parentNode.id.slice(11));
                        //stuSco[i].push(d);
                       if(nameCour[i] === this_courseName){
                            stuSco.push(parseInt(d));
                        }
                    }
                    
                }
            });
        }
        //console.log(stuID);
        temp = [];
        for(var i = 0; i < stuID[0].length; i++){
            var flag = true;
            for(var j = 0; j < stuID.length; j++){
                if(!stuID[j].contains(stuID[0][i])){
                    flag = false;
                    break;
                }
            }
            if(flag){
                temp.push(stuID[0][i]);
            }
        }
        stuID = temp;

        //高亮选取的学生学业进展
        overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path")
                    .filter(function(d,i){
                        if(parseInt(this.id.slice(0,4)) === year){
                            d3.select(this).style("display",function(d){
                                return (nameCour.length === compareCour.length && stuID.contains(this.id))?null:"none";
                            });
                        }
                    });
        if(nameCour.length === compareCour.length){
            heatmap_g.selectAll("#grade"+year).selectAll("rect").attr("opacity",1);
            heatmap_g.selectAll("#heatmapYear"+year).attr("opacity",1);
            heatmap_g.selectAll("#grade"+year).selectAll("path").attr("opacity",1);
            //如果显示的是桑基图, 则不重绘统计信息
            if(!flagShowSankey){
                showSelectedStu(stuID,year);
            }
        }
        else{
            weaken_unselected_HeatMap_PC(year);
        }
    }else{
        if(nameCour.length === 0 && flagClick){
            //高亮选取的学生学业进展
            overall_svg.select("#ParallelCoordinates").select(".foreground").selectAll("path")
                        .filter(function(d,i){
                            if(parseInt(this.id.slice(0,4)) === year){
                                d3.select(this).style("display","none");
                            }
                        });
        }

        if(flagClick){
            weaken_unselected_HeatMap_PC(year);
        }
        else{
            show_All_HeatMap_PC(year);
        }
    }
    stu_IdSco_info.year = year;
    stu_IdSco_info.id = stuID;
    stu_IdSco_info.Sco = stuSco;
    stu_IdSco_info.numStu = stuSco.length;
    return stu_IdSco_info;
}

//重绘被选取课程的学生信息
function showSelectedStu(stuID,year){
    var select_stu_score = [];
    //选取学生
    heatmap_g.select(".g"+year).selectAll("g.heat"+year)
                .filter(function(d,i){
                    if(!stuID.contains(this.id.slice(-10))) return d;
                })
                .selectAll("rect").attr("opacity", 0.1);
    heatmap_g.select(".g"+year).selectAll("g.heat"+year)
                .filter(function(d,i){
                    if(stuID.contains(this.id.slice(-10))) select_stu_score = select_stu_score.concat(d);
                    if(stuID.contains(this.id.slice(-10))) return d;
                })
                .selectAll("rect").attr("opacity", 1);
    for(var i = 0; i < select_stu_score.length; i++)
        if(select_stu_score[i] == "" || typeof(select_stu_score[i]) == "undefined"){
                select_stu_score.splice(i,1);
            i = i-1;
        }
                        
    heatmap_g.select("#grade"+year).select("g.histogram").remove(); //移除统计信息
    drawHistogram_student(select_stu_score,year);                   //重绘统计信息
}

//显示完整的矩阵热力图和平行坐标
function show_All_HeatMap_PC(year){
    heatmap_g.selectAll("#grade"+year).selectAll(".highlightCourse").remove();
    heatmap_g.selectAll("#grade"+year).selectAll("rect").attr("opacity","1");
    heatmap_g.selectAll("text").select("#heatmapYear"+year).attr("opacity","1");
    heatmap_g.selectAll("#heatmapYear"+year).attr("opacity","1");
    heatmap_g.selectAll("#grade"+year).selectAll("path").attr("opacity","1");
}

//将为选中的元素弱化
function weaken_unselected_HeatMap_PC(year){
    heatmap_g.selectAll("#grade"+year).selectAll(".highlightCourse").remove();
    heatmap_g.selectAll("#grade"+year).selectAll("rect").attr("opacity",0.3);
    heatmap_g.selectAll("text").select("#heatmapYear"+year).attr("opacity",0.3);
    heatmap_g.selectAll("#heatmapYear"+year).attr("opacity",0.295);
    heatmap_g.selectAll("#grade"+year).selectAll("path").attr("opacity",0.3);
}

//显示有用的课程和课程成绩分布
//参数是节点连接图中课程名
function show_useful_LinkNode_Node(useful_courseName){
	//console.log("772");
    main_view.select("#NodeLinkGraph").selectAll(".circleCourse").filter(function(d){
		    //console.log("this.id.slice(6,-8))",this.id.slice(6,-8));
            if(useful_courseName.contains(this.id.slice(6,-8))) return this;
        }).attr("opacity",1);
    main_view.select("#NodeLinkGraph").selectAll(".arcA").filter(function(d){
		    //console.log("this.id.slice(4))",this.id.slice(4));
            if(useful_courseName.contains(this.id.slice(4))) return this;
        }).attr("opacity",1);
    main_view.select("#NodeLinkGraph").selectAll(".arcB").filter(function(d){
		    //console.log("this.id.slice(4))",this.id.slice(4));
            if(useful_courseName.contains(this.id.slice(4))) return this;
        }).attr("opacity",1);
}

//虚化未被点击的课程,高亮被点击课程
function weaken_unuseful_LinkNode_Node(nameCour,useful_color){
	console.log("786");
    main_view.select("#NodeLinkGraph").selectAll(".circleCourse").filter(function(d){
        if(!nameCour.contains(this.id.slice(6,-8))) return this;
    }).attr("opacity",1);

    main_view.select("#NodeLinkGraph").selectAll(".arcA").filter(function(){
            if(!nameCour.contains(this.id.slice(4))){
                return this;
            }else{
                var idx = nameCour.indexOf(this.id.slice(4));
                if(!(this.attributes.fill.value === useful_color[idx] || useful_color[idx] === "All")){
                    console.log("781");
                    return this;
                }
            }
        })
        .attr("opacity",1);
    main_view.select("#NodeLinkGraph").selectAll(".arcB").filter(function(){
            if(!nameCour.contains(this.id.slice(4))) return this;
        })
        .attr("opacity",1);
}

//显示有用的课程之间的连线
//参数是节点连接图节点ID
function show_useful_LinkNode_Line(useful_courseID){
    main_view.selectAll("#NodeLinkGraph").selectAll(".linkLine").attr("opacity",function(d){
        var begin_id = parseInt(this.id.split("to")[0]);
        var end_id = parseInt(this.id.split("to")[1]);
        return useful_courseID.contains(begin_id)&&useful_courseID.contains(end_id)?1:0;
    });
}