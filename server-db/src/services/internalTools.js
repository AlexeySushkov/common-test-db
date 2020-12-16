const config = require('../config/config')
const { Users } = require('../models')
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const logger = require('./logger')

module.exports = {
    jwtSignUser: function (user) {
        const ONE_WEEK = 60 * 60 * 24 * 7

        return jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: ONE_WEEK
        })
      },
      
    getToken: function(email) {
        return jwt.sign({ email: email }, process.env.JWT_SECRET, {
            // expiresIn: '1m' // 1 мин для тестирования
            expiresIn: '1w'
          })   
    },

    sessionId: function() {
        return  uuid.v4() // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    },

    async checkDataOwner(uuid, ownerUuid) {
      try {
        logger.info('checkDataOwner uuid: ', uuid, ' ownerUuid: ', ownerUuid)
  
        let data = await db.sequelize.query(`SELECT * FROM "Data" WHERE uuid = :uuid AND ownerUuid = :ownerUuid LIMIT :limit;`, { replacements: { uuid: uuid, ownerUuid: ownerUuid, limit: config.db.limit } })
        logger.info('data: ', data)
        logger.info('data[0]: ', data[0].length)
        if (data[0].length > 0) {
          return 'Ok'
        } 
      } catch (error) {}
      return null
    },

    async updateInvalidToken (req) {
        let decodedToken = {}
        let userToken = null
        try {
           // достаем токен из заголовка:  
           let jwtToken = req.headers.authorization.replace('Bearer ', '');
     
           decodedToken = jwt.decode(jwtToken)
           // logger.info('updateInvalidToken, decodedToken: ', decodedToken)
           const expDate = new Date(decodedToken.exp*1000)
           // logger.info('updateInvalidToken, decodedToken expDate: ', expDate.toString())
           // проверяем юзера в базе:
           userToken = await Users.findOne({ 
             where: { email: decodedToken.email }
           })
           if (!userToken) {
             logger.info('updateInvalidToken, Wrong email from token')
             return null
           }
           // проверяем токен на валидность:
           const verifiedToken = jwt.verify(
             jwtToken,
             process.env.JWT_SECRET 
           )
           // logger.info('updateInvalidToken, verifiedToken: ', verifiedToken)
        } catch (error) {
            logger.error('updateInvalidToken, Error: ', error, 'try to get new token:')
        }
          
          let lastRequestDate = new Date(userToken.ddosLastRequest)

          logger.info('userToken.requestsNumber: ', userToken.requestsNumber, 'lastRequestDate: ', lastRequestDate.toISOString())
          const maxReguests = 1000 // 1000 requests
          const maxMinutesTimeout = 60 * 60000 // one hour timout
          let userToUpdate = {}

          if ( userToken.ddosRequestsNumber >= maxReguests ) {

            let plusMaxMinutes = new Date(lastRequestDate.getTime() + maxMinutesTimeout)
            let now = new Date (Date.now())
            
            logger.info('plusMaxMinutes: ', plusMaxMinutes.toISOString(), ' now.toISOString(): ', now.toISOString())
   
            if (plusMaxMinutes > now) {
              logger.error('maxReguests and time exceeded!')
              return null
            } else {
              userToUpdate.ddosRequestsNumber = 1
            }
          } else {
            userToUpdate.ddosRequestsNumber = userToken.ddosRequestsNumber + 1     
          }

          userToUpdate.ddosLastRequest = Date.now()
          userToUpdate.sessionId = this.sessionId(decodedToken.email )      
          userToUpdate.commonToken = this.getToken(decodedToken.email )  
          await Users.update(userToUpdate, {
            where: {
              email: decodedToken.email 
            }
          })      
         // logger.info('updateInvalidToken, User update ok')    
         return { 
             sessionId: userToUpdate.sessionId,
             token: userToUpdate.commonToken,
             email: userToken.email,
             uuid: userToken.uuid,
             id: userToken.id
         }
       },
}
