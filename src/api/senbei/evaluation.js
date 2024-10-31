import request from '@/utils/request'

// 查询出馆评估列表
export function listEvaluation(query) {
  return request({
    url: '/senbei/evaluation/rows',
    method: 'get',
    params: query
  })
}

// 查询出馆评估详细
export function getEvaluation(evaluationId) {
  return request({
    url: '/senbei/evaluation/get/' + evaluationtId,
    method: 'get'
  })
}

// 新增出馆评估
export function addEvaluation(data) {
  return request({
    url: '/senbei/evaluation/add',
    method: 'post',
    data: data
  })
}

// 修改出馆评估
export function updateEvaluation(data) {
  return request({
    url: '/senbei/evaluation/edit',
    method: 'post',
    data: data
  })
}

// 删除出馆评估
export function delEvaluation(evaluationIds) {
  return request({
    url: '/senbei/evaluation/del/' + evaluationIds,
    method: 'post'
  })
}

// 通过宝妈ID查询宝妈出馆评估详细
export function getEvaluationMom(mId) {
  return request({
    url: '/senbei/evaluation/mom/get/' + mId,
    method: 'get'
  })
}

// 删除宝妈出馆评估
export function delEvaluationMom(mIds) {
  return request({
    url: '/senbei/evaluation/mom/del/' + mIds,
    method: 'post'
  })
}

// 新增宝妈出馆评估
export function addEvaluationMom(data) {
  return request({
    url: '/senbei/evaluation/mom/add',
    method: 'post',
    data: data
  })
}

// 修改宝妈出馆评估
export function updateEvaluationMom(data) {
  return request({
    url: '/senbei/evaluation/mom/edit',
    method: 'post',
    data: data
  })
}

// 通过婴儿ID查询宝妈出馆评估详细
export function getEvaluationBaby(bId) {
  return request({
    url: '/senbei/evaluation/baby/get/' + bId,
    method: 'get'
  })
}

// 删除婴儿出馆评估
export function delEvaluationBaby(bIds) {
  return request({
    url: '/senbei/evaluation/baby/del/' + bIds,
    method: 'post'
  })
}

// 新增婴儿出馆评估
export function addEvaluationBaby(data) {
  return request({
    url: '/senbei/evaluation/baby/add',
    method: 'post',
    data: data
  })
}

// 修改婴儿出馆评估
export function updateEvaluationBaby(data) {
  return request({
    url: '/senbei/evaluation/baby/edit',
    method: 'post',
    data: data
  })
}