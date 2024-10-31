import request from '@/utils/request'

// 查询采购单列表
export function listPurchase(query) {
  return request({
    url: '/senbei/purchase/rows',
    method: 'get',
    params: query
  })
}

// 查询采购单详细
export function getPurchase(id) {
  return request({
    url: '/senbei/purchase/get/' + id,
    method: 'get'
  })
}

// 新增采购单
export function addPurchase(data) {
  return request({
    url: '/senbei/purchase/add',
    method: 'post',
    data: data
  })
}

// 修改采购单
export function updatePurchase(data) {
  return request({
    url: '/senbei/purchase/edit',
    method: 'post',
    data: data
  })
}

// 删除采购单
export function delPurchase(ids) {
  return request({
    url: '/senbei/purchase/del/' + ids,
    method: 'post'
  })
}

// 查询采购单详细
export function getInfo(id) {
  return request({
    url: '/senbei/purchase/getInfo/' + id,
    method: 'get'
  })
}

// 修改采购单
export function createOrUpdate(data) {
  return request({
    url: '/senbei/purchase/createOrUpdate',
    method: 'post',
    data: data
  })
}

// 一键入库
export function saveToStore(data) {
  return request({
    url: '/senbei/purchase/saveToStore',
    method: 'post',
    data: data
  })
}