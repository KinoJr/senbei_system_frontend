import request from '@/utils/request'

// 查询宝妈列表
export function listMom(query) {
  return request({
    url: '/senbei/mom/list',
    method: 'get',
    params: query
  })
}

// 查询宝妈详细
export function getMom(id) {
  return request({
    url: '/senbei/mom/get/' + id,
    method: 'get'
  })
}

// 新增宝妈
export function addMom(data) {
  return request({
    url: '/senbei/mom/add',
    method: 'post',
    data: data
  })
}

// 修改宝妈
export function updateMom(data) {
  return request({
    url: '/senbei/mom/edit',
    method: 'post',
    data: data
  })
}

// 删除宝妈
export function delMom(ids) {
  return request({
    url: '/senbei/mom/del/' + ids,
    method: 'post'
  })
}

// 查询宝妈与婴儿列表
export function getMomAndBabyList(id, tp) {
  return request({
    url: '/senbei/mom/getMomAndBabyList/' + id + "/" + tp,
    method: 'get'
  })
}
