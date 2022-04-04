<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  created(){
      this.$q.dark.set(true)
  }
})
</script>
