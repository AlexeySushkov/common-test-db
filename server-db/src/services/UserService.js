const dotenv = require('dotenv')
dotenv.config()
const axios = require('axios')
const { Users } = require('../models')
const uuid = require('uuid')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const internalTools = require('./internalTools')
const logger = require('./logger')

module.exports = {
  async updateValidToken (req, res) {
    try {
       logger.debug('updateValidToken req.headers: ', req.headers)
       logger.info('updateValidToken req.headers.authorization: ', req.headers.authorization)
 
       // достаем токен из заголовка:  
       // let jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhYUBhYWEuYWFhIiwiaWF0IjoxNTkzNTMwODgxLCJleHAiOjE1OTM1MzQ0ODF9.4Nsm47LZ-ux_etnU7zjcjuMCCsHioWpzUDpo8OIwAyI'
       let jwtToken = req.headers.authorization.replace('Bearer ', '');
 
       let decodedToken = jwt.decode(jwtToken)
       logger.info('updateValidToken, decodedToken: ', decodedToken)
       const expDate = new Date(decodedToken.exp*1000)
       logger.info('updateValidToken, decodedToken expDate: ', expDate.toString())
 
       // // проверяем токен на валидность:
       const verifiedToken = jwt.verify(
         jwtToken,
         process.env.JWT_SECRET
       )
       logger.info('updateValidToken, verifiedToken: ', verifiedToken)
       // // проверяем юзера в базе:
       let userToken = null
       userToken = await Users.findOne({ 
         where: { email: verifiedToken.email }
       })
       if (!userToken) {
         logger.info('updateValidToken, Wrong email from token, send status: 404')
         res.status(404).send({
           error: 'Wrong email from token'
         })
       }
       let userToUpdate = {}
       userToUpdate.lastLogin = Date.now()
       userToUpdate.sessionId = internalTools.sessionId(verifiedToken.email )      
       userToUpdate.commonToken = internalTools.getToken(verifiedToken.email )      
       await Users.update(userToUpdate, {
         where: {
           email: verifiedToken.email 
         }
       })      
       logger.info('updateValidToken, User update ok')    
 
       res.status(200).send(
         { 
           name: userToken.name,
           email: verifiedToken.email,
           sessionId: userToUpdate.sessionId,
           token: userToUpdate.commonToken,
           titleColor: "blue darken-3", 
           status: "Ok"    
       })        
      } catch (error) {
        if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
          logger.error('updateValidToken, Error status: ', error.response.status, ', message: ', error.response.data.error)
        } else {
          logger.error('updateValidToken, No connection to the server or other error')
        }
         res.status(500).send({
         error: 'updateValidToken error'
       })
     }
   },

   async googleConfig (req, res) {
    try {
         // проверяем может ли данный юзер вызывать данную функцию
       logger.info('GoogleConfig req.headers: ', req.headers) 
 
       res.status(200).send(
         { 
          googleAuth: config.googleLogin.googleAuth,
          response_type: 'code',
          scope: 'openid email',
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          client_id: process.env.GOOGLE_CLIENT_ID,
          status: "Ok"    
       })        
      } catch (error) {
        if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
          logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
        } else {
          logger.error('No connection to the server or other error')
        }
         res.status(500).send({
         error: 'googleConfig error'
       })
     }
   },  
   
  async sessionId (req, res) {
    try {
      let SessionId = internalTools.sessionId()
      logger.info('SessionId: ', SessionId)
      res.status(200).send(
        { SessionId: SessionId }
      )
    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error')
      }
      res.status(500).send({
        error: 'sessionId error'
      })
    }
  },

  async userBySessionId (req, res) {
    try {
      // проверяем может ли данный юзер вызывать данную функцию
      logger.debug('userBySessionId req.headers: ', req.headers)
      logger.info('userBySessionId req.headers.authorization: ', req.headers.authorization)
      //  if ( req.headers.x-csrf-token !== undefined ) {
      //    logger.info('userBySessionId req.headers.x-csrf-token: ', req.headers.x-csrf-token)
      //  } else {
      //   logger.info('userBySessionId no x-csrf-token header')
      //  }

      // достаем токен из заголовка:  
      // let jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhYUBhYWEuYWFhIiwiaWF0IjoxNTkzNTMwODgxLCJleHAiOjE1OTM1MzQ0ODF9.4Nsm47LZ-ux_etnU7zjcjuMCCsHioWpzUDpo8OIwAyI'
      // let jwtToken = req.headers.authorization.replace('Bearer ', '');

      // let decodedToken = jwt.decode(jwtToken)
      // logger.info('decodedToken: ', decodedToken)
      // const expDate = new Date(decodedToken.exp*1000)
      // logger.info('decodedToken expDate: ', expDate.toString())

      // // проверяем токен на валидность:
      // const verifiedToken = jwt.verify(
      //   jwtToken,
      //   config.authentication.jwtSecret 
      // )
      // logger.info('verifiedToken: ', verifiedToken)
      // // проверяем юзера в базе:
      // let userToken = null
      // userToken = await Users.findOne({ 
      //   where: { email: verifiedToken.email }
      // })
      // if (!userToken) {
      //   logger.info('Wrong email from token, send status: 404')
      //   res.status(404).send({
      //     error: 'Wrong email from token'
      //   })
      // }

      let user = null
      if ( req.query.sessionId !== undefined ) {
        logger.info('userBySessionId query sessionId: ', req.query.sessionId)
        user = await Users.findOne({ 
          where: { sessionId: req.query.sessionId }
        })
      } else {
        logger.info('userBySessionId query email: ', verifiedToken.email)
        user = await Users.findOne({ 
          where: { email: verifiedToken.email }
        })
      }

      if (user) {
        logger.info('user send status: OK')
        res.status(200).send({
          name: user.name,
          email: user.email,
          sessionId: user.sessionId,
          token: user.commonToken,
          status: "Ok" 
        })  
      } else {
        logger.info('user send status: 404')
        res.status(404).send({
          error: 'The user is not found'
        })
      }
    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error')
      }
      res.status(500).send({
        error: 'Get user error or wrong token'
      })
    }
  },

  async users (req, res) {
    try {
      logger.info('users req.body: ', req.body)
      let users = null
      users = await Users.findAll(({
          limit: config.db.limit
        }))

      if (users.length > 0) {
        logger.info('user send status: OK')
        res.status(200).send(
          users
        )  
      } else {
        logger.info('user send status: 404')
        res.status(404).send({
          error: 'The user is not found'
        })
      }
    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error')
      }
      res.status(500).send({
        error: 'Get user error'
      })
    }
  },
  async register (req, res) {
    try {
      logger.info('register req.body: ', req.body)

      // Проверка на то что пользователь существует
      let userCheck = await Users.findOne({
         where: {
           email: req.body.email
        }
      })

      if (userCheck && !(userCheck.loginState.indexOf('idle') >= 0)) { // если idle далее сделаем новый 
         if (userCheck.loginState.indexOf('password') >= 0) { // уже есть аккаунт с паролем
          logger.error('User with email: ' +  req.body.email + ' already exists.')
          res.status(400).send({
            error: 'User with email: ' +  req.body.email + ' already exists.'
          })
          return
        }         

        if (userCheck.loginState.indexOf('google') >= 0) { // уже есть google account
          // связываем google account:
          logger.info('Google account found for email: ' +  req.body.email + ' bind now.')

          let userToUpdate = {}
          userToUpdate.lastLogin = Date.now()
          userToUpdate.name = req.body.name
          userToUpdate.password = bcrypt.hashSync(req.body.password, 10)
          userToUpdate.sessionId = internalTools.sessionId(req.body.email)      
          userToUpdate.commonToken = internalTools.getToken(req.body.email) 
          userToUpdate.loginState = 'active+google+password'

          await Users.update(userToUpdate, {
          where: {
            email: req.body.email
          }
        })      
        logger.info('User update ok')    

          res.setHeader('X-CSRF-Token', userCheck.sessionId)
          res.status(200).send({ 
            name: userCheck.name,
            email: userCheck.email,
            sessionId: userCheck.sessionId,
            token: userCheck.commonToken,
            status: "Bind Ok"
          })
        } else { // нет google account
          logger.info('No Google account for email: ' +  req.body.email + ' ignore.')
          res.status(400).send({
            error: 'User with email: ' +  req.body.email + ' already exists.'
          })
       }
       return
      } // юзер уже был в базе

      let userToCreate = {}
      userToCreate.uuid = uuid.v4() // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      userToCreate.name = req.body.name
      userToCreate.email = req.body.email
      userToCreate.password = bcrypt.hashSync(req.body.password, 10)
      userToCreate.lastLogin = Date.now()
      userToCreate.googleToken = null
      userToCreate.googleAccessToken = null
      userToCreate.googleRefreshToken = null
      userToCreate.sessionId = internalTools.sessionId(req.body.email)      
      userToCreate.commonToken = internalTools.getToken(req.body.email) 

      userToCreate.loginState = 'active+password'
      logger.debug(userToCreate)

      let user = null
      if (userCheck && (userCheck.loginState.indexOf('idle') >= 0)) { //если уже был, то  update:
        user = await Users.update(userToCreate, {
          where: {
            email: req.body.email
          }
        })
      } else {
        user = await Users.create(userToCreate)
      }

      // let userJson = user.toJSON()
      logger.info('User create ok userJson: ', userToCreate)    

      res.setHeader('X-CSRF-Token', userToCreate.sessionId)
      res.status(200).send({ 
        name: userToCreate.name,
        email: userToCreate.email,
        sessionId: userToCreate.sessionId,
        token: userToCreate.commonToken,
        status: "Ok"
      })        
    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error')
      }
      res.status(500).send({
        error: 'Get user error'
      })
    }
  },

  async login (req, res) {
    try {
      logger.info('login req.body: ', req.body)
      
      let userCheck = await Users.findOne({
          where: {
          email: req.body.email
        }
      })

      if (!userCheck) {        
        logger.error('User with email: ' +  req.body.email + ' not exists.')
        res.status(403).send({ error: 'Wrong login information' })       
        return
      }
  
      if (userCheck.loginState.indexOf('idle') >= 0) { // неактивный юзер
        logger.info('User with email: ' +  req.body.email + ' exists but idle.')
        res.status(403).send({ error: 'Wrong login information' })       
        return
      }

      if (userCheck.password === null) {
        logger.info('User with email: ' +  req.body.email + ' exists but no password.')
        res.status(403).send({ error: 'Wrong login information' })       
        return
      }
      // check password
      let isValid = bcrypt.compareSync(req.body.password, userCheck.password)
      logger.info('password: ' +  req.body.password + ' from db: ' + userCheck.password + 'result: ' + isValid)
      if (!isValid) {        
        logger.error('Wrong user password: ' +  req.body.password)
        res.status(403).send({ error: 'Wrong login information' })       
        return
      }

      let userToUpdate = {}
      userToUpdate.lastLogin = Date.now()
      userToUpdate.sessionId = internalTools.sessionId(req.body.email)      
      userToUpdate.commonToken = internalTools.getToken(req.body.email)      
      await Users.update(userToUpdate, {
        where: {
          email: req.body.email
        }
      })      
      logger.info('User update ok')    
      res.status(200).send(
        { 
          name: userCheck.name,
          email: userCheck.email,
          sessionId: userToUpdate.sessionId,
          token: userToUpdate.commonToken,  
          titleColor: "blue darken-3", 
          status: "Ok"    
      })        
    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error')
      }
      res.status(500).send({
        error: 'Login user error'
      })
    }
  },
  async delete (req, res) {
    try {
      logger.info('delete req.body: ', req.body)
      
      let userCheck = await Users.findOne({
          where: {
          email: req.body.email
        }
      })

      if (!userCheck) {        
        logger.error('User with email: ' +  req.body.email + ' not exists.')
        res.status(403).send({ error: 'Wrong login information' })       
        return
      }
      if (userCheck.loginState.indexOf('idle') >= 0) { //если уже был удален:
        logger.error('User with email: ' +  req.body.email + ' exists but idle.')
        res.status(403).send({ error: 'Wrong login information' })       
        return
      }
      if (userCheck.loginState.indexOf('password') >=0 ) { // active+password
        if (userCheck.password === null) {
          logger.info('User with email: ' +  req.body.email + ' exists but no password.')
          res.status(403).send({ error: 'Wrong login information' })       
          return
        }
        // check password
        let isValid = bcrypt.compareSync(req.body.password, userCheck.password)
        logger.info('password: ' +  req.body.password + ' from db: ' + userCheck.password + 'result: ' + isValid)
        if (!isValid) {        
          logger.error('Wrong user password: ' +  req.body.password)
          res.status(403).send({ error: 'Wrong login information' })       
          return
        }
      } else { // google, проверяем токен
        // достаем токен из таблицы, проверяем токен на валидность:
        const verifiedToken = jwt.verify(
          userCheck.googleToken,
          process.env.JWT_SECRET
        )
        logger.info('verifiedToken: ', verifiedToken)
        // // проверяем что юзера совпадают:
        if (verifiedToken.email != req.body.email) {
          logger.error('Wrong users not the same: ' +  verifiedToken.email + ' and: ' + req.body.email)
          res.status(403).send({ error: 'Wrong login information' })       
          return
        }
      }

      let userToUpdate = {}
      userToUpdate.lastLogin = Date.now()
      userToUpdate.password = null     
      userToUpdate.sessionId = null   
      userToUpdate.commonToken = null
      userToUpdate.googleToken = null
      userToUpdate.googleRefreshToken = null
      userToUpdate.googleAccessToken = null
      userToUpdate.loginState = 'idle'

      await Users.update(userToUpdate, {
        where: {
          email: req.body.email
        }
      })      
      logger.info('User update ok')    

      res.status(200).send(
        { 
          name: req.body.name,
          email: req.body.email,
          status: "Ok"    
      })        
    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error')
      }
      res.status(500).send({
        error: 'Delete user error'
      })
    }
  },

  async redirectGoogle (req, res) {
    try {
      logger.info('redirectGoogle req.query: ', req.query)
      let code
      if (req.query.code) {
        code = req.query.code
      }
      let state
      if (req.query.state) {
        state = req.query.state
      }

      const callGoogle = axios.create({
        baseURL: config.googleLogin.googleApi,
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        }        
      })      

      let queryString = '/token?'
      if (code) {
        queryString += 'code=' + code + '&'
      }      

      queryString += 
      'client_id' + '=' + process.env.GOOGLE_CLIENT_ID + '&' +
      'client_secret' + '=' + process.env.GOOGLE_CLIENT_SECRET + '&' +
      'grant_type=authorization_code&' +
      'redirect_uri' + '=' + process.env.GOOGLE_REDIRECT_URI
      logger.info('redirectGoogle queryString: ', queryString)

      let response = await callGoogle.post(queryString)
      logger.info('redirectGoogle response status: ', response.status)
      logger.info('redirectGoogle response data: ', response.data)

      // Приходит такой ответ:
      //
      // redirectGoogle response data:  {
      //   access_token: 'ya29.a0AfH6SMA',
      //   expires_in: 3599,
      //   refresh_token: '1//0cHpEvLOZCod4CgYIAR',
      //   scope: 'openid https://www.googleapis.com/auth/userinfo.email',
      //   token_type: 'Bearer',
      //   id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImIxNmRlMWIyY'
      // }
      
      // get new Tokin using refresh token:
      // refresh_token = '1//0cHpEvLOZCod4CgYIARAAGAwSNwF-L9IroieHAoD6iD5qLMRdhVhkZf4bcgiURaCdV8y8o4sDScp1TLfyJskbkaggDiVgl7w2jR4',

      // queryString = '/token?' +
      // 'client_id' + '=' + config.googleLogin.client_id + '&' +
      // 'client_secret' + '=' + config.googleLogin.client_secret + '&' +
      // 'grant_type=refresh_token&' +
      // 'refresh_token' + '=' + refresh_token
      // console.log('redirectGoogle queryString: ', queryString)
      // response = await callGoogle.post(queryString)
      // console.log('refresh_token response status: ', response.status)
      // console.log('refresh_token response data: ', response.data)

      // res.status(200).send()
 
      let decodedIdToken = jwt.decode(response.data.id_token)
      logger.info('decodedIdToken: ', decodedIdToken)
//       iss: 'https://accounts.google.com',
//       azp: '918962537901-gi8oji3qk312pqdhg5bcju4hpr3efknv.apps.googleusercontent.com',
//       aud: '918962537901-gi8oji3qk312pqdhg5bcju4hpr3efknv.apps.googleusercontent.com',
//       sub: '117430744854320010353',
//       email: 'alexey.p.sushkov@gmail.com',
//       email_verified: true,
//       at_hash: 'g88_PrMFpev3Vr_PjC8RLg',
//       iat: 1591690407,
//       exp: 1591694007

      // ручная проверка на время жизни:
      const now = Date.now().valueOf() / 1000
      if (typeof decodedIdToken.exp !== undefined && decodedIdToken.exp < now) {
        logger.info('token expired')
      } else {
        logger.info('token NOT expired')
      }

      // общая проверка на валидность Google токена:

      // сертификат берет отсюда
      // https://www.googleapis.com/oauth2/v1/certs
      // на 14.07.2020
    //   let key = '-----BEGIN CERTIFICATE-----\nMIIDJjCCAg6gAwIBAgIIXaCxByfTdtEwDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0yMDA3MTEwNDI5MzZaFw0yMDA3MjcxNjQ0MzZaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wggEiMA0GCSqG\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDMI0T4VYUgzt6L97yGqNbcxOd0cnGlDVok\nQW4OPNeqVOSgX+YOBkjKdQ7PKlQO19bE3zX6Ks2gIhg1BBqbzM7+CRCvdpeZjqhc\nJ3JdvbhgPSi53GO0gZoqQ8H0N8Rmwpq3pgD0xgWDfGSUsCdya+SxzxOq7+4HVTef\nVdwpRvXYWGRQRQlUFkg2jvhoi0TCxjH1nJOSoQme8v1gGNrd3BI43R+bwMP9J54W\n/uxFCFxANQdhmPqOOIt9cRDMaatvLNpsZtV/MVkPRft6UYi1egmh9vVRdp078r+N\nURer+O2trsC3aMktgvBEVcb4eFEjv6qw8B3DxCel4PLZ6PyT3MI/AgMBAAGjODA2\nMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1UdJQEB/wQMMAoGCCsG\nAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4IBAQDCwcex3zVAt/KWSoUvrpalLrPvCNEF\nmRf+k0c2H2FSO6qei+jeTllSMsgZzuEdXsh9hTiVtKa78kk5NiWC0GGmOHMssWLD\ni8TrO0VzAu5SYrwReWEyTc6g8tzqK8TL6iKi4onjWWGzg4NZA5HT0lARsuPwL5Cc\nMcliWXuVhg2WvFDNFkzSiL92Kz0QAEraTHroBpL41Aybqo+ydkrf2n8aZnQjmXAa\nu6cnsSrMSnfTw8oOOQWkzzgqNPJSKNdlvXGB9+ATut6WeHcrknd+NMFqrXdRWLJ/\nXxVomErLAOrCI/Z/MX/lthDM0v3KGCGzM5AJx5cKQk0dCDzCoe9SA2yq\n-----END CERTIFICATE-----\n'
    //   const verifiedGoogleToken = jwt.verify(
    //     response.data.id_token,
    //     key,
    //     { algorithms: ['RS256'] }         
    //   )
    //   logger.info('verifiedGoogleToken: ', verifiedGoogleToken)        
          
      // Проверка на то что пользователь существует
      let userCheck = await Users.findOne({
        where: {
          email: decodedIdToken.email
       }
     })
  
     if (userCheck && !(userCheck.loginState.indexOf('idle') >= 0)) { // юзер существует и активный
        logger.info('Google user with email: ' +  decodedIdToken.email + ' already exists.')
        // проверка - может надо связать аккаунты?
        // но на самом деле связывавание ничем не отличается от просто логина
  
        let userToUpdate = {}
        userToUpdate.lastLogin = Date.now()
        userToUpdate.commonToken = internalTools.getToken(decodedIdToken.email) 
        userToUpdate.googleToken = response.data.id_token
        userToUpdate.googleAccessToken = response.data.access_token
        if (response.data.refresh_token !== undefined) {
          userToUpdate.googleRefreshToken = response.data.refresh_token
        } else {
          logger.info('refresh_token is absent.')
        }
        userToUpdate.sessionId = state // полученный из клиента через google
        if (userCheck.loginState.indexOf('password') >=0 ) { // active+google+password
          userToUpdate.loginState = 'active+google+password'
        } else {
          userToUpdate.loginState = 'active+google'
        }
        await Users.update(userToUpdate, {
          where: {
            email: decodedIdToken.email
          }
        })      
        logger.info('User update ok')    
      } else {  // создаем нового юзера:
        let userToCreate = {}
        userToCreate.uuid = uuid.v4() // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        userToCreate.name = decodedIdToken.email
        userToCreate.email = decodedIdToken.email
        userToCreate.password = null
        userToCreate.lastLogin = Date.now()
        userToCreate.loginState = 'active+google'
        userToCreate.googleToken = response.data.id_token
        userToCreate.googleAccessToken = response.data.access_token
        if (response.data.refresh_token !== undefined) {
          userToCreate.googleRefreshToken = response.data.refresh_token
        } else {
          logger.info('refresh_token is absent.')
        }
        userToCreate.sessionId = state // полученный из клиента через google
        userToCreate.commonToken = internalTools.getToken(decodedIdToken.email) 

        let user = null
        if (userCheck && (userCheck.loginState.indexOf('idle') >= 0)) { //если уже был, то update:
          user = await Users.update(userToCreate, {
            where: {
              email: decodedIdToken.email
            }
          })
        } else {
          user = await Users.create(userToCreate)
        }        

        // let userJson = user.toJSON()
        logger.info('User create ok: ', userToCreate)
      } // создали нового юзера.

      res.setHeader('Location',  process.env.GOOGLE_REDIRECT_TO_CLIENT)
      res.status(307).send()

    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error')
      }
      res.status(500).send({
        error: 'Google login user error'
      })
    }
  }
} // module.exports