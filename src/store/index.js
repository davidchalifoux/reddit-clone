import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    currentProfile: null
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    },
    setCurrentProfile (state, profile) {
      state.currentProfile = profile
    }
  },
  actions: {
  },
  modules: {
  }
})
