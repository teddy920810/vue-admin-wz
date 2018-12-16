import request from '@/utils/request'

export function getSysUserList(params) {
  return request({
    url: '/User/list',
    method: 'get',
    params
  })
}

export function initLeader(data) {
  return request({
    url: '/Leader/init',
    method: 'post',
    data
  })
}

export function bindLeader(data) {
  return request({
    url: '/Leader/edit',
    method: 'post',
    data
  })
}

export function getUserAll() {
  return request({
    url: '/User/all',
    method: 'get'
  })
}
