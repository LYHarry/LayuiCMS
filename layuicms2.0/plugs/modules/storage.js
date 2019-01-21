layui.define(["jquery"], function (exports) {
    'use strict';

    var $ = layui.$;
    var cache = {
        getItem: function (key) {
            var con = window.sessionStorage.getItem(key);
            con = con || '';
            try {
                return JSON.parse(con);
            } catch (error) {
                return '';
            }
        },
        removeItem: function (key) {
            window.sessionStorage.removeItem(key);
        },
        clear: function () {
            window.sessionStorage.clear();
            window.localStorage.clear();
        },
        setItem: function (key, value) {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        },
        isExist: function (key) {
            var con = window.sessionStorage.getItem(key);
            if (con) return true;
            return false;
        }

    };

    exports('storage', cache);
});
