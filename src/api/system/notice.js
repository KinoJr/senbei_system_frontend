import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/system/notice/rows',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/system/notice/get/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data) {
  return request({
    url: '/system/notice/add',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/system/notice/edit',
    method: 'post',
    data: data
  })
}

// 删除公告
export function delNotice(ids) {
  return request({
    url: '/system/notice/del/' + ids,
    method: 'post'
  })
}

// 已读
export function readNotice(id) {
  return request({
    url: '/system/notice/onRead/' + id,
    method: 'post'
  })
}
