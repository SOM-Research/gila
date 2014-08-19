var labelAnalyzerServlet = 'http://atlanmodexp.info.emn.fr:8800/gila';
var selectedProjectName = "";
var selectedProjectValue = "";

window.onload = function() {
    var source =
        {
            datatype: "json",
            datafields: [
                { name: 'projectId' },	
                { name: 'projectName' }
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
	        	var searchstring = $("#pcombobox").jqxComboBox('searchString'); 
	            if (searchstring != undefined) {
	                settings.url = settings.url + "&searchstring=" + searchstring;
	            }
	        },
	        
	        loadComplete: function() {
	            $("#pcombobox").jqxComboBox('selectedIndex', 0);
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
        selectedIndex: 0,
        minLength: 3,
        search: function (searchString) {
        	console.log('search');
            dataAdapter.dataBind();
        }
    });
    
    dataAdapter.dataBind();
    
    $("#pcombobox").on('bindingComplete', function (event) {
//    	console.log(event);
    });
    
    $("#pcombobox").on('select', function (event) {
    	if (typeof event.args != 'undefined') {
	        var selecteditem = event.args.item;
	        if (selecteditem) {
	            selectedProjectName = selecteditem.label;
	            selectedProjectValue = selecteditem.value;
	        }
    	}
    });
 
};