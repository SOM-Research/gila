/**
 * 
 */

var w1 = 800;
var h1 = 600;

var rq1 = d3.select(".rq1")
.attr("width", w1)
.attr("height", h1)
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
	
	//define a scale for line thickness 
	var linethickness = d3.scale.linear()
	.domain([0, maxthickness])
	.range([1, 10]);
	
	//define a scale for color mapping
	var colormapping = d3.scale.ordinal()
	.domain([0,nodes.length])
	.range(['#A700E6','#D95B96','#F4DA88','#22C1BE','#F24957','#DBEF91','#CF8EE8','#FF9B58','#B8FFC4','#91AEFF','#E873D3','#CCB298']);

	//graph force directed layout algorithm
	var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.gravity(0.2)
	.charge(-1500)
	.friction(0.8)
	.size([w1, h1])
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
	.attr("fill", function (d,i) {return d3.rgb(colormapping(i)); })
//	.attr("fill", function (d) {return d3.rgb(d.color); })
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
		
		circle.attr("cx", function(d) { return d.x = Math.min(w1 - 200 - r, d.x); })
        .attr("cy", function(d) { return d.y = Math.min(h1 - r, d.y); });
		circletext.attr("x", function(d) { return d.x-25; });
		circletext.attr("y", function(d) { return d.y-25;});
	});
}
