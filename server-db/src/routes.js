const UserService = require('./services/UserService')
const DataService = require('./services/DataService')
const InternalService = require('./services/InternalService')
const baseUrl = '/commontest/v1'

// OpenAPI
module.exports = (app) => {
  // InternalService
  app.get('/', InternalService.ping)
  app.get('/ping', InternalService.ping)
  // UserService
  app.get(baseUrl + '/updateValidToken', UserService.updateValidToken)
  app.get(baseUrl + '/users', UserService.users)
  app.get(baseUrl + '/userBySessionId', UserService.userBySessionId)
  app.get(baseUrl + '/sessionId', UserService.sessionId)
  app.post(baseUrl + '/register', UserService.register)
  app.post(baseUrl + '/login', UserService.login)
  app.post(baseUrl + '/delete', UserService.delete)
  // Google login
  app.get('/redirect', UserService.redirectGoogle)
  app.get(baseUrl + '/googleConfig', UserService.googleConfig)
  // DataServer
  app.get(baseUrl + '/data', DataService.getData)
  app.delete(baseUrl + '/data', DataService.deleteData)
  app.post(baseUrl + '/data', DataService.newData)
}
