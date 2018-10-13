'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://www.easy-mock.com/mock/5b680be31519da4ff895eb54/easy-mock-zw"',
  //BASE_API: '"http://192.168.0.111:8888/index"',
  BASE_API: '"http://47.74.250.86/index"'
})
