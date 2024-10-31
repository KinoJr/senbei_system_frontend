import request from '@/utils/request'

// 查询餐次列表
export function listMeal(query) {
  return request({
    url: '/senbei/meal/rows',
    method: 'get',
    params: query
  })
}

// 查询餐次详细
export function getMeal(id) {
  return request({
    url: '/senbei/meal/get/' + id,
    method: 'get'
  })
}

// 新增餐次
export function addMeal(data) {
  return request({
    url: '/senbei/meal/add',
    method: 'post',
    data: data
  })
}

// 修改餐次
export function updateMeal(data) {
  return request({
    url: '/senbei/meal/edit',
    method: 'post',
    data: data
  })
}

// 删除餐次
export function delMeal(ids) {
  return request({
    url: '/senbei/meal/del/' + ids,
    method: 'post'
  })
}

// 获取下拉
export function getMealSelect() {
  return request({
    url: '/senbei/meal/getSelect',
    method: 'get'
  })
}