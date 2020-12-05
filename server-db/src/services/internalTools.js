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

    async checkDataOwner(id, uuid) {
      try {
        logger.info('checkDataOwner id: ', id, ' uuid: ', uuid)
  
        let data = await db.sequelize.query(`SELECT * FROM "Data" WHERE id > 0 AND "ownerUuid" = :uuid AND data ->> 'id' = :id LIMIT :limit;`, { replacements: { uuid: uuid, id: id, limit: config.db.limit } })
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
          let userToUpdate = {}
          userToUpdate.lastLogin = Date.now()
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
             uuid: userToken.uuid
         }
       },
}
