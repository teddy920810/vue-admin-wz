import request from '@/utils/request'

export function getSysUserList(params) {
  return request({
    url: '/User/list',
    method: 'get',
    params
  })
}

export function bindLeader(data) {
  return request({
    url: '/Leader/edit',
    method: 'post',
    data
  })
}
