import request from '@/utils/request'

// 查询提成结算记录列表
export function listCommission(query) {
  return request({
    url: '/senbei/commission/rows',
    method: 'get',
    params: query
  })
}

// 查询提成结算记录详细
export function getCommission(id) {
  return request({
    url: '/senbei/commission/get/' + id,
    method: 'get'
  })
}

// 新增提成结算记录
export function addCommission(data) {
  return request({
    url: '/senbei/commission/add',
    method: 'post',
    data: data
  })
}

// 修改提成结算记录
export function updateCommission(data) {
  return request({
    url: '/senbei/commission/edit',
    method: 'post',
    data: data
  })
}

// 删除提成结算记录
export function delCommission(ids) {
  return request({
    url: '/senbei/commission/del/' + ids,
    method: 'post'
  })
}