/**
 * 用户相关请求模块
 */
import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },

    // 可以不用手动设置 content-type：
    // 如果 data 是普通对象，则 content-type 是 application/json
    // 如果 data 是 qs.stringify(data) 转换之后的数据：key1=value&key2=value2
    //      则 content-type 会被设置为 application/x-www-form-urlencoded
    // 如果 data 是 h5提供的 FormData 对象，则 content-type 是 multipart/form-data

    data: qs.stringify(data) // axios 默认发送的是 application/json 格式的数据
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
