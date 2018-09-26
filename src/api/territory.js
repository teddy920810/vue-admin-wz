import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/territory/list',
    method: 'get',
    params
  })
}

export function addTerritory(data) {
  return request({
    url: '/territory/add',
    method: 'post',
    data
  })
}

export function editTerritory(data) {
  return request({
    url: '/territory/edit',
    method: 'post',
    data
  })
}

export function deleteTerritory(data) {
  return request({
    url: '/territory/del',
    method: 'post',
    data
  })
}
