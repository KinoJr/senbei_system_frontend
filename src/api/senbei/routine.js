import request from '@/utils/request'

// 查询每日记录列表
export function listRoutine(query) {
  return request({
    url: '/senbei/routine/list',
    method: 'get',
    params: query
  })
}

// 查询每日记录详细
export function getRoutine(id) {
  return request({
    url: '/senbei/routine/get/' + id,
    method: 'get'
  })
}

// 删除每日记录
export function delRoutine(ids) {
  return request({
    url: '/senbei/routine/del/' + ids,
    method: 'post'
  })
}