import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getLeaderInfo(token) {
  return request({
    url: '/Leader/check',
    method: 'get',
    params: { token }
  })
}

export function isAdmin() {
  return request({
    url: '/User/checkadmin',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
