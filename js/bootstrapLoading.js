function LoadingShow() {
    var loadinghtml = loadDiv();
    $(document.body).append(loadinghtml);
    var top = ($(window).height() - $("#loading").height())/2;
    var left = ($(window).width() - $("#loading").width())/2;
    var scrollTop = $(document).scrollTop();
    var scrollLeft = $(document).scrollLeft();
    $("#overlay").css( { 'z-index': 999 } ).show();
    $("#loading").css( { position : 'absolute', 'top' : top + scrollTop, left : left + scrollLeft } ).show();
}
function loadDiv() {
    var div = "<div id='overlay' class='overlay' onclick='LoadingHide();'><div id='loading' class='loading'>" +
        "        <span></span>" +
        "        <span></span>" +
        "        <span></span>" +
        "        <span></span>" +
        "        <span></span>" +
        "</div></div>";
    return div;
}

function LoadingHide() {
    $("#overlay").remove();
}