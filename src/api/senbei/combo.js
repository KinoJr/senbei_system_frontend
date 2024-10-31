import request from '@/utils/request'

// 查询套餐列表
export function listCombo(query) {
  return request({
    url: '/senbei/combo/rows',
    method: 'get',
    params: query
  })
}

// 查询套餐详细
export function getCombo(id) {
  return request({
    url: '/senbei/combo/get/' + id,
    method: 'get'
  })
}

// 新增套餐
export function addCombo(data) {
  return request({
    url: '/senbei/combo/add',
    method: 'post',
    data: data
  })
}

// 修改套餐
export function updateCombo(data) {
  return request({
    url: '/senbei/combo/edit',
    method: 'post',
    data: data
  })
}

// 删除套餐
export function delCombo(ids) {
  return request({
    url: '/senbei/combo/del/' + ids,
    method: 'post'
  })
}

// 修改套餐
export function createOrUpdate(data) {
  return request({
    url: '/senbei/combo/createOrUpdate',
    method: 'post',
    data: data
  })
}