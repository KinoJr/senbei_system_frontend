import request from '@/utils/request'

// 查询其他收支列表
export function listIncome(query) {
  return request({
    url: '/senbei/income/rows',
    method: 'get',
    params: query
  })
}

// 查询其他收支详细
export function getIncome(id) {
  return request({
    url: '/senbei/income/get/' + id,
    method: 'get'
  })
}

// 新增其他收支
export function addIncome(data) {
  return request({
    url: '/senbei/income/add',
    method: 'post',
    data: data
  })
}

// 修改其他收支
export function updateIncome(data) {
  return request({
    url: '/senbei/income/edit',
    method: 'post',
    data: data
  })
}

// 删除其他收支
export function delIncome(ids) {
  return request({
    url: '/senbei/income/del/' + ids,
    method: 'post'
  })
}