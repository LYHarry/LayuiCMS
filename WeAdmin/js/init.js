"use strict"

//创建 加载 loading 层
var body = document.getElementsByTagName('body')[0];
var loading = document.createElement('div');
loading.id = 'init-loading';
loading.innerHTML = '<div style="z-index:19891028;background-color:#333;opacity:0.1;width:100%;height:100%;position:fixed;top:0;left:0;pointer-events:auto;"></div>';
loading.innerHTML += '<img style="z-index:19891029;width:34px;position:absolute;left:49%;top:48%" src="../../images/load.gif" />';
body.insertBefore(loading, body.children[0]);

//加载页面所需 css(后加载样式会造成页面闪烁)
// loadCss('../../css/weadmin.css');
// loadCss('../../css/init.css');
// loadCss('../../plugs/layui/css/layui.css');

//加载 layui 基础插件
const loadJsArr = ['../../plugs/layui/layui.js', '../../js/config.js'];
loadJsArr.map(function (url) {
    loadJS(url, init);
});

//加载页面所需 js
window.onload = function () {
    //延时加载 layui 配置文件
    loadJS('../../js/layui.conf.js', init);
    var thisHtml = GetPagePath().replace('.html', '');
    loadJS('../../js/' + thisHtml + '.js', init);
};


//引入 css
function loadCss(url, callback) {
    var head = document.getElementsByTagName('head');
    if (head && head.length) {
        head = head[0];
    } else {
        head = document.body;
    }
    var link = document.createElement('link');
    link.rel = "stylesheet";
    link.onload = link.onreadystatechange = function () {
        if ((!this.readyState) || this.readyState == "complete" || this.readyState == "loaded") {
            if (callback) callback();
        }
    };
    link.href = url;
    head.appendChild(link);
}

//引入 js
function loadJS(url, callback) {
    var body = document.body;
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.onload = script.onreadystatechange = function () {
        if ((!this.readyState) || this.readyState == "complete" || this.readyState == "loaded") {
            if (typeof (callback) === 'function') callback();
        }
    };
    script.src = url.replace('//', '/') + '?r=' + (new Date()).getTime();
    body.appendChild(script);
}


var loadJsIndex = 0;
//初始化页面
function init() {
    loadJsIndex = loadJsIndex + 1;
    if (loadJsIndex == loadJsArr.length + 2) {
        //判断用户是否登录
        if (verifyLogin() !== true) return false;
        //移除初始化加载动画
        setTimeout(function () {
            document.getElementById('init-loading').remove();
        }, 500);
    }
}

//验证用户登陆
function verifyLogin() {
    var userInfo = getSession('userSessionInfo');
    if ((typeof (IS_LOGIN) == 'undefined' || IS_LOGIN === false) && (userInfo === null)) {
        top.location.href = '../../pages/main/login.html'
        return false;
    }
    return true;
}

//得到当前页面路径
function GetPagePath() {
    var url = window.location.pathname;
    var tmp = url.split("?");
    url = tmp[0];
    tmp = url.split("/");
    tmp = tmp.slice(tmp.length - 2);
    return tmp.join('/');
}


//得到页面 url 参数
function getUrlParam(paramName) {
    var paramValue = "";
    var url = window.location.search;
    if (url.indexOf("?") == 0 && url.indexOf("=") > 1) {
        var arrSource = unescape(url).substring(1, url.length).split("&");
        for (var i = 0; i < arrSource.length; i++) {
            if (arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
                paramValue = arrSource[i].split("=")[1];
            }
        }
    }
    return paramValue == "" && (paramValue = null), paramValue
}


//写入session缓存 时间以秒计算
function addSession(obj) {
    var msg = {
        info: obj.info,
        time: new Date().getTime(),
        livetime: obj.time
    }
    sessionStorage[obj.name] = JSON.stringify(msg);
}

//取session缓存
function getSession(name) {
    var data = sessionStorage[name];
    if (typeof (data) === 'undefined' || data == null) {
        return null;
    }
    var msg = JSON.parse(data);
    if (!msg.info || msg.info === null || msg.info.length === 0) {
        return null;
    }
    if (msg.livetime) {
        if (msg.time + msg.livetime * 1000 < new Date().getTime()) return null;
    }
    return msg.info;
}