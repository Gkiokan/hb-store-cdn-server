<template lang="html">
  <div class="bg-black q-mb-xs rounded-borders titleBar">
      <div class='row'>
          <div class="q-pl-sm self-center text-weight-bold draggable">
              HB-Store CDN Server
          </div>
          <q-space class="draggable" />
          <div class='q-pr-sm'>
              <q-btn round size="sm" icon="power_settings_new" @click="closeApplication" />
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: "TitleBar",

    methods: {
        closeApplication(){
            this.$q.dialog({
                title: "Quit application?",
                message: "This will stop the Server and Close the Application",
                dark: true,
                cancel: {
                    flat: true,
                    color: 'black',
                    textColor: 'white',
                },
                ok: {
                    flat: true,
                    label: "Ok, close it",
                    color: 'transparent',
                    textColor: 'red',
                    icon: 'power_settings_new',
                },

            }).onOk( () => {
                window.hb.closeApplication()
            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
