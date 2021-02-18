import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

// 加载全局样式
import './styles/index.scss'

// 这个可以放到全局样式index.scss中去@import
// import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 创建Vue根实例，通过render函数将App根组件渲染到#app节点的位置
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
