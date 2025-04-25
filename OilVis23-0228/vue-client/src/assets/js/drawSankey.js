function drawSankey(dataPath){
	$('#MainView')

	var width = 760,
		height = 361.2;
		node_width = 10;
		node_padding = 100;
		semester_width = 3.5;
		mycolor = ["Blue","Green","hsl(0,100%,40%)"];

	//d3.json("data/AcademicProgressPath_B.json",function(data){
	d3.json(dataPath,function(data){
		//console.log(data)
    	sankey_g = main_view.append("g")
    				.attr("id","SanKey")
            		.attr("transform", "translate(370,20)");
	
		// 定义桑基布局
		/*
		nodeWidth表示节点水平宽度，这个属性可以用来设置矩形的宽度等；
		nodePadding表示矩形的垂直方向的间距；
		size表示整个sankey图占用的空间大小；
		nodes加载如上所述的节点数组；
		同理links函数加载链接数组；
		layout中的参数表示桑基布局用来优化流布局的时间
		*/
		var sankey = d3.sankey()
	        .nodeWidth(node_width)		//设置节点宽度 
	        .nodePadding(node_padding) 	//设置节点间距
	        .size([width, height]) 
	        .nodes(data.nodes)  
	        .links(data.links)
	        .layout(3);

		// 路径数据生成器
		var path = sankey.link();

					//计算节点横坐标
		var node_x = [],
			semeset_x = [];
		for(var i = 0; i < data.nodes.length; i = i + 3){
			node_x.push(data.nodes[i].x);
			node_x.push(data.nodes[i].x);
			semeset_x.push(data.nodes[i].x);
		}
		
		//绘制学期线
		var semester_line = sankey_g.append("g")
								.attr("transform","translate(0,10)")
								.selectAll(".rect")
					            .data(node_x)
					            .enter();

		var semester_text = sankey_g.append("g")
								.attr("class","sankeySemesterText")
								.attr("transform","translate(0,00)")
								.selectAll(".text")
					            .data(semeset_x)
					            .enter();
								
		// 绘制连接数据
		var links = sankey_g.append("g")
					.attr("transform","translate(0,10)")
					.selectAll("path")
		            .data(data.links)
		            .enter();
		            
		// 绑定节点数据
		var nodes = sankey_g.append("g")
						.attr("transform","translate(0,10)")
						.selectAll(".node")
		                .data(data.nodes)
		                .enter();

		// 绘制连接线
		links.append("path")
		    .attr({
		    	fill: function(d,i){ return mycolor[d.color.slice(0,1)-1];},  //填充色 
		        stroke: function(d,i){ return mycolor[d.color.slice(0,1)-1];},//描边色
		        "stroke-width": function(d,i){
		        	//return d.dy<1 ? 0.5:0;/*return Math.max(1, d.dy);*/
		        	return 0;
		        	},//连线的宽度
		        "stroke-opacity": 0.65,  //描边透明度
		        d: path,  //路径数据
		        id: function(d,i){ return 'link' +i }  //ID
		    })
		    .on("mouseover",function(d,i){
		     	var index = [],
		     		index_node = [];
		     	var index_cor = [];
		     		index.push(data.links.indexOf(d));
		     		index_node.push(d.target.name);
		     		index_node.push(d.source.name);
		     		index_cor = [index,index_node];
		     	computeSourceIndex(index_cor,d,data);
		     	computeTargetIndex(index_cor,d,data);
		     	//console.log(abcde);
		     	/*for(var j = 0; j < d.source.targetLinks.length; j++)
		     		if(d.pathed_aaa.includes(d.source.targetLinks[j].pathed_aaa)){
		     			index.push(data.links.indexOf(d.source.targetLinks[j]));
		     			if(d.source.targetLinks[j].source !== undefined){
		     				index_node.push(d.source.targetLinks[j].source.name);
		     			}
		     		}
		     	for(var j = 0; j < d.target.sourceLinks.length; j++)
		     		if( d.target.sourceLinks[j].pathed_aaa.includes(d.pathed_aaa)){
		     			index.push(data.links.indexOf(d.target.sourceLinks[j]));
		     			if(d.target.sourceLinks[j].target !== undefined){
		     				index_node.push(d.target.sourceLinks[j].target.name);
		     			}
		     		}*/
		     	sankey_g.selectAll("path").style("stroke-opacity",0.3).style("opacity",0.3);
		     	sankey_g.selectAll(".levelNode").style("opacity",0.3);
			    sankey_g.selectAll(".semesterLine").style("opacity",0.3);
		     	for(var j = 0; j < index.length; j++){
		     		sankey_g.select("#link"+index[j])
		     			.style("stroke-opacity",1)
		     			.style("opacity",1);	
		     	}
		     	index_node.sort(function(a,b){
		     		return b-a;
		     	});
		     	for(var j = 0; j < index_node.length; j++){
		     		if(j < index_node.length-1 && (index_node[j] - index_node[j+1])< 3 
		     			&& Math.floor(index_node[j]/3) === Math.floor(index_node[j+1]/3))
		     			sankey_g.select("#semester"+((Math.floor(index_node[j+1]/3)+1)*10/*+index_node[j+1]%3*/))
		     				.attr("height", function(d) { return height/2; })
		     				.style("opacity",1);
		     		sankey_g.select("#node"+index_node[j]).style("opacity",1)
		     	}
		    })
		    .on("mouseout",function(d,i){
		     	sankey_g.selectAll("path")
		     		.style("stroke-opacity",0.65)
		     		.style("opacity",0.8)
		     	sankey_g.selectAll(".levelNode").style("opacity",1)
		     	sankey_g.selectAll(".semesterLine").style("opacity",1).attr("height", function(d){return height/2;})
		    });
		/*sankey_g.selectAll("path").filter(function(d,i){
			//console.log(this.id);
			if(this.id==="link7") {
				console.log(d);
				console.log(this);
			}
			if(this.id!=="link7") d3.select(this).remove();
		});*/

		//绘制学期连线
        semester_line.append("rect")
			.attr("transform",function (d,i) {
		        return "translate(" + (d + node_width/2 - semester_width/2)+ "," + (height/2)*(i%2)+ ")";
		       })
			.attr("id",function(d,i){
				return "semester" + (Math.floor(i/2)+1)+""+(i%2);
			})
			.attr("class","semesterLine")
	        .attr("width", function(d) { return semester_width; })
	        .attr("height", function(d) { return height/2; })
	        .style("fill", "#595757");

	    //绘制矩形节点
		nodes.append("rect")
		    .attr("transform",function (d) {return "translate(" + d.x + "," + d.y + ")";})
		    .attr("id",function(d,i){return "node"+i;})
		    .attr("class","levelNode")
	        .attr("width", function(d) { return d.dx; })
	        .attr("height", function(d) { return d.dy; })
	        .style("fill", function(d){
				console.log("blue",parseInt(d.name));
		        	if(parseInt(d.name)%3 == 0) return "darkblue";
		        	else if(parseInt(d.name)%3 == 1) return "darkgreen";
		        	else return "darkred";
		        })	
            .attr("rx",3)				
	        .on("mouseover",function(d,i){
		     	var index_node = [];
		     	var node_name = d.name;
		     		index_node.push(d.name);

		     	sankey_g.selectAll("path").style("stroke-opacity",0.3).style("opacity",0.3);
		     	sankey_g.selectAll(".levelNode").style("opacity",0.3);
			    sankey_g.selectAll(".semesterLine").style("opacity",0.3);
		     	sankey_g.selectAll("path").filter(function(d,i){
		     		if(d.source.name === node_name){
		     			index_node.push(d.target.name)
		     			d3.select(this).style("stroke-opacity",1).style("opacity",1);
		     		}
		     		if(d.target.name === node_name){
		     			index_node.push(d.source.name)
		     			d3.select(this).style("stroke-opacity",1).style("opacity",1);
		     		}
		     	});
		     	index_node = index_node.moveRepetition();
		     	index_node.sort(function(a,b){
		     		return b - a;
		     	});
		     	for(var j = 0; j < index_node.length; j++){
		     		if(j < index_node.length-1 && (index_node[j] - index_node[j+1])< 3 
		     			&& Math.floor(index_node[j]/3) === Math.floor(index_node[j+1]/3))
		     			sankey_g.select("#semester"+((Math.floor(index_node[j+1]/3)+1)*10+index_node[j+1]%3))
		     				.attr("height", function(d) { return height/2; })
		     				.style("opacity",1);
		     		sankey_g.select("#node"+index_node[j]).style("opacity",1)
		     	}

		    })
		    .on("mouseout",function(d,i){
		     	sankey_g.selectAll("path").style("stroke-opacity",1).style("opacity",0.8);
		     	sankey_g.selectAll(".levelNode").style("opacity",1);
		     	sankey_g.selectAll(".semesterLine").style("opacity",1).attr("height", function(d){return height/2;});
		    });

	    semester_text.append("text")
			    	.attr("transform",function (d,i) {
				        return "translate(" + d+ "," +1+ ")";
				       })
			    	.text(function(d,i){
			    		return i+1;
			    	})
			    	.attr("font-size","11px")
			    	.attr("text-anchor","start")
			    	.style("fill", "block");

		// 绘制节点文本
		/*nodes.append("text")
	        .attr({
	            x: function (d) { return d.x+sankey.nodeWidth() / 2; },
	            y: function (d) { return d.y+d.dy / 2; }
	        })
	        .text(function (d) { return d.value; })
	        .style("fill","white");*/

	    // 绘制连接文本
		/*links.append('text')
	        .append('textPath')
	        .attr('xlink:href', function (d,i) { return '#link' + i; })
	        .attr('startOffset','50%')
	        //.text(function (d) { return '流量:' + d.value; })
	        .text(function (d) { return d.value; })*/
	});
}

/*index_cor = [index,index_node];
* index = []; index_node = [];
* d被指向的路径
*/
function computeSourceIndex(index_cor,d,data){
	if(d.source.targetLinks === []){
		return index_cor;
	}
	else{
		for(var j = 0; j < d.source.targetLinks.length; j++){
			if(d.pathed_aaa.includes(d.source.targetLinks[j].pathed_aaa)){
				index_cor[0].push(data.links.indexOf(d.source.targetLinks[j]));
				if(d.source.targetLinks[j].source !== undefined){
					index_cor[1].push(d.source.targetLinks[j].source.name);
				}
				computeSourceIndex(index_cor,d.source.targetLinks[j],data);
			}
		}
	}
}

function computeTargetIndex(index_cor,d,data){
	if(d.target.sourceLinks === []){
		return index_cor;
	}
	else{
     	for(var j = 0; j < d.target.sourceLinks.length; j++){
     		if( d.target.sourceLinks[j].pathed_aaa.includes(d.pathed_aaa)){
     			index_cor[0].push(data.links.indexOf(d.target.sourceLinks[j]));
     			if(d.target.sourceLinks[j].target !== undefined){
     				index_cor[1].push(d.target.sourceLinks[j].target.name);
     			}
     			computeTargetIndex(index_cor,d.target.sourceLinks[j],data);
     		}
     	}
	}
}