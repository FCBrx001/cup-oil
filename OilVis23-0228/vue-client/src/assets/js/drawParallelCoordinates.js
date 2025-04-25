function drawParallelCoordinates(dataPath){
	$('#MainView');
	$('#OverallSvg');
	$('#HeatMap');
	var m = [30, 10, 10, 10],
		w = 880 - m[1] - m[3],
		h = 401.6 - m[0] - m[2];

	var dataRaw = [];		 //存放读取的CSV
	var center_cluster_coor ;//存放聚类中心坐标
	var gradeYear = 0;		 //存储学业进展的年级

	var x = d3.scale.ordinal().rangePoints([0, w], 1),
		y = {},
		y1={},
		dragging = {};

	var line = d3.svg.line().interpolate("basis");
	var line_str = d3.svg.line();
	var	connect_line = d3.svg.line(),
		axis = d3.svg.axis().orient("left"),
		axis1=d3.svg.axis().orient("right").tickValues([1.3,3.3]),
		background,
		foreground;

	parallel_coor_g = main_view.append("g")
				.attr("id","ParallelCoordinates")
				.attr("transform", "translate(" + 320 + "," + m[0] + ")");

	d3.csv(dataPath, function(error, data) {
		if (error) throw error;
		dataRaw = data;	//存放CSV数据
		gradeYear = dataPath.slice(30,-4);
		//console.log(gradeYear);
		/* data,学生成绩数据,对象数组:
		   [{1: "3.81", 2: "3.88", 3: "3.93", 4: "3.91", 5: "3.94", 6: "3.82", 7: "3.81", 8: "3.83", id: "2007081221"}
			,...,
		    {1: "0.91", 2: "1.17", 3: "1.23", 4: "1.35", 5: "1.22", 6: "1.15", 7: "1.24", 8: "1.44", id: "2010044206"}]
		*/

		//Extract the list of dimensions and create a scale for each.
		x.domain(dimensions = d3.keys(data[0])
			.filter(function(d) {
				//console.log(d);
				return d != "semester" && d != "id" && (y[d] = d3.scale.linear()
					.domain([0,4])
					.range([h,0]))&& (y1[d] = d3.scale.linear()
					.domain([0,4])
					.range([h,0]));
			}))

		center_cluster_coor = mycluster(data)

		//添加背景颜色
		background = parallel_coor_g.append("g")
						.attr("class", "background")
						.selectAll("path")
						.data(data)
						.enter()
						.append("path")
						.attr("d", path)

		//添加线条颜色
		foreground = parallel_coor_g.append("g")
					.attr("class", "foreground")
					.selectAll("path")
					.data(data)
					.enter()
					.append("path")
					.attr("d", path)
					.attr("id",function(d){
						return d.id;
					})
					.style("stroke",function(d){
						if(d[1]>=3.3) return 'blue';
						else if(d[1]>=1.3) return 'green';
						else return 'red';
					})
					.style("opacity",1);

		// Add a group element for each dimension.
		var g = parallel_coor_g.selectAll(".dimension")
					.data(dimensions)
					.enter().append("g")
					.attr("class", "dimension")
					.attr("transform", function(d) { return "translate(" + x(d) + ")"; })
					.call(d3.behavior.drag()
						.on("dragstart", function(d) {
							dragging[d] = this.__origin__ = x(d);
							background.attr("visibility", "hidden");
						})
						.on("drag", function(d) {
							dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
							foreground.attr("d", path);
							dimensions.sort(function(a, b) { return position(a) - position(b); });
							x.domain(dimensions);
							g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
						})
						.on("dragend", function(d) {
							delete this.__origin__;
							delete dragging[d];
							transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
							transition(foreground).attr("d", path);
							background.attr("d", path)
										.transition()
										.delay(500)
										.duration(0)
										.attr("visibility", null);
						}));

		// Add an axis and title.
		g.append("g")
			.attr("class", "axis")
			.each(function(d) { d3.select(this).call(axis.scale(y[d])); })
			.append("text")
			.attr("text-anchor", "middle")
			.attr("y", -9)
			.text(String);
			
		g.append("g")
			.attr("class", "axis1")
			.each(function(d) { d3.select(this).call(axis1.scale(y1[d])); })
			.append("text")
			.attr("text-anchor", "middle")
			.attr("y", -9);
			//.attr("font-size","12px");

		// Add and store a brush for each axis.
		g.append("g")
			.attr("class", "brush")
			.each(function(d) { 
				d3.select(this)
				.call(y[d].brush = d3.svg.brush().y(y[d])
				.on("brushstart", brushstart).on("brush", brush)); })
			.selectAll("rect")
			.attr("x", -8)
			.attr("width", 16);

	});
for(var i=0;i<8;i++){
	
	
	
}
	function position(d) {
		//console.log(dragging[d])
		var v = dragging[d];
		return v == null ? x(d) : v;
	}

	function transition(g) {
		return g.transition().duration(500);
	}

	// Returns the path for a given data point.
	function path(d) {
		var movey = [30,135,240,330],	//两个move参考drawHeatMap.js 85行
			movex = [36,36,34,33],	
			coordinate_heatMap = [],	//存放矩阵热力图与平行坐标的链接节点
			w1=6,h1=1.8;
		var aim_center_clu; //存放目标聚类中心
		var aim_coor;		//存放目标坐标点
		var control = [0,0];//控制点
		var m_y = 0,		//Vi,j和Vi+1,j中心点
			p_y = 0;		//P点纵坐标
		var temp = [];		//存放对象关键值;存放路径控制点(每段3个控制点)
		var path_str = '';	//路径
		var a_p = 0.55;		//计算P的系数
		var b_c = 0.1;		//计算中间控制点系数

		for(var i in d)
			temp.push(i)

		for(var i = 0; i < center_cluster_coor.length; i ++){
			//记住if,else要加{}会好一点
			if(temp[temp.length-1] == 'id'){
				if(center_cluster_coor[i][center_cluster_coor[i].length-1] == d.id)
					aim_center_clu = center_cluster_coor[i];
			}
			else if(center_cluster_coor[i][center_cluster_coor[i].length-1] == d.semester){
				aim_center_clu = center_cluster_coor[i];
			}
		}

		//将平行坐标坐标轴上的数据提取到出存储到 aim_coor 上
		aim_coor = dimensions.map(function(p) {
			return [position(p), y[p](d[p])];
		});

		var year = parseInt(String(d.id).slice(0,4));
		var data_year = eval("data"+String(d.id).slice(0,4));
		for(var i = 0;i<data_year.length-2;i++){			
			if(parseInt(d.id) === parseInt(data_year[i].name)){
				//计算每个学生 平行坐标与矩阵热率图连接点
				coordinate_heatMap = [w1*movex[year-2007] - 230, movey[year-2007]+h1*i+h1/2 - m[0]];
			}
		}
		//如果矩阵热力图与平行坐标连线不用边捆绑,这句不需要
		//计算每个学生 平行坐标与矩阵热率图连接点插入到对应学生平行坐标路径的头部
		// unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
		aim_coor.unshift(coordinate_heatMap);

		//平行坐标中曲线两种绘制方式之一
		//分段调用line()函数,路径拼接起来
		for(var i = 0; i < aim_coor.length - 1; i++){
			temp = []
			control=[0,0];
			m_y = (aim_coor[i][1] + aim_coor[i+1][1])/2;
			p_y = aim_center_clu[i][1] + a_p*(aim_center_clu[i][1] - m_y);
			control[0] = (aim_coor[i][0] + aim_coor[i+1][0])/2;
			control[1] = b_c*m_y + (1 - b_c)*p_y
			temp.push(aim_coor[i]);
			temp.push(control);
			temp.push(aim_coor[i+1]);
			if(i==0) path_str = /*line([coordinate_heatMap,aim_coor[i]])+ */ line(temp);
			else path_str = path_str + line(temp);
		}
		return path_str;
		

		//平行坐标中曲线两种绘制方式之二
		//将控制点连接起来,然后调用line()函数,获取路径
		/*temp = []
		for(var i = 0; i < aim_coor.length - 1; i++){
			control=[0,0];
			m_y = (aim_coor[i][1] + aim_coor[i+1][1])/2;
			p_y = aim_center_clu[i][1] + a_p*(aim_center_clu[i][1] - m_y);
			control[0] = (aim_coor[i][0] + aim_coor[i+1][0])/2;
			control[1] = b_c*m_y + (1 - b_c)*p_y
			temp.push(aim_coor[i]);
			temp.push(control);
			temp.push(aim_coor[i+1]);
		}
		return line(temp);*/
		//return line_str(aim_coor);
		//return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
	}

	// When brushing, don’t trigger axis dragging.
	function brushstart() {
		d3.event.sourceEvent.stopPropagation();
	}

	// Handles a brush event, toggling the display of foreground lines.
	function brush() {
		var datasetID = dataRaw.map(function(d){return d.id;});	//存放数据所有ID,然后剔除被刷取的
		var activeID = [];		//存放被刷取的ID
		var datasetHist = [];	//存放绘制成绩drawHistogram_student()函数数据
		var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
			extents = actives.map(function(p) { return y[p].brush.extent(); });
		for(var k = 2007; k <= 2010; k++){
			gHeatID[k-2007] = [];
		}
		foreground.style("display", function(d) {
			if(actives.every(function(p, i){
					return extents[i][0] <= d[p] && d[p] <= extents[i][1];
			})){
				datasetID.removeByValue(d.id);	//剔除被刷取的ID
				activeID.push(d.id);			//存放被刷取的ID
				return null;
			}
			else return "none";
		});

		for(var k=2007;k<=2010;k++){
			if(gradeYear === "all")
				heatmap_g.select(".g"+k).select("g.histogram").remove();
			else if(k.toString() === gradeYear)
				heatmap_g.select(".g"+k).select("g.histogram").remove();
			datasetHist = [];
			heatmap_g.select(".g"+k).selectAll("g.heat"+k)
				.filter(function(d,i){
					//console.log(d);
					//此处是用来筛选出被刷取的路径，还可以用活动ID activeID
					if(!datasetID.contains(eval("data"+k)[i].name)){
						for(var j = 0; j < transform(eval("data"+k)[i]).slice(1).length;j++){
							if(transform(eval("data"+k)[i]).slice(1)[j] !== ""|| typeof(transform(eval("data"+k)[i]).slice(1)[j]) === "undefined")
								datasetHist.push(transform(eval("data"+k)[i]).slice(1)[j])
						}
						return d;
					}
				})
				.selectAll("rect")
				.style("display",null);
			heatmap_g.select(".g"+k).selectAll("g.heat"+k)
				.filter(function(d,i){
					if(datasetID.contains(eval("data"+k)[i].name)) return d;
				})
				.selectAll("rect").style("display","none");
			if(gradeYear === "all")
				drawHistogram_student(datasetHist,k);
			else if(k.toString() === gradeYear)
				drawHistogram_student(datasetHist,k);
		}
	}

	//js和python一样,名字只是指向数据的代称
	//var mydata = data都指向同一块数据
	//目前理解,2019.3.14
	function mycluster(data){
		/*var mydata = data
		console.log(mydata)*/
		var div_index = [];
		var	slice_index ,
			cluster_id;
		//var center_coor;

		data = mysort(data)

		//按第一学期分层
		for(var i = 0; i < data.length-1; i++)
			if(data[i][1]>=3.3&&data[i+1][1]<3.3)
				div_index.push(i);
			else if(data[i][1]>=1.3&&data[i+1][1]<1.3)
				div_index.push(i);

		slice_index = slice_data(div_index,data.length);
		cluster_id = get_cluster_id(slice_index,data);
		return(get_center_cluster(slice_index,cluster_id,data));
	}

	//基排序
	//内部排序使用的是改进的冒泡排序
	function mysort(data){
		//获取学期
		var temp = [];
		for(var i in data[0])
			if(i != "id" && i != "semester")
				temp.push(parseInt(i));
		//基排序
		for(var i = temp.length-1; i >= 0; i--){
			//优化的冒泡排序
			for(var j = 0; j < data.length - 1; j ++){
				var flag = false;
				for(var k = 0; k < data.length - j - 1; k ++){
					if(data[k][temp[i]] < data[k+1][temp[i]]){
						var re_temp = data[k];
						data[k] = data[k+1];
						data[k+1] = re_temp;
						flag = true;
					}
				}
				if(!flag) break;
			}
		}
		//console.log(data);
		return data;
	}

	/* 对data按第一学期进行分段,返回分段结果
	参数：
	   数据分段索引:div_index [第一类最后一个元素的索引,...,倒数第二类最后一个元素的索引]
	   原始数据的长度:data_length
	   返回值:数据分类的索引对数组,[第一类索引对,第二类索引对,...,最后一类索引对]
	   [[0,第一类最后一个元素的索引],...,[倒数第二类最后一个元素的索引+1,data_length]]
	*/
	function slice_data(div_index,data_length){
		var slice_index = [];
		if(div_index.length < 1) console.log("waring!!!")
		else if(div_index.length == 1){
			slice_index.push([0,div_index[0]]);
			slice_index.push([div_index[0]+1,data_length-1]);
		}
		else{
			for(var i = 0; i < div_index.length; i++){
				if(i==0) slice_index.push([0,div_index[i]]);
				else if(i == div_index.length - 1){
					slice_index.push([div_index[i-1]+1,div_index[i]]);
					slice_index.push([div_index[i]+1,data_length-1]);
				}
				else slice_index.push([div_index[i-1]+1,div_index[i]]);
			}
		}
		return slice_index;
	}

	/* 获取聚类id
	  数据结构如下:
	* [
	   [ //第一大类,按第一学期分类
		[[第一类学号],[第二类学号],[第三类学号]],//第一学期
		...,								  //第...学期
		[[第一类学号],[第二类学号],[第三类学号]]//最后一学期
	   ],
	   ,...,
	   [[],[],...,[]]]
	*/
	/*
	参数:
		数据分类的索引对数组,slice_index:
		原始数据:data(对象数组)
	返回值:
		聚类id
	*/
	function get_cluster_id(slice_index,data){
		var	cluster_id = [],
			temp = [];
		//获取学期,学号编号
		for(var i in data[0])
			temp.push(i);

		for(var i = 0; i < slice_index.length; i++){
			var clu_id = [];
			for(var j = 0; j < temp.length-1; j ++){
				var clu_id_a = [],
					clu_id_b = [],
					clu_id_c = [],
					clu_id_all = [];
				for(var k = slice_index[i][0]; k <= slice_index[i][1]; k++ ){
					if(temp[temp.length-1] == 'id'){
						if(data[k][parseInt(temp[j])] >= 3.3)
							clu_id_a.push(data[k].id);
						else if(data[k][parseInt(temp[j])] >= 1.3)
							clu_id_b.push(data[k].id);
						else clu_id_c.push(data[k].id);
					}
					else if(temp[temp.length-1] == 'semester'){
						if(data[k][parseInt(temp[j])] >= 3.3)
							clu_id_a.push(data[k].semester);
						else if(data[k][parseInt(temp[j])] >= 1.3)
							clu_id_b.push(data[k].semester);
						else clu_id_c.push(data[k].semester);
					}
				}
				clu_id_all.push(clu_id_a,clu_id_b,clu_id_c);
				clu_id.push(clu_id_all);
			}
			cluster_id.push(clu_id);
		}
		return cluster_id;
	}

	function get_center_cluster(slice_index,cluster_id,data){
		var movey = [30,135,240,330],	//两个move参考drawHeatMap.js 85行
			movex = [36,36,34,33],
			m = [30, 10, 10, 10],
			coordinate_heatMap = [],	//存放矩阵热力图与平行坐标的链接节点
			w1=6,h1=1.8;

		var year = 0;
		var coor_heat_all = []; //矩阵热力图与平行坐标链接节点,学号放在尾部[[],[],学号]

		var temp = [];			//将学期,学号代号存出来
		var coordinate = [];	//保存GPA转化成平行坐标中坐标
		var coor_all = [];		//保存GPA转化成平行坐标中坐标,将学号加在尾部
		var coor_a = []; 		//存放聚类中第i条坐标轴上坐标
		var coor_b = []; 		//存放聚类中第i+1条坐标轴上坐标
		var center_coor = [];	//存放聚类中心和相应学号
		var clu_coor_sum=[0,0], //聚类点集合
			clu_center = [0,0];	//聚类中心点

		var index_coor_heat = [[],[],[]];

		for(var i in data[0])
			temp.push(i);

		//将每学期GPA转化成平行坐标中坐标
		for(var i = 0; i < slice_index.length; i++){
			center_coor.push([]);
			for(var j = slice_index[i][0]; j <= slice_index[i][1]; j ++){
				//计算平行坐标与举证热力图连线节点,到空行
				var data_year = eval("data"+String(data[j].id).slice(0,4));
					coordinate_heatMap = [];
					year = parseInt(data[j].id.slice(0,4));
				for(var l = 0;l<data_year.length-2;l++){			
					if(parseInt(data[j].id) === parseInt(data_year[l].name)){
						coordinate_heatMap.push([w1*movex[year-2007] - 230, movey[year-2007]+h1*l+h1/2 - m[0]]);
					}
				}
				coordinate_heatMap.push([position(1), y[1](data[j][1])]);

				coordinate = dimensions.map(function(p) { return [position(p), y[p](data[j][p])]; });
				if(temp[temp.length-1] == 'id'){
					coordinate.push(data[j].id);
					coordinate_heatMap.push(data[j].id);
					center_coor[i].push([data[j].id]);
				}
				else if(temp[temp.length-1] == 'semester'){
					coordinate.push(data[j].semester);
					coordinate_heatMap.push(data[j].semester);
					center_coor[i].push([data[j].semester]);
				}
				coor_heat_all.push(coordinate_heatMap);
				coor_all.push(coordinate);
			}
		}

		var len_coor = coor_all[0].length;
		//求平行坐标的聚类中心,我自己不想看了,脑壳疼
		for(var i = 0; i < cluster_id.length; i ++){//找到分类
			for(var j = cluster_id[i].length - 1; j >= 1 ; j--){//找到每类学期,从最后一学期开始遍历
				for(var k = 0; k < cluster_id[i][j].length; k ++){//找到每类某一学期分类
					coor_a = [];
					coor_b = [];
					clu_coor_sum = [0,0];
					clu_center = [0,0];
					for(var n = 0; n < cluster_id[i][j][k].length; n++){//遍历每类某一学期分类中学号
						//抽取相应学期
						for(var m = slice_index[i][0];m <= slice_index[i][1]; m++ ){
							if(cluster_id[i][j][k][n] === coor_all[m][len_coor-1]){
								coor_a.push(coor_all[m][j-1]);
								coor_b.push(coor_all[m][j]);
							}
						}
					}
					//计算聚类中心
					if(cluster_id[i][j][k].length !== 0){
						for(var ind_a = 0; ind_a < coor_a.length; ind_a++){
							clu_coor_sum[0] = clu_coor_sum[0] + coor_a[ind_a][0] + coor_b[ind_a][0];
							clu_coor_sum[1] = clu_coor_sum[1] + coor_a[ind_a][1] + coor_b[ind_a][1];
						}
						clu_center[0] = clu_coor_sum[0]/(2*coor_a.length);
						clu_center[1] = clu_coor_sum[1]/(2*coor_a.length);
					}

					for(var n = 0; n < cluster_id[i][j][k].length; n++){
						for(var l = 0; l < center_coor[i].length; l++){
							clu_center_add_id = [];
							if(center_coor[i][l][center_coor[i][l].length-1] === cluster_id[i][j][k][n])
								center_coor[i][l].splice(0, 0, clu_center);
						}
					}
				}
			}
		}

		//计算平行坐标与矩阵热力图边捆绑聚类中心
		for(var i = 0; i < cluster_id.length;i++){
			index_coor_heat[i] = cluster_id[i][0][i];
		}
		for(var i = 0; i < index_coor_heat.length; i++){
			for(var k = 2007; k < 2011; k++){
				var student_id = [];
				coor_a = [];
				coor_b = [];
				clu_coor_sum = [0,0];
				clu_center = [0,0];
				for(var j = 0; j < coor_heat_all.length; j++){
					if(coor_heat_all[j][2].slice(0,4)===k.toString()&&index_coor_heat[i].contains(coor_heat_all[j][2])){
						student_id.push(coor_heat_all[j][2]);
						clu_coor_sum[0] = clu_coor_sum[0] + coor_heat_all[j][0][0] + coor_heat_all[j][1][0];
						clu_coor_sum[1] = clu_coor_sum[1] + coor_heat_all[j][0][1] + coor_heat_all[j][1][1];
					}
				}
				if(clu_coor_sum[0]!==0){
					clu_center[0] = clu_coor_sum[0]/(student_id.length*2);
					clu_center[1] = clu_coor_sum[1]/(student_id.length*2);
				}
				if(center_coor[i] !== undefined){
					for(var j = 0; j < center_coor[i].length; j++){
						if(student_id.contains(center_coor[i][j][7])){
							center_coor[i][j].splice(0, 0, clu_center)
						}
					}
				}
			}
		}
		return tranform_array(center_coor)
	}

	function tranform_array(center_coor){
		var cen = []
		for(var i = 0 ; i < center_coor.length; i++ )
			for(var j = 0; j < center_coor[i].length; j++ )
				cen.push(center_coor[i][j]);
		return cen;
	}
}