// import something here
// import { boot } from 'quasar/wrappers'
// import '~/components'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files


export default async ( { app, store, router, Vue } ) => {

    const requireContext = require.context('~/components', true, /.*\.vue$/)
    const layouts = requireContext.keys()
      .map(file =>
        [file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)]
      )
      .reduce((components, [name, component]) => {
        let Component = component.default || component
        app.component(Component.name, Component)
      }, {})

}
