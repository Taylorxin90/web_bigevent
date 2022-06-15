$(function () {
    // 调用getUserInfo 获取用户基本信息
    getUserInfo();

    var layer = layui.layer;
    // 点击按钮，实现退出功能
    $("#btnLogout").on("click", function () {
        // console.log(11);
        // layui中提供了弹出选项框
        // 提示用户是否退出
        // 参数1  数组内容，参数2 对象图标，title 对象3回调函数
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // layer.close(login.html);
            // console.log('ok');
            // 重新跳转到登录页面并且清空token
            // 1.清空本地存储中的token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面 
            location.href = "/login.html";
            // 官方体要带着，关闭对应的弹出层
            // 关闭 confirm 询问框
            layer.close(index);
        });
    });
});

// 获取用户基本信息
function getUserInfo() {
    // 发起请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     // 通过键名获取，如果没有就是空字符串
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }

            // layui.layer.msg('登录成功！');
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        }
        // 无论成功还是失败都会调用complete函数
        // complete: function (res) {
        //     console.log(res);
        // 在complete回调函数中，可以使用res.responseJSON 拿到服务器相应回来的数据
        // if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        // 1.强制清空token
        // localStorage.removeItem('token');
        // 2.强制跳转到登录页
        //         location.href = '/login.html';
        //     }
        // }
    });
}


// 渲染头像的方法放到一个单独的方法中
function renderAvatar(user) {
    // 1.指定获取用户的名称
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $("#welcome").html('欢迎&nbsp&nbsp' + name);
    // 3.渲染用户的头像 
    if (user.user_pic !== null) {
        // 3.1渲染图片图像
        // $(".userinfo .layui-nav-img").show();
        // $(".userinfo .text-avatar").hide();
        $(".layui-nav-img").attr('src', user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        // 3.2渲染文本图像
        // $(".userinfo .layui-nav-img").hide();
        // $(".userinfo .text-avatar").show();
        $(".layui-nav-img").hide();
        // 第一个字符获取出来并转为大写
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show();
    }
}