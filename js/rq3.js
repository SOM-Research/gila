
var w3 = 718;
var h3 = 400;
var heightPadding = 20;
var widthPadding = 20;
var verticalTick = 10;
var defaultLineLength = 50;


function createRQ3LabelCombobox(datasource) {

	$("#rq3lcombobox").jqxComboBox(
	    {
	        width: 200,
	        height: 25,
	        source: datasource,
	        displayMember: "labelName",
	        valueMember: "labelId"
	    });
	
	    $("#rq3lcombobox").on('select', function (event) {
	    	var item = event.args.item;
	    	if(item.label != '') {
	    		$("#rq3noselection").css('display', 'none');
	    	}
	    });

}

function initrq3(datasource) {
	createRQ3LabelCombobox(datasource);
}

function generaterq3() {

	var labelid = $("#rq3lcombobox").children('input')[0].value;
	clearContainer($("#resolutiontl"));
	
	if (labelid != '') {
		
		getrq3(labelid);
	} else {
		$("#rq3noselection").css('display', 'block');
	}

}

function getrq3(labelid) {
	var container = d3.select(".rq3")
			.append("svg")
			.attr("width", 714)
			.attr("height", 400)
			.append("svg:g")
			.attr("id", "labeltimeline"); 

	onLoadingGraph(container, "loaderRQ3", h3, w3);
    $("#loadingRQ3").css('display','inline');
    var event = $('#outlierscheck').prop('checked') ? 'rq3data!outliers' : 'rq3data';
    var url = labelAnalyzerServlet + "/LabelAnalysisServlet?event="+event+"&labelId="+labelid;
    
    
	d3.json(url, function (error, json) {

	    // Main variables to draw the lines
	    var firstComment = +json[0].avg_hs_first_comment;
	    var firstCommentCollaborator = +json[0].avg_hs_first_collab_response;
	    var timeToMerge = +json[0].avg_hs_to_merge;
	    var timeToClose = +json[0].avg_hs_to_close;
	    var avgAge = +json[0].avg_pending_issue_age;
	    var percClosed = +json[0].prctg_closed;
	    var percMerged = +json[0].prctg_merged;
	    var percOpen = +json[0].prctg_pending;
	
		var checkResult = firstComment + firstCommentCollaborator + timeToMerge + timeToClose + percClosed + percMerged + percOpen;
		
		if (checkResult > 0) {
			$("#info_rq3").css("visibility", "visible");		
			draw(container, firstComment, firstCommentCollaborator, timeToMerge, timeToClose, avgAge, percClosed, percMerged, percOpen);
		}
		else {
			$("#info_rq3").css("visibility", "hidden");
			creatingWarningMessage(container, 375, 115, "No issue to analyse for this label!"); 
		}
	    $("#loadingRQ3").css('display','none');
	});
	removeLoadingImage("loaderRQ3");
}

function draw(container, firstComment, firstCommentCollaborator, timeToMerge, timeToClose, avgAge, percClosed, percMerged, percOpen) {
    $(".tooltip").remove();

	var maxTime = d3.max([timeToClose, timeToMerge, firstComment, firstCommentCollaborator]);
	
	if (maxTime === 0)
		maxTime = defaultLineLength;
	
    // The scale for the x axis
    // We first create an auxiliar axis from 0 to maxTime and then calculate
    // how much it takes "100" pixels in this scale. This distance will be used
    // to separate maxTime from the avgAge time by a dotted line
    var auxScalex = d3.scale.linear() 
        .range([0+widthPadding, w3-widthPadding])
        .domain([0, maxTime]);
    var avgAgePosition = auxScalex.invert(0+widthPadding+100);

    // We now calculate the real x scale 
    var scalex = d3.scale.linear() 
        .range([0+widthPadding, w3-widthPadding])
        .domain([0, maxTime+avgAgePosition]);

    var scaley = d3.scale.ordinal()
        .domain([1, 2, 3]).rangePoints([0+2*heightPadding, h3-2*heightPadding], 0).range();

    // Main line coordinates
    var upperLine = scaley[0];
    var middleLine = scaley[1];
    var lowerLine = scaley[2];
    
    // The tick indicator
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 1e-6);

    // Creating the gradients 
    var defs = container.append("svg:defs");

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
    var upperGroup = container.append("g")
        .attr("id", "upperGroup");

    var upperMaxRange = d3.max([firstComment, firstCommentCollaborator, timeToMerge]);
    var upperMinRange = d3.min([firstComment, firstCommentCollaborator, timeToMerge]);
    // We have to control whether timeToMerge is sooner that the first comment variables
    if(d3.min([firstComment, firstCommentCollaborator]) > timeToMerge) {
    	upperMinRange = 0;
    	upperMaxRange = timeToMerge;
    }
    
    if(upperMaxRange != 0) {
		
		if (upperMinRange === upperMaxRange) {
			upperMinRange = upperMaxRange - 10;
		}
	
	    var upperScale = d3.scale.ordinal()
	        .domain([1, 2, 3, 4]).rangePoints([upperMinRange, upperMaxRange], 0).range();
	
		//upper diagonal path
		drawGrowingPath(upperGroup, "upperDiagonalLine", scalex(upperScale[1]), middleLine, scalex(upperScale[2]), upperLine, 700, 800, "fill:none;stroke:url(#upperGradient);stroke-width:5")
	        
		//upper path
		drawGrowingPath(upperGroup, "upperLine", scalex(upperScale[2]), upperLine, scalex(timeToMerge), upperLine, 700, 1500, "stroke:#457313;stroke-width:5")
			
		// The rotated text
	    upperGroup.append("text")
			.attr("id", "upperText")
            .attr("dy", "-0.7em")
            .attr("dx", "2em")
			.style("opacity", 0)
	      .append("textPath")
	        .attr("xlink:href","#upperDiagonalLine")
	        .text("merged (" + percMerged + "%)");	
			
	    var upperTick = upperGroup.append("line")
			.attr("id", "upperTick")
	        .attr("style", "stroke:#457313;stroke-width:10")
	        .attr("x1", scalex(timeToMerge))
	        .attr("y1", upperLine + verticalTick)
	        .attr("x2", scalex(timeToMerge))
	        .attr("y2", upperLine - verticalTick)
			.style("opacity", 0);
        
		makeItAppear(d3.select("#upperText"), 100, 1500);
		makeItAppear(d3.select("#upperTick"), 200, 2500);
		
        upperTick.on("mousemove", function(d, index, element) {    
            tooltip.selectAll("p").remove();
            tooltip
                .style("left", (d3.event.pageX+15) + "px")
                .style("top", (d3.event.pageY-10) + "px");

            if (timeToMerge > 24)
            	tooltip.append("p").text((timeToMerge/24).toFixed(2) + " days");
            else
            	tooltip.append("p").text(timeToMerge + " hrs");
            tooltip.append("p").text("Merge event");
        });    

        upperTick.on("mouseover", function(d, index, element) {     
            tooltip.transition()
              .duration(200)
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
    var lowerGroup = container.append("g")
        .attr("id", "lowerGroup");

    var lowerMaxRange = d3.max([d3.max([firstComment, firstCommentCollaborator]), timeToClose]);
    var lowerMinRange = d3.min([d3.min([firstComment, firstCommentCollaborator]), timeToClose]);
    // We have to control whether timeToClose is sooner that the first comment variables
    if(d3.min([firstComment, firstCommentCollaborator]) > timeToClose) {
    	lowerMinRange = 0;
    	lowerMaxRange = timeToClose;
    }

    if(lowerMaxRange != 0) {
	
		if (lowerMinRange === lowerMaxRange) {
			lowerMinRange = lowerMinRange - 10;
		}
		
	    var lowerScale = d3.scale.ordinal()
	        .domain([1, 2, 3, 4]).rangePoints([lowerMinRange,lowerMaxRange], 0).range();
	
	
		//lower diagonal path
		drawGrowingPath(lowerGroup, "lowerDiagonalLine", scalex(lowerScale[1]), middleLine, scalex(lowerScale[2]), lowerLine, 700, 800, "fill:none;stroke:url(#lowerGradient);stroke-width:5")
	
		//lower path
		drawGrowingPath(lowerGroup, "lowerLine", scalex(lowerScale[2]), lowerLine, scalex(timeToClose), lowerLine, 700, 1500, "stroke:#FC821A;stroke-width:5")
		
	    // The rotated text
	    lowerGroup.append("text")
			.attr("id", "lowerText")
			.style("opacity", 0)
	        .attr("dy", "-0.6em")
	        .attr("dx", "3em")
	      .append("textPath")
	        .attr("xlink:href","#lowerDiagonalLine")
	        .text("closing (" + percClosed + "%)");
	
	    // The tick indicator
	    var lowerTick = lowerGroup.append("line")
			.attr("id", "lowerTick")
	        .attr("style", "stroke:#FC821A;stroke-width:10")
	        .attr("x1", scalex(timeToClose))
	        .attr("y1", lowerLine + verticalTick)
	        .attr("x2", scalex(timeToClose))
	        .attr("y2", lowerLine - verticalTick)
			.style("opacity", 0);

		makeItAppear(d3.select("#lowerText"), 100, 1500);
		makeItAppear(d3.select("#lowerTick"), 200, 2500);	
			
        lowerTick.on("mousemove", function(d, index, element) {    
            tooltip.selectAll("p").remove();
            tooltip
                .style("left", (d3.event.pageX+15) + "px")
                .style("top", (d3.event.pageY-10) + "px");

			if (timeToClose > 24)
            	tooltip.append("p").text((timeToClose/24).toFixed(2) + " days");
            else
            	tooltip.append("p").text(timeToClose + " hrs");	
            tooltip.append("p").text("Close event");
        });    

        lowerTick.on("mouseover", function(d, index, element) {     
            tooltip.transition()
              .duration(200)
              .style("opacity", 1);
        });    

        lowerTick.on("mouseout", function(d, index, element) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 1e-6);
        });

    }
    
    //
    // Main center line, from 0 to max time value (+ avgAgePosition)
    //
    var mainGroup = container.append("g")
        .attr("id", "mainGroup");
		
	//central path
	drawGrowingPath(mainGroup, "centralPath", scalex(0), middleLine, scalex(maxTime), middleLine, 1000, 0, "fill:none;stroke:#000000;stroke-width:7")
	
	mainGroup.append("path")
		.attr("id", "dottedPath")
        .attr("d", "M " + scalex(maxTime) + "," + middleLine + " "+ scalex(maxTime+avgAgePosition) + "," + middleLine)
        .attr("style", "fill:none;stroke:url(#mainGradient);stroke-dasharray:7,15;stroke-dashoffset:10;stroke-width:7")
        .attr("stroke-linecap", "round")
		.style("opacity", 0);
	
	//text central line
	mainGroup.append("text")
		.attr("id", "centralText")
        .attr("x", scalex(maxTime+avgAgePosition))
        .attr("y", middleLine)
        .attr("dy", "-0.8em")
        .attr("dx", "-7.7em")
        .text("Still open (" + percOpen + "%)")
		.style("opacity", 0);
	
	// Indicators for the first time values
    // The tick indicator
    var firstCommentTick = mainGroup.append("line")
		.attr("id", "firstCommentTick")
        .attr("style", "stroke:rgb(185,211,238);stroke-width:10")
        .attr("x1", scalex(firstComment))
        .attr("y1", middleLine + verticalTick)
        .attr("x2", scalex(firstComment))
        .attr("y2", middleLine - verticalTick)
		.style("opacity", 0);
			
	// Indicators for the first time a collaboration comments
    // The tick indicator
    firstCommentCollaboratorTick = mainGroup.append("line")
		.attr("id", "firstCommentCollaboratorTick")
        .attr("style", "stroke:rgb(0,0,0);stroke-width:10")
        .attr("x1", scalex(firstCommentCollaborator))
        .attr("y1", middleLine + verticalTick)
        .attr("x2", scalex(firstCommentCollaborator))
        .attr("y2", middleLine - verticalTick)
		.style("opacity", 0);
	
	// Indicators for the age
    // The tick indicator
    var ageTick = mainGroup.append("line")
		.attr("id", "ageTick")
        .attr("style", "stroke:#F62626;stroke-width:10")
        .attr("x1", scalex(maxTime+avgAgePosition))
        .attr("y1", middleLine + verticalTick)
        .attr("x2", scalex(maxTime+avgAgePosition))
        .attr("y2", middleLine - verticalTick)
		.style("opacity", 0);
	
	makeItAppear(d3.select("#dottedPath"), 200, 1100);
	makeItAppear(d3.select("#centralText"), 100, 1500);
	makeItAppear(d3.select("#firstCommentTick"), 200, 1500);
	makeItAppear(d3.select("#firstCommentCollaboratorTick"), 200, 1500);
	makeItAppear(d3.select("#ageTick"), 200, 2000);	

    firstCommentTick.on("mousemove", function(d, index, element) {    
        tooltip.selectAll("p").remove();
        tooltip
            .style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY-10) + "px");

			
		if (firstComment > 24)
          	tooltip.append("p").text((firstComment/24).toFixed(2) + " days");
        else
           	tooltip.append("p").text(firstComment + " hrs");		
        tooltip.append("p").text("First comment");
    });    

    firstCommentTick.on("mouseover", function(d, index, element) {     
        tooltip.transition()
          .duration(200)
          .style("opacity", 1);
    });    

    firstCommentTick.on("mouseout", function(d, index, element) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
    });

    firstCommentCollaboratorTick.on("mousemove", function(d, index, element) {    
        tooltip.selectAll("p").remove();
        tooltip
            .style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY-10) + "px");

		if (firstCommentCollaborator > 24)
           	tooltip.append("p").text((firstCommentCollaborator/24).toFixed(2) + " days");
        else
           	tooltip.append("p").text(firstCommentCollaborator + " hrs");	
        tooltip.append("p").text("A collaborator answers");
    });    

    firstCommentCollaboratorTick.on("mouseover", function(d, index, element) {     
        tooltip.transition()
          .duration(200)
          .style("opacity", 1);
    });    

    firstCommentCollaboratorTick.on("mouseout", function(d, index, element) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
    });

    ageTick.on("mousemove", function(d, index, element) {    
        tooltip.selectAll("p").remove();
        tooltip
            .style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY-10) + "px");

		if (avgAge > 24)
            tooltip.append("p").text((avgAge/24).toFixed(2) + " days");
        else
           	tooltip.append("p").text(avgAge + " hrs");	
        tooltip.append("p").text("Average age");
    });    

    ageTick.on("mouseover", function(d, index, element) {     
        tooltip.transition()
          .duration(200)
          .style("opacity", 1);
    });    

    ageTick.on("mouseout", function(d, index, element) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
    });
	
};

function drawGrowingPath(container, id, x1, y1, x2, y2, duration, delay, lineStyle) {
	var path = container.append("path")
	.attr("id", id)
	.attr("d", "M " + x1 + "," + y1 + " "+ x2 + "," + y2)
	.attr("style", lineStyle)
    .attr("stroke-linecap", "round");
 
	var pathTotalLength = path.node().getTotalLength();
	
	path
      .attr("stroke-dasharray", pathTotalLength + " " + pathTotalLength)
      .attr("stroke-dashoffset", pathTotalLength)
      .transition()
        .duration(duration)
		.delay(delay)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
}

function makeItAppear(element, duration, delay) {
	element
	.transition()
	.delay(delay)
	.duration(duration)
	.style("opacity", 1);
}

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
