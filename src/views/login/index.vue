<template>
  <div class="login">
    <!--
      1. ref="loginForm"
      2. :model="form"
      3. :rules="rules"
      4. el-form-item 绑定 prop="phone"
     -->
    <el-form
      ref="loginForm"
      class="login-form"
      label-position="top"
      :model="form"
      label-width="80px"
      :rules="rules"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary"
          :loading="isLoginLoading"
          @click="onSubmit('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data() {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit(formName: string) {
      try {
        // 1. 表单验证
        // 转换成 Form 类型 否则不能通过TS的类型验证（不建议转成any）
        // validate() 若不传入回调函数，则会返回一个 promise
        // 捕获 promise 异常最方便就是使用 try catch
        await (this.$refs[formName] as Form).validate()

        // 登录按钮 loading
        this.isLoginLoading = true

        // 2. 验证通过 -> 提交表单 - login方法中的参数必须符合定义好的类型要求
        const { data } = await login(this.form)

        // 3. 处理请求结果
        //    失败：给出提示
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          // 1. 登录成功，记录登录状态，状态需要能够全局访问（放到Vuex容器中）
          this.$store.commit('setUser', data.content)
          // 2. 然后在访问需要登录的页面时判断有无登录状态（路由拦截嚣）
          //    成功：跳转到首页
          this.$router.push(this.$route.query.redirect as string || '/')
          // this.$router.push({
          //   name: 'home'
          // })
          this.$message.success('登录成功')
        }
      } catch (error) {
        console.log('登录失败', error)
      }
      // 无论登录成功与否，都要结束登录按钮的 loading
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-form {
      width: 300px;
      background-color: #FFF;
      padding: 20px;
      border-radius: 5px;
    }
    .login-btn {
      width: 100%;
    }
  }
</style>
