import request from '@/utils/request'

// 查询订单产品列表
export function listShoppingList(query) {
  return request({
    url: '/senbei/shoppingList/rows',
    method: 'get',
    params: query
  })
}

// 查询订单产品详细
export function getShoppingList(id) {
  return request({
    url: '/senbei/shoppingList/get/' + id,
    method: 'get'
  })
}

// 新增订单产品
export function addShoppingList(data) {
  return request({
    url: '/senbei/shoppingList/add',
    method: 'post',
    data: data
  })
}

// 修改订单产品
export function updateShoppingList(data) {
  return request({
    url: '/senbei/shoppingList/edit',
    method: 'post',
    data: data
  })
}

// 删除订单产品
export function delShoppingList(ids) {
  return request({
    url: '/senbei/shoppingList/del/' + ids,
    method: 'post'
  })
}