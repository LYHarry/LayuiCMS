import axios from "axios"
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import cache from '@/libs/cache'
import { ACCESS_TOKEN, LOGIN_USER_INFO } from '@/store/mutation-types'

//axios http 请求工具类
class AxiosHttpRequest {
    //构造方法(初始化 axios 配置)
    constructor(options) {
        //默认配置
        const config = {
            //接口基础地址
            baseURL: '',
            //默认请求头
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            //表示跨域请求时是否需要使用凭证
            withCredentials: true,
            //指定请求超时的毫秒数(0 表示无超时时间)
            timeout: 5000,
            //允许的响应内容的最大长度
            maxContentLength: 5000,
            //超时重试次数
            retry: 3,
            //超时重试间隔时间(毫秒)
            retryDelay: 2000,
        };
        this.AxiosConfig = Object.assign(config, options);
    };

    //拦截器
    interceptors(instance) {
        // 请求拦截器(处理请求配置)
        instance.interceptors.request.use(config => {
            config.method = config.method.toUpperCase();
            // 添加全局的 loading 提示
            if (config.showLoading === true) {
                message.loading('loading...', 0);
            }
            //请求参数处理
            if (config.method === 'POST') {
                config.data = config.data || config.params || undefined;
                if (config.params) delete config.params;
            }
            if (config.method === 'GET') {
                config.params = config.params || config.data || undefined;
                if (config.data) delete config.data;
            }
            //添加接口访问权限 token
            const token = cache.get(ACCESS_TOKEN);
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, error => {
            console.log('request error ', error)
            return Promise.reject(error);
        });

        // 响应拦截器(处理响应数据)
        instance.interceptors.response.use(response => {
            // 移除全局的 loading 提示
            if (response.config.showLoading === true) {
                message.destroy()
            }
            const resData = response.data || {};
            if (response.status === 200 && resData.serveStatus === 200 && resData.status === 1) {
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
        return false;
    };

    //axios请求超时重试配置
    async timeOutRetry(error) {
        let config = Object.assign(this.AxiosConfig, error.config);
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
        const instance = axios.create(this.AxiosConfig);
        this.interceptors(instance);
        return instance(options);
    };

    //解析错误的响应结果
    parseErrorResult(response) {
        if (!response) {
            notification.error({ message: '错误', description: '响应结果为空' });
            return Promise.reject('响应结果为空');
        }
        const resData = response.data || {};
        //只解析错误的响应结果，成功则返回
        if (response.status === 200 && resData.serveStatus === 200 && resData.status === 1)
            return Promise.resolve(resData);
        //返回 blob 数据
        if (response.status === 200 && response.config.responseType === 'blob') {
            if (!(resData.type && resData.type === 'application/json')) {
                return Promise.resolve(response);
            }
        }
        //401 未登录/登录失效
        if (response.status === 401 || resData.serveStatus === 401) {
            notification.error({ message: '提示', description: '登录失效,请重新登录！' });
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
        if (response.status === 417 || resData.serveStatus === 417) {
            var oneError = (resData.data || []).shift();
            resData.msg = oneError.messages.join('')
        }
        //TODO 其他状态判断 比如 500、404
        let msg = resData.msg || resData.message || '网络异常，请稍后重试！';
        notification.error({ message: '错误', description: msg });
        return Promise.reject(msg);
    }

}

export default AxiosHttpRequest;