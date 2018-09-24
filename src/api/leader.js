import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/leader/list',
    method: 'get',
    params
  })
}

export function addLeader(data) {
  return request({
    url: '/leader/add',
    method: 'post',
    data
  })
}

export function editLeader(data) {
  return request({
    url: '/leader/edit',
    method: 'post',
    data
  })
}

export function deleteLeader(data) {
  return request({
    url: '/leader/del',
    method: 'post',
    data
  })
}
