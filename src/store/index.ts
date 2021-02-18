import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前登录用户状态
    user: JSON.parse(window.localStorage.getItem('user') || 'null')
  },
  mutations: {
    // 修改容器数据必须使用 mutations 函数
    // payload：载荷数据（用户传递的数据）
    setUser(state, payload) {
      state.user = JSON.parse(payload)
      // 持久化：为了防止页面刷新数据丢失，需要把 user 数据持久化
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
