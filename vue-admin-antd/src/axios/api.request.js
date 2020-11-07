import axios from "axios"
import notification from 'ant-design-vue/es/notification'
import cache from 'store' // Cache
import { ACCESS_TOKEN, LOGIN_USER_INFO } from '@/store/mutation-types'

//axios http 请求工具类
class AxiosHttpRequest {
    //构造方法(初始化 axios 配置)
    constructor(options) {
        //默认配置
        const config = {
            //接口基础地址
            baseURL: '',
            //请求头
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            //表示跨域请求时是否需要使用凭证
            withCredentials: true,
            //指定请求超时的毫秒数(0 表示无超时时间)
            timeout: 5000,
            //允许的响应内容的最大长度
            maxContentLength: 5000,
            //是否显示请求loading
            showLoading: false,
            //超时重试次数
            retry: 3,
            //超时重试间隔时间(毫秒)
            retryDelay: 2000,
        };
        // 请求头单独处理
        if (options && options.headers && Object.keys(options.headers).length > 0) {
            for (let key in config.headers) {
                options.headers[key] = config.headers[key];
            }
        }
        this.RequestConfig = Object.assign(config, options);
    };

    //拦截器
    interceptors(instance) {
        // 请求拦截器(处理请求配置)
        instance.interceptors.request.use(config => {
            // 添加全局的 loading 提示
            if (this.RequestConfig.showLoading === true) {
                // TODO loading 提示
            }
            const reqType = config.method.toUpperCase();
            if (reqType === 'POST') {
                config.data = config.data || config.params || {}
                delete config.params
            }
            if (reqType === 'GET') {
                config.params = config.params || config.data || {}
                delete config.data
            }
            //TODO 添加接口访问 token
            // config.headers['_token'] = cache.get(ACCESS_TOKEN);
            return config;
        }, error => {
            console.log('request error ', error)
            return Promise.reject(error);
        });

        // 响应拦截器(处理响应数据)
        instance.interceptors.response.use(response => {
            // 移除全局的 loading 提示
            if (this.RequestConfig.showLoading === true) {
                // TODO loading 提示
            }
            const resData = response.data || {};
            if (response.status === 200 && resData.code === 200 && resData.success) {
                return resData;
            }
            return this.parseErrorResult(response);
        }, error => {
            console.log('response error ', error)
            return this.timeOutRetry(error);
        });
    };

    //超时重试条件，默认只要是错误都重试
    shouldRetry(error) {
        return true;
    };

    //axios请求超时重试配置
    async timeOutRetry(error) {
        let config = Object.assign(error.config, this.RequestConfig);
        if (!(config && config.retry)) {
            return this.parseErrorResult(error.response);
        }
        config.retry = parseInt(config.retry);
        if (isNaN(config.retry) || config.retry < 1) {
            return this.parseErrorResult(error.response);
        }
        //不满足重试条件
        if (!this.shouldRetry(error)) {
            return this.parseErrorResult(error.response);
        }
        config.retryCount = config.retryCount || 0;
        //已达到最大的重试次数
        if (config.retryCount >= config.retry) {
            return this.parseErrorResult(error.response);
        }
        config.retryCount += 1;
        console.log(`${config.url} time out retry count: ${config.retryCount}`);
        //创建新的Promise来处理重新请求的间隙
        const backoff = new Promise(resolve => {
            setTimeout(() => resolve(), config.retryDelay || 2000);
        });
        await backoff;
        return this.request(config);
    };

    // http 请求方法
    request(options) {
        const instance = axios.create(this.RequestConfig);
        this.interceptors(instance);
        return instance(options);
    };

    //解析错误的响应结果
    parseErrorResult(response) {
        if (!response) {
            notification.error({ message: '错误', description: '未返回响应结果' });
            return Promise.reject('未返回响应结果');
        }
        const resData = response.data || {};
        //只解析错误的响应结果，成功则返回
        if (response.status === 200 && resData.code === 200 && resData.success)
            return Promise.resolve(resData);
        //401 未登录/登录失效
        if (response.status === 401 || resData.code === 401) {
            notification.error({ message: '提示', description: '登录失效,请先登录！' });
            Promise.resolve().then(res => {
                cache.remove(ACCESS_TOKEN)
                cache.remove(LOGIN_USER_INFO)
                top.location.reload()
            });
            return false;
        }
        //405 MethodNotAllowed
        if (response.status === 405) {
            resData.msg = '接口请求类型错误'
        }
        //417 参数校验错误
        if (response.status === 417 || resData.ServeStatus === 417) {
            var oneError = (resData.Data || []).shift();
            resData.msg = `${oneError.Field}字段${oneError.Messages.join('')}`
        }
        //TODO 其他状态判断 比如 500、404、400
        let msg = resData.msg || resData.message || '网络异常，请稍后重试！';
        notification.error({ message: '错误', description: msg });
        return Promise.reject(msg);
    }

}

export default AxiosHttpRequest;