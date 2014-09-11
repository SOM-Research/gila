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
	        },
	        
	        loadError: function(jqXHR, status, error) {
	        }
    	}
    );
    
    $("#pcombobox").jqxComboBox(
    {
        width: "100%",
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
    	if (typeof data == 'undefined') {
    		$("#error").html("<h3>GiLA is currently unavailable, we will be back soon!</h3>");
    	}
    	console.log(event);
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
    
  //add help tooltip
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

 
};