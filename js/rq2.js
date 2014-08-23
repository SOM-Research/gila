/**
 * 
 */

var w2 = 718;
var h2 = 600;

var maxcreated;
var maxsolved;
var maxcomments;

var rq2 = d3.select(".rq2")
.append("svg")
.attr("width", w2)
.attr("height", h2)
.append("svg:g")
.attr("id", "contribgraph");


function createRQ2LabelCombobox(datasource) {

    $("#lcombobox").jqxComboBox(
    {
        width: 200,
        height: 25,
        source: datasource,
        displayMember: "labelName",
        valueMember: "labelId",
    });
    
    $("#lcombobox").on('select', function (event) {
    	var item = event.args.item;
    	if(item.label != '') {
    		$("#rq2noselection").css('display', 'none');
    	}
    });
}

function initrq2(datasource) {
	d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq2maxvalues&projectId="+projectId, function (errormax, jsonmax) {
		
		maxcreated = jsonmax[0].max_created;
		maxsolved = jsonmax[1].max_solved;
		maxcomments = jsonmax[2].max_comments;
		
		createRQ2LabelCombobox(datasource);
	});
}

function generaterq2() {
	
	var labelid = $("#lcombobox").children('input')[0].value;
	
	clearContainer($("#contribgraph"));

	if (labelid != '') {
		getrq2(labelid);
	} else {
		$("#rq2noselection").css('display', 'block');
	}

}

function getrq2(labelid) {

	$("#loadingRQ2").css('display','inline');

	d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq2label&labelId="+labelid, function (errorlabel, jsonlabel) {
			
		d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq2contributors&projectId="+projectId+"&labelId="+labelid, function (errorcont, jsoncont) {
			
					var nodes = mapId2node(jsoncont);
					nodes[0] = jsonlabel[0];
					
					//choose the maximum between maxcreated and maxsolved
					//to use it as max value for rect scale
					var maxnode = Math.max(maxcreated, maxsolved);
					
					//create link array
					var links = new Array();
					var i = 0;
					jsoncont.forEach(function(node) {
							links[i] = {
								source: nodes[0],
								target: node,
								value: node.num_comments
							};
							i = i+1;
					});
					
					if (links.length > 0) {
						drawrq2(nodes, links, maxnode, maxcomments);
					}
					else {
					
						svg = d3.select("#contribgraph");
						
						svg.append("svg:image")
						.attr("xlink:href", "imgs/warningimage.png")
						.attr("width", "98%")
						.attr("height", "98%");
						
						svg.append("text")
						.attr("x", 375)
						.attr("y", 215)
						.attr("font-family", "sans-serif")
						.attr("font-size", "28px")
						.attr("text-anchor", "middle")
						.attr("fill", "red")
						.text("Nobody participates on this label!");
						
					}
					$("#loadingRQ2").css('display','none');
		});
	});

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
	
	labels[0].x = w2/2;
	labels[0].y = h2/2;
	
	console.log(labels[0]);
	console.log(labels[0].x);
	console.log(labels[0].y);
	
	//define a scale for mapping roles to colors
	var role2color = d3.scale.ordinal()
	.domain(['user', 'administrator'])
	.range(['#A26CCC', '#F5925D']);

	//define a scale for rectangle width 
	var rectwidth = d3.scale.linear()
	.domain([0, maxrectsize])
	.range([10, 100]);
	
	//define a scale for rectangle height 
	var rectheight = d3.scale.linear()
	.domain([0, maxrectsize])
	.range([10, 100]);
	
	//define a scale for line thickness 
	var linethickness = d3.scale.linear()
	.domain([0, maxthickness])
	.range([1, 15]);
	
	
	//create user node tooltip
	var rq2tooltip = d3.select("body").append("div")
    .attr("class", "rq2tooltip")
    .style("opacity", 1e-6);
	
	//create label node tooltip
	var rq2labeltooltip = d3.select("body").append("div")
    .attr("class", "rq2labeltooltip")
    .style("opacity", 1e-6);

	
	//force directed graph
	var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.charge(-1000)	
	.size([w2-100, h2-100])
	.linkDistance(100)
	.friction(0.8);
	
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
	
    rect.on("mousemove", function(d, index, element) {
        rq2tooltip.selectAll("p").remove();
        rq2tooltip
            .style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY-10) + "px");

        rq2tooltip.append("p").attr("class", "tooltiptext").html("<span>user: </span>" + d.name);
        rq2tooltip.append("p").attr("class", "tooltiptext").html("<span>created issues: </span>" + d.num_created_issues);
        rq2tooltip.append("p").attr("class", "tooltiptext").html("<span>solved issues: </span>" + d.num_solved_issues);
        rq2tooltip.append("p").attr("class", "tooltiptext").html("<span>comments: </span>" + d.num_comments);
    });    

    rect.on("mouseover", function(d, index, element) {
        rq2tooltip.transition()
          .duration(500)
          .style("opacity", 1);
    });    

    rect.on("mouseout", function(d, index, element) {
        rq2tooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
    });
	
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
	
    circle.on("mousemove", function(d, index, element) {
        rq2labeltooltip.selectAll("p").remove();
        rq2labeltooltip
            .style("left", (d3.event.pageX-50) + "px")
            .style("top", (d3.event.pageY-30) + "px");

        rq2labeltooltip.append("p").attr("class", "tooltiptext").html(d.name);
    });    

    circle.on("mouseover", function(d, index, element) {
        rq2labeltooltip.transition()
          .duration(500)
          .style("opacity", 1);
    });    

    circle.on("mouseout", function(d, index, element) {
        rq2labeltooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
    });
	
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
	    .attr("cy", function(d) { return d.y-10; });
	    
	  });

}