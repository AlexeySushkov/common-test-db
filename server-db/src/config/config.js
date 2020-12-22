const path = require('path')
let log4js = require('log4js')
let logger = log4js.getLogger() // for console
// let logger = log4js.getLogger('access') // for files
var sequelizeLogger = function(msg) {
  logger.info('Sequelize -', msg)
}

module.exports = {
  port: process.env.PORT || 8081,
  consoleLog: true, // log to console
  // consoleLog: false, // log to files
  db: {
    database: process.env.DB_NAME || 'ServerDB',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    limit: 1000,
    options: {
      logging: sequelizeLogger, // log db output to file
      // logging: true, // log db output to console
      // dialect: process.env.DIALECT || 'postgres',
      // host: process.env.HOST || 'localhost'
      dialect: process.env.DIALECT || 'sqlite',
      storage: path.resolve(__dirname, '../../CommonTestDB.sqlite')
    }
  },
  googleLogin: {
    // for use on server
    googleApi: 'https://oauth2.googleapis.com',
    // for use on client
    googleAuth: 'https://accounts.google.com/o/oauth2/v2/auth',
    response_type: 'code',
    scope: 'openid email'
  },
  cors: {
      "origin": "*",
      "methods": "GET,POST,PUT,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }          
}
