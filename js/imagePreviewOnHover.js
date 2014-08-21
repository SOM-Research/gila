$(function(){
$container = $('<div/>').attr('id', 'imgPreviewWithStyles').append('<img/>').hide()
.css({'position': 'absolute', 'border-width': 'medium', 'border-style': 'solid', 'border-radius': '5px', 'border-color' : '#9C4590', 'box-shadow': '10px 10px 5px #888888'})
.appendTo('body'),

$img = $('img', $container),
    $('a:not(.brand)').mousemove(function (e) {
    $container.css({
        top: e.pageY + -200 + 'px',
        left: e.pageX + 10 + 'px',
    });

}).hover(function () {

    var link = this;
    $container.show();
    $img.load(function () {
        $img.addClass('img-rounded');
        $img.show();
    }).attr('src', $(link).prop('href'));
    
}, function () {

    $container.hide();
    $img.unbind('load').attr('src', '').hide();
    
});
});