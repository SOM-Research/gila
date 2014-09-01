var labelAnalyzerServlet = 'http://atlanmodexp.info.emn.fr:8800/gila';
var selectedProjectName = "";
var selectedProjectValue = "";
var searchstring="";

window.onload = function() {
	var loader = $("#loader").attr('src', 'imgs/ajax-loader.gif').hide();
    var source =
        {
            datatype: "json",
            datafields: [
                { name: 'projectId' },	
                { name: 'projectName' },
                { name: 'name' },
                { name: 'login' }
            ],
            url: labelAnalyzerServlet + "/LabelAnalysisServlet?event=getprojects",
            data: {
                featureClass: "P",
                style: "full",
                maxRows: 50,
                username: "jqwidgets"
            }
        };
        
    var dataAdapter = new $.jqx.dataAdapter(source, 
    	{
	        beforeSend: function (jqxhr, settings) {
	        	searchstring = $("#pcombobox").jqxComboBox('searchString'); 
	            if (searchstring != undefined) {
	            		settings.url = settings.url = settings.url + "&searchstring=" + searchstring;
	            }
	        },
	        
	        loadComplete: function() {
	        }
    	}
    );
    
    $("#pcombobox").jqxComboBox(
    {
        width: 200,
        height: 25,
        source: dataAdapter,
        displayMember: "projectName",
        valueMember: "projectId",
        remoteAutoComplete: true,
        remoteAutoCompleteDelay: 500,
        minLength: 1,
        placeHolder: "name[owner]",
        search: function (searchString) {
        	$(".jqx-combobox-input, .jqx-combobox-content").css({ "background": "url('imgs/loading_project.gif') no-repeat right 5px center" });
            dataAdapter.dataBind();
            
        }
    });
    
    dataAdapter.dataBind();
    $("#pcombobox").on('bindingComplete', function (event) {
    	$(".jqx-combobox-input, .jqx-combobox-content").css({ "background-image": "none" });
    });
    
    $("#pcombobox").on('select', function (event) {
    	if (typeof event.args != 'undefined') {
	        var selecteditem = event.args.item;
	        if (selecteditem) {
	            selectedProjectValue = selecteditem.value;
	            var projectName = selecteditem.originalItem.name;
	            var projectOwner = selecteditem.originalItem.login;
	            selectedProjectName = projectOwner + "/" + projectName	;
	        }
    	}
    });
    
    //add help tooltip in the selection box
    var helptooltip = d3.select("body").append("div")
        .attr("class", "helptooltip")
        .style("opacity", 1e-6);
    
    helptooltip.append("p").attr("class", "tooltiptext").text("Open the combobox to choose a project from the list " +
        "or type the name of a project you want to search. " +
        "Projects are listed using the convention: project name[project owner].");
    
    var helpdiv = d3.select("#projecthelp");
    
    helpdiv.on("mouseover", function(d, index, element) {
    	helptooltip
        .style("left", (d3.event.pageX+10) + "px")
        .style("top", (d3.event.pageY-5) + "px");
        helptooltip.transition()
          .duration(500)
          .style("opacity", 1);
    });    

    helpdiv.on("mouseout", function(d, index, element) {
    	helptooltip.transition()
          .duration(500)
          .style("opacity", 1e-6);
    });

    //add tooltips for each visualization
    var tooltipV1 = d3.select("body").append("div")
        .attr("class", "helptooltipvis")
        .style("opacity", 1e-6);

    tooltipV1.append("p").attr("class", "tooltiptext").html("The most used labels are <b>defect</b>, followed by <b>feature</b>" + 
        " and <b>improvement</b> <i>(see size of nodes)</i>. In addition, <b>improvement</b> is often used together with the " + 
        "<b>feature</b>, <b>defect</b>, <b>cleanup</b> and <b>won\'t fix</b> <i>(see thickness of edges)</i>." + 
        "<p class='text-center'><img src='imgs/luex.png'/></p>");

    divV1 = d3.select("#rqbox1");
    divV1.on("mouseover", function(d, index, element) {
        tooltipV1
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY-5) + "px");
        tooltipV1.transition().duration(500).style("opacity", 1);
    });    

    divV1.on("mouseout", function(d, index, element) {
        tooltipV1.transition()
          .duration(500)
          .style("opacity", 1e-6);
    }); 

    var tooltipV2 = d3.select("body").append("div")
        .attr("class", "helptooltipvis")
        .style("opacity", 1e-6);

    tooltipV2.append("p").attr("class", "tooltiptext").html("The collaborators <i>(orange nodes)</i> that comment the most " + 
        "<i>(see thickness of the edges)</i> are <b>trustin</b> and <b>normanmaurer</b>. In addition, <b>normanmaurer</b> is " + 
        "the one that opened more issues <i>(see node width)</i>, while <b>trustin</b> is the one that closed more issues " + 
        "<i>(see node height)</i>" +
        "<p class='text-center'><img src='imgs/uiex.png'/></p>");

    divV2 = d3.select("#rqbox2");
    divV2.on("mouseover", function(d, index, element) {
        tooltipV2
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY-5) + "px");
        tooltipV2.transition().duration(500).style("opacity", 1);
    });    

    divV2.on("mouseout", function(d, index, element) {
        tooltipV2.transition()
          .duration(500)
          .style("opacity", 1e-6);
    }); 

    var tooltipV3 = d3.select("body").append("div")
        .attr("class", "helptooltipvis")
        .style("opacity", 1e-6);

    tooltipV3.append("p").attr("class", "tooltiptext").html("<b>7.39%</b> of issues are <b>accepted</b> and end up with a " + 
        "merge action, <b>85.8%</b> of issues are <b>rejected</b> <i>(closed without merging)</i> and the remaining <b>6.81%</b> " + 
        "are <b>still open</b>. In addition, on average an issue is accepted in <b>1.49 days</b> or rejected in <b>26.86 days</b>. " + 
        "Finally, the first collaborator comment is made on average <b>7.67 days</b> after opening an issue." + 
        "<p class='text-center'><img src='imgs/ltex.png'/></p>");

    divV3 = d3.select("#rqbox3");
    divV3.on("mouseover", function(d, index, element) {
        tooltipV3
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY-5) + "px");
        tooltipV3.transition().duration(500).style("opacity", 1);
    });    

    divV3.on("mouseout", function(d, index, element) {
        tooltipV3.transition()
          .duration(500)
          .style("opacity", 1e-6);
    }); 


};