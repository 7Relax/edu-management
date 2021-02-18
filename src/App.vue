<template>
  <div id="app">
    <!-- <p class="text">Hello World</p> -->
    <!-- 根路由的出口，
      被匹配到路由组件会被渲染到这个位置 -->
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import request from '@/utils/request'

// request({
//   method: 'GET',
//   url: '/boss'
// }).then(res => {
//   console.log(res)
// })

export default Vue.extend({
  name: 'App'
})
</script>

<style lang="scss" scoped>
// 最好是将variables.scss注入到全局Vue组件中再使用
// @import '~@/styles/variables.scss';
// 使用全局样式变量
.text {
  color: $success-color;
}
</style>
