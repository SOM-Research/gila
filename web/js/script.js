function initGraph() {
    var sigmaInstance = null;

    sigma.parsers.gexf(
        'data.gexf',
        {
            container : 'graph'
        },
        function(instance) {
            sigmaInstance = instance
        }
    );

    var layoutRunning = false;
    document.getElementById("layout").addEventListener("click", function() {
        if(layoutRunning) {
            layoutRunning = false;
            document.getElementById("layout").innerHTML = 'Start Layout';
            sigmaInstance.stopForceAtlas2();
        } else {
            layoutRunning = true;
            document.getElementById("layout").innerHTML = 'Stop Layout';
            sigmaInstance.startForceAtlas2();
        }
    });

    document.getElementById('rescale').addEventListener('click',function(){
        sigmaInstance.position(0,0,1).draw();
    },true);

    //sigmaGraph.draw();
}

if(document.addEventListener) {
    document.addEventListener("DOMContentLoaded", initGraph, false);
} else {
    window.onload = initGraph;
}
