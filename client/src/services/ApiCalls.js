import Api from '@/services/Api'
import ApiHTTPS from '@/services/ApiCallsHTTPS'

export default {
  // for autologin
  updateValidToken () {
    return Api().get('updateValidToken')
  },
  userBySessionId (sessionId) {
    return Api().get('userBySessionId', {
      params: {
        sessionId: sessionId
      }
    })
  },
  sessionId () {
    return Api().get('sessionId')
  },
  googleConfig () {
    return Api().get('googleConfig')
  },  
  register (record) {
    return Api().post('register', record)
  },
  login (record) {
    return Api().post('login', record)
  },
  delete (record) {
    return Api().post('delete', record)
  },

  // DataServer  
  getData () {
    return Api().get('data')    
  },
  deleteData (data) {
    return Api().delete('data', {
      params: {
        id: data
      }
    })
  },     
  newData (data) {
    return Api().post('data', data)
  },
  
  // OpenAPI HTTPS
  registerHTTPS (record) {
    return ApiHTTPS().post('register', record)
  },
  loginHTTPS (record) {
    return ApiHTTPS().post('login', record)
  }
}
