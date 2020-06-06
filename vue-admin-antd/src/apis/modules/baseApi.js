import axios from '@/axios'
import apiUrl from '../urls/baseApi'

export function login(request) {
    return axios.request({
        url: apiUrl.Login,
        method: 'POST',
        data: request
    })
}

export function getSmsCaptcha(request) {
    return axios.request({
        url: apiUrl.SendSms,
        method: 'POST',
        data: request
    })
}

export function logout() {
    return axios.request({
        url: apiUrl.Logout,
        method: 'POST',
    })
}


export function get2step(request) {
    return axios.request({
        url: apiUrl.twoStepCode,
        method: 'POST',
        data: request
    })
}

export function Register(request) {
    return axios.request({
        url: apiUrl.Register,
        method: 'POST',
        data: request
    })
}

export function getInfo() {
    return axios.request({
        url: apiUrl.UserInfo,
        method: 'post',
    })
}


export function getSystemMenu() {
    return axios.request({
        url: apiUrl.systemMenu,
        method: 'post'
    })
}