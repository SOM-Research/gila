var projectId;
var labelAnalyzerServlet = 'http://localhost:8080/labelAnalysisServer';
//var labelAnalyzerServlet = 'http://atlanmodexp.info.emn.fr:8800/gila';

window.onload = function() {
	var params = {};

	if (location.search) {
	    var parts = location.search.substring(1).split('&');

	    for (var i = 0; i < parts.length; i++) {
	        var nv = parts[i].split('=');
	        if (!nv[0]) continue;
	        params[nv[0]] = nv[1] || true;
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

function loadPage(projectId) {

	generaterq1(projectId);
	
	var source =
	    {
	        datatype: "json",
	        datafields: [
	            { name: 'labelId' },
	            { name: 'labelName' }
	        ],
	        url: labelAnalyzerServlet + "/LabelAnalysisServlet?event=getlabels&projectid="+projectId,
	        data: {
	            featureClass: "P",
	            style: "full",
	            maxRows: 50,
	            username: "jqwidgets"
	        }
	    };
    		
	var dataAdapter = new $.jqx.dataAdapter(source);
	initrq2(dataAdapter);
	initrq3(dataAdapter);
}


function clearContainer(container) {
	//remove previous graph if exists
	if (container.children().size() > 0) {
		console.log(container);
		container.empty();
	}

}

