layui.use(['jquery', 'admin', 'menu', 'common', 'element'], function () {
    var $ = layui.jquery,
        admin = layui.admin,
        $bw = layui.common,
        element = layui.element,
        menu = layui.menu;

    $(function () {
        menu.getMenu('../../json/menu.json');
        //显示当前登陆用户
        var userInfo = $bw.getSession('userSessionInfo');
        $('#topUserName').html(userInfo.NickName);
        element.render('nav');

        //退出
        $('.loginout').on('click', function () {
            layer.confirm('是否退出登录?', function () {
                //写入用户登录信息
                $bw.addSession({ name: "userSessionInfo", info: null });
                $bw.addSession({ name: 'userAuthority', info: null });
                layer.close();
                window.location.href = '../../pages/main/login.html';
            });
        });
    });

});