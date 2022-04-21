import { make } from 'vuex-pathify'

export const state = {
    search: '',
    selected: null,
    serverFilesVersion: false,
    pkgs: [],
}


// make all mutations
export const mutations = {
    ...make.mutations(state),

}

// actions
export const actions = {
    ...make.actions(state),

    // addFiles({ commit, dispatch, state}, payload){
    //     commit('addFiles', payload)
    // }
}

// getters
export const getters = {
  // make all getters (optional)
  ...make.getters(state),

  // overwrite default `items` getter
  // allFiles: state => {
  //     return state.images
  // },
}

// console.log({
//     mutations, actions, getters
// })
