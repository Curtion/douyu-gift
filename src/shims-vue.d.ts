import Vue from 'vue'
declare module 'vue/types/vue' {
  interface Vue {
    $db: any
    $auto: any
  }
}
