import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Category/list',
    method: 'get',
    params
  })
}

export function addCategory(data) {
  return request({
    url: '/Category/add',
    method: 'post',
    data
  })
}

export function editCategory(data) {
  return request({
    url: '/Category/edit',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/Category/del',
    method: 'post',
    data
  })
}
