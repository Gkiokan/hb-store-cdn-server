import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import pathify from './pathify'

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

 const requireContext = require.context('./modules', false, /.*\.js$/)

 const modules = requireContext.keys()
   .map(file =>
     [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)]
   )
   .reduce((modules, [name, module]) => {
     if (module.namespaced === undefined) {
       module.namespaced = true
     }

     return { ...modules, [name]: module }
}, {})


const Store = createStore({
  plugins: [ pathify.plugin ],
  modules,

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  // strict: process.env.DEBUGGING
})

export default Store
