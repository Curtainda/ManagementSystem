$(document).ready(function() {
    $("#btn_query").click();
});

$("#btn_query").click( function() {
    var tabledata = [];
    for (var i=0;i<1000;i++){
        var datarow = {};
        datarow.id = i;
        datarow.name = "Item "+i;
        datarow.price = "$"+i;
        tabledata.push(datarow);
    }

    var params =  ['id','name','price','操作'];
    var titles =  ['Item ID','Item Name!','Item Price!','操作'];
    var columns = createCols (params,titles,false);
    createBootstrapTable('#table',tabledata,columns,true,'#toolbar');
});

//构成表头和操作
function createCols (params,titles,hasCheckbox) {
    //params  数据库字段名称
    //titles  表头
    //是否有chek框
    if(params.length!=titles.length)
        return null;
    var columns = [];
    if(hasCheckbox){
        var objc = {};
        objc.checkbox = true;
        columns.push(objc);
    }
    // var arr =[];
    // var obj = {};
    // obj.valign = 'middle';
    // obj.align = 'center';
    // obj.title = '合并单元格';
    // obj.colspan = params.length;
    // arr.push(obj)
    // columns.push(arr);
    var arr1 =[];
    for (var i=0;i<params.length;i++){
        var obj ={};
        obj.field = params[i];
        obj.title = titles[i];
        obj.valign = 'middle';
        obj.align = 'center';
        if(obj.title == '操作'&&obj.field == '操作'){
            obj.formatter=function (value,row,index) {
                var html = '<a href="javascript:View(\''+ row.id + '\')">查看</a>';
                html += '　<a href="javascript:Edit(\'' + row.id + '\')">编辑</a>';
                html += '　<a href="javascript:Delete(\'' + row.name + '\')">删除</a>';
                return html;
            }
        }
        arr1.push(obj);
    }
    columns.push(arr1);
    return columns;
}


(function () {
    function init(table,tabledata,columns,toolbar) {
        //table 表ID
        //tabledata 表数据
        //columns 构成表头和操作
        //toolbar 工具divid
        $(table).bootstrapTable({
            // url: url,                           //请求后台的URL（*）
            // method: 'post',                     //请求方式（*）
            toolbar: toolbar,                   //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: true,                    //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: queryParams,           //传递参数（*），这里应该返回一个object，即形如{param1:val1,param2:val2}
            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [20, 50, 100],            //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
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
            columns: columns,
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
                fatherson(index, row, $detail,params,titles,Checkbox);
            }
        });
    }

    function fatherson(index, fatherrow, $detail,params,titles,hasCheckbox) {
        var fatherid = fatherrow.id;
        var cur_table = $detail.html('<table></table>').find('table');
        $(cur_table).bootstrapTable({
            data: getfaehrtsondata(fatherid),
            clickToSelect: true,
            detailView: false,//父子表
            uniqueId: "id",
            pageSize: 10,
            pageList: [10, 25],
            columns: createCols(params,titles,hasCheckbox),
            // //无线循环取子表，直到子表里面没有记录
            // onExpandRow: function (index, row, $Subdetail) {
            //     oInit.InitSubTable(index, row, $Subdetail);
            // }
        });
    }

    //可发送给服务端的参数：limit->pageSize,offset->pageNumber,search->searchText,sort->sortName(字段),order->sortOrder('asc'或'desc')
    function queryParams(params) {
        return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset  //页码
            //name: $("#txt_name").val()//关键字查询
        };
    }
    // 传'#table'
    createBootstrapTable = function (table,url,params,titles,hasCheckbox,toolbar) {
        init(table,url,params,titles,hasCheckbox,toolbar);
    }
})();
//查看操作
function View(Id) {
    alert("查看操作，ID：" + Id);
}
//编辑操作
function Edit(Id){
    alert("编辑操作，ID：" + Id);
}
//删除操作
function Delete(Id) {
    if (confirm("确定删除ID：" + Id + "吗？"))
    {
        alert("执行删除操作");
    }
}





