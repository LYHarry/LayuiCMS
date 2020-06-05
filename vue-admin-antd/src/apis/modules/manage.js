import axios from '@/axios'
import apiUrl from '../urls/manage'


export function getRoleList(parameter) {
    return request({
        url: apiUrl.role,
        method: 'get',
        params: parameter
    })
}

export function getServiceList(parameter) {
    return request({
        url: apiUrl.service,
        method: 'get',
        params: parameter
    })
}