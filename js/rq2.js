/**
 * 
 */

var w2 = 718;
var h2 = 600;

var rq2 = d3.select(".rq2")
.append("svg")
.attr("width", w2)
.attr("height", h2)
.append("svg:g")
.attr("id", "contribgraph");

function getrq2() {

	var labelid = $("#lcombobox").children('input')[0].value;
	clearContainer($("#contribgraph"));
			
	d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq2label&labelId="+labelid, function (errorlabel, jsonlabel) {
			
		d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq2contributors&labelId="+labelid, function (errorcont, jsoncont) {
			
			d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq2links&labelId="+labelid, function (errorlinks, jsonlinks) {
				
				d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq2maxvalues&labelId="+labelid, function (errormax, jsonmax) {
			
					var nodes = mapId2node(jsoncont);
					nodes[0] = jsonlabel[0];
					
					var maxcreated = jsonmax[0].max_created;
					var maxsolved = jsonmax[1].max_solved;
					var maxcomments = jsonmax[2].max_comments;
					
					//choose the maximum between maxcreated and maxsolved
					//to use it as max value for rect scale
					var maxnode = Math.max(maxcreated, maxsolved);
					
					//create link array
					jsonlinks.forEach(function(link) {
						    link.source = nodes[0];
						    link.target = nodes[link.userid];
					});
					
					drawrq2(nodes, jsonlinks, maxnode, maxcomments);
				});
			});
		});
	});

}

function clearContainer(container) {
	
	//remove previous graph if exists
	if (container.children().size() > 0) {
		container.empty();
	}

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


function drawrq2(innodes, links, maxrectsize, maxthickness) {

	var users = innodes.filter(function(d) {return !(typeof d == "undefined") && (d.type == 'user'); });
	var labels = innodes.filter(function(d) {return !(typeof d == "undefined") && (d.type == 'label'); });
	var nodes = labels.concat(users);
	
	//define a scale for mapping roles to colors
	var role2color = d3.scale.ordinal()
	.domain(['user', 'administrator'])
	.range(['#A26CCC', '#F5925D']);
	//9C4590
	//define a scale for rectangle width 
	var rectwidth = d3.scale.linear()
	.domain([0, maxrectsize])
	.range([20, 60]);
	
	//define a scale for rectangle height 
	var rectheight = d3.scale.linear()
	.domain([0, maxrectsize])
	.range([20, 60]);
	
	//define a scale for line thickness 
	var linethickness = d3.scale.linear()
	.domain([0, maxthickness])
	.range([1, 10]);
	
	var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.charge(-1000)	
	.size([w2-100, h2-100])
	.linkDistance(100)
	.friction(0.7);
	
	force.start();
		
	//links
	var link = rq2.selectAll(".line")
	.data(links)
	.enter()
	.append("line")
	.attr("stroke-width",4)
	.attr("stroke-width",function (d) { return linethickness(d.value); })
	.style("stroke", "grey");
	
	// user nodes
	var usernode = rq2.selectAll("rect.usernode")
	.data(users)
	.enter().append("g")
	.attr("class", "usernode")
	.call(force.drag);
	
	var rect = usernode.append("svg:rect")

	.attr("width", function(d) { return rectwidth(d.num_created_issues); })
	.attr("height", function(d) { return rectheight(d.num_solved_issues); })
	.attr("fill", function(d) { return d3.rgb(role2color(d.role)); })
	;
	
	var recttext = usernode.append("svg:text")
	.text(function(d) {return d.name;})
	.attr("class","nodeText");
	
	//label node
	var labelnode = rq2.selectAll("circle.labelnode")
	.data(labels)
	.enter().append("g")
	.attr("class", "labelnode")
	.call(force.drag);
	
	var circle = labelnode.append("svg:circle")
	.attr("r", 30)
	.attr("fill", d3.rgb("#797B80"));
	;
	
	var circletext = labelnode.append("svg:text")
	.text(function(d) {return d.name;})
	.attr("class","labelText");
	
	force.on("tick", function() {
		
		link.attr("x1", function(d) {return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x + rectwidth(d.target.num_created_issues)/2; })
		.attr("y2", function(d) { return d.target.y + rectheight(d.target.num_solved_issues)/2; });
	
		rect.attr('x', function (d) { return d.x; })
	    .attr('y', function (d) { return d.y; });
	
	    recttext.attr("x", function(d) { return d.x-5; });
	    recttext.attr("y", function(d) { return d.y-5; });
	    
	    circle.attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; });
	    
	    circletext.attr("x", function(d) { return d.x-25; });
	    circletext.attr("y", function(d) { return d.y-35;});
	    
	  });

}