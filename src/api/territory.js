import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Territory/list',
    method: 'get',
    params
  })
}

export function addTerritory(data) {
  return request({
    url: '/Territory/add',
    method: 'post',
    data
  })
}

export function editTerritory(data) {
  return request({
    url: '/Territory/edit',
    method: 'post',
    data
  })
}

export function deleteTerritory(data) {
  return request({
    url: '/Territory/del',
    method: 'post',
    data
  })
}
