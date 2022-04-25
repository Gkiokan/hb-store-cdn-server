import { make } from 'vuex-pathify'

export const state = {
    state: null,
    ip: "",
    port: "6448",

    ps4ip: "",
    ps4port: "2121",

    basePath: null,
    binaryVersion: "0.00",
    files: [],
    assets: [],
}


// make all mutations
export const mutations = {
    ...make.mutations(state),

}

// actions
export const actions = {
    ...make.actions(state),
}

// getters
export const getters = {
  // make all getters (optional)
  ...make.getters(state),
}

// console.log({
//     mutations, actions, getters
// })
