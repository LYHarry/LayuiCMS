import AxiosHttpRequest from './api.request'
import config from '@/config'

var httpRequest = new AxiosHttpRequest({
    baseURL: envConfig.BASE_URL
});

//得到分页列表数据
httpRequest.getPagingData = (params) => {
    return new Promise((resolve, reject) => {
        let defaultPaged = { page: 1, pageSize: config.pageSize };
        params.data = Object.assign(defaultPaged, params.data);
        httpRequest.request(params).then(res => {
            const resData = (res && res.data) || {};
            const pagingRest = {
                Data: resData.rows || [],
                Pagination: {
                    total: resData.totalCount || 0,
                    current: resData.webPage || 1,
                    showTotal: total => `共 ${total} 条记录`,
                    pageSize: params.data.pageSize
                }
            };
            resolve(pagingRest)
        }).catch(e => reject(e))
    })
};

export default httpRequest;