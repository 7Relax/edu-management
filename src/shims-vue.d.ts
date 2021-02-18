// 在TS中原本不能加载以.vue结尾的模块
// import xxx from 'xxx.vue'
// 以下做适配处理后就可以识别：
// 所有以.vue结尾的模块，它的类型就是Vue构造函数
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
