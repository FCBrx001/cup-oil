function DrawSplitLine(){

	$('#OverallSvg');
	$('#MainView');
	var linePath = d3.svg.line();
	var lines = [[3,3],[1165,3],[1165,416],[3,416],[3,3]];
	
	overall_svg.append("path")
			.attr("d",linePath(lines))
			.attr("stroke","black")
			.attr("stroke-width","2px")
			.attr("fill","none");

	lines = [[1165,396],[1165,762],[3,762],[3,396]];

	overall_svg.append("path")
			.attr("d",linePath(lines))
			.attr("stroke","black")
			.attr("stroke-width","2px")
			.attr("fill","none");

	lines = [[1165,3],[1350,3],[1350,762],[1165,762]];

	overall_svg.append("path")
			.attr("d",linePath(lines))
			.attr("stroke","black")
			.attr("stroke-width","2px")
			.attr("fill","none");

	lines = [[336,416],[336,762]];

	overall_svg.append("path")
			.attr("d",linePath(lines))
			.attr("stroke","black")
			.attr("stroke-width","2px")
			.attr("fill","none");

	/*lines = [[3,582],[336,582]];

	overall_svg.append("path")
			.attr("d",linePath(lines))
			.attr("stroke","black")
			.attr("stroke-width","2px")
			.attr("fill","none");*/


}