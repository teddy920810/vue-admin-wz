import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/category/list',
    method: 'get',
    params
  })
}

export function addCategory(data) {
  return request({
    url: '/category/add',
    method: 'post',
    data
  })
}

export function editCategory(data) {
  return request({
    url: '/category/edit',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/category/del',
    method: 'post',
    data
  })
}
