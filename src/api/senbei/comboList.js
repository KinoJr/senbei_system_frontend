import request from '@/utils/request'

// 查询套餐列表列表
export function listComboList(query) {
  return request({
    url: '/senbei/comboList/rows',
    method: 'get',
    params: query
  })
}

// 查询套餐列表详细
export function getComboList(id) {
  return request({
    url: '/senbei/comboList/get/' + id,
    method: 'get'
  })
}

// 新增套餐列表
export function addComboList(data) {
  return request({
    url: '/senbei/comboList/add',
    method: 'post',
    data: data
  })
}

// 修改套餐列表
export function updateComboList(data) {
  return request({
    url: '/senbei/comboList/edit',
    method: 'post',
    data: data
  })
}

// 删除套餐列表
export function delComboList(ids) {
  return request({
    url: '/senbei/comboList/del/' + ids,
    method: 'post'
  })
}