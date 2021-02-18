<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({name: 'menu-create'})">
          添加菜单
        </el-button>
      </div>
      <el-table
        :data="menus"
        stripe
        style="width: 100%"
      >
        <el-table-column
          label="编号"
          type="index"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="菜单名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="level"
          label="菜单级数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="icon"
          label="前端图标"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="排序"
          align="center">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenu, deleteMenu } from '@/services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data() {
    return {
      menus: []
    }
  },
  created() {
    this.loadAllMenu()
  },
  methods: {
    async loadAllMenu() {
      const { data } = await getAllMenu()
      console.log(data)
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    handleEdit(item: any) {
      console.log('handleEdit')
      this.$router.push({
        name: 'menu-edit',
        params: { // 通过params向路由传参
          id: item.id
        }
      })
    },
    handleDelete(item: any) {
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 请求删除操作
        const { data } = await deleteMenu(item.id)
        if (data.code === '000000') {
          this.$message.success('删除成功')
          this.loadAllMenu() // 更新列表
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
})
</script>

<style lang="scss" scoped></style>
