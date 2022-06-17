$(function () {
    var layer = layui.layer;
    var form = layui.form;

    iniArtCateList();

    // 1.获取文档分类的列表 
    function iniArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $("#btnAddCate").on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    // 通过代理的形式，为form add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        // alert(11);
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 快速获取
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }

                // 成功后，获取数据
                iniArtCateList();
                layer.msg('新增分类成功');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    });

    // 通过代理的形式，为btn-edit按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // alert(11);
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 获取自定义数据
        var id = $(this).attr('data-id');
        console.log(id);

        $.ajax({
            // method和type属性都可以 method后来才有的
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data);
            }
        });
    });


    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败！');
                }

                layer.msg('修改文章分类成功！');
                // 根据索引，关闭对应的弹出层
                layer.close(indexEdit);
                iniArtCateList();

            }
        });
    })


    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 拿到id的值
        var id = $(this).attr('data-id');
        // console.log(id);
        // 提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            // console.log(123);
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！');
                    }
                    layer.msg('删除文章分类成功！');

                    layer.close(index);
                    iniArtCateList();
                }
            });


        });
    })

});