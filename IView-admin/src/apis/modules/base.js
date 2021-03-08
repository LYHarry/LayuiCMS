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
    getSystemMenu: () => {
        return axios.request({
            url: apiUrl.systemMenu,
            method: 'get'
        })
    },
    saveErrorLogger: (info) => {
        return axios.request({
            url: apiUrl.saveErrorLogger,
            data: info,
            method: 'post'
        })
    },
    errorReq: () => {
        return axios.request({
            url: apiUrl.error_url,
            method: 'post'
        })
    },
    getOrgData: () => {
        return axios.request({
            url: apiUrl.getOrgData,
            method: 'get'
        })
    },
    uploadImg: formData => {
        return axios.request({
            method: 'post',
            url: apiUrl.uploadImg,
            data: formData
        })
    },
    getTableData: () => {
        return axios.request({
            url: apiUrl.getTableData,
            method: 'get'
        })
    },
    getTreeSelectData: () => {
        return axios.request({
            url: apiUrl.getTreeSelectData,
            method: 'get'
        })
    },
    getDragList: () => {
        return axios.request({
            url: apiUrl.getDragList,
            method: 'get'
        })
    }

}