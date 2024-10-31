import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询账户列表
export function listBalance(query) {
  return request({
    url: '/app/balance/rows',
    method: 'get',
    params: query
  })
}

// 查询账户详细
export function getBalance(id) {
  return request({
    url: '/app/balance/get/' + parseStrEmpty(id),
    method: 'get'
  })
}

// 新增账户
export function addBalance(data) {
  return request({
    url: '/app/balance/add',
    method: 'post',
    data: data
  })
}

// 修改账户
export function updateBalance(data) {
  return request({
    url: '/app/balance/edit',
    method: 'post',
    data: data
  })
}

// 删除账户
export function delBalance(ids) {
  return request({
    url: '/app/balance/del/' + ids,
    method: 'post'
  })
}