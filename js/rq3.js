
var w3 = 1100;
var h3 = 400;
var heightExtension = 10;
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
	    var percClosed = +json[0].prctg_closed;
	    var percMerged = +json[0].prctg_merged;
	    var percOpen = +json[0].prctg_pending;
	    
	    draw(".rq3", firstComment, firstCommentCollaborator, timeToMerge, timeToClose, percClosed, percMerged, percOpen);

	});
}

function draw(container, firstComment, firstCommentCollaborator, timeToMerge, timeToClose, percClosed, percMerged, percOpen) {

	var maxTime = d3.max([timeToClose, timeToMerge]);
    var scalex = d3.scale.linear() 
        .range([0, w3])
        .domain([0, maxTime+heightExtension]);

    var scaley = d3.scale.ordinal()
        .domain([1, 2, 3]).rangePoints([0+2*heightExtension, h3-2*heightExtension], 0).range();

    // Main line coordinates
    var upperLine = scaley[0];
    var middleLine = scaley[1];
    var lowerLine = scaley[2];
    
    var test = d3.select(container)
    	.append("svg")
        .attr("width", w3)
        .attr("height", h3);
     
     var defs = test.append("svg:defs");

    var mainGradient = defs.append("svg:linearGradient")
        .attr("id", "mainGradient")
        .attr("gradientUnits" , "userSpaceOnUse");

    mainGradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", "#000")
        .attr("stop-opacity", 1);

    mainGradient.append("svg:stop")
        .attr("offset", "75%")
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
	        .attr("dy", "-0.6em")
	        .attr("dx", "6em")
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
	    upperGroup.append("line")
	        .attr("style", "stroke:#457313;stroke-width:3")
	        .attr("x1", scalex(timeToMerge))
	        .attr("y1", upperLine + verticalTick)
	        .attr("x2", scalex(timeToMerge))
	        .attr("y2", upperLine - verticalTick);
	
	    // The text with the time
	    upperGroup.append("text")
	        .attr("x", scalex(timeToMerge))
	        .attr("y", upperLine)
	        .attr("dy", "1.75em")
	        .attr("dx", "-.7em")
	        .text(timeToMerge + " hrs");
	
	    upperGroup.append("text")
	        .attr("x", scalex(timeToMerge))
	        .attr("y", upperLine)
	        .attr("dy", "2.75em")
	        .attr("dx", "-2em")
	        .text("Merge event");
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
	        .attr("dx", "6em")
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
	    lowerGroup.append("line")
	        .attr("style", "stroke:#FC821A;stroke-width:3")
	        .attr("x1", scalex(timeToClose))
	        .attr("y1", lowerLine + verticalTick)
	        .attr("x2", scalex(timeToClose))
	        .attr("y2", lowerLine - verticalTick);
	
	    // The text with the time
	    lowerGroup.append("text")
	        .attr("x", scalex(timeToClose))
	        .attr("y", lowerLine)
	        .attr("dy", "-1em")
	        .attr("dx", "-.6em")
	        .text(timeToClose + " hrs");
	
	    lowerGroup.append("text")
	        .attr("x", scalex(timeToClose))
	        .attr("y", lowerLine)
	        .attr("dy", "-2.15em")
	        .attr("dx", "-2.25em")
	        .text("Closing event");
    }
    //
    // Main center line, from 0 to max time value (+ heightExtension)
    //
    var mainGroup = test.append("g")
        .attr("id", "mainGroup");

    mainGroup.append("path")
        .attr("d", "M " + "0" + "," + middleLine + " "+ scalex(maxTime+heightExtension) + "," + middleLine)
        .attr("style", "fill:none;stroke:url(#mainGradient);stroke-width:7")
        .attr("stroke-linecap", "round");

    mainGroup.append("text")
        .attr("x", scalex(maxTime+heightExtension))
        .attr("y", middleLine)
        .attr("dy", "-0.75em")
        .attr("dx", "-9em")
        .text("Still open (" + percOpen + "%)");

    // Indicators for the first time values
    // The tick indicator
    mainGroup.append("line")
        .attr("style", "stroke:rgb(0,0,0);stroke-width:3")
        .attr("x1", scalex(firstComment))
        .attr("y1", middleLine + verticalTick)
        .attr("x2", scalex(firstComment))
        .attr("y2", middleLine - verticalTick);

    // The text with the time
    mainGroup.append("text")
        .attr("x", scalex(firstComment))
        .attr("y", middleLine)
        .attr("dy", "-1.25em")
        .attr("dx", "-.6em")
        .text(firstComment + " hrs");

    mainGroup.append("text")
        .attr("x", scalex(firstComment))
        .attr("y", middleLine)
        .attr("dy", "-2.35em")
        .attr("dx", "-2.55em")
        .text("First comment");

    // The tick indicator
    mainGroup.append("line")
        .attr("style", "stroke:rgb(0,0,0);stroke-width:3")
        .attr("x1", scalex(firstCommentCollaborator))
        .attr("y1", middleLine + verticalTick)
        .attr("x2", scalex(firstCommentCollaborator))
        .attr("y2", middleLine - verticalTick);

    // The text with the time
    mainGroup.append("text")
        .attr("x", scalex(firstCommentCollaborator))
        .attr("y", middleLine)
        .attr("dy", "1.75em")
        .attr("dx", "-.6em")
        .text(firstCommentCollaborator + " hrs");

    mainGroup.append("text")
        .attr("x", scalex(firstCommentCollaborator))
        .attr("y", middleLine)
        .attr("dy", "2.75em")
        .attr("dx", "-4em")
        .text("A collaborator answers");
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