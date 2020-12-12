import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    email: null,
    sessionId: null,
    isUserLoggedIn: false,
    drawer: true
  },
  mutations: {
    setToken (state, token) { 
      state.token = token
      localStorage.token = token
      if (token) {
        state.isUserLoggedIn = true
      } else {
        state.isUserLoggedIn = false
      }
    }, 
    setSessionId (state, id) { 
      state.sessionId = id
      sessionStorage.sessionId = id
    },     
    setEmail (state, email) { 
      state.email = email
    },
    setDrawer (state, _drawer) { 
      state.drawer = _drawer
    }
  },
  actions: {
    setEmail ({ commit }, email) { 
      commit('setEmail', email)
    },
    setToken ({ commit }, token) { 
      commit('setToken', token)
    },
    setSessionId ({ commit }, id) { 
      commit('setSessionId', id)
    },    
    setDrawer ({ commit }, drawer) { 
      commit('setDrawer', drawer)
    }
  },
  modules: { 
  } 
})
