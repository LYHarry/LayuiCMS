import axios from '@/axios'
import dashboard from '../urls/dashboard'

export function searchProjects() {
    return axios.request({
        url: dashboard.projects,
        method: 'post'
    })
}

export function workplaceActivity() {
    return axios.request({
        url: dashboard.activity,
        method: 'post'
    })
}

export function workplaceTeams() {
    return axios.request({
        url: dashboard.teams,
        method: 'post'
    })
}

export function workplaceRadar() {
    return axios.request({
        url: dashboard.radar,
        method: 'post'
    })
}


