
var w3 = 718;
var h3 = 400;
var heightPadding = 20;
var widthPadding = 20;
var verticalTick = 10;

function getrq3() {

	var labelid = $("#rq3lcombobox").children('input')[0].value;
	clearContainer($("#resolutiontl"));

	//d3.csv("data/rq3.csv", typeConversor, function(error, data) {
	d3.json(labelAnalyzerServlet + "/LabelAnalysisServlet?event=rq3data&labelId="+labelid, function (error, json) {

    // Main variables to draw the lines
	    var firstComment = +json[0].avg_hs_first_comment;
	    var firstCommentCollaborator = +json[0].avg_hs_first_collab_response;
	    var timeToMerge = +json[0].avg_hs_to_merge;
	    var timeToClose = +json[0].avg_hs_to_close;
        var avgAge = +json[0].avg_pending_issue_age;
	    var percClosed = +json[0].prctg_closed;
	    var percMerged = +json[0].prctg_merged;
	    var percOpen = +json[0].prctg_pending;
	    
	    draw(".rq3", firstComment, firstCommentCollaborator, timeToMerge, timeToClose, avgAge, percClosed, percMerged, percOpen);

	});
}

function draw(container, firstComment, firstCommentCollaborator, timeToMerge, timeToClose, avgAge, percClosed, percMerged, percOpen) {

	var maxTime = d3.max([timeToClose, timeToMerge, firstComment, firstCommentCollaborator]);

    var auxScalex = d3.scale.linear() 
        .range([0+widthPadding, w3-widthPadding])
        .domain([0, maxTime]);
    var avgAgePosition = auxScalex.invert(0+widthPadding+100);

    var scalex = d3.scale.linear() 
        .range([0+widthPadding, w3-widthPadding])
        .domain([0, maxTime+avgAgePosition]);

    var scaley = d3.scale.ordinal()
        .domain([1, 2, 3]).rangePoints([0+2*heightPadding, h3-2*heightPadding], 0).range();

    // Main line coordinates
    var upperLine = scaley[0];
    var middleLine = scaley[1];
    var lowerLine = scaley[2];
    
    var test = d3.select(container)
    	.append("svg")
        .attr("width", w3)
        .attr("height", h3);
    

    // Creating the gradients 
    var defs = test.append("svg:defs");

    var mainGradient = defs.append("svg:linearGradient")
        .attr("id", "mainGradient")
        .attr("gradientUnits" , "userSpaceOnUse");

    mainGradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", "#000")
        .attr("stop-opacity", 1);

    mainGradient.append("svg:stop")
        .attr("offset", "70%")
        .attr("stop-color", "#000")
        .attr("stop-opacity", 1);

    mainGradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "#F62626")
        .attr("stop-opacity", 1);

    var upperGradient = defs.append("svg:linearGradient")
        .attr("id", "upperGradient");

    upperGradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", "#000")
        .attr("stop-opacity", 1);

    upperGradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "#457313")
        .attr("stop-opacity", 1);

    var lowerGradient = defs.append("svg:linearGradient")
        .attr("id", "lowerGradient");

    lowerGradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", "#000")
        .attr("stop-opacity", 1);

    lowerGradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "#FC821A")
        .attr("stop-opacity", 1);

    //
    // Drawing upper path (time to merge)
    //
    var upperGroup = test.append("g")
        .attr("id", "upperGroup");

    var upperMaxRange = d3.max([d3.max([firstComment, firstCommentCollaborator]), timeToMerge]);
    var upperMinRange = d3.min([d3.min([firstComment, firstCommentCollaborator]), timeToMerge]);
    // We have to control whether timeToMerge is sooner that the first comment variables
    if(d3.min([firstComment, firstCommentCollaborator]) > timeToMerge) {
    	upperMinRange = 0;
    	upperMaxRange = timeToMerge;
    }
    
    if(upperMaxRange != 0) {
	    var upperScale = d3.scale.ordinal()
	        .domain([1, 2, 3, 4]).rangePoints([upperMinRange, upperMaxRange], 0).range();
	
	    // The diagonal line connecting paths
	    upperGroup.append("path")
	        .attr("id", "upperText")
	        .attr("d", "M " +scalex(upperScale[1]) + "," + middleLine + " "+scalex(upperScale[2]) + "," + upperLine)
	        .attr("style", "fill:none;stroke:url(#upperGradient);stroke-width:5")
	        .attr("stroke-linecap", "round");
	
	    // The rotated text
	    upperGroup.append("text")
            .attr("dy", "-0.7em")
            .attr("dx", "2em")
	      .append("textPath")
	        .attr("xlink:href","#upperText")
	        .text("merged (" + percMerged + "%)");
	
	    // The section of upper path
	    upperGroup.append("line")
	        .attr("style", "stroke:#457313;stroke-width:5")
	        .attr("x1", scalex(upperScale[2]))
	        .attr("y1", upperLine)
	        .attr("x2", scalex(timeToMerge))
	        .attr("y2", upperLine);


        // The tick indicator
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 1e-6);
	
	    var upperTick = upperGroup.append("line")
	        .attr("style", "stroke:#457313;stroke-width:10")
	        .attr("x1", scalex(timeToMerge))
	        .attr("y1", upperLine + verticalTick)
	        .attr("x2", scalex(timeToMerge))
	        .attr("y2", upperLine - verticalTick);
        
        upperTick.on("mousemove", function(d, index, element) {    
            tooltip.selectAll("p").remove();
            tooltip
                .style("left", (d3.event.pageX+15) + "px")
                .style("top", (d3.event.pageY-10) + "px");

            tooltip.append("p").text(timeToMerge + " hrs")
            tooltip.append("p").text("Merge event");
        });    

        upperTick.on("mouseover", function(d, index, element) {     
            tooltip.transition()
              .duration(500)
              .style("opacity", 1);
        });    

        upperTick.on("mouseout", function(d, index, element) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 1e-6);
        });
    }
    //
    // Drawing lower path (time to close)
    //
    var lowerGroup = test.append("g")
        .attr("id", "lowerGroup");

    var lowerMaxRange = d3.max([d3.max([firstComment, firstCommentCollaborator]), timeToClose]);
    var lowerMinRange = d3.min([d3.min([firstComment, firstCommentCollaborator]), timeToClose]);
    // We have to control whether timeToClose is sooner that the first comment variables
    if(d3.min([firstComment, firstCommentCollaborator]) > timeToClose) {
    	lowerMinRange = 0;
    	lowerMaxRange = timeToClose;
    }

    if(lowerMaxRange != 0) {
	    var lowerScale = d3.scale.ordinal()
	        .domain([1, 2, 3, 4]).rangePoints([lowerMinRange,lowerMaxRange], 0).range();
	
	    // The diagonal line connecting paths
	    lowerGroup.append("path")
	        .attr("id", "lowerText")
	        .attr("d", "M " +scalex(lowerScale[1]) + "," + middleLine + " "+scalex(lowerScale[2]) + "," + lowerLine)
	        .attr("style", "fill:none;stroke:url(#lowerGradient);stroke-width:5")
	        .attr("stroke-linecap", "round");
	
	    // The rotated text
	    lowerGroup.append("text")
	        .attr("dy", "-0.6em")
	        .attr("dx", "3em")
	      .append("textPath")
	        .attr("xlink:href","#lowerText")
	        .text("closing (" + percClosed + "%)");
	
	    // The section of lower path
	    lowerGroup.append("line")
	        .attr("style", "stroke:#FC821A;stroke-width:5")
	        .attr("x1", scalex(lowerScale[2]))
	        .attr("y1", lowerLine)
	        .attr("x2", scalex(timeToClose))
	        .attr("y2", lowerLine);
	
	    // The tick indicator
	    var lowerTick = lowerGroup.append("line")
	        .attr("style", "stroke:#FC821A;stroke-width:10")
	        .attr("x1", scalex(timeToClose))
	        .attr("y1", lowerLine + verticalTick)
	        .attr("x2", scalex(timeToClose))
	        .attr("y2", lowerLine - verticalTick);

        lowerTick.on("mousemove", function(d, index, element) {    
            tooltip.selectAll("p").remove();
            tooltip
                .style("left", (d3.event.pageX+15) + "px")
                .style("top", (d3.event.pageY-10) + "px");

            tooltip.append("p").text(timeToClose + " hrs")
            tooltip.append("p").text("Close event");
        });    

        lowerTick.on("mouseover", function(d, index, element) {     
            tooltip.transition()
              .duration(500)
              .style("opacity", 1);
        });    

        lowerTick.on("mouseout", function(d, index, element) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 1e-6);
        });

    }
    //
    // Main center line, from 0 to max time value (+ heightExtension)
    //
    var mainGroup = test.append("g")
        .attr("id", "mainGroup");

    mainGroup.append("path")
        .attr("d", "M " + scalex(0) + "," + middleLine + " "+ scalex(maxTime) + "," + middleLine)
        .attr("style", "fill:none;stroke:#000000;stroke-width:7")
        .attr("stroke-linecap", "round");

    mainGroup.append("path")
        .attr("d", "M " + scalex(maxTime) + "," + middleLine + " "+ scalex(maxTime+avgAgePosition) + "," + middleLine)
        .attr("style", "fill:none;stroke:url(#mainGradient);stroke-dasharray:7,15;stroke-dashoffset:10;stroke-width:7")
        .attr("stroke-linecap", "round");

    mainGroup.append("text")
        .attr("x", scalex(maxTime+avgAgePosition))
        .attr("y", middleLine)
        .attr("dy", "-0.8em")
        .attr("dx", "-7.7em")
        .text("Still open (" + percOpen + "%)");

    // Indicators for the first time values
    // The tick indicator
    var firstCommentTick = mainGroup.append("line")
        .attr("style", "stroke:rgb(0,0,0);stroke-width:10")
        .attr("x1", scalex(firstComment))
        .attr("y1", middleLine + verticalTick)
        .attr("x2", scalex(firstComment))
        .attr("y2", middleLine - verticalTick);

    firstCommentTick.on("mousemove", function(d, index, element) {    
        tooltip.selectAll("p").remove();
        tooltip
            .style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY-10) + "px");

        tooltip.append("p").text(firstComment + " hrs")
        tooltip.append("p").text("First comment");
    });    

    firstCommentTick.on("mouseover", function(d, index, element) {     
        tooltip.transition()
          .duration(500)
          .style("opacity", 1);
    });    

    firstCommentTick.on("mouseout", function(d, index, element) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
    });

    // Indicators for the first time a collaboration comments
    // The tick indicator
    firstCommentCollaboratorTick = mainGroup.append("line")
        .attr("style", "stroke:rgb(0,0,0);stroke-width:10")
        .attr("x1", scalex(firstCommentCollaborator))
        .attr("y1", middleLine + verticalTick)
        .attr("x2", scalex(firstCommentCollaborator))
        .attr("y2", middleLine - verticalTick);

    firstCommentCollaboratorTick.on("mousemove", function(d, index, element) {    
        tooltip.selectAll("p").remove();
        tooltip
            .style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY-10) + "px");

        tooltip.append("p").text(firstCommentCollaborator + " hrs")
        tooltip.append("p").text("A collaborator answers");
    });    

    firstCommentCollaboratorTick.on("mouseover", function(d, index, element) {     
        tooltip.transition()
          .duration(500)
          .style("opacity", 1);
    });    

    firstCommentCollaboratorTick.on("mouseout", function(d, index, element) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
    });

    // Indicators for the age
    // The tick indicator
    var ageTick = mainGroup.append("line")
        .attr("style", "stroke:#F62626;stroke-width:10")
        .attr("x1", scalex(maxTime+avgAgePosition))
        .attr("y1", middleLine + verticalTick)
        .attr("x2", scalex(maxTime+avgAgePosition))
        .attr("y2", middleLine - verticalTick);

    ageTick.on("mousemove", function(d, index, element) {    
        tooltip.selectAll("p").remove();
        tooltip
            .style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY-10) + "px");

        tooltip.append("p").text(avgAge + " hrs")
        tooltip.append("p").text("Average age");
    });    

    ageTick.on("mouseover", function(d, index, element) {     
        tooltip.transition()
          .duration(500)
          .style("opacity", 1);
    });    

    ageTick.on("mouseout", function(d, index, element) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
    });

};

function typeConversor(d) {
  d.first_comment = +d.first_comment;
  d.first_comment_collaborator = +d.first_comment_collaborator;
  d.time_to_close = +d.time_to_close;
  d.time_to_merge = +d.time_to_merge;
  d.perc_closed = +d.perc_closed;
  d.perc_merged = +d.perc_merged;
  d.perc_open = +d.perc_open;
  return d;
};

/*test.append("line")
    .attr("x1", 0)
    .attr("y1", 55)
    .attr("x2", d3.max(times) + 10)
    .attr("y2", 55)

test.selectAll("line")
    .data(times)
  .enter().append("line")
    .attr("x1", function(d) { return d; })
    .attr("y1", 50)
    .attr("x2", function(d) { return d; })
    .attr("y2", 60)*/