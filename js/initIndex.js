var labelAnalyzerServlet = 'http://localhost:8080/labelAnalysisServer';
//var labelAnalyzerServlet = 'http://atlanmodexp.info.emn.fr:8800/gila';
var selectedProjectName = "";

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
            selectedProjectName = selecteditem.label;
        }
    });
};