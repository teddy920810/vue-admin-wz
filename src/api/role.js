import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/Role/list',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/Role/add',
    method: 'post',
    data
  })
}

export function editRole(data) {
  return request({
    url: '/Role/edit',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/Role/del',
    method: 'post',
    data
  })
}

export function getPermission() {
  return request({
    url: '/Permission/list',
    method: 'get'
  })
}

