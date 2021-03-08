import Mock from 'mockjs'
import apiUrl from '@/apis/urls/base'
import { OrgData, treeData } from './data'
import { doCustomTimes } from '@/libs/utils'

const login = {
    url: apiUrl.Login,
    response: function (req) {
        const username = ['admin', 'super']
        //密码为: admin
        // const password = '21232f297a57a5a743894a0e4a801fc3';
        if (!username.includes(req.userName)) {
            return {
                code: 500,
                message: '账户或密码错误',
                data: { isLogin: false },
            }
        }
        return {
            'id': Mock.mock('@guid'),
            'name': Mock.mock('@name'),
            'username': req.userName,
            'avatar': 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',
            'token': Mock.mock('@guid')
        };
    }
}

const logout = {
    type: 'get',
    url: apiUrl.Logout,
    response: true,
}

const messageCount = {
    type: 'get',
    url: apiUrl.MessageCount,
    response: 3
}

const getOrgData = {
    type: 'get',
    url: apiUrl.getOrgData,
    response: OrgData
}

const uploadImage = {
    url: apiUrl.uploadImg,
    response: true,
}

const getTableData = {
    type: 'get',
    url: apiUrl.getTableData,
    response: function (req) {
        let tableData = []
        doCustomTimes(5, () => {
            tableData.push(Mock.mock({
                name: '@name',
                email: '@email',
                createTime: '@date'
            }))
        })
        return tableData
    }
}

const getTreeSelectData = {
    type: 'get',
    url: apiUrl.getTreeSelectData,
    response: treeData
}


const getDragList = {
    type: 'get',
    url: apiUrl.getDragList,
    response: function () {
        let dragList = []
        doCustomTimes(5, () => {
            dragList.push(Mock.mock({
                name: Mock.Random.csentence(10, 13),
                id: Mock.Random.increment(10)
            }))
        })
        return dragList
    }
}

export default [
    login,
    logout,
    messageCount,
    getOrgData,
    uploadImage,
    getTableData,
    getTreeSelectData,
    getDragList

]