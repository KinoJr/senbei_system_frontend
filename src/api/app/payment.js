import request from '@/utils/request'

// 查询付款记录列表
export function listPayment(query) {
  return request({
    url: '/app/payment/rows',
    method: 'get',
    params: query
  })
}

// 查询付款记录详细
export function getPayment(id) {
  return request({
    url: '/app/payment/get/' + id,
    method: 'get'
  })
}

// 新增付款记录
export function addPayment(data) {
  return request({
    url: '/app/payment/add',
    method: 'post',
    data: data
  })
}

// 修改付款记录
export function updatePayment(data) {
  return request({
    url: '/app/payment/edit',
    method: 'post',
    data: data
  })
}

// 删除付款记录
export function delPayment(ids) {
  return request({
    url: '/app/payment/del/' + ids,
    method: 'post'
  })
}