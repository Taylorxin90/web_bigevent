// 注意：每次调用$.ajax或$.post或$.get 的时候，
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // options是调ajax传递的配置对象

    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);

    // 统一为有权限的接口，设置headers 请求头

    // 如果url里面包含 '/my/'说明是有权限请求 就配置headers文件
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 无论成功还是失败都会调用complete函数
    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        console.log(res);
        // 在complete回调函数中，可以使用res.responseJSON 拿到服务器相应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.强制跳转到登录页
            location.href = '/login.html';
        }
    }

});