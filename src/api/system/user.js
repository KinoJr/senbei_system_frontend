import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/rows',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/get/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user/add',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user/edit',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delUser(ids) {
  return request({
    url: '/system/user/del/' + ids,
    method: 'post'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  return request({
    url: '/system/user/resetPwd',
    method: 'post',
    data: {
      userId,
      password
    }
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  return request({
    url: '/system/user/changeStatus',
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
    url: '/system/user/profile/get',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile/edit',
    method: 'post',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'post',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(id) {
  return request({
    url: '/system/user/authRole/get/' + id,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/system/user/authRole/add',
    method: 'post',
    params: data
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}

// 查询部门下拉树结构
export function getSelectList() {
  return request({
    url: '/system/user/getSelectList',
    method: 'get'
  })
}

