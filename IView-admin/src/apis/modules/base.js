import axios from '@/axios'
import apiUrl from '../urls/base'

export default {

    login: (request) => {
        return axios.request({
            url: apiUrl.Login,
            method: 'POST',
            data: request
        })
    },
    logout: () => {
        return axios.request({
            url: apiUrl.Logout,
            method: 'GET',
        })
    },
    getUnreadCount: () => {
        return axios.request({
            url: apiUrl.MessageCount,
            method: 'get'
        })
    },

}