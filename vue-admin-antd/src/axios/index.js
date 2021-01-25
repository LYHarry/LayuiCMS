import AxiosHttpRequest from './api.request'
import config from '@/config'

var httpRequest = new AxiosHttpRequest({
    baseURL: envConfig.BASE_URL
});

//得到分页列表数据
httpRequest.getPagingData = (params) => {
    return new Promise((resolve, reject) => {
        //处理默认参数
        params = Object.assign({ method: 'POST' }, params);
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

//导出数据
httpRequest.exportData = (params) => {
    return new Promise((resolve, reject) => {
        //处理默认参数
        params = Object.assign({ method: 'POST', responseType: 'blob', showLoading: true }, params);
        httpRequest.request(params).then(res => {
            //得到文件名称
            const getFileName = (res) => {
                if (params.fileName) return params.fileName;
                try {
                    let contentDis = (res.headers['content-disposition'] || '').split(';');
                    let fileName = contentDis.find(item => item.indexOf('filename=') > 0);
                    fileName = (fileName || '').split('=')[1].split('.')[0];
                    if (fileName) return fileName;
                } catch (error) {
                    console.error('exportData.fileName.error ', error)
                }
                return new Date().getTime();
            };
            //下载后文件名
            const fileName = getFileName(res) + '.xlsx';
            //创建下载 a dom
            let link = document.createElement("a");
            // 不支持a标签download的浏览器
            if (!('download' in link) || 'msSaveOrOpenBlob' in navigator) {
                navigator.msSaveOrOpenBlob(new Blob([res.data]), fileName)
                return resolve(true);
            }
            link.href = window.URL.createObjectURL(new Blob([res.data])); //创建下载链接
            link.download = fileName
            link.style.display = 'none'
            document.body.appendChild(link); //添加创建的节点
            link.click(); //点击下载
            //下载完成移除元素
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href); //释放掉blob对象
            resolve(true)
        }).catch(e => reject(e))
    })
}

export default httpRequest;