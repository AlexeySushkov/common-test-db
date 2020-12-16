const dotenv = require('dotenv')
dotenv.config()
const uuid = require('uuid')
const db = require('../models/index')
const config = require('../config/config')
const internalTools = require('./internalTools')
const logger = require('./logger')


module.exports = {
 
  
  async getData (req, res) {
    try {
      logger.info('getData')
      let updateInvalidTokenRes = await internalTools.updateInvalidToken(req)
      logger.debug('internalTools.updateInvalidToken returns: ', updateInvalidTokenRes)
      
      if (updateInvalidTokenRes === null) {
        throw 'Update token error'
      }    
      
      let data = null
      
      data = await db.sequelize.query(`SELECT * FROM "Data"  WHERE id > 0 LIMIT :limit;`, { replacements: { limit: config.db.limit } })
      if (data[0].length > 0) {
        logger.info('getData send status: Ok: ', data)

        // getData send status: Ok:  [
        //   [
        //     {
        //       id: 1,
        //       uuid: '8f9f0f16-6cc1-4419-a60e-5dcedd7429f4',
        //       ownerUuid: '1ee8a237-bc66-4b31-a3d1-d24b3da9e800',
        //       data: '{"data":{"Counter1":"1","Counter2":"2"}}',
        //       createdAt: '2020-12-03 20:07:55.912 +00:00',
        //       updatedAt: '2020-12-03 20:07:55.912 +00:00'
        //     }
        //   ],
        //   Statement {}
        // ]        

        // postgres:
        // [2020-12-04T12:42:50.674] [INFO] default - getData send status: Ok:  [
        //   [
        //     {
        //       id: 4,
        //       uuid: '32292dac-fcb1-4d97-855a-1b6e3aa70dc8',
        //       ownerUuid: '26c88fad-277a-4012-8e91-f4078ad5241a',
        //       data: [Object],
        //       createdAt: 2020-12-01T20:03:55.475Z,
        //       updatedAt: 2020-12-01T20:03:55.475Z
        //     }

        // logger.info('data.uuid: ', data.uuid)
        // logger.info('data.data: ', data.data)
        // const jsonParseData = JSON.parse(data.data); 
      // logger.info('jsonParseData: ', jsonParseData)
      // data.data = jsonParseData

      // const jsonData = JSON.stringify(data);
      const jsonData = data

        res.status(200).send(
          jsonData
      )  
      } else {
        res.status(404).send(
          { error: 'No data found'}
        )  
      }
    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error')
      }
      res.status(500).send({
        error: 'Get data error'
      })
    }
  },

  
  async newData (req, res) {
    try {
      logger.info('newData req.body: ', req.body)
      let updateInvalidTokenRes = await internalTools.updateInvalidToken(req)
      // logger.debug('internalTools.updateInvalidToken returns: ', updateInvalidTokenRes)
      if (updateInvalidTokenRes === null) {
        throw 'Update token error'
      }    
            
      let dataToCreate = {}
      dataToCreate.UserId = updateInvalidTokenRes.id
      dataToCreate.uuid = uuid.v4() // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      dataToCreate.ownerUuid = updateInvalidTokenRes.uuid
      dataToCreate.data = req.body
      logger.debug(dataToCreate)

      await db.Data.create(dataToCreate)

      // let userJson = user.toJSON()
      logger.info('Data create ok')   

      res.status(200).send({ 
        status: "Ok",
        sessionId: updateInvalidTokenRes.sessionId,
        token: updateInvalidTokenRes.token
      })        
    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error')
      }
      res.status(500).send({
        error: 'Create data error'
      })
    }
  },

  async deleteData (req, res) {
    try {
      logger.info('deleteData query: ', req.query)
      let updateInvalidTokenRes = await internalTools.updateInvalidToken(req)
      if (updateInvalidTokenRes === null) {
        throw 'Update token error'
      }     

      let checkOwner = await internalTools.checkDataOwner(req.query.uuid, updateInvalidTokenRes.uuid)     
      if ( checkOwner === null) {
        throw 'Check data owner error'
      } 

      await db.Data.destroy( {
        where: {
          uuid: req.query.uuid
        }
      })      
      logger.info('Data delete ok')    


      res.status(200).send({ 
        status: "Ok",
        sessionId: updateInvalidTokenRes.sessionId,
        token: updateInvalidTokenRes.token
      })        

    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        logger.error('Error status: ', error.response.status, ', message: ', error.response.data.error)
      } else {
        logger.error('No connection to the server or other error: ', error)
      }
      res.status(500).send({
        error: 'Delete data error'
      })
    }
  }

} // module.exports