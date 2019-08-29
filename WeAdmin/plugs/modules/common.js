//公共方法模块
layui.define(['jquery', 'layer', 'table', 'upload', 'element'], function (exports) {
    'use strict';

    var $ = layui.jquery,
        layer = layui.layer,
        upload = layui.upload,
        element = layui.element,
        table = layui.table;

    var util = {};

    /* 显示 dot 模板语法
    * 需要在页面中引入 dot.js 
    * tpldom 模板dom
    * dom 容器dom
    * data 数据
    */
    util.showTpl = function (tpldom, dom, data) {
        if ($(tpldom)[0]) {
            var interText = doT.template($(tpldom).text());
            $(dom).html(interText(data));
        }
    };

    //添加 dot 模板语法
    util.addTpl = function (tpldom, dom, data) {
        if ($(tpldom)[0]) {
            var interText = doT.template($(tpldom).text());
            $(dom).append(interText(data));
        }
    };

    //特殊字符串替换
    util.N = function (str) {
        if (typeof (str) === 'undefined' || str === null) return '';
        str = ('' + str).replace(/null/g, '');
        str = $.trim(str);
        return str;
    };

    // ajax 请求
    util.ajax = function (obj) {
        if (typeof (obj.url) === 'undefined' || obj.url == '') {
            throw new Error('请求地址未设置');
        }
        var layerLoad = undefined;
        if (obj.showLoad !== false) {
            // layerLoad = layer.msg('数据请求中，请稍候', { icon: 16, time: false, shade: 0.1 });
            layerLoad = layer.load(1);
        }
        //处理请求参数
        obj.data = util.dealParam(obj.data);
        //加密请求参数
        if (obj.escape === true) {
            obj.data = forEscape(obj.data);
        }
        //请求方式默认为post
        if (typeof (obj.type) === 'undefined' || obj.type == '') obj.type = 'POST';
        obj.type = obj.type.toUpperCase();
        if (obj.type == 'POST' || obj.type == 'PUT') obj.data = JSON.stringify(obj.data);
        //得到访问 Token
        var header = getUserAuthority();
        $.ajax({
            type: obj.type,
            url: $Conf.httpHeader + obj.url,
            data: obj.data,
            dataType: "json",
            headers: header,
            contentType: 'application/json; charset=utf-8',
            success: function (res) {
                if (res.Status == 3 && res.Errors.length > 0 && res.Errors[0].ErrorMessages[0] != '') {
                    layer.msg('字段：' + res.Errors[0].Field + '错误: ' + res.Errors[0].ErrorMessages[0]);
                    return false;
                }
                if (res.Status != 1) {
                    layer.msg(res.Message, function () {
                        //没有登录
                        if (res.Status == -1) {
                            util.addSession({ name: 'userSessionInfo', info: null });
                            util.addSession({ name: 'userAuthority', info: null });
                            window.parent.location.href = '../../pages/main/login.html';
                        }
                    });
                    if (typeof (obj.errorBack) === 'function') { obj.errorBack(res); }
                    return false;
                }
                if (typeof (obj.callback) === 'function') obj.callback(res);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //token过期
                if (XMLHttpRequest.status == 401) {
                    layer.msg('授权已过期，请重新登录', { time: 4000 }, function () {
                        util.addSession({ name: 'userSessionInfo', info: null });
                        util.addSession({ name: 'userAuthority', info: null });
                        window.parent.location.href = '../../pages/main/login.html';
                    });
                };
                if (XMLHttpRequest.responseText != '') {
                    layer.msg(JSON.parse(XMLHttpRequest.responseText).Message);
                }
                console.error(XMLHttpRequest.responseText);
                if (typeof (obj.errorBack) == 'function') {
                    obj.errorBack(JSON.parse(XMLHttpRequest.responseText));
                }
            },
            complete: function (XHR, TS) {
                setTimeout(function () {
                    layer.close(layerLoad);
                }, 500);
            }
        });
    };

    //时间戳转文字
    util.formatUnixDate = function (shijianchuo, type) {
        if (!shijianchuo && type === '--') return '--';
        if (!shijianchuo) return '';
        shijianchuo = parseInt(shijianchuo);
        shijianchuo = isNaN(shijianchuo) ? 0 : shijianchuo;
        if (shijianchuo < 1)
            return '--';
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        var add0 = function (m) {
            return m < 10 ? '0' + m : m;
        };
        if (type == 'minDay') return y + '-' + add0(m) + '-' + '01';
        if (type == 'year') return y + '-' + add0(m) + '-' + add0(d);
        if (type == 'time') return add0(h) + ':' + add0(mm);
        if (type == 'second') return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm);
    };

    //写入Cookie缓存 时间以秒计算
    util.addStorage = function (obj) {
        //如果不规定生命周期 默认一年
        if (!obj.livetime) { obj.livetime = 60 * 60 * 24 * 365; }
        var msg = {
            info: obj.info,
            time: new Date().getTime(),
            livetime: obj.time
        };
        localStorage[obj.name] = JSON.stringify(msg);
    };

    //取Cookie缓存
    util.getStorage = function (name) {
        var msg = null;
        if (typeof (localStorage[name]) == 'undefined' || localStorage[name] === null || localStorage[name] == 'null') {
            return null;
        } else {
            msg = JSON.parse(localStorage[name]);
            if (!msg.info || msg.info === null || msg.info.length === 0) return null;
        }
        if (msg.time + msg.livetime * 1000 < new Date().getTime()) return null;
        return msg.info;
    };

    //写入session缓存 时间以秒计算
    util.addSession = function (obj) {
        var msg = {
            info: obj.info,
            time: new Date().getTime(),
            livetime: obj.time
        }
        sessionStorage[obj.name] = JSON.stringify(msg);
    };

    //取session缓存
    util.getSession = function (name) {
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
    };

    //保留2位小数
    util.tofixed = function (info, num) {
        if (typeof (info) === 'undefined' || info == '') return 0;
        info = parseFloat(info);
        if (isNaN(info)) return 0;
        if (!num) num = 2;
        return info.toFixed(num);
    };

    /** 
     * 获取指定的URL参数值 
     * 参数：paramName URL参数 
     * 调用方法:getUrlParam("name") 
     */
    util.getUrlParam = function (paramName) {
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
    };

    //获取到列表数据并显示到页面
    util.showTableList = function (obj) {
        var option = obj.data;
        if (!option.PageSize) option.PageSize = $Conf.pages;
        if (!option.ajaxType) option.ajaxType = 'post';
        var ajaxType = option.ajaxType;
        var ajaxUrl = option.url;
        //处理请求参数
        var ajaxData = util.dealParam(option);
        //得到访问 Token
        var header = getUserAuthority();
        var tableIns = table.render({
            id: obj.id,
            elem: obj.elem,
            toolbar: obj.toolbar,
            defaultToolbar: obj.defaultToolbar,
            loading: false,
            url: $Conf.httpHeader + ajaxUrl,
            method: ajaxType,
            headers: header,
            limit: option.PageSize,
            contentType: 'application/json; charset=utf-8',
            where: ajaxData,
            request: {
                pageName: 'PageIndex',
                limitName: 'PageSize'
            },
            response: {
                statusCode: 1
            },
            parseData: function (res) { //res 即为原始返回的数据
                if (res.Status === 1) {
                    return {
                        "code": res.Status,
                        "msg": res.Message,
                        "count": res.Data.TotalItemCount,
                        "data": res.Data.Items
                    };
                }
                return {
                    "code": res.Status,
                    "msg": res.Message
                };
            },
            page: {
                layout: ['prev', 'page', 'next', 'skip', 'count']
            },
            cols: [obj.cols],
            done: function (res, curr, count) { //数据渲染完的回调
                if (typeof (obj.callback) === 'function') {
                    obj.callback(res, tableIns);
                }
            }
        });

    };

    // 显示弹框
    util.showPopup = function (obj) {
        obj.type = parseInt(obj.type);
        obj.type = isNaN(obj.type) ? 1 : obj.type;
        //拼接参数
        if (obj.type === 2) {
            if (typeof (obj.params) === 'undefined') obj.params = {};
            if (getLength(obj.params) > 0) {
                var paramStr = '';
                for (var key in obj.params) {
                    paramStr += key + '=' + obj.params[key] + '&';
                }
                if (obj.url.indexOf('?') == -1) {
                    obj.url += '?' + paramStr;
                } else {
                    obj.url += '&' + paramStr;
                }
                obj.url = obj.url.substring(0, obj.url.length - 1);
            }
        }
        var index = layer.open({
            title: obj.title,
            type: obj.type,
            area: ['85%', '85%'],
            content: obj.type === 2 ? obj.url : obj.dom,
            success: function (layero, index) {
                // setTimeout(function () {
                //     layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                //         tips: 3
                //     });
                // }, 500);
                //弹出回调
                if (typeof (obj.popupBack) === 'function') obj.popupBack(layero, index);
            },
            yes: function (index, layero) {
                //确定按钮回调
                if (typeof (obj.yesBack) === 'function') obj.yesBack(layero, index);
            },
            cancel: function (index, layero) {
                //取消按钮回调
                if (typeof (obj.cancelBack) === 'function') obj.cancelBack(layero, index);
            },
            end: function (index, layero) {
                //销毁回调
                if (typeof (obj.endBack) === 'function') obj.endBack(layero, index);
            }
        });
        // layer.full(index);
        // //改变窗口大小时，重置弹窗的宽高，防止超出可视区域
        // $(window).on("resize", function () {
        //     layer.full(index);
        // });
    };

    //上传文件
    util.uploadFile = function (obj) {
        var layerLoad = undefined;
        //得到访问 Token
        var header = getUserAuthority();
        upload.render({
            elem: obj.elem,
            url: $Conf.httpHeader + '/api/File/UploadAttachment',
            headers: header,
            size: obj.size ? parseInt(obj.size) : 0,
            before: function (obj) {
                // layerLoad = layer.msg('上传中，请稍候', { icon: 16, time: false, shade: 0.1 });
                layerLoad = layer.load(1);
            },
            done: function (res, index, upload) {
                layer.close(layerLoad);
                if (res.Status === 1) {
                    if (typeof (obj.callback) === 'function') obj.callback(res, index, upload);
                } else {
                    layer.msg(res.Message);
                    if (typeof (obj.errorBack) === 'function') { obj.errorBack(res, index, upload); }
                }
            },
            error: function (index, upload) {
                layer.close(layerLoad);
                if (typeof (obj.errorBack) === 'function') obj.errorBack(index, upload);
            }
        });
    };

    //刷新页面
    util.reloadForm = function (message) {
        if (typeof (message) == "undefined") {
            message = "操作成功";
        }
        layer.msg(message, { time: 1500 }, function () {
            parent.layer.closeAll();
            var w = parent.window == top.window ? window : parent.window;
            w.location.reload();
        });
    };

    //获取form表单数据
    util.getFormInfo = function (elem) {
        var info = {};
        //处理空格变为+号问题
        var data = $(elem).serialize().replace(/\+/g, " ").replace(/\&/g, 'bwduan');
        //防止中文乱码
        data = decodeURIComponent(data, true);
        data = data.split(/bwduan/g);
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                var index = parseInt(data[i].indexOf('='));
                var key = data[i].substring(0, index);
                var val = data[i].substring(index + 1);
                //名字相同的用逗号隔开
                if (getLength(info[key]) > 0) {
                    info[key] = info[key] + ',' + val;
                } else {
                    info[key] = val;
                }
            }
        }
        return info;
    };


    util.exportFile = function (obj) {
        if (typeof (obj.url) === 'undefined' || obj.url == '') {
            throw new Error('请求地址未设置');
        }
        var layerLoad = undefined;
        if (obj.showLoad !== false) {
            // layerLoad = layer.msg('数据请求中，请稍候', { icon: 16, time: false, shade: 0.1 });
            layerLoad = layer.load(1);
        }
        //处理请求参数
        obj.data = util.dealParam(obj.data);
        //导出数据不分页
        obj.data.IsPaged = false;
        //加密请求参数
        if (obj.escape === true) {
            obj.data = forEscape(obj.data);
        }
        //请求方式默认为post
        if (typeof (obj.type) === 'undefined' || obj.type == '') obj.type = 'POST';
        obj.type = obj.type.toUpperCase();
        if (obj.type == 'POST' || obj.type == 'PUT') obj.data = JSON.stringify(obj.data);
        //得到访问 Token
        var header = getUserAuthority();
        //请求数据
        var xhr = new XMLHttpRequest();
        xhr.open(obj.type, $Conf.httpHeader + obj.url, true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.setRequestHeader("Accept", "application/json,text/javascript");
        xhr.setRequestHeader("Authorization", header.Authorization);
        xhr.setRequestHeader("CityIdentity", header.CityIdentity);
        xhr.setRequestHeader("ClientType", header.ClientType);
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                layer.close(layerLoad);
                if (xhr.response.byteLength === 0) {
                    layer.msg('下载数据为空');
                    return false;
                }
                var blob = new Blob([xhr.response], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
                });
                saveAs(blob, new Date().getTime() + '.xlsx');
                // if (typeof (obj.callback) === 'function') { obj.callback(xhr.response); }
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                layer.close(layerLoad);
                layer.msg('network error');
            }
        };
        xhr.send(obj.data);
    };

    //处理请求参数
    util.dealParam = function (obj) {
        if (typeof (obj) === 'undefined' || obj === null) return {};
        if (typeof (obj) === 'string') {
            try {
                obj = JSON.parse(obj);
            } catch (e) {
                throw new Error('处理请求参数出错：' + e);
            }
        }
        var delParams = ['url', 'ajaxType'];
        for (var i in obj) {
            var item = obj[i];
            if (delParams.indexOf(i) != -1) item = null;
            if (typeof (item) === 'undefined') item = null;
            if (typeof (item) === 'string') {
                item = item.replace(/undefined/g, '');
                item = $.trim(item);
                // if (item == '') item = null;
            }
            if (typeof (item) === 'number' && isNaN(item)) item = 0;
            if (typeof (item) == 'object' && JSON.stringify(item) == "{}") item = null;
            if (item == null) { delete obj[i]; continue; }
            obj[i] = item;
        }
        return obj;
    };

    //格式化结束时间
    util.formatEndDate = function (time) {
        time = (time || '').replace(new RegExp('-', 'g'), '/');
        var dateTime = new Date(time);
        var add0 = function (m) {
            return m < 10 ? '0' + m : m;
        };
        var y = dateTime.getFullYear();
        var m = dateTime.getMonth() + 1;
        var d = dateTime.getDate();
        var h = dateTime.getHours();
        var mm = dateTime.getMinutes();
        var s = dateTime.getSeconds();
        if (h === 0 && mm === 0 && s === 0) {
            return (y + '-' + add0(m) + '-' + add0(d) + ' 23:59:59');
        }
        return time;
    }




















    //对提交的字符串进行转码
    function forEscape(obj) {
        if (typeof (obj) === 'string') return escape(obj);
        for (var i in obj) {
            if (typeof (obj[i]) == 'string') {
                obj[i] = escape(obj[i]);
            } else {
                obj[i] = forEscape(obj[i]);
            }
        }
        return obj;
    };

    //获取对象长度
    function getLength(obj) {
        var n = 0;
        for (var i in obj) { n++; }
        return n;
    };

    //得到用户权限
    function getUserAuthority() {
        var token = util.getSession('userAuthority');
        var CityIdentity = util.getSession('CityIdentity');
        return {
            Authorization: 'Bearer ' + token,
            ClientType: 'Phone',
            CityIdentity: CityIdentity || 'CTU'
        };
    }







    exports('common', util);
});