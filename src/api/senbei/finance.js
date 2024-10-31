import request from '@/utils/request'

// 查询其他收支列表
export function getStatistics(query) {
  return request({
    url: '/senbei/finance/getStatistics',
    method: 'get',
    params: query
  })
}

// 查询其他收支详细
export function getIncome(id) {
  return request({
    url: '/senbei/finance/get/' + id,
    method: 'get'
  })
}