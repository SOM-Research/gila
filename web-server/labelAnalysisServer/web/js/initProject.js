var labelAnalyzerServlet = 'http://localhost:8080/labelAnalysisServer';

window.onload = function() {
	var projectId = location.search.split('projectId=')[1];
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

