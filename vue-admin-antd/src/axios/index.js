// import config from '@/config'
import AxiosHttpRequest from './api.request'

// let baseUrl = config.baseUrl.dev;
// if (process.env.NODE_ENV === 'testing')
//     baseUrl = config.baseUrl.test;
// if (process.env.NODE_ENV === 'production')
//     baseUrl = config.baseUrl.pro;

var httpRequest = new AxiosHttpRequest({
    baseURL: '' //baseUrl
});

//得到分页列表数据
httpRequest.getPagingData = function (params) {
    params.data = Object.assign({
        PageIndex: 1,
        PageSize: 10
    }, params.data);
    return httpRequest.request(params);
};

export default httpRequest;