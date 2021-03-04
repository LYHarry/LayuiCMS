'use strict'

export function isIE() {
    const bw = window.navigator.userAgent
    const compare = (s) => bw.indexOf(s) >= 0
    const ie11 = (() => 'ActiveXObject' in window)()
    return compare('MSIE') || ie11
}

export const localSave = (key, value) => {
    localStorage.setItem(key, value)
}

export const localRead = (key) => {
    return localStorage.getItem(key) || ''
}