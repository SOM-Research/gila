/**
 * 
 */

//RQ1 Label Graph

var w1 = 718;
var h1 = 600;
var linkedByIndex = {};

var rq1 = d3.select(".rq1")
.append("svg")
.attr("width", w1)
.attr("height", h1)
.append("svg:g")
.attr("id", "labelgraph");


function generaterq1(projectid) {
	
	//remove previous graph if exists
	if ($("#labelgraph").children().size() > 0) {
		$("#labelgraph").empty();
	}
	
	getrq1(projectid);

}

function neighboring(id_a, id_b) {
  return linkedByIndex[id_a + "," + id_b] || linkedByIndex[id_b + "," + id_a];
}

function getrq1(projectid) {
	onLoadingGraph(d3.select("#labelgraph"), "loaderRQ1", h1, w1);
	
	d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq1nodes&projectId="+projectid, function(errornodes,jsonnodes) {
		if (!!jsonnodes) {
			if (jsonnodes.length > 0) {
				$("#info_rq1").css("visibility", "visible");
				d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq1links&projectId="+projectid, function(errorlinks,jsonlinks) {
					d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq1maxvalues&projectId="+projectid, function(error,jsonmax) {
			
						var maxthickness = jsonmax[0].maxlinkvalue;
						var maxwidth = jsonmax[1].maxnodevalue;
						var nodes = mapId2node(jsonnodes);
						jsonlinks.forEach(function(link) {
							link.source = nodes[link.label1_id];
							link.target = nodes[link.label2_id];
						  });
						
						var filterednodes = nodes.filter(function(d) {return !(typeof d == "undefined");});
						drawrq1(filterednodes, jsonlinks, maxwidth, maxthickness);
					});
				});
			}
			else {
				$("#info_rq1").css("visibility", "hidden");
			}
		}			
	});
	
	removeLoadingImage("loaderRQ1");
	
}

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

function drawrq1(nodes, links, maxwidth, maxthickness) {
	
	//define a scale for line thickness 
	var linethickness = d3.scale.linear()
	.domain([0, maxthickness])
	.range([1, 10]);
	
	//define a scale for node width
	var nodewidth = d3.scale.linear()
	.domain([0, maxwidth])
	.range([10, 25]);
	
	//define a scale for color mapping
	var colormapping = d3.scale.ordinal()
	.domain([0,nodes.length])
	.range(['#A700E6','#D95B96','#F4DA88','#22C1BE','#F24957','#DBEF91','#CF8EE8','#FF9B58','#B8FFC4','#91AEFF','#E873D3','#CCB298']);
	
	//create label node tooltip
	var labeltooltip = d3.select("body").append("div")
    .attr("class", "labeltooltip")
    .style("opacity", 1e-6);

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

	//add zoom and pan behavior
	var panrect = rq1.append("rect")
	.attr("width", w1)
	.attr("height", h1)
	.style("fill", "none")
	.style("pointer-events", "all");
	
	var container = rq1.append("g")
    .attr("id", "container");
	
	 var zoom = d3.behavior.zoom()
	 .scaleExtent([1, 10])
	 .on("zoom", function() {
    	 container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
     });
	 
     rq1.call(zoom);
	
	//links
	var link = container.selectAll(".line")
	.data(links)
	.enter()
	.append("line")
	.attr("stroke-width",4)
	.attr("stroke-width",function (d) { return linethickness(d.value); })
	.style("stroke", "gray");
	
	links.forEach(function(d) {
	  linkedByIndex[d.source.id + "," + d.target.id] = 1;
	  linkedByIndex[d.source.id + "," + d.source.id] = 1;
	  linkedByIndex[d.target.id + "," + d.target.id] = 1;
	});
	
	//label nodes
	var labelnode = container.selectAll("circle.labelnode")
	.data(nodes)
	.enter().append("g")
	.attr("class", "labelnode")
	.call(force.drag);
	
	var circle = labelnode.append("svg:circle")
	.attr("r", function(d) {return nodewidth(d.num_issues);})
	.attr("fill", function (d,i) {return d3.rgb(colormapping(i)); })
	;
	
	circle.on("mousemove", function(d, index, element) {
		labeltooltip.selectAll("p").remove();
		labeltooltip
            .style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY-10) + "px");

		labeltooltip.append("p").attr("class", "tooltiptext").html("<span>label: </span>" + d.name);
        labeltooltip.append("p").attr("class", "tooltiptext").html("<span>number of issues: </span>" + d.num_issues);
    }); 
	
	circle.on("mouseover", function(d) {
    	labeltooltip.transition()
          .duration(500)
          .style("opacity", 1);
		link.style('stroke', function(l) {
			if (d === l.source || d === l.target)
			  return d3.rgb('#9E00D9');
			else
			  return 'gray';
			});
		link.style('opacity', function(o) {
			return o.source === d || o.target === d ? 1 : 0;
		});
		labelnode.style("opacity", function(o) {
			if (o.id != d.id)
				return neighboring(d.id, o.id) ? 1 : 0;
		});
    });    

    circle.on("mouseout", function(d) {
    	labeltooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
		link.style('stroke', 'gray');
		link.style('opacity', 1);
		labelnode.style("opacity", 1);  
    });
	
	var circletext = labelnode.append("svg:text")
	.text(function(d) {return d.name;})
	.attr("class","labelText");
	
	force.on("tick", function() {
		
		link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
		var r = +circle.attr("r");
		circle.attr("cx", function(d) { return d.x = Math.max(r + 35, Math.min(w1 - r - 35, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(r + 35, Math.min(h1 - r - 35, d.y)); });
		circletext.attr("x", function(d) { return d.x-25; });
		circletext.attr("y", function(d) { return d.y-25;});
	});
	
	addZoomMoveIcon("#labelgraph");
}
