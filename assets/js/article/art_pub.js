$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();


    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }
                // layer.msg('初始化文章分类成功！');

                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                // 填充到select里面去
                $('[name=cate_id]').html(htmlStr);
                // 为了让layui监听到加的可选项动作，填充好以后一定要调用form.render方法
                // 一定要记得调用form.render方法
                form.render();
            }
        });
    }

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件处理
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    // 监听 coverFile 的 change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 1.拿到用户选择的文件
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 2.根据选择的文件，创建一个对应的 URL 地址：
        var imgURL = URL.createObjectURL(files[0]);
        // 3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

        // 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    })

    // 定义文章的发布状态 默认已发布
    var art_status = '已发布';

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        // 改变状态
        art_status = '草稿';
    });

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.  阻止表单的默认提交
        e.preventDefault();
        // 2.基于form表单快速创建formdata对象
        var fd = new FormData($(this)[0]);

        // 追加status 
        // 3.将文章的发布状态，存到 fd 中 
        fd.append('state', art_status);
        // 循环formdata中所存的每一个键和值
        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })

        // 4.将封面裁剪过后的图片 输出为一个文件的对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象，存储 到 fd中
                fd.append('cover_img', blob);
                // 6.发起 ajax 数据请求
                // publishArticle发表文章
                publishArticle(fd);
            })
    });

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        // 发送请求
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData格式的数据
            // 必须添加以下两个配置项 不加这两个一定会失败
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        });
    }

});