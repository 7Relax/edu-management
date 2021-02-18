import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout
})

// 请求拦截器
request.interceptors.request.use(function(config) {
  // Do something before request is sent
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function(error) {
  // Do something with request error
  return Promise.reject(error)
})

function redirectLogin() {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken() {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

let isRefreshing = false // 是否正在刷新 token
let requests: (() => void)[] = [] // 存储 刷新token期间过来的401请求
// 响应拦截嚣
request.interceptors.response.use(function(response) {
  // 任何 2xx 范围内的状态码（http）都会触发此函数
  // 如果是自定义错误状态码，错误处理就写到这里
  return response
}, async function(error) {
  // 任何超出 2xx 范围的状态码都会触发此函数
  // 如果是使用 HTTP 状态码，错误处理就写到这里
  // console.dir(error)
  if (error.response) {
    // 发出请求并收到服务器响应，但是状态超出了 2xx 范围
    // 400 401 403 404 500 根据开发文档合理编写代码
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token 无效（没有提供token、token是无效的、token过期了）
      // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
      //   成功了 -> 把本次失败的请求重新发出去
      //   失败了 -> 跳转到登录页重新登录获取新的 token
      // 如果没有，则直接跳转到登录页
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 尝试刷新获取新的 token
      // 通过创建一个新的 axios 实例去发请求，避免死循环（遇到401又尝试刷新token）
      // 因为这个新的 axios 与 request 实例没有联系
      // 关于多次请求的问题：由于后端设计：同一个 refresh_token 只能使用一次，
      // 如果同一时刻并发发起了第二个请求也用了同一个refresh_token 则会报错，
      // 报错是以自定义状态来返回的（返回数据为null再更新到store容器则会跳转到登录页），
      // 并不是标准的HTTP状态码，所以不会被 try catch 捕获到，所以不用 try catch 了
      if (!isRefreshing) {
        isRefreshing = true
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 Token 失败')
          }
          // 成功了：
          // 1、把成功刷新拿到的新 access_token 更新到store容器和本地存储中
          store.commit('setUser', res.data.content)
          // 把 requests 队列中的请求依次重新发出
          requests.forEach(cb => cb())
          // 重置 requests
          requests = []
          // 2、把本次失败的请求重新发出去
          // error.config: 本次失败请求的配置信息
          return request(error.config)
        }).catch(() => {
          // 失败了：
          // 1、清除当前登录用户的状态
          store.commit('setUser', null)
          // 2、跳转到登录页
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false // 重置刷新状态
        })
      }
      // 刷新状态下，把请求挂起并放到 requests 数组中
      // 返回一个不执行 resolve 的 Promise 就可以达到挂起的效果，因为 Promise 不结束
      // 则请求会一直等待 padding 的状态（设了超时时间另说）
      return new Promise(resolve => {
        // 数组中push一个函数，此函数只是push到数组中，还未调用
        // 当此函数被调用后（则对应的Promise状态才会发生改变，一个函数对应一个resolve），
        // 其中先执行之前由于401错误的请求，再调用 resolve，调用 resolve 就说明此 Promise 成功
        requests.push(() => {
          // 重新发送之前错误的请求，它的结果给了resolve，resolve作为Promise的结果返回
          // 即 返回真正发请求的地方
          resolve(request(error.config))
        })
      })
      // try {
      //   const { data } = await refreshToken()
      //   store.commit('setUser', data.content)
      //   request(error.config)
      // } catch (err) {
      //   store.commit('setUser', null)
      //   redirectLogin()
      //   return Promise.reject(error)
      // }
    } else if (status === 403) {
      // 是登录状态，但执行了一些未授权的操作
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) {
    // 发出请求，但未收到服务器响应
    Message.error('请求超时，请刷新重新')
  } else {
    // 在设置请求时发生了一些事情，触发了一个错误
    Message.error(`请求失败：${error.message}`)
  }
  // 把请求失败的错误对象抛出给上一个调用者
  return Promise.reject(error)
})

export default request
