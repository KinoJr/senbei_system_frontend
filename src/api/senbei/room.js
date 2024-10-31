import request from '@/utils/request'

// 查询房间列表
export function listRoom(query) {
  return request({
    url: '/senbei/room/list',
    method: 'get',
    params: query
  })
}

// 查询房间详细
export function getRoom(id) {
  return request({
    url: '/senbei/room/get/' + id,
    method: 'get'
  })
}

// 新增房间
export function addRoom(data) {
  return request({
    url: '/senbei/room/add',
    method: 'post',
    data: data
  })
}

// 修改房间
export function updateRoom(data) {
  return request({
    url: '/senbei/room/edit',
    method: 'post',
    data: data
  })
}

// 删除房间
export function delRoom(ids) {
  return request({
    url: '/senbei/room/del/' + ids,
    method: 'post'
  })
}

// 获取扫地阿姨列表
export function getClearList() {
  return request({
    url: '/senbei/room/getClearList',
    method: 'get'
  })
}

// 查询使用中的房间详情
export function getUseRooms() {
  return request({
    url: '/senbei/room/getUseRooms',
    method: 'get'
  })
}

// 查询使用中的房间详情
export function getRooms(query) {
  return request({
    url: '/senbei/room/getRooms',
    method: 'get',
    params: query
  })
}

// 获取楼层列表
export function getRoomFloors() {
  return request({
    url: '/senbei/room/getRoomFloors',
    method: 'get'
  })
}
