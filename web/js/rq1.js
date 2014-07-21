/**
 * 
 */

var w = 800;
var h = 600;

var rq1 = d3.select(".rq1")
.attr("width", w)
.attr("height", h)
.append("svg:g");

d3.csv("data/rq1labels.csv", typeConversor, function(error, labels) {
	
	d3.csv("data/rq1label_relation.csv", typeConversor, function(error, labelrelation) {
			var maxthickness = 37;
			var nodes = mapId2node(labels);
			labelrelation.forEach(function(link) {
				link.source = nodes[link.label1];
				link.target = nodes[link.label2];
			  });
			var filterednodes = nodes.filter(function(d) {return !(typeof d == "undefined");})
			drawrq1(filterednodes, labelrelation, maxthickness);
	});
});

//function maplinks(data) {
//	data.forEach(function(link) {
//	link.source = nodes[link.label1];
//	link.target = nodes[link.label2];
//  });
//}

function mapId2node(data) {
	var mappingarray = new Array();
	for (var i = 0; i < data.length; i++) {
		var node = data[i];
		mappingarray[node.id] = node;
	}
	return mappingarray;
}

function typeConversor(d) {
	  d.id = +d.id;
	  return d;
	};

function drawrq1(nodes, links, maxthickness) {
	
	alert(nodes[8].color);
	
	//define a scale for line thickness 
	var linethickness = d3.scale.linear()
	.domain([0, maxthickness])
	.range([1, 10]);

	//graph force directed layout algorithm
	var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.gravity(0.3)
	.charge(-1500)	
	.size([w-50, h-50])
	.linkDistance(200);
	
	force.start();
	
	//links
	var link = rq1.selectAll(".line")
	.data(links)
	.enter()
	.append("line")
	.attr("stroke-width",4)
	.attr("stroke-width",function (d) { return linethickness(d.value); })
	.style("stroke", "gray");
	
	//label nodes
	var labelnode = rq1.selectAll("circle.labelnode")
	.data(nodes)
	.enter().append("g")
	.attr("class", "labelnode")
	.call(force.drag);
	
	var circle = labelnode.append("svg:circle")
	.attr("r", 20)
	.attr("fill", function (d) { return d3.rgb(d.color); })
	;
	
	var circletext = labelnode.append("svg:text")
	.text(function(d) {return d.name;})
	.attr("class","labelText");

	force.on("tick", function() {
		
		link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
		
		var r = circle.attr("r");
		//alert("max: "+ w - 60 - r +" width: "+ Math.min(w - 60 - r, d.x));
		//alert("max: "+ h - 60 - r +" height: "+ Math.min(h - 60 - r, d.y));
		circle.attr("cx", function(d) { return d.x = Math.min(w - 60 - r, d.x); })
        .attr("cy", function(d) { return d.y = Math.min(h - 60 - r, d.y); });
		
//		circle.attr("cx", function(d) { return d.x; })
//	    .attr("cy", function(d) { return d.y; });
//		
		 circletext.attr("x", function(d) { return d.x-25; });
		 circletext.attr("y", function(d) { return d.y-25;});
	});
}
