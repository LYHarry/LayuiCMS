'use strict'

const cacheUtil = {
    //添加缓存 expires 单位: 秒
    set: (key, value, expires) => {
        if (!key) {
            throw new Error('key cannot be empty');
        }
        expires = expires || (60 * 20); //默认 20 分钟
        if (!Number.isFinite(expires)) {
            throw new Error('expires must be a numeric type');
        }
        const temp = { data: value, time: Date.now(), expires: expires };
        window.localStorage.setItem(key, JSON.stringify(temp))
    },
    //得到缓存
    get: (key) => {
        if (!key) {
            throw new Error('key cannot be empty');
        }
        const cacheStr = window.localStorage.getItem(key)
        if (!cacheStr) return null;
        const temp = JSON.parse(cacheStr);
        if (!(temp && temp.data)) return null;
        if (temp.time && temp.expires) {
            if ((Date.now() - temp.time) < (temp.expires * 1000))
                return temp.data;
        }
        return null;
    },
    //删除缓存
    remove: (key) => {
        if (!key) {
            throw new Error('key cannot be empty');
        }
        window.localStorage.removeItem(key);
    },
    //删除所有缓存
    clearAll: () => {
        window.localStorage.clear();
    },


};

export default cacheUtil