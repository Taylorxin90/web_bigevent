$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        // m = m < 10 ? '0' + m : m;
        // d = d < 10 ? '0' + d : d;
        // hh = hh < 10 ? '0' + hh : hh;
        // mm = mm < 10 ? '0' + mm : mm;
        // ss = ss < 10 ? '0' + ss : ss;

        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss;
    };

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义查询的参数对象Q,将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //默认请求页码值为1
        pagesize: 2,//每页显示几条数据，默认每页显示两条
        cate_id: '',//文章分类的id
        state: ''//文章的状态
    }

    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！');
                }
                layer.msg('获取文章列表数据成功！');
                // 通过模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
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

    // 为筛选表单绑定 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 通过选择器，拿到cate_id 的值
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 拿到值后填充到q对象对应的值里面
        // 为查询参数对象q中 对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',//分页容器的id
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            limits: [2, 3, 5, 10],
            curr: q.pagenum,//设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换的时候，触发 jump回调
            // 触发 jump 回调 的方式有两种：
            // 1.点击页码的时候，会触发 jump 回调
            // 2.只要调用了laypage.render()方法，就会触发jump回调
            jump: function (obj, first) {
                // 可以通过 first的值通过哪种方式，触发的 jump回调
                // 如果 first 的值为 true , 证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first);
                // console.log(obj.curr);
                // 把最新的页码值，赋值到q 这个查询参数对象中
                q.pagenum = obj.curr;

                // 把最新的条目数，赋值到q 这个查询对象的 pagesize属性中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表，并渲染列表
                // 这里不能直接调用，会发生死循环
                // initTable();
                if (!first) {
                    initTable();
                }
            }
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        console.log(length);
        // console.log(11);
        // 获取到文章的id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断当前这一页中，是否有剩余的数据
                    // 如果没有剩余的数据了，则让页码值-1之后，
                    // 再重新调用 initTable 方法
                    // 4

                    if (len === 1) {
                        // 如果len的值等于1 ， 证明删除完毕之后，页面上没有任何数据了
                        // 前提：页码值最小必须是 1 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }

            });

            layer.close(index);
        })


    });


    // 修改文章内容
    // 通过代理的形式，为article-edit按钮绑定点击事件
    var indexEdit = null;
    $('body').on('click', '#article-edit', function () {
        // alert(11);
        indexEdit = layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: '修改文章内容',
            content: $('#dialog-edit').html()
        });
        // 获取自定义数据
        var id = $(this).attr('data-id');
        console.log(id);

        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败！');
                }
                // layer.msg('获取文章数据成功！');
                res.data.content = delHtmlTag(res.data.content);
                form.val('form-edit', res.data);
            }
        });
    })

    // 通过代理的形式，为修改分类的表单绑定submit 事件
    // $('body').on('submit', '#form-edit', function (e) {
    //     // alert(11);
    //     e.preventDefault();
    //     var fd = new FormData($(this)[0]);
    //     fd.append('state', art_status);
    //     // 4.将封面裁剪过后的图片 输出为一个文件的对象
    //     $image
    //         .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    //             width: 400,
    //             height: 280
    //         })
    //         .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    //             // 得到文件对象后，进行后续的操作
    //             // 5.将文件对象，存储 到 fd中
    //             fd.append('cover_img', blob);
    //             // 6.发起 ajax 数据请求
    //             // publishArticle发表文章
    //             publishArticle(fd);
    //         })
    // })

    // 定义一个发布文章的方法
    // function publishArticle(fd) {
    //     // 发送请求
    //     $.ajax({
    //         method: 'POST',
    //         url: '/my/article/edit',
    //         data: fd,
    //         // 注意：如果向服务器提交的是 FormData格式的数据
    //         // 必须添加以下两个配置项 不加这两个一定会失败
    //         contentType: false,
    //         processData: false,
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg('发布文章失败！');
    //             }
    //             layer.msg('发布文章成功！');
    //             // 发布文章成功后，跳转到文章列表页面
    //             // location.href = '/article/art_list.html';
    //         }
    //     });
    // }


    // var art_status = '已发布';
    // $('#btnSave').on('click', function () {
    //     // alert(11);
    //     art_status = '草稿';
    // });

    // 去除标签的函数
    function delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, "");
    }
});