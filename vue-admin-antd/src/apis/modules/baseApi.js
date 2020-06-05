import axios from '@/axios'
import baseApi from '../urls/baseApi'

export function login(request) {
    return axios.request({
        url: baseApi.Login,
        method: 'POST',
        data: request
    })
}

export function getSmsCaptcha(request) {
    return axios.request({
        url: baseApi.SendSms,
        method: 'POST',
        data: request
    })
}

export function logout() {
    return axios.request({
        url: baseApi.Logout,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}


export function get2step(request) {
    return axios.request({
        url: baseApi.twoStepCode,
        method: 'POST',
        data: request
    })
}

export function Register(request) {
    return axios.request({
        url: baseApi.Register,
        method: 'POST',
        data: request
    })
}

export function getInfo() {
    return axios.request({
        url: baseApi.UserInfo,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}


export function getSystemMenu() {
    return axios.request({
        url: baseApi.systemMenu,
        method: 'post'
    })
}