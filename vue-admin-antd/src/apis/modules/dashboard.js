import axios from '@/axios'
import apiUrl from '../urls/dashboard'

export function searchProjects() {
    return axios.request({
        url: apiUrl.projects,
        method: 'post'
    })
}

export function workplaceActivity() {
    return axios.request({
        url: apiUrl.activity,
        method: 'post'
    })
}

export function workplaceTeams() {
    return axios.request({
        url: apiUrl.teams,
        method: 'post'
    })
}

export function workplaceRadar() {
    return axios.request({
        url: apiUrl.radar,
        method: 'post'
    })
}


