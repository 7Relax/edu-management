<template>
  <el-container>
    <el-aside width="200px">
      <!-- 侧边栏 -->
      <app-aside />
    </el-aside>
    <el-container>
      <el-header>
        <!-- header -->
        <app-header />
      </el-header>
      <el-main>
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'

export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    AppAside,
    AppHeader
  }
})
</script>

<style lang="scss" scoped>
  .el-container {
    // 100% 是相对于父元素的，父元素没有高就无效
    // 这里采用100vh 也类似于百分比：把整个高分成100份
    min-height: 100vh;
    // 管理后台界面中内容超出后最好设置宽度（出现滚动条）
    // min-width: 980px;
  }
  .el-aside {
    background-color: #D3DCE6;
  }
  .el-header {
    background-color: #FFF;
    display: flex;
    align-items: center;
  }
  .el-main {
    background-color: #E9EEF3;
  }
</style>
