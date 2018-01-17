$(document).ready(function() {
    $('#animate').addClass('flipInX' + ' animated infinite');//给DIV添加动画效果
    setTimeout(function () {
        $('#animate').removeClass('flipInX' + ' animated infinite')
    },1000);//持续一秒去掉动画效果
});


/**
 * 表单验证神器
 */
$('#LogInForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: '此值无效',
                validators: {
                    notEmpty: {
                        message: '用户名不能为空。'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '用户名必须大于6，长度小于30个字符。'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: '用户名只能由字母、数字组成。'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空。'
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

            //获取数据
            var username =  $('#username').val();
            var password =  $('#password').val();
            var UUID = uuid(8,16);

            //json字符串构造
            var datarow = {};
            datarow.username = username;
            datarow.password = password;
            datarow.uuid = UUID;
            var reqdata = [];
            reqdata.push(datarow);
            var JsonData = JSON.stringify(reqdata);
            // console.log("JSON--->"+JsonData);

            ShowLoading();
            socket.emit(LOGIN,JsonData);//发送服务器消息
            socket.on('listen'+LOGIN,function (resdata) {//接受（监听）消息
                if(UUID == DocJson(resdata,'uuid')){//判断是否是自己访问的UUID
                    if(DocJson(resdata,'Code') == '0'){//正确
                        var Message = DocJson(resdata,'Message');
                        // ShowAlert(
                        //     "账号："+DocJson(Message,"username")+'</br>'+
                        //     "密码："+DocJson(Message,"password")+'</br>'+
                        //     "邮箱："+DocJson(Message,"email")+'</br>'
                        //  );
                        SetVal("username",DocJson(Message,"username"));
                        SetVal("password",DocJson(Message,"password"));
                        SetVal("email",DocJson(Message,"email"));
                        OpenUrl("HotelMain.html");
                    }else{//错误
                        ShowAlert2(DocJson(resdata,'Message'),2);//提示错误
                    }
                }
                HideLoading();
            });
            //数据后台验证
           // $('#LogInForm').bootstrapValidator('disableSubmitButtons', false);//使按钮重新可以点击
        });



