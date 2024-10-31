import request from '@/utils/request'

// 查询康复使用记录列表
export function listRehabilitation(query) {
  return request({
    url: '/senbei/rehabilitation/rows',
    method: 'get',
    params: query
  })
}

// 查询康复使用记录详细
export function getRehabilitation(id) {
  return request({
    url: '/senbei/rehabilitation/get/' + id,
    method: 'get'
  })
}

// 新增康复使用记录
export function addRehabilitation(data) {
  return request({
    url: '/senbei/rehabilitation/add',
    method: 'post',
    data: data
  })
}

// 修改康复使用记录
export function updateRehabilitation(data) {
  return request({
    url: '/senbei/rehabilitation/edit',
    method: 'post',
    data: data
  })
}

// 删除康复使用记录
export function delRehabilitation(ids) {
  return request({
    url: '/senbei/rehabilitation/del/' + ids,
    method: 'post'
  })
}

// 获取康复记录使用数
export function getContByShoppingId(id) {
    return request({
      url: '/senbei/rehabilitation/getContByShoppingId/' + id,
      method: 'get'
    })
  }
  