import axios from '@/axios'
import apiUrl from '../urls/article'


export function getArticleList(request) {
    return axios.request({
        url: apiUrl.article,
        method: 'POST',
        data: request
    })
}