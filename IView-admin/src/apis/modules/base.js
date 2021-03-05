import axios from '@/axios'
import apiUrl from '../urls/base'

export default {
    //登录
    login: (request) => {
        return axios.request({
            url: apiUrl.Login,
            method: 'POST',
            data: request
        })
    },
    //退出
    logout: () => {
        return axios.request({
            url: apiUrl.Logout,
            method: 'GET',
        })
    }

}