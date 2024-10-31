import request from '@/utils/request'

// 查询档案列表
export function listArchival(query) {
    return request({
        url: '/senbei/archival/list',
        method: 'get',
        params: query
    })
}

// 查询档案详细
export function getArchival(id) {
    return request({
        url: '/senbei/archival/get/' + id,
        method: 'get'
    })
}

// 新增档案
export function addArchival(data) {
    return request({
        url: '/senbei/archival/add',
        method: 'post',
        data: data
    })
}

// 修改档案
export function updateArchival(data) {
    return request({
        url: '/senbei/archival/edit',
        method: 'post',
        data: data
    })
}

// 删除档案
export function delArchival(ids) {
    return request({
        url: '/senbei/archival/del/' + ids,
        method: 'post'
    })
}

// 获取账户列表
export function getAppList() {
    return request({
        url: '/senbei/archival/getAppList',
        method: 'get'
    })
}

// 获取房间列表
export function getRoomList() {
    return request({
        url: '/senbei/archival/getRoomList',
        method: 'get'
    })
}

// 按档案ID获取每日检查列表
export function getDailyCheckList(aid, tp) {
    return request({
        url: '/senbei/archival/getDailyCheckList/' + aid + "/" + tp,
        method: 'get'
    })
}

// 获取每日检查详情
export function getDailyCheckInfo(groupNo) {
    return request({
        url: '/senbei/archival/getDailyCheckInfo/' + groupNo,
        method: 'get'
    })
}
