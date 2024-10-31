import request from '@/utils/request'

// 查询库存记录列表
export function listStore(query) {
  return request({
    url: '/senbei/store/rows',
    method: 'get',
    params: query
  })
}

// 查询库存记录详细
export function getStore(id) {
  return request({
    url: '/senbei/store/get/' + id,
    method: 'get'
  })
}

// 新增库存记录
export function addStore(data) {
  return request({
    url: '/senbei/store/add',
    method: 'post',
    data: data
  })
}

// 修改库存记录
export function updateStore(data) {
  return request({
    url: '/senbei/store/edit',
    method: 'post',
    data: data
  })
}

// 删除库存记录
export function delStore(ids) {
  return request({
    url: '/senbei/store/del/' + ids,
    method: 'post'
  })
}