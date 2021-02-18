<template>
  <div class="menu-edit">
    <create-or-edit :isEdit="true" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  },
  data() {
    return {
    }
  }
})
</script>

<style lang="scss" scoped></style>
