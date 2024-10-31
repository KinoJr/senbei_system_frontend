import request from '@/utils/request'

// 查询完结档案列表
export function listCompleted(query) {
  return request({
    url: '/senbei/completed/rows',
    method: 'get',
    params: query
  })
}

// 查询完结档案详细
export function getCompleted(id) {
  return request({
    url: '/senbei/completed/get/' + id,
    method: 'get'
  })
}

// 新增完结档案
export function addCompleted(data) {
  return request({
    url: '/senbei/completed/add',
    method: 'post',
    data: data
  })
}

// 修改完结档案
export function updateCompleted(data) {
  return request({
    url: '/senbei/completed/edit',
    method: 'post',
    data: data
  })
}

// 删除完结档案
export function delCompleted(ids) {
  return request({
    url: '/senbei/completed/del/' + ids,
    method: 'post'
  })
}