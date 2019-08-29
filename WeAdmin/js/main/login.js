var IS_LOGIN = true;

layui.use(['form', 'admin', 'common'], function () {
    var form = layui.form,
        $bw = layui.common,
        $ = layui.jquery;

    $(function () {
        //验证登陆
        var userInfo = getSession('userSessionInfo');
        if (userInfo !== null) {
            top.location.href = '../../pages/main/index.html'
            return false;
        }
        //验证码图片点击事件
        $('#codeImg').on('click', function () {
            $(this).attr({
                'src': '../../images/load.gif',
                'style': ''
            });
            getVerImg();
        });

        $('#codeImg').click();

    });

    //监听提交
    form.on('submit(login)', function (data) {
        $bw.ajax({
            url: '/api/Users/SignIn',
            data: data.field,
            callback: function (res) {
                //写入用户登录信息
                $bw.addSession({ name: "userSessionInfo", info: res.Data });
                $bw.addSession({ name: 'userAuthority', info: res.Data.AccessToken });
                top.location.href = '../../pages/main/index.html'
            }
        });
        return false;
    });


    function getVerImg() {
        $bw.ajax({
            type: 'get',
            url: "/api/Captcha/Image",
            showLoad: false,
            callback: function (res) {
                $('#captchaId').val(res.Data.CaptchaGuidResult);
                $('#codeImg').attr('src', "data:image/png;base64," + res.Data.CaptchaImgResult);
                $('#codeImg').prop("style", "width: 100%;height: 100%");
            }
        });
    }


});   