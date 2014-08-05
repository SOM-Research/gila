/**
 * 
 */


function createProjectCombobox() {
	// prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'projectId' },
            { name: 'projectName' }
        ],
        url: "http://atlanmodexp.info.emn.fr:8800/labelAnalysis/LabelAnalysisServlet?event=getprojects",
        data: {
            featureClass: "P",
            style: "full",
            maxRows: 50,
            username: "jqwidgets"
        }
    };
    
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#pcombobox").jqxComboBox(
    {
        width: 200,
        height: 25,
        source: dataAdapter,
        selectedIndex: 0,
        displayMember: "projectName",
        valueMember: "projectId"
    });
    
    $("#pcombobox").on('select', function (event) {
    	var selecteditem = event.args.item;
    	if (selecteditem) {
    		var projectId = selecteditem.value;
    		var source =
    	    {
    	        datatype: "json",
    	        datafields: [
    	            { name: 'labelId' },
    	            { name: 'labelName' }
    	        ],
    	        url: "http://atlanmodexp.info.emn.fr:8800/labelAnalysis/LabelAnalysisServlet?event=getlabels&projectid="+projectId,
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
    	}
    	
    });
}

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
}

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

}


$(document).ready(function () {
	createProjectCombobox();
});