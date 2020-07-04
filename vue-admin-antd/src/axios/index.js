import AxiosHttpRequest from './api.request'

var httpRequest = new AxiosHttpRequest({
    baseURL: envConfig.BASE_URL
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