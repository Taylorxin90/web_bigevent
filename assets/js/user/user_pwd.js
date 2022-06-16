$(function () {
    var form = layui.form;
    var layer = layui.layer;


    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // value就是你把哪个规则给文本框了，你的值可以通过value拿到
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！';
            }

        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！';
            }
        }

    });

    $(".layui-form").on("submit", function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改密码失败！');
                }

                layer.msg('修改密码成功！');
                // 转为原生的DOM元素
                // 重置表单
                $('.layui-form')[0].reset();
            }
        });
    })

});