$(function(){
$container = $('<div/>').append('<p id="content"/>').append('<img id="example"/>').append('<p style="text-align:center"><img id="loader" src="../imgs/ajax-loader.gif"/"></p>').hide()
.css({'background': '#FFFFFF',
'position': 'absolute',
'font-size': '22px',
'width': '510px',
'heigth': '400px',
'border-width': 'medium', 
'border-style': 'solid',
'border-radius': '5px', 
'border-color': '#9C4590', 
'box-shadow': '10px 10px 5px #888888'})
.appendTo('body'),

$img = $('#example');
$loader = $('#loader');
    $('a').mousemove(function (e) {
    $container.css({
        top: e.pageY + -200 + 'px',
        left: e.pageX + 10 + 'px',
    });

}).hover(function () {

    var link = this;
	
	if (link.href.indexOf('luex.png') >= 0) {
		$('#content')
		.css('padding', '10px')
		.append('The most used labels are <b>defect</b>, followed by <b>feature</b> and <b>improvement</b> <i>(see size of nodes)</i>.In addition, <b>improvement</b> is often used together with the <b>feature</b>, <b>defect</b>, <b>cleanup</b> and <b>won\'t fix</b> <i>(see thickness of edges)</i>');
	}
	else if (link.href.indexOf('uiex.png') >= 0) {
		$('#content').append('The collaborators <i>(orange nodes)</i> that comment the most <i>(see thickness of the edges)</i> are <b>trustin</b> and <b>normanmaurer</b>. In addition, <b>normanmaurer</b> is the one that opened more issues <i>(see node width)</i>, while <b>trustin</b> is the one that closed more issues <i>(see node height)</i>');
	}
	else if (link.href.indexOf('ltex.png') >= 0) {
		$('#content').append('<b>7.39%</b> of issues are <b>accepted</b> and end up with a merge action, <b>85.8%</b> of issues are <b>rejected</b> <i>(closed without merging)</i> and the remaining <b>6.81%</b> are <b>still open</b>. In addition, on average an issue is accepted in <b>1.49 days</b> or rejected in <b>26.86 days</b>. Finally, the first collaborator comment is made on average <b>7.67 days</b> after opening an issue.');
	}
	
    $container.show();
	$img.attr('src', $(link).prop('href')).css({'margin-left': 'auto', 'margin-right':'auto'});
	$img.on('load', function () {
        $loader.hide();
    }).show();
	
}, function () {

    $container.hide();
	$('#content').empty();
    $img.attr('src', '').hide();
    
});
});