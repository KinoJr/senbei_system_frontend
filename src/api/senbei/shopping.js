import request from '@/utils/request'

// 查询订单列表
export function listShopping(query) {
  return request({
    url: '/senbei/shopping/rows',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getShopping(id) {
  return request({
    url: '/senbei/shopping/get/' + id,
    method: 'get'
  })
}

// 新增订单
export function addShopping(data) {
  return request({
    url: '/senbei/shopping/add',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updateShopping(data) {
  return request({
    url: '/senbei/shopping/edit',
    method: 'post',
    data: data
  })
}

// 删除订单
export function delShopping(ids) {
  return request({
    url: '/senbei/shopping/del/' + ids,
    method: 'post'
  })
}

// 查询订单详细
export function getInfo(id) {
  return request({
    url: '/senbei/shopping/getInfo/' + id,
    method: 'get'
  })
}

// 修改订单
export function createOrUpdate(data) {
  return request({
    url: '/senbei/shopping/createOrUpdate',
    method: 'post',
    data: data
  })
}