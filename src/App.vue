<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',

    data(){ return {
        tab: 'config',
    }},

    created(){
        this.$q.dark.set(true)
    },
})
</script>
