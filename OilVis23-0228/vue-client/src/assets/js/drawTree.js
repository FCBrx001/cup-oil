function drawTree(pathTree){
    $('#MainView');
    $('#OverallSvg');

    var old_teacherPost = "";
    var old_courseName = "";
    var old_courseNameArr = [];
    var old_teacherPostArr = [];
    
    var name_path = pathTree.slice(5,-5);
    //定义树的参数
    var twidth=220,theight=150;
    var stepLenth = 0;      //定义步长
    //课程树
    var tree = d3.layout.tree().size([theight, twidth]);
    //对角线生成器
    var diagonal = d3.svg.diagonal().projection(function (d) { return [d.y, d.x]; });
    var vis = main_view.append("g");
        if(name_path === "course"){
            vis.attr("id", "NodeLinkTree_course")
                .attr("class","courseTree").attr("transform","translate(80,400)");
            stepLenth = 60;
        }
        else{
            vis.attr("id", "NodeLinkTree_teacher")
                .attr("class","teacherTree").attr("transform","translate(1190,565)");
            stepLenth = 55;
        }
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
    d3.json(pathTree, function (json){
        root = json;
        root.x0 = 100;
        root.y0 = 200;

        //节点后的子树全部展开或隐藏
        function toggleAll(d){
            if(d.children){
                d.children.forEach(toggleAll); //forEach函数针对数组
                toggle(d);
            }
        }

        //隐藏或显示节点
        function toggle(d){
            //隐藏
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }else{
                d.children = d._children;
                d._children = null;
            }
        }
        update(root);
    });

    function update(source){
        //动画时间
        var duration = d3.event && d3.event.altKey ? 100 : 100;
        //根据数据生成nodes集合
        var nodes = tree.nodes(root).reverse();
            nodes全局1 = nodes;
        var count1 = 0,
            count2 = 0,
            count3 = 0;

            //根据节点深度固定y
            nodes.forEach(function (d) {
                if(d.depth==1) count1++;
                else if(d.depth==2) count2++;
                else if(d.depth==3) count3++;
                d.y = d.depth * stepLenth; 
            });

        //根据nodes集合生成节点（绑定数据），添加id为了区分是否是新加入节点
        //node是class为node的g元素集合
        var node = vis.selectAll("g.cnode")
                    .data(nodes, function (d,i) { return d.id || (d.id = ++i); });

        var nodeEnter = node.enter().append("g")
                         .attr("class", "cnode")
                         .attr("transform", function (d) {
                            return "translate(" + source.y0 + "," + source.x0 + ")";
                        });
        var scale=d3.scale.linear().domain([0,1]).range([3,6]);
        if(name_path === "course"){
            nodeEnter.append("circle")
                .attr("class",function(d,i){
                    return "tree_rectCourse";
                })
                .attr("id",function(d,i){
                    // console.log("tree_course_"+d.class);
                    return "tree_course_"+d.class;
                })
                .attr("style","cursor:pointer") 
                .attr("r", 5)
                .style("fill", function (d) {
                    if(d.class === "课程" || d.class === "教师") return "orangeRed";
                    else return eval("color" + d.class);
                })
                .attr("opacity", 0.8)
                .on("click",function(d){
                    var c_attr = d.class;       //存储课程属性
                    var selected_courName = []; //存储被选中的课程
                    var selected_circleId = []; //存储课程ID
                    var c_attr_arr = [];

                    //console.log(c_attr);
                    
                    if(c_attr.length === 4){
                        c_attr_arr.push(c_attr,c_attr.slice(0,2));
                    }else if(c_attr.length === 7){
                        c_attr_arr.push(c_attr,c_attr.slice(0,2),c_attr.slice(0,4));
                    }else{
                        c_attr_arr.push(c_attr);
                    }

                    /*console.log(c_attr);
                    console.log(c_attr_arr);*/

                    if(c_attr === "课程"){
                        ifclick_CourseTree = false;
                        old_courseName = "";
                        selected_courName = getCourseName_HighLightCourse_LinkNode(false);
                        highlight_C_Circle(c_attr,ifclick_CourseTree);
                        show_useful_courseCircle((ifclick_CourseTree||ifClick_WordCloud),ifStudentNum,false,selected_circleId,selected_courName);
                        return;
                    };
                    if(old_courseName === ""|| old_courseName !== c_attr){
                        old_courseName = c_attr;
                        ifclick_CourseTree = true;
                        filter_selected_flag = true;
                        nameCour = [];
                        nodeID = [];
                        commonCour = [];
                        old_courseNameArr = [];
                    }else{
                        old_courseName = "";
                        ifclick_CourseTree = false;
                    }
                    //console.log(c_attr_arr,ifclick_CourseTree);
                    highlight_C_Circle(c_attr_arr,ifclick_CourseTree);
                    //console.log(ifclick_CourseTree,ifClick_WordCloud);
                    selected_courName = get_selected_courseName(ifclick_CourseTree,ifClick_WordCloud);
                    //console.log(selected_courName);
                    selected_circleId = get_selected_courseID(selected_courName,[]);
					selected_node=selected_circleId;
                    show_useful_courseCircle((ifclick_CourseTree||ifClick_WordCloud),ifStudentNum,false,selected_circleId,selected_courName);
                });

            //为节点添加文本,调整位置
            nodeEnter.append("text")
                .attr("font-size",10)
                .attr("class","course_text")
                .attr("id",function(d){
                    /*console.log(d);
                    console.log(d.class);*/
                    return "c_text" + d.class;
                })
                .attr("style","cursor:pointer") 
                .attr("x", function (d) {
                    return d.children || d._children ? -6 : 6; 
                })
                .attr("y",function(d){
                    if(d.class=="必修"||d.class=="必修理论"||d.class=="选修理论") return -6;
                    else if(d.class=="选修"||d.class=="必修实践"||d.class=="选修实践") return 12;
                    else return 3;
                })
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function (d){
					
					//console.log(d.name);
                    return typeEnglishAll(d.name);
                })
               .style("fill-opacity", 1)
               .on("click",function(d){
                    var c_attr = d.class;       //存储课程属性
                    var selected_courName = []; //存储被选中的课程
                    var selected_circleId = []; //存储课程ID
                    var c_attr_arr = [];

                    if(c_attr === "课程"){
                        ifclick_CourseTree = false;
                        old_courseName = "";
                        selected_courName = getCourseName_HighLightCourse_LinkNode(false);
                        highlight_C_Circle(c_attr,ifclick_CourseTree);
                        show_useful_courseCircle((ifclick_CourseTree||ifClick_WordCloud),ifStudentNum,false,selected_circleId,selected_courName);
                        return;
                    }else if(c_attr.length === 4 && c_attr.slice(-2) === "实践"){
                        c_attr_arr = ["必修实践","选修实践","必修","选修"];
                    }else if(c_attr.length === 4 && c_attr.slice(-2) === "理论"){
                        c_attr_arr = ["必修理论","选修理论","必修","选修"];
                    }else if(c_attr.length === 7 && c_attr.slice(-3) === "高学分"){
                        c_attr_arr = ["必修理论高学分","选修理论高学分","必修实践高学分","选修实践高学分","必修实践","选修实践","必修理论","选修理论","必修","选修"];
                    }else if(c_attr.length === 7 && c_attr.slice(-3) === "低学分"){
                        c_attr_arr = ["必修理论低学分","选修理论低学分","必修实践低学分","选修实践低学分","必修实践","选修实践","必修理论","选修理论","必修","选修"];
                    }else{
                        c_attr_arr.push(c_attr);
                    }
                    //console.log(c_attr_arr);
                    if(old_courseNameArr === []|| old_courseNameArr.indexOf(c_attr) === -1){
                        old_courseNameArr = c_attr_arr;
                        ifclick_CourseTree = true;
                        filter_selected_flag = true;
                        nameCour = [];
                        nodeID = [];
                        commonCour = [];
                        old_courseName = "";
                    }else{
                        old_courseNameArr = [];
                        ifclick_CourseTree = false;
                    }
                    highlight_C_Circle(c_attr_arr,ifclick_CourseTree);
                    selected_courName = get_selected_courseName(ifclick_CourseTree,ifClick_WordCloud);
                    selected_circleId = get_selected_courseID(selected_courName,[]);
					selected_node=selected_circleId;
                    show_useful_courseCircle((ifclick_CourseTree||ifClick_WordCloud),ifStudentNum,false,selected_circleId,selected_courName);
                    
				});
        }
        else{
            nodeEnter.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("class",function(d,i){
                    return "tree_rectTeacher";
                })
                .attr("id",function(d,i){
                    return "tree_rect_"+d.class;
                })
                .attr("style","cursor:pointer") 
                .attr("transform","translate(-5,-5)")
                .style("fill", function (d) {
                    if(d.class === "课程" || d.class === "教师") return "orangeRed";
                    else return eval("color" + d.class);
                })
                .attr("opacity", 1)
                .on("click",function(d){
                    var now_post = d.class;
                    var selected_courName = []; //存储被选中的课程
                    var selected_circleId = []; //存储课程ID
                    var now_post_arr = [];
                    var name_year_info = {};
                    var selected_year = [];
                    
                    if(now_post === "教师"){
                        ifclick_TeacherTree = false;
                        old_teacherPost = "";
                        highlight_T_Rect(now_post,ifclick_TeacherTree);
                        selectTeacher_tree(now_post,ifclick_TeacherTree);
                        return;
                    }else if(now_post === "教授"){
                        now_post_arr = ["教授男","教授"];
                    }else if(now_post === "副教授"){
                        now_post_arr = ["副教授男","副教授女","副教授"];
                    }else if(now_post === "讲师"){
                        now_post_arr = ["讲师男","讲师女","讲师"];
                    }else{
                        now_post_arr.push(now_post);
                    }
                    if(old_teacherPost === ""|| old_teacherPost !== now_post){
                        old_teacherPost = now_post;
                        ifclick_TeacherTree = true;
                        old_teacherPostArr = [];
                    }else{
                        old_teacherPost = "";
                        ifclick_TeacherTree = false;
                    }
                    highlight_T_Rect(now_post_arr,ifclick_TeacherTree);
                    name_year_info = selectTeacher_tree(now_post_arr,ifclick_TeacherTree);
                    selected_courName = name_year_info.name;
                    selected_year = name_year_info.year;
                    selected_circleId = get_selected_courseID(selected_courName,selected_year);
                    show_useful_courseCircle(ifclick_TeacherTree,ifStudentNum,false,selected_circleId,selected_courName);
                     selected_node=selected_circleId;  
                	//console.log("name_year_info",name_year_info);
	                //console.log("selected_courName",selected_courName);	
                    //console.log("selected_year",selected_year);		
                     //console.log("selected_circleId",selected_circleId);							
			   });

            nodeEnter.append("text")
                .attr("font-size",10)
                .attr("class","teacher_text")
                .attr("id",function(d){
                    return "t_text" + d.class;
                })
                .attr("x", function (d) {
                    if(d.name=="教师") return 23;
                    else return d.children || d._children ? -12 : 6; 
                })
                .attr("y",function(d){
                    if(d.name=="教师") return 22;
                    else if(d.name=="教授" || d.name=="副教授" || d.name=="讲师") return 15;
                    else if(d.name=="男" || d.name=="女") return 0;
                })
               .attr("dy", "0.35em")
               .attr("text-anchor", function (d) {
                    if(d.class=="教师") return "end";
                    else return "start";
                })
               .text(function (d) { 
                 return typeEnglishAll(d.name); 
                })
               .attr("style","cursor:pointer")
               .on("click",function(d){
                    var now_post = d.class;
                    var selected_courName = []; //存储被选中的课程
                    var selected_circleId = []; //存储课程ID
                    var now_post_arr = [];
                    var name_year_info = {};
                    var selected_year = [];

                    if(now_post === "教师"){
                        ifclick_TeacherTree = false;
                        old_teacherPost = "";
                        highlight_T_Rect(now_post,ifclick_TeacherTree);
                        selectTeacher_tree(now_post,ifclick_TeacherTree);
                        return;
                    }else if(now_post.slice(-1) === "男"){
                        now_post_arr = ["教授男","副教授男","讲师男","男"];
                    }else if(now_post.slice(-1) === "女"){
                        now_post_arr = ["副教授女","讲师女","女"];
                    }else if(now_post === "教授"){
                        now_post_arr = ["教授男","教授"];
                    }else if(now_post === "副教授"){
                        now_post_arr = ["副教授男","副教授女","副教授"];
                    }else if(now_post === "讲师"){
                        now_post_arr = ["讲师男","讲师女","讲师"];
                    }else{
                        now_post_arr.push(now_post);
                    }
                    if(old_teacherPostArr === []|| old_teacherPostArr.indexOf(now_post) === -1){
                        old_teacherPostArr = now_post_arr;
                        ifclick_TeacherTree = true;
                        old_teacherPost = "";
                    }else{
                        now_post_arr = [];
                        ifclick_TeacherTree = false;
                    }
                    highlight_T_Rect(now_post_arr,ifclick_TeacherTree);
                    name_year_info = selectTeacher_tree(now_post_arr,ifclick_TeacherTree);
					//console.log("name_year_info",name_year_info);
                    selected_courName = name_year_info.name;
					//console.log("selected_courName",selected_courName);
                    selected_year = name_year_info.year;
                    selected_circleId = get_selected_courseID(selected_courName,selected_year);
					//console.log("selected_circleId",selected_circleId);
					selected_node=selected_circleId;
                    show_useful_courseCircle(ifclick_TeacherTree,ifStudentNum,false,selected_circleId,selected_courName);
                });
        }
        //更新节点位置
        var nodeUpdate = node.transition()
                            .duration(duration)
                            .attr("transform", function (d) {
                                return "translate(" + d.y + "," + d.x + ")"; 
                            });
            nodeUpdate.select("circle")
                        .attr("r", 5)
                        .style("fill",function (d) {
                            if(d.class=="课程")return "orangeRed";
                                else return "color"+d.class;
                        });
        //更新
        nodeUpdate.select("text")
                .style("fill-opacity", 1);

        // 移动无用节点
        var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
                        .remove();
            nodeExit.select("circle").attr("r", 1e-6);
            nodeExit.select("text").style("fill-opacity", 1e-6);

        // 更新连接
        var link = vis.selectAll("path.link")
                    .data(tree.links(nodes), function (d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            })
            .transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition links to their new position.
        link.transition().duration(duration).attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
}

//高亮课程树
function highlight_C_Circle(c_attr_arr,ifclick_CourseTree){
    //console.log(c_attr_arr);
    if(ifclick_CourseTree){
        main_view.select("#NodeLinkTree_course")
            .selectAll("path.link")
            .style("stroke",function(d){
                for(var i = 0; i < c_attr_arr.length; i++){
                    if(d.target.class === c_attr_arr[i]||c_attr_arr[i].indexOf(d.target.class)!==-1){
                        return "orangeRed";
                    }
                }
                return "black";
            })
            .attr("opacity",function(d){
                for(var i = 0; i < c_attr_arr.length; i++){
                    if(d.target.class === c_attr_arr[i]||c_attr_arr[i].indexOf(d.target.class)!==-1){
                        return 1;
                    }
                }
                return 0.3;
            });
        main_view.select("#NodeLinkTree_course")
                .selectAll("circle")
                .attr("opacity",function(d){
                    if(this.id === "tree_course_课程") return 1;
                    for(var i = 0; i < c_attr_arr.length; i++){
                        if(this.id === ("tree_course_" + c_attr_arr[i])){
                            return 1;
                        }
                    }
                    return 0.3;
                });
        main_view.select("#NodeLinkTree_course")
                .selectAll("text")
                .attr("opacity",function(d){
                    if(this.id === "c_text课程") return 1;
                    for(var i = 0; i < c_attr_arr.length; i++){
                        if(this.id === ("c_text" + c_attr_arr[i])){
                            return 1;
                        }
                    }
                    return 0.3;
                });
    }else{
        main_view.select("#NodeLinkTree_course").selectAll("path.link").style("stroke","black").attr("opacity",1);
        main_view.select("#NodeLinkTree_course").selectAll("circle").attr("opacity",1);
        main_view.select("#NodeLinkTree_course").selectAll("text").attr("opacity",1);
    }
}

//高亮教师树, now_post_arr代替now_post
function highlight_T_Rect(now_post_arr,ifclick_TeacherTree) {
    if(ifclick_TeacherTree){
        main_view.select("#NodeLinkTree_teacher")
            .selectAll("path.link")
            .style("stroke",function(d){
                if(now_post_arr[now_post_arr.length-1]!=="男"&&now_post_arr[now_post_arr.length-1]!=="女"){
                    return (d.target.class === now_post_arr[now_post_arr.length-1]||
                        d.target.class === now_post_arr[now_post_arr.length-1].slice(0,-1))?"orangeRed":"black";
                }else{
                    for(var i = 0; i < now_post_arr.length; i++){
                        if(d.target.class === now_post_arr[i]||d.target.class === now_post_arr[i].slice(0,-1)){
                            return "orangeRed";
                        }
                    }
                    return "black";
                }
            })
            .attr("opacity",function(d){
                if(now_post_arr[now_post_arr.length-1]!=="男"&&now_post_arr[now_post_arr.length-1]!=="女"){
                    return (d.target.class === now_post_arr[now_post_arr.length-1]||
                        d.target.class === now_post_arr[now_post_arr.length-1].slice(0,-1))?1:0.3;
                }else{
                    for(var i = 0; i < now_post_arr.length-1; i++){
                        if(d.target.class === now_post_arr[i]||d.target.class === now_post_arr[i].slice(0,-1)){
                            return 1;
                        }
                    }
                    return 0.3;
                }
            });

        main_view.select("#NodeLinkTree_teacher")
                .selectAll("rect")
                .attr("opacity",function(d){
                    //console.log(this.id);
                    if(this.id === "tree_rect_教师"){
                        return 1;
                    }
                    else if(now_post_arr[now_post_arr.length-1]!=="男"&&now_post_arr[now_post_arr.length-1]!=="女"){
                        return ((this.id === ("tree_rect_" + now_post_arr[now_post_arr.length-1]))
                            ||(this.id === ("tree_rect_" + now_post_arr[now_post_arr.length-1].slice(0,-1))))?1:0.3;
                    }else{
                        for(var i = 0; i < now_post_arr.length-1; i++){
                            if((this.id === ("tree_rect_" + now_post_arr[i]))
                                ||(this.id === ("tree_rect_" + now_post_arr[i].slice(0,-1)))){
                                return 1;
                            }
                        }
                        return 0.3;
                    }
                });
        main_view.select("#NodeLinkTree_teacher")
                .selectAll("text")
                .attr("opacity",function(d){
                    if(this.id === "t_text教师"){
                        return 1;
                    }
                    else if(now_post_arr[now_post_arr.length-1]!=="男"&&now_post_arr[now_post_arr.length-1]!=="女"){
                        return ((this.id === ("t_text" + now_post_arr[now_post_arr.length-1]))
                            ||(this.id === ("t_text" + now_post_arr[now_post_arr.length-1].slice(0,-1))))?1:0.3;
                    }else{
                        for(var i = 0; i < now_post_arr.length-1; i++){
                            if((this.id === ("t_text" + now_post_arr[i]))
                            ||(this.id === ("t_text" + now_post_arr[i].slice(0,-1)))){
                                return 1;
                            }
                        }
                        return 0.3;
                    }
                });
    }else{
        main_view.select("#NodeLinkTree_teacher").selectAll("path.link").style("stroke","black").attr("opacity",1);
        main_view.select("#NodeLinkTree_teacher").selectAll("rect").attr("opacity",1);
        main_view.select("#NodeLinkTree_teacher").selectAll("text").attr("opacity",1);
    }
}

//高亮对应教师
function selectTeacher_tree(now_post_arr,ifclick_TeacherTree){
    //console.log(now_post_arr);
    var course_Name_T = [];
    var course_Year_T = [];
	var course_Year_T1=[];
    var temp_year = [];
	var temp_year1=[];
    var name_year = {};
    var idx_name = -1;
    var idx_name_year = -1;
    var last_teacher = "";
    main_view.selectAll("#overall_teacherMap_g")
        .selectAll("g")
        .filter(function(){
            //console.log(this);
            //这一段将变化得教师教师教学信息复原
            if(this.id === "itemInfo") return this;
            var changeFlag = this.getAttribute("ifchangeItemAttr");
            d3.select(this).selectAll("rect")
                .attr("opacity",function(d){
                    if(this.id.slice(0,10) === "courseNum_"){
                        if(changeFlag === "yes"){
                            return this.getAttribute("opacity")/0.3;
                        }
                        else{
                            return this.getAttribute("opacity"); 
                        }
                    }
                    else{
                        return 1;
                    }
                    
                })
                .style("display",null);
            d3.select(this).selectAll("text").attr("opacity","1");
            if(changeFlag === "yes") d3.select(this).attr("ifchangeItemAttr","no");
            changeFlag = "no";

            //获取元素class
            if(ifclick_TeacherTree){
                var flag = false;
                if(now_post_arr.indexOf(this.className.animVal.slice(13)) !== -1){
                    last_teacher = this.id.slice(-2);
                    d3.select(this).selectAll("rect")
                        .style("display",null)
                        .filter(function(){
                            idx_name_year = idx_name;
                            
							
                            if(this.className.animVal === "courseType"){
                                //console.log(this);
                                idx_name=idx_name+1;
                                //console.log("--->courseType",idx_name,idx_name_year);
                                course_Name_T.push(this.id.slice(11));
                                flag = true;
                            }

                            if(this.className.animVal === "courseYear"){
                                
                                if(idx_name === idx_name_year){
									
                                    temp_year.push(this.id.slice(0,4));
									
                                      flag = false;
                                }
                                
                                /*console.log("--->601",idx_name,idx_name_year,flag);
                                console.log("--->602",temp_year);
                                console.log("--->609",course_Name_T);
                                console.log("--->610",course_Year_T);*/
								console.log("course_Year_T",course_Year_T);
								console.log("course_Year_T1",course_Year_T1);
                            }else if(idx_name != idx_name_year && flag && idx_name_year != -1){
								//console.log(i,idx_name);
								course_Year_T.push(temp_year);
								
								temp_year1=course_Year_T[idx_name_year];
								if(temp_year1.length!=0)
								course_Year_T1.push(course_Year_T[idx_name-1]);
                                temp_year = [];
                                flag = false;
                            }
                        });
                }else{
                    if(idx_name === idx_name_year && !flag && temp_year.length != 0){
                        course_Year_T.push(temp_year);
                        temp_year = [];

                    }
                    d3.select(this).selectAll("rect")
                        .attr("opacity",function(d){
                            if(this.id.slice(0,10) === "courseNum_"){
                                if(changeFlag === "no") return this.getAttribute("opacity")*0.3;
                                else return this.getAttribute("opacity")/0.3;
                            }
                            else{
                                if(changeFlag === "no") return 0.3;
                                else return 1;
                            }
                            
                        })
                        .style("display",null);
                        d3.select(this).selectAll("text").attr("opacity","0.3");
                        if(changeFlag === "no")
                            d3.select(this).attr("ifchangeItemAttr","yes");
                        else
                            d3.select(this).attr("ifchangeItemAttr","no");
                }

                if(last_teacher === "f6"){
                    course_Year_T.push(temp_year);   
                }
            }
        });
		var length=course_Year_T.length;
		course_Year_T1.push(course_Year_T[length-2]);
		course_Year_T1.push(course_Year_T[length-1]);
        name_year.name = course_Name_T;
        name_year.year = course_Year_T1;
        /*console.log(course_Year_T);
        console.log(name_year);*/
        return name_year;
}