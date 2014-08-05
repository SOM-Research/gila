var labelAnalyzerServlet = 'http://localhost:8080/labelAnalysisServer';

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
};