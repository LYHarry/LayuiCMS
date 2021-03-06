import axios from '@/axios'
import apiUrl from '../urls/manage'


export function getRoleList(parameter) {
    return axios.request({
        url: apiUrl.role,
        method: 'POST',
        data: parameter
    })
}

export function getServiceList(parameter) {
    return axios.request({
        url: apiUrl.service,
        method: 'post',
        data: parameter
    })
}

export function getOrgTree(parameter) {
    return axios.request({
        url: apiUrl.orgTree,
        method: 'post',
        data: parameter
    })
}


export function uploadFile(formData) {
    return axios.request({
        url: apiUrl.uploadFile,
        method: 'post',
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
}


export function permissionNoPager(request) {
    return axios.request({
        url: apiUrl.permissionNoPager,
        method: 'post',
        data: request,
    })
}

export function permissions(request) {
    return axios.request({
        url: apiUrl.permissions,
        method: 'post',
        data: request,
    })
}