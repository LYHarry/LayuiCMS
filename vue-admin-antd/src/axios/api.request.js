import axios from "axios"

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
            return config;
        }, error => {
            return Promise.reject(error);
        });

        // 响应拦截器(处理响应数据)
        instance.interceptors.response.use(response => {
            // 移除全局的 loading 提示
            if (this.RequestConfig.showLoading === true) {
                // TODO loading 提示
            }
            if (response.status !== 200) {
                throw new Error('网络异常，请稍后重试！');
            }
            //TODO 其他状态判断 比如 401、500、404
            return response.data;
        }, error => {
            return this.timeOutRetry(error);
        });
    };

    //超时重试条件，默认只要是错误都重试
    shouldRetry(error) {
        return true;
    };

    //axios请求超时重试配置
    async timeOutRetry(error) {
        var config = error.config;
        if (!(config && config.retry)) {
            return Promise.reject(error);
        }
        config.retry = parseInt(config.retry);
        if (isNaN(config.retry) || config.retry < 1) {
            return Promise.reject(error);
        }
        if (!this.shouldRetry(error)) {
            return Promise.reject(error);
        }
        config.retryCount = config.retryCount || 0;
        if (config.retryCount >= config.retry) {
            return Promise.reject(error);
        }
        console.log(`${config.url} time out retry count: ${config.retryCount}`);
        config.retryCount += 1;
        //创建新的Promise来处理重新请求的间隙
        var backoff = new Promise(resolve => {
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

}

export default AxiosHttpRequest;