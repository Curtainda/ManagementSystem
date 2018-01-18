var Fromtype = "";
var Fromrow = {};
$(document).ready(function() {
    $("#btn_query").click();
    formValidator();
});


$("#btn_query").click( function() {
    var menu_name =$('#menumname').val();
    var isdisabledSelect =$('#isdisabledSelect').val();
    var UUID = uuid(8,16);
    var reqdata = [];
    var reqobj = {};
    reqobj.menu_name = menu_name;
    reqobj.isdisabledSelect = isdisabledSelect;
    reqobj.function = 'query';
    reqobj.uuid = UUID;
    reqdata.push(reqobj);
    var JsonData = JSON.stringify(reqdata);
    ShowLoading();
    socket.emit(MENU,JsonData);//发送服务器消息
    socket.on('listen'+MENU,function (resdata) {//接受（监听）消息
        if(UUID == DocJson(resdata,'uuid')){//判断是否是自己访问的UUID
            if(DocJson(resdata,'Code') == '0'){//正确
                var Message = DocJson(resdata,'Message');
                var tabledata = eval('(' + Message + ')');
                loadtable(tabledata);
                $("#table").bootstrapTable('load', tabledata);//重新加载数据（刷新）
            }else{//错误
                ShowAlert2(DocJson(resdata,'Message'),2);//提示错误
                $("#table").bootstrapTable('destroy');//销毁表
            }
        }
        HideLoading();
    });
});





//创建表头和操作
function CreatColumns() {
    //params  数据库字段名称
    //titles  表头
    //是否有chek框
    var params =  ['ID','menu_id','menu_name','state','remarks','creat_time','last_update_time','操作'];
    var titles =  ['ID','菜单ID','菜单名称','状态','备注','创建时间','最后修改时间','操作'];
    var hasCheckbox = true;
    if(params.length!=titles.length){
        ShowAlert("错误！");
        return null;
    }
    var Columns = [];
    if(hasCheckbox){
        var objc = {};
        objc.checkbox = true;
        Columns.push(objc);
    }
    // var arr =[];
    // var obj = {};
    // obj.valign = 'middle';
    // obj.align = 'center';
    // obj.title = '合并单元格';
    // obj.colspan = params.length;
    // arr.push(obj)
    // columns.push(arr);
    //var arr1 =[];
    for (var i=0;i<params.length;i++){
        var obj ={};
        obj.field = params[i];
        obj.title = titles[i];
        obj.valign = 'middle';
        obj.align = 'center';
        if (i == 0){//隐藏表头
            obj.visible = false;
        }
        if (i == params.length-1){//最后一列操作配置
            obj.formatter=function (value,row,index) {
                var html = '  <button  type="button" class="btn btn-default" data-toggle="modal" data-target="#Modal" onclick="View(\''+index+'\')"> '+
                           '   <span class="glyphicon glyphicon-list" aria-hidden="true"></span>查看'+
                           '  </button>';
                html +=  '  <button  type="button" class="btn btn-default" data-toggle="modal" data-target="#Modal"  onclick="Edit(\''+ index + '\')">'+
                    '   <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑'+
                    '  </button>';
                html +=  '  <button  type="button" class="btn btn-default"   onclick="Delete(\''+index+'\')">'+
                    '   <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除'+
                    '  </button>';
                // var html = '<a href="javascript:View(\''+ row.ID + '\')">查看</a>';
                // html += '　<a href="javascript:Edit(\'' + row.ID + '\')">编辑</a>';
                // html += '　<a href="javascript:Delete(\'' + row.ID + '\',\''+row.menu_name+'\')">删除</a>';
                return html;
            }
        }
        if(i == 3){//备注转义
            obj.formatter=function(value,row,index){
                var Val = "";
                if(value == '0'){
                    Val ="可用";
                }else{
                    Val ="不可用";
                }
                return Val;
            }
        }


        Columns.push(obj);
    }
    return Columns;
}
//加载表
function loadtable(tabledata) {
    $("#table").bootstrapTable({
        // url: url,                           //请求后台的URL（*）
        // method: 'post',                     //请求方式（*）
        toolbar: "#toolbar",                   //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: function (params) {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit: params.limit,   //页面大小
                offset: params.offset  //页码
                //name: $("#txt_name").val()//关键字查询
            };
        },                                  //传递参数（*），这里应该返回一个object，即形如{param1:val1,param2:val2}
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [20, 50, 100],            //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: true,                     //是否显示导出
        exportDataType: "all",              //basic', 'all', 'selected'.当前页、所有数据还是选中数据。
        exportTypes:['excel'],
        columns: CreatColumns(),
        data: tabledata,
        rowStyle: function (row, index) {
            //这里有5个取值代表5中颜色['active', 'success', 'info', 'warning', 'danger'];
            var rowclass = {};
            var strclass = "";
            // if (row.id < 5) {
            //     strclass = 'success';//还有一个active
            // }
            rowclass.classes = strclass;
            return rowclass
        },
        //注册加载子表的事件。注意下这里的三个参数！
        onExpandRow: function (index, row, $detail) {
           // fatherson(index, row, $detail);
            var fatherid = row.id;
            var cur_table = $detail.html('<table></table>').find('table');
            $(cur_table).bootstrapTable({
                data: getfaehrtsondata(fatherid),//获取子表数据源方法
                clickToSelect: true,
                detailView: false,//父子表
                uniqueId: "id",
                pageSize: 10,
                pageList: [10, 25],
                columns: CreatColumns(),
                // //无线循环取子表，直到子表里面没有记录
                // onExpandRow: function (index, row, $Subdetail) {
                //     oInit.InitSubTable(index, row, $Subdetail);
                // }
            });
        }
    });
}
//表单验证
function formValidator() {
    $('#add_menu_from').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            menu_id: {
                validators: {
                    notEmpty: {
                        message: '菜单ID不能为空。'
                    },
                    regexp: {
                        regexp: /^[0-9_]+$/,
                        message: '菜单名称只能由数字丶下划线组成。'
                    }
                }
            },
            menu_name: {
                validators: {
                    notEmpty: {
                        message: '菜单名称不能为空。'
                    }
                }
            }
        }
    })
        .on('success.form.bv', function(e) {
            // Prevent form submission 防止表单提交
            e.preventDefault();

            // Get the form instance  获取表单实例
            var $form = $(e.target);

            // Get the BootstrapValidator instance  得到bootstrapvalidator实例
            var bv = $form.data('bootstrapValidator');
            ShowLoading();
            if(Fromtype == 'add'){
                var menu_id = $("#menu_id").val();
                var menu_name = $("#menu_name").val();
                var remarks = $("#remarks").val();
                var UUID = uuid(8,16);
                var reqdata = [];
                var reqobj = {};
                reqobj.menu_id = menu_id;
                reqobj.menu_name = menu_name;
                reqobj.remarks = remarks;
                reqobj.function = 'add';
                reqobj.uuid = UUID;
                reqdata.push(reqobj);
                var JsonData = JSON.stringify(reqdata);
                socket.emit(MENU,JsonData);//发送服务器消息
                socket.on('listen'+MENU,function (resdata) {//接受（监听）消息
                    if(UUID == DocJson(resdata,'uuid')) {//判断是否是自己访问的UUID
                        if (DocJson(resdata, 'Code') == '0') {//正确
                            ShowAlert(DocJson(resdata,'Message'));
                            $("#btn_modal_close").click();
                            $("#btn_query").click();
                        }else{//错误
                            ShowAlert2(DocJson(resdata,'Message'),2);//提示错误
                        }
                    }
                    HideLoading();
                });
            }else if (Fromtype == 'view'){
                var menu_id = $("#menu_id").val();
                var menu_name = $("#menu_name").val();
                var remarks = $("#remarks").val();
                var state = $("#state").val();
            }else if (Fromtype == 'edt'){
                Edit(Id);
            }
        });
}


//添加操作
function Add() {
    ResetFrom('#add_menu_from');
    formValidator();
    FromAvailable('#add_menu_from');//表单控件可用
    $("#state").val("0");
    $('#add_menu_from').find('#state')/*.not('这里代表需要改的元素的查找')*/.attr("disabled", "disabled");
    Fromtype = 'add';
}
//查看操作
function View(index) {
    ResetFrom('#add_menu_from');//重置表单
    FromDisabled('#add_menu_from');//表单控件不可用
    var TableRow = $("#table").bootstrapTable('getData');//获取表格的所有内容行
    var row = TableRow[index];

}
//编辑操作
function Edit(index){
    ResetFrom('#add_menu_from');//重置表单
    FromAvailable('#add_menu_from');//表单控件可用
    formValidator();
    var TableRow = $("#table").bootstrapTable('getData');//获取表格的所有内容行
    var row = TableRow[index];
}
//删除操作
function Delete(index) {
    var TableRow = $("#table").bootstrapTable('getData');//获取表格的所有内容行
    var row = TableRow[index];
    layer.msg("要删除："+row.menu_name+" 吗?", {
        time: 0 ,//不自动关闭
        btn: ['是', '否'],
        yes: function (index) {
            layer.close(index);//关闭窗口
            var reqdata = [];
            var reqobj = {};
            var UUID = uuid(8,16);
            reqobj.uuid = UUID;
            reqobj.id = row.ID;
            reqobj.function = 'del';
            reqdata.push(reqobj);
            var JsonData = JSON.stringify(reqdata);
            socket.emit(MENU,JsonData);//发送服务器消息
            socket.on('listen'+MENU,function (resdata) {//接受（监听）消息
                if(UUID == DocJson(resdata,'uuid')) {//判断是否是自己访问的UUID
                    if (DocJson(resdata, 'Code') == '0') {//正确
                        ShowAlert(DocJson(resdata,'Message'));
                        $("#btn_query").click();
                    }else{//错误
                        ShowAlert2(DocJson(resdata,'Message'),2);//提示错误
                    }
                }
            });
        }
    });
}
//批量删除
function BatchDelete() {
    var row = $.map($("#table").bootstrapTable('getSelections'), function (row) {
        return row;
    });
    //row 是数组
    if (row.length < 2) {
        ShowAlert2('至少选择两个');
        return;
    }
    var ids = [];
    var names = [];
    for (var i = 0; i < row.length; i++) {
        ids[i] = row[i].ID;
        names[i] = row[i].menu_name;
    }
    layer.msg("要删除："+names.join(',')+" 吗?", {
        time: 0 ,//不自动关闭
        btn: ['是', '否'],
        yes: function (index) {
            layer.close(index);//关闭窗口
            var Ids = ids.join(',');//数组转字符串
            var reqdata = [];
            var reqobj = {};
            var UUID = uuid(8, 16);
            reqobj.uuid = UUID;
            reqobj.ids = Ids;
            reqobj.function = 'batch_del';
            reqdata.push(reqobj);
            var JsonData = JSON.stringify(reqdata);
            socket.emit(MENU, JsonData);//发送服务器消息
            socket.on('listen' + MENU, function (resdata) {//接受（监听）消息
                if (UUID == DocJson(resdata, 'uuid')) {//判断是否是自己访问的UUID
                    if (DocJson(resdata, 'Code') == '0') {//正确
                        ShowAlert(DocJson(resdata, 'Message'));
                        $("#btn_query").click();
                    } else {//错误
                        ShowAlert2(DocJson(resdata, 'Message'), 2);//提示错误
                    }
                }
            });
        }
    });
}





