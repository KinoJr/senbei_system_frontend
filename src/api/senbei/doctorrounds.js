import request from '@/utils/request'

// 查询医生查房记录列表
export function listDoctorRounds(query) {
  return request({
    url: '/senbei/doctorRounds/list',
    method: 'get',
    params: query
  })
}

// 查询医生查房记录详细
export function getDoctorRounds(id) {
  return request({
    url: '/senbei/doctorRounds/get/' + id,
    method: 'get'
  })
}

// 新增医生查房记录
export function addDoctorRounds(data) {
  return request({
    url: '/senbei/doctorRounds/add',
    method: 'post',
    data: data
  })
}

// 修改医生查房记录
export function updateDoctorRounds(data) {
  return request({
    url: '/senbei/doctorRounds/edit',
    method: 'post',
    data: data
  })
}

// 删除医生查房记录
export function delDoctorRounds(ids) {
  return request({
    url: '/senbei/doctorRounds/del/' + ids,
    method: 'post'
  })
}

// 获取医生列表
export function getDoctorList() {
  return request({
    url: '/senbei/doctorRounds/getDoctorList',
    method: 'get'
  })
}

// 通过入住档案ID获取关联的所有查房记录(日历)
export function getListByArchivalId(archivalId) {
  return request({
    url: '/senbei/doctorRounds/getListByArchivalId/' + archivalId,
    method: 'get'
  })
}
