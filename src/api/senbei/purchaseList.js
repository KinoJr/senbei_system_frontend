import request from '@/utils/request'

// 查询订单产品列表
export function listPurchaseList(query) {
  return request({
    url: '/senbei/purchaseList/rows',
    method: 'get',
    params: query
  })
}

// 查询订单产品详细
export function getPurchaseList(id) {
  return request({
    url: '/senbei/purchaseList/get/' + id,
    method: 'get'
  })
}

// 新增订单产品
export function addPurchaseList(data) {
  return request({
    url: '/senbei/purchaseList/add',
    method: 'post',
    data: data
  })
}

// 修改订单产品
export function updatePurchaseList(data) {
  return request({
    url: '/senbei/purchaseList/edit',
    method: 'post',
    data: data
  })
}

// 删除订单产品
export function delPurchaseList(ids) {
  return request({
    url: '/senbei/purchaseList/del/' + ids,
    method: 'post'
  })
}