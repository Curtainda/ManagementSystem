$(document).ready(function() {
    $('#menu').metisMenu();//菜单初始化
    //ShowAlert2(IsVal("username"));
    //  ShowAlert2(GetVal("username"));
    // ShowAlert2(GetVal("password"));
    // ShowAlert2(GetVal("email"));
});

/**
 * 菜单标签按钮监听
 */
$('#menu').find("li").find("a").on("click",function () {
    var $this = $(this);//获取当前控件
    var _clickTab = $this.attr('target');//获取target 的值
    if(_clickTab != '' && _clickTab != null){
        // ShowAlert(_clickTab);
        _clickTab = "Content/"+_clickTab;
        IframeLoad(_clickTab,"content");
    }
})
