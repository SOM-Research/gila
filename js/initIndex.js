var labelAnalyzerServlet = 'http://localhost:8080/labelAnalysisServer';
var selectedProjectName = "";
var selectedProjectValue = "";
var searchstring="";

window.onload = function() {
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
	                settings.url = settings.url + "&searchstring=" + searchstring;
	            }
	        },
	        
	        loadComplete: function() {
//	            $("#pcombobox").jqxComboBox('autoOpen', 'true');
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
        minLength: 3,
        search: function (searchString) {
            dataAdapter.dataBind();
        }
    });
    
    dataAdapter.dataBind();
    
//    $("#pcombobox").on('open', function (event) {
//    	$("#pcombobox").jqxComboBox('removeAt', 0 ); 
//    });
    
    $("#pcombobox").on('bindingComplete', function (event) {
//    	console.log(event);
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
 
};