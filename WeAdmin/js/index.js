layui.use(['jquery', 'admin', 'menu'], function () {
    var $ = layui.jquery,
        admin = layui.admin,
        menu = layui.menu;
    $(function () {
        menu.getMenu('/json/menu.json');
        var login = JSON.parse(localStorage.getItem("login"));
        if (login) {
            if (login === 0) {
                window.location.href = '/pages/login/index.html';
                return false;
            } else {
                return false;
            }
        } else {
            window.location.href = '/pages/login/index.html';
            return false;
        }
    });
});