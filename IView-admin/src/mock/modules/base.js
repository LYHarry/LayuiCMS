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

const getMessageInit = {
    type: 'get',
    url: apiUrl.getMessage,
    response: function (req) {
        let unreadList = []
        doCustomTimes(3, () => {
            unreadList.push(Mock.mock({
                title: Mock.Random.cword(10, 15),
                create_time: '@date',
                msg_id: Mock.Random.increment(100)
            }))
        })
        let readedList = []
        doCustomTimes(4, () => {
            readedList.push(Mock.mock({
                title: Mock.Random.cword(10, 15),
                create_time: '@date',
                msg_id: Mock.Random.increment(100)
            }))
        })
        let trashList = []
        doCustomTimes(2, () => {
            trashList.push(Mock.mock({
                title: Mock.Random.cword(10, 15),
                create_time: '@date',
                msg_id: Mock.Random.increment(100)
            }))
        })
        return {
            unread: unreadList,
            readed: readedList,
            trash: trashList
        }
    }
}

const removeReaded = {
    url: apiUrl.removeReaded,
    response: true
}

const restoreTrash = {
    url: apiUrl.restoreTrash,
    response: true
}

const getContentByMsgId = {
    type: 'get',
    url: apiUrl.getContentByMsgId,
    response: function (req) {
        return `<divcourier new',="" monospace;font-weight:="" normal;font-size:="" 12px;line-height:="" 18px;white-space:="" pre;"=""><div>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: medium;">这是消息内容，这个内容是使用<span style="color: rgb(255, 255, 255); background-color: rgb(28, 72, 127);">富文本编辑器</span>编辑的，所以你可以看到一些<span style="text-decoration-line: underline; font-style: italic; color: rgb(194, 79, 74);">格式</span></span></div><ol><li>你可以查看Mock返回的数据格式，和api请求的接口，来确定你的后端接口的开发</li><li>使用你的真实接口后，前端页面基本不需要修改即可满足基本需求</li><li>快来试试吧</li></ol><p>${Mock.Random.csentence(100, 200)}</p></divcourier>`
    }
}

const hasRead = {
    url: apiUrl.hasRead,
    response: true
}

export default [
    login,
    logout,
    messageCount,
    getOrgData,
    uploadImage,
    getTableData,
    getTreeSelectData,
    getDragList,
    getMessageInit,
    removeReaded,
    restoreTrash,
    getContentByMsgId,
    hasRead

]