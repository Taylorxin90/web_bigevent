$(function () {
    var form = layui.form;
    var layer = layui.layer;

    // 创建自定义的验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1 ~ 6个字符之间!';
            }
        }
    });




    initUserInfo();


    // 初始化用户的信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                console.log(res);

                // 调用 form.val()快速为表单赋值
                form.val('formUserInfo', res.data);

            }
        });
    }

    // 重置表单的数据
    $("#btnReset").on("click", function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 调用initUserInfo  重新发起ajax请求拿到用户当前的信息用form.val()重新放到表单中去 
        initUserInfo();
    });


    // 监听表单的提交事件
    $(".layui-form").on("submit", function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 当前表单  快速的拿到表单里面所填写的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败！");
                }

                layer.msg("更新用户信息成功！");
                // 调用父页面中的方法，重新渲染用户的头像和用户信息
                window.parent.getUserInfo();
            }
        });
    });


});


