import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
  return request({
    url: '/system/logininfor/rows',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLogininfor(ids) {
  return request({
    url: '/system/logininfor/del' + ids,
    method: 'post'
  })
}

// 强退用户登录状态
export function quitLogininfor(tokens) {
  return request({
    url: '/system/logininfor/quit/' + tokens,
    method: 'post'
  })
}


// 解锁用户登录状态
export function unlockLogininfor(names) {
  return request({
    url: '/system/logininfor/unlock/' + names,
    method: 'post'
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/system/logininfor/clean',
    method: 'post'
  })
}
