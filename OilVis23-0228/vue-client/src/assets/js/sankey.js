d3.sankey = function(){
	var sankey = {},
		nodeWidth = 24,
		nodePadding = 8,
		size = [1, 1],
		nodes = [],
		links = [];

	sankey.nodeWidth = function(_) {
		if (!arguments.length) return nodeWidth;
		nodeWidth = +_;
		return sankey;
	}

	sankey.nodePadding = function(_) {
		if (!arguments.length) return nodePadding;
		nodePadding = +_;
		return sankey;
	};

	sankey.nodes = function(_){
		if (!arguments.length) return nodes;
		nodes = _;
		return sankey;
	}

	sankey.links = function(_){
		if (!arguments.length) return links;
		links = _;
		return sankey;
	}

	sankey.size = function(_) {
		if (!arguments.length) return size;
		size = _;
		return sankey;
	};

	sankey.layout = function(iterations) {
		computeNodeLinks();
	    computeNodeValues();
	    computeNodeBreadths();
	    computeNodeDepths(iterations);
	    computeLinkDepths();
	    return sankey;
	};

	sankey.relayout = function(){
		computeLinkDepths();
		return sankey;
	};

	sankey.link = function(){
		//设置连线的曲率
		var curvature = 0.25;

		function link(d) {
			var x0 = d.source.x + d.source.dx,
				x1 = d.target.x,
				xi = d3.interpolateNumber(x0, x1),
				x2 = xi(curvature),
				x3 = xi(1 - curvature),
				y0 = d.source.y + d.sy + d.dy / 2,
				y1 = d.target.y + d.ty + d.dy / 2;
				/*console.log("---->",65);
				console.log("x0",x0);
				console.log("x1",x1);
				console.log("xi",xi);
				console.log("x2",x2);
				console.log("x3",x3);
				console.log("y0",y0);
				console.log("y1",y1);*/
			//将line改成区域,同时将d.dy太小的部分用另一个区域绘制
			if(d.dy > 3)
				return 	"M"+x0+","+(y0 - d.dy / 2) +
						"C"+x2+","+(y0 - d.dy / 2) +
						" "+x2+","+(y0 - d.dy / 4) +
						" "+(x2+x3)/2 + ","+(y0+y1-d.dy/4-d.dy/4)/2+
						"C"+x3+","+(y1 - d.dy / 4) +
						" "+x3+","+(y1 - d.dy / 2) +
						" "+x1+","+(y1 - d.dy / 2) +
						"L"+x1+","+(y1 + d.dy / 2) +
						"C"+x3+","+(y1 + d.dy / 2) +
						" "+x3+","+(y1 + d.dy / 4) +
						" "+(x2+x3)/2 + ","+(y0+y1+d.dy/4+d.dy/4)/2+
						"C"+x2+","+(y0 + d.dy / 4) +
						" "+x2+","+(y0 + d.dy / 2) +
						" "+x0+","+(y0 + d.dy / 2) + "Z";
			else
				return  "M" + x0 + "," +(y0 - d.dy/2)+
						"C" + x2 + "," +(y0 - d.dy/2)+
						" " + x3 + "," +(y1 - d.dy/2)+
						" " + x1 + "," +(y1 - d.dy/2)+
						"L" + x1 + "," +(y1 + d.dy/2)+
						"C" + x3 + "," +(y1 + d.dy/2)+
						" " + x2 + "," +(y0 + d.dy/2)+
						" " + x0 + "," +(y0 + d.dy/2)+ "Z";
			//返回一条线
			// return "M" + x0 + "," + y0
			// 		+ "C" + x2 + "," + y0
			// 		+ " " + x3 + "," + y1
			// 		+ " " + x1 + "," + y1;
		}

		link.curvature = function(_) {
			if (!arguments.length) return curvature;
			curvature = +_;
			return link;
		};
		return link;
	};

	function computeNodeLinks() {
		nodes.forEach(function(node) {
			node.sourceLinks = [];
			node.targetLinks = [];
		});
		links.forEach(function(link) {
			var source = link.source,
				target = link.target;
				if (typeof source === "number") source = link.source = nodes[link.source];
				if (typeof target === "number") target = link.target = nodes[link.target];
				source.sourceLinks.push(link);
				target.targetLinks.push(link);
		});
	}

	//计算节点的value
	function computeNodeValues() {
		nodes.forEach(function(node) {
			node.value = Math.max(
				d3.sum(node.sourceLinks, value),
				d3.sum(node.targetLinks, value)
			);
		});
	}

	//计算节点的宽度(或者说长度)
	function computeNodeBreadths() {
		var remainingNodes = nodes,
			nextNodes,
			x = 0;

		while (remainingNodes.length) {
			nextNodes = [];
			remainingNodes.forEach(function(node) {
				node.x = x;
				node.dx = nodeWidth;
				node.sourceLinks.forEach(function(link) {
					if (nextNodes.indexOf(link.target) < 0) {
						nextNodes.push(link.target);
					}
				});
			});
			remainingNodes = nextNodes;
			++x;
		}

		moveSinksRight(x);
		scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
	}

	function moveSourcesRight() {
		nodes.forEach(function(node) {
			if (!node.targetLinks.length) {
				node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
			}
		});
	}

	function moveSinksRight(x) {
		nodes.forEach(function(node) {
			if (!node.sourceLinks.length) {
				node.x = x - 1;
			}
		});
	}

	function scaleNodeBreadths(kx) {
		nodes.forEach(function(node) {
			node.x *= kx;
		});
	}

	//计算节点的深度
	function computeNodeDepths(iterations) {
		var nodesByBreadth = d3.nest()
			.key(function(d) { return d.x; })
			.sortKeys(d3.ascending)
			.entries(nodes)
			.map(function(d) { return d.values; });

    	initializeNodeDepth();
    	resolveCollisions();
    	for (var alpha = 1; iterations > 0; --iterations) {
    		relaxRightToLeft(alpha *= .99);
    		resolveCollisions();
    		relaxLeftToRight(alpha);
    		resolveCollisions();
    	}

    	//初始化节点深度
    	function initializeNodeDepth() {
    		var ky = d3.min(nodesByBreadth, function(nodes) {
    			return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
    		});

    		nodesByBreadth.forEach(function(nodes) {
    			nodes.forEach(function(node, i) {
    				node.y = i;
    				node.dy = node.value * ky;
    			});
    		});

    		links.forEach(function(link) {
    			link.dy = link.value * ky;
    		});
    	}


    	function relaxLeftToRight(alpha) {
    		nodesByBreadth.forEach(function(nodes, breadth) {
    			nodes.forEach(function(node) {
    				if (node.targetLinks.length) {
    					var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
    					node.y += (y - center(node)) * alpha;
    				}
    			});
    		});

    		function weightedSource(link) {
    			return center(link.source) * link.value;
    		}
    	}

    	function relaxRightToLeft(alpha) {
    		nodesByBreadth.slice().reverse().forEach(function(nodes) {
    			nodes.forEach(function(node) {
    				if (node.sourceLinks.length) {
    					var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
    					node.y += (y - center(node)) * alpha;
    				}
    			});
    		});

    		function weightedTarget(link) {
    			return center(link.target) * link.value;
    		}
    	}

    	//解决冲突
    	function resolveCollisions() {
    		nodesByBreadth.forEach(function(nodes) {
    			var node,
    			dy,
    			y0 = 0,
    			n = nodes.length,
    			i;

		        // Push any overlapping nodes down.
		        nodes.sort(ascendingDepth);
		        for (i = 0; i < n; ++i) {
		        	node = nodes[i];
		        	dy = y0 - node.y;
		        	if (dy > 0) node.y += dy;
		        	y0 = node.y + node.dy + nodePadding;
		        }

		        // If the bottommost node goes outside the bounds, push it back up.
		        dy = y0 - nodePadding - size[1];
		        if (dy > 0) {
		        	y0 = node.y -= dy;

			        // Push any overlapping nodes back up.
			        for (i = n - 2; i >= 0; --i) {
			        	node = nodes[i];
			        	dy = node.y + node.dy + nodePadding - y0;
			        	if (dy > 0) node.y -= dy;
			        	y0 = node.y;
			        }
			    }
			});
    	}

    	//排节点的顺序
    	function ascendingDepth(a, b) {
    		/*console.log(a);
    		console.log(parseInt(a.name));
    		console.log(parseInt(b.name));*/
    		return parseInt(a.name) - parseInt(b.name);
    		//return a.y - b.y;
    	}
    }

    //计算连接的深度
    function computeLinkDepths() {
    	n = 1
    	nodes.forEach(function(node) {
    		node.sourceLinks.sort(ascendingTargetDepth);
    		node.targetLinks.sort(ascendingSourceDepth);
    	});
    	nodes.forEach(function(node) {
    		var sy = 0, ty = 0;
    		node.sourceLinks.forEach(function(link) {
    			link.sy = sy;
    			sy += link.dy;
    		});
    		node.targetLinks.forEach(function(link) {
    			link.ty = ty;
    			ty += link.dy;
    		});
    	});

    	function ascendingSourceDepth(a, b) {
    		if(a.pathed_aaa == undefined){
    			if(a.color != b.color)
	    			return a.color - b.color;
	    		else return a.target.y - b.target.y;
    		}
    		else{
	    		var a_path = a.pathed_aaa,
	    			b_path = b.pathed_aaa;
	    		var len_a = a.pathed_aaa.length,
	    			len_b = b.pathed_aaa.length;
	    		if(len_a < len_b && len_a == 4)
	    			a_path = a_path.slice(0,len_a - 1) + "0" + a_path.slice(len_a-1)
	    		else if(len_a > len_b && len_b == 4)
	    			b_path = b_path.slice(0,len_b - 1) + "0" + b_path.slice(len_b-1)
	    		if(a.color.slice(0,1) == b.color.slice(0,1))
	    			return a_path - b_path
	    		else return a.color.slice(0,1) - b.color.slice(0,1);
    		}
    		//return a.source.y - b.source.y;
    	}

    	function ascendingTargetDepth(a, b) {
    		if(a.pathed_aaa == undefined){
    			if(a.color != b.color)
	    			return a.color - b.color;
	    		else return a.target.y - b.target.y;
    		}
    		else{
	    		var a_path = a.pathed_aaa,
	    			b_path = b.pathed_aaa;
	    		var len_a = a.pathed_aaa.length,
	    			len_b = b.pathed_aaa.length;
	    		if(len_a < len_b && len_a == 4)
	    			a_path = a_path.slice(0,len_a - 1) + "0" + a_path.slice(len_a-1)
	    		else if(len_a > len_b && len_b == 4)
	    			b_path = b_path.slice(0,len_b - 1) + "0" + b_path.slice(len_b-1)
	    		if(a.color.slice(0,1) == b.color.slice(0,1))
	    			return a_path - b_path
	    		else return a.color.slice(0,1) - b.color.slice(0,1);
    		}
    		//return a.target.y - b.target.y;
    	}
    }

    function center(node) {
    	return node.y + node.dy / 2;
    }

    function value(link) {
    	return link.value;
    }
    
    return sankey;
}