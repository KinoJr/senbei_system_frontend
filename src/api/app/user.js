import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/app/user/rows',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/app/user/get/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/app/user/add',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/app/user/edit',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delUser(id) {
  return request({
    url: '/app/user/del/' + id,
    method: 'post'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  return request({
    url: '/app/user/resetPwd',
    method: 'post',
    data: {
      userId: userId,
      password: password
    }
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  return request({
    url: '/app/user/changeStatus',
    method: 'post',
    data: {
      userId,
      status
    }
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/app/user/profile/get',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/app/user/profile/edit',
    method: 'post',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  return request({
    url: '/app/user/profile/updatePwd',
    method: 'post',
    params: {
      oldPassword,
      newPassword
    }
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/app/user/profile/avatar',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: data
  })
}
