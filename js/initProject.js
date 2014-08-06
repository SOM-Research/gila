var labelAnalyzerServlet = 'http://atlanmodexp.info.emn.fr:8800/ladrian';

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

	var projectId;
	if(params.projectId) {
		projectId = params.projectId;
		if(params.projectName) {
			$("#projectName").text(params.projectName + " results");
		} else {
			$("#projectName").text('The results for your project');
		}
	} else {
		if(params.projectName) {
			$("#projectName").text('No project found');
		}
	}

	getrq1(projectId);

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
	createRQ2LabelCombobox(dataAdapter);
	createRQ3LabelCombobox(dataAdapter);
};
    	

function createRQ2LabelCombobox(datasource) {

    $("#lcombobox").jqxComboBox(
    {
        width: 200,
        height: 25,
        source: datasource,
        selectedIndex: 0,
        displayMember: "labelName",
        valueMember: "labelId"
    });
    $("#lcombobox").on('select', function (event) {
    	
    });
};

function createRQ3LabelCombobox(datasource) {

	$("#rq3lcombobox").jqxComboBox(
	    {
	        width: 200,
	        height: 25,
	        source: datasource,
	        selectedIndex: 0,
	        displayMember: "labelName",
	        valueMember: "labelId"
	    });
	    $("#rq3lcombobox").on('select', function (event) {
	    	
	    });

};

