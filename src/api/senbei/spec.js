import request from '@/utils/request'

// 查询产品规格列表
export function listSpec(query) {
  return request({
    url: '/senbei/spec/rows',
    method: 'get',
    params: query
  })
}

// 查询产品规格详细
export function getSpec(id) {
  return request({
    url: '/senbei/spec/get/' + id,
    method: 'get'
  })
}

// 新增产品规格
export function addSpec(data) {
  return request({
    url: '/senbei/spec/add',
    method: 'post',
    data: data
  })
}

// 修改产品规格
export function updateSpec(data) {
  return request({
    url: '/senbei/spec/edit',
    method: 'post',
    data: data
  })
}

// 删除产品规格
export function delSpec(ids) {
  return request({
    url: '/senbei/spec/del/' + ids,
    method: 'post'
  })
}

// 获取下拉
export function getSpecSelectList(id) {
  return request({
    url: '/senbei/spec/getSelectList/' + id,
    method: 'get'
  })
}