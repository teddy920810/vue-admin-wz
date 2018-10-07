import request from '@/utils/request'

export function getList(params) {
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
