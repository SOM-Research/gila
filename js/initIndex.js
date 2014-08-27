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
 
};