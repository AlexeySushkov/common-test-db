const config = require('../config/config')
let log4js = require('log4js')
let logger = null
if ( config.consoleLog ) {
 logger = log4js.getLogger()
} else {
 logger = log4js.getLogger('access')
}

module.exports = logger
