/**
 * 
 */

var width = 1200;
var height = 900;

var rq2 = d3.select(".rq2")
.attr("width", width)
.attr("height", height)
.append("svg:g");

d3.csv("data/rq2feature_label.csv", typeConversor, function(error, labeldata) {
		
	d3.csv("data/rq2feature_users.csv", typeConversor, function(error, userdata) {
		
		d3.csv("data/rq2feature_links.csv", typeConversor, function(error, linkdata) {
			
			d3.csv("data/rq2feature_max_values.csv", typeConversor, function(error, scalevalues) {
		
				var nodes = mapId2node(userdata);
				nodes[0] = labeldata[0];
				
				var maxcreated = scalevalues[0].max_created;
				var maxsolved = scalevalues[0].max_solved;
				var maxcomments = scalevalues[0].max_comments;
				 linkdata.forEach(function(link) {
					    link.source = nodes[0];
					    link.target = nodes[link.user_id];
					  });
				
				drawrq2(nodes, linkdata, maxcreated, maxsolved, maxcomments);
			});
		});
	});
});

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


function drawrq2(innodes, links, maxwidth, maxheight, maxthickness) {

	var users = innodes.filter(function(d) {return !(typeof d == "undefined") && (d.type == 'user'); });
	var labels = innodes.filter(function(d) {return !(typeof d == "undefined") && (d.type == 'label'); });
	var nodes = labels.concat(users);
	
	//define a scale for mapping roles to colors
	var role2color = d3.scale.ordinal()
	.domain(['user', 'administrator'])
	.range(['DarkOrchid', 'DarkOrange']);
	
	//define a scale for rectangle width 
	var rectwidth = d3.scale.linear()
	.domain([0, maxwidth])
	.range([20, 50]);
	
	//define a scale for rectangle height 
	var rectheight = d3.scale.linear()
	.domain([0, maxheight])
	.range([20, 50]);
	
	//define a scale for line thickness 
	var linethickness = d3.scale.linear()
	.domain([0, maxthickness])
	.range([1, 10]);
	
	var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.charge(-1000)	
	.size([width-50, height-50])
	.linkDistance(100);
	
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
	.attr("fill", function(d) { return role2color(d.role); 
	})
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