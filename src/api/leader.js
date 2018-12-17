import request from '@/utils/request'

export function getSysUserList(params) {
  return request({
    url: '/User/list',
    method: 'get',
    params
  })
}
export function getLeaderList(params) {
  return request({
    url: '/Leader/list',
    method: 'get',
    params
  })
}

export function addLeader(data) {
  return request({
    url: '/Leader/add',
    method: 'post',
    data
  })
}

export function editLeader(data) {
  return request({
    url: '/Leader/edit',
    method: 'post',
    data
  })
}

export function deleteLeader(data) {
  return request({
    url: '/Leader/del',
    method: 'post',
    data
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
