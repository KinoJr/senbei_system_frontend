import request from '@/utils/request'

// 查询产品列表
export function listProduct(query) {
  return request({
    url: '/senbei/product/rows',
    method: 'get',
    params: query
  })
}

// 查询产品详细
export function getProduct(id) {
  return request({
    url: '/senbei/product/get/' + id,
    method: 'get'
  })
}

// 新增产品
export function addProduct(data) {
  return request({
    url: '/senbei/product/add',
    method: 'post',
    data: data
  })
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: '/senbei/product/edit',
    method: 'post',
    data: data
  })
}

// 删除产品
export function delProduct(ids) {
  return request({
    url: '/senbei/product/del/' + ids,
    method: 'post'
  })
}

// 获取下拉
export function getProductSelectList(id) {
  return request({
    url: '/senbei/product/getSelectList/' + id,
    method: 'get'
  })
}