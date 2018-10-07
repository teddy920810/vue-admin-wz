import request from '@/utils/request'

export function getPrivince() {
  return request({
    url: '/province/list',
    method: 'get'
  })
}

export function getCity(provice_id) {
  return request({
    url: '/province/list',
    method: 'get',
    provice_id
  })
}

export function getRegion() {
  return request({
    url: '/Location/list',
    method: 'get'
  })
}
