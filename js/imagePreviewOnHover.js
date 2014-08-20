$(function(){
$container = $('<div/>').attr('id', 'imgPreviewWithStyles').append('<img/>').hide().css('position', 'absolute').appendTo('body'),

$img = $('img', $container),
    $('a:not(.brand)').mousemove(function (e) {
    $container.css({
        top: e.pageY + -200 + 'px',
        left: e.pageX + 10 + 'px'
    });

}).hover(function () {

    var link = this;
    $container.show();
    $img.load(function () {
        //$container.removeClass(s.containerLoadingClass);
        $img.addClass('img-rounded');
        $img.show();
        //s.onLoad.call($img[0], link);
    }).attr('src', $(link).prop('href'));
    //alert($(link).prop('href'));
    //s.onShow.call($container[0], link);

}, function () {

    $container.hide();
    $img.unbind('load').attr('src', '').hide();
    //s.onHide.call($container[0], this);

});
});