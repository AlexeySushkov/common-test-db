import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    email: null,
    sessionId: null,
    isUserLoggedIn: false,
    drawer: true,
    titleColor: 'blue darken-3'
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
    },
    setTitleColor (state, titleColor) { 
      state.titleColor = titleColor
      localStorage.titleColor = titleColor
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
    },
    setTitleColor ({ commit }, titleColor) { 
      commit('setTitleColor', titleColor)
    }
  },
  modules: { 
  } 
})
