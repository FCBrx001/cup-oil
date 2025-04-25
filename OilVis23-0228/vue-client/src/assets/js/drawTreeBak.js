function drawTree(pathTree){
    $('#MainView');
    $('#OverallSvg');
    var name_path = pathTree.slice(5,-5);
    console.log(name_path);
    //定义树的参数
    var twidth=220,theight=180;
    //课程树
    var tree1 = d3.layout.tree().size([theight, twidth]);
    //对角线生成器
    var diagonal = d3.svg.diagonal().projection(function (d) { return [d.y, d.x]; });
    var vis = overall_svg.append("g")
                    .attr("id", "NodeLinkTree")
                    .attr("class","course").attr("transform","translate(40,420)");

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
        var duration = d3.event && d3.event.altKey ? 300 : 100;
        //根据数据生成nodes集合
        var nodes = tree1.nodes(root).reverse();
        var count1=0,
            count2=0,
            count3=0;
            //根据节点深度固定y
            nodes.forEach(function (d) {
                if(d.depth==1) count1++;
                else if(d.depth==2) count2++;
                else if(d.depth==3) count3++;
                d.y = d.depth * 40; 
            });

        //根据nodes集合生成节点（绑定数据），添加id为了区分是否是新加入节点
        //node是class为node的g元素集合
        var node = vis.selectAll("g.cnode")
                    .data(nodes, function (d,i){
                        return d.id || (d.id = ++i);
                    });

        var nodeEnter = node.enter().append("g")
                         .attr("class", "cnode")
                         .attr("transform", function (d){ 
                            return "translate(" + source.y0 + "," + source.x0 + ")";
                        });
        var scale=d3.scale.linear().domain([0,1]).range([3,6]);
        if(name_path === "course"){
            nodeEnter.append("circle")
                .attr("r", 5)
                .style("fill", function (d) {
                    if(d.class === "课程" || d.class === "教师") return "orangeRed";
                    else return eval("color" + d.class);
                })
                .attr("opacity", 0.8);

            //为节点添加文本,调整位置
            nodeEnter.append("text")
                    .attr("font-size",12)
                    .attr("x", function (d) {
                        return d.children || d._children ? -13 : 10; 
                    })
                    .attr("y",function(d){
                        if(d.class=="必修"||d.class=="必修理论"||d.class=="选修理论") return -6;
                        else if(d.class=="选修"||d.class=="必修实践"||d.class=="选修实践") return 6;
                        else return 3;
                    })
                    .attr("text-anchor", function (d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function (d) {
                        return d.name;
                    })
                   .style("fill-opacity", 1e-6);
        }
        else{
            nodeEnter.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("transform","translate(-5,-5)")
                .style("fill", function (d) {
                    if(d.class === "课程" || d.class === "教师") return "orangeRed";
                    else return eval("color" + d.class);
                })
                .attr("opacity", 1);

            nodeEnter.append("text")
                .attr("font-size",12)
                .attr("x", function (d) {
                    if(d.name=="教师") return -6;
                    else return d.children || d._children ? -12 : 6; 
                })
                .attr("y",function(d){
                    console.log(d.class);
                    if(d.name=="教师") return 0;
                    else if(d.name=="教授" || d.name=="副教授" || d.name=="讲师") return 15;
                    else if(d.name=="男" || d.name=="女") return 0;
                })
               .attr("dy", "0.35em")
               .attr("text-anchor", function (d) {
                    if(d.class=="教师") return "end";
                    else return "start";
                })
               .text(function (d) { 
                    console.log(d.name)
                    return d.name; 
                });
        }

        
        var flag = 0;
        //更新节点位置
        var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                            return "translate(" + d.y + "," + d.x + ")"; 
                        });

        nodeUpdate.select("circle")
            .attr("r", function(d){
                5
            })
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
            .data(tree1.links(nodes), function (d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
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