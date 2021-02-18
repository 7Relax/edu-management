<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          :src="userInfo.portrait || require('@/assets/default-avatar.png')"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{userInfo.userName}}</el-dropdown-item>
        <!-- .native 直接把事件注册给这个组件的根元素（把事件直接穿透组件进入组件的根元素） -->
        <el-dropdown-item divided @click.native="handleLogout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserInfo } from '@/services/user'

export default Vue.extend({
  name: 'AppHeader',
  data() {
    return {
      userInfo: {} // 当前登录用户的信息
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    handleLogout() {
      this.$confirm('确认退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除登录状态
        this.$store.commit('setUser', null)
        // 跳转到登录页
        this.$router.push({
          name: 'login'
        })
      }).catch(() => {
        console.log('取消退出')
      })
    }
  }
})
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    // 两端对齐
    justify-content: space-between;
    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
  }
</style>
