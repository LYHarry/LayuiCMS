import Mock from 'mockjs'

//登陆
const login = {
    url: '/auth/login',
    response: function (req) {
        console.log('req ', req)
        const username = ['admin', 'super']
        // 强硬要求 ant.design 相同密码
        // admin, ant.design
        const password = ['8914de686ab28dc22f30d3d8e107ff6c', '21232f297a57a5a743894a0e4a801fc3']
        if (req.loginType !== 2) {
            if (!(username.includes(req.username) && password.includes(req.password))) {
                return {
                    code: 401,
                    message: '账户或密码错误',
                    data: { isLogin: true },
                }
            }
        }
        return {
            'id': Mock.mock('@guid'),
            'name': Mock.mock('@name'),
            'username': 'admin',
            'password': '',
            'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
            'status': 1,
            'telephone': '',
            'lastLoginIp': '27.154.74.117',
            'lastLoginTime': 1534837621348,
            'creatorId': 'admin',
            'createTime': 1497160610259,
            'deleted': 0,
            'roleId': 'admin',
            'lang': 'zh-CN',
            'token': Mock.mock('@guid') //'4291d7da9005377ec9aec4a71ea837f'
        };
    }
}

//退出登陆
const logout = {
    url: '/auth/logout',
    response: true,
}

//得到登陆验证码
const getsms = {
    url: '/account/sms',
    response: { captcha: Mock.mock('@integer(10000, 99999)') }
}

//得到用户第二步验证
const stepcode2 = {
    url: '/auth/2stepcode',
    response: { stepCode: Mock.mock('@integer(0, 1)') }
}

//注册
const register = {
    url: '/auth/register',
    response: true
}

export default [
    login,
    logout,
    getsms,
    stepcode2,
    register
]
