import request from '@/utils/request'

// 查询宝宝列表
export function listBaby(query) {
  return request({
    url: '/senbei/baby/list',
    method: 'get',
    params: query
  })
}

// 查询宝宝详细
export function getBaby(id) {
  return request({
    url: '/senbei/baby/get/' + id,
    method: 'get'
  })
}

// 新增宝宝
export function addBaby(data) {
  return request({
    url: '/senbei/baby/add',
    method: 'post',
    data: data
  })
}

// 修改宝宝
export function updateBaby(data) {
  return request({
    url: '/senbei/baby/edit',
    method: 'post',
    data: data
  })
}

// 删除宝宝
export function delBaby(ids) {
  return request({
    url: '/senbei/baby/del/' + ids,
    method: 'post'
  })
}
