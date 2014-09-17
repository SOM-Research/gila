
var projectId;

var labelAnalyzerServlet = 'http://atlanmodexp.info.emn.fr:8800/gila';

window.onload = function() {
	var params = {};

	if (location.search) {
	    var parts = location.search.substring(1).split('&');

	    for (var i = 0; i < parts.length; i++) {
	        var nv = parts[i].split('=');
	        if (!nv[0]) continue;
	        params[nv[0]] = nv[1] || -1;
	    }
	}
	
	if(params.projectId) {
		projectId = params.projectId;
		if(params.projectName) {
			$("#projectName").text(params.projectName + " results");
		} else {
			$("#projectName").text('The results for your project');
		}
		
		loadPage(projectId);

	} else {
		if(params.projectName) {
			$("#projectName").text(params.projectName + " results");
			$.ajax({
				  url: labelAnalyzerServlet + "/LabelAnalysisServlet?event=getprojectid&project=" + params.projectName,
				  success:function(data) {
					projectId = data[0].projectId;
					loadPage(projectId);
				}
			});
			
		} else {
				$("#projectName").text('No project found');
			}
	}
}
	//var projectId = location.search.split('projectId=')[1];

function getProjectSummary(projectId) {
	$.ajax({
		  url: labelAnalyzerServlet + "/LabelAnalysisServlet?event=projectsummary&projectId=" + projectId,
		  success:function(data) {
			  numLabels = data[0].num_labels;
			  percLabeled = data[0].perc_labeled;
			  avgLabels = data[0].avg_num_labels;
			  label = (numLabels == 1)? 'label' : 'labels'; 
			  
			  $("#projectsummary").html('The project defines <span>' + numLabels  
			   +' '+ label +'</span> and <span>' + percLabeled + '% </span> of the total number of issues are <span> labeled</span>,'
			   +' having an average of <span>'+ avgLabels +' labels </span> per issue');
		}
	});
}

function loadPage(projectId) {
	
	getProjectSummary(projectId);
	generaterq1(projectId);
	
	var source =
	    {
	        datatype: "json",
	        datafields: [
	            { name: 'labelId' },
	            { name: 'labelName' }
	        ],
	        url: labelAnalyzerServlet + "/LabelAnalysisServlet?event=getprojectlabels&projectid="+projectId,
	        data: {
	            featureClass: "P",
	            style: "full",
	            maxRows: 50,
	            username: "jqwidgets"
	        }
	    };
    		
	var rq2DataAdapter = new $.jqx.dataAdapter(source);
	var rq3DataAdapter = new $.jqx.dataAdapter(source);
	
	initrq2(rq2DataAdapter);
	initrq3(rq3DataAdapter);
}


function clearContainer(container) {
	//remove previous graph if exists
	if (container.children().size() > 0) {
		container.empty();
	}

}

function onLoadingGraph(svgIdContainer, loaderId, svgHeight, svgWidth) {
	svgIdContainer
	.append("svg:image")
	.attr("id", loaderId)
	.attr("xlink:href", "imgs/ajax-loader.gif")
	.attr("width", "5%")
	.attr("height", "5%")
	.attr("x", function(){ return svgWidth/2;})
	.attr("y", function(){ return svgHeight/2;});
}

function removeLoadingImage(loaderId) {
	d3.select('#' + loaderId).remove();
}

function creatingWarningMessage(svgIdContainer, posX, posY, text) {
	svgIdContainer.append("svg:image")
	.attr("xlink:href", "imgs/warningimage.png")
	.attr("width", "98%")
	.attr("height", "98%");
						
	svgIdContainer.append("text")
	.attr("x", posX)
	.attr("y", posY)
	.attr("font-family", "sans-serif")
	.attr("font-size", "28px")
	.attr("text-anchor", "middle")
	.attr("fill", "red")
	.text(text);
}
