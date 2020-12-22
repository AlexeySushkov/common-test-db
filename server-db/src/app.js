const express = require('express');

const app = express();
const { sequelize } = require('./models')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const config = require('./config/config')
var log4js = require('log4js')
const logger = require('./services/logger')


const monitorConfig = {
  title: 'Monitor',
  path: '/monitor',
  healthChecks: [
    {
      protocol: 'http',
      host: 'localhost',
      path: '/ping',
      port: config.port
    },
    {
      protocol: 'http',
      host: 'localhost',
      path: '/wrongRoutePath',
      port: config.port
    }
  ],  
}
// https://www.npmjs.com/package/express-status-monitor
app.use(require('express-status-monitor')(monitorConfig))

const cors = require('cors')
// CORS но все по дефолту:
// app.use(cors()) 

// About CORS
// https://www.npmjs.com/package/cors#simple-usage-enable-all-cors-requests
// let whitelist = config.cors.origin
var corsOptions = {
  // пример origin как функции для вызовов без origin:
  // origin: function (origin, callback) {
  //   if ((whitelist.indexOf(origin) !== -1) || !origin){
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // },
  "origin": config.cors.origin,
  "methods": config.cors.methods,
  "preflightContinue": config.cors.preflightContinue,
  "optionsSuccessStatus": config.cors.optionsSuccessStatus
}
app.use(cors(corsOptions))
app.use(function customErrorHandler(err, req, res, next) {
  res.status(400).send('Not allowed by CORS')
})
// Убираем header 'x-powered-by' и вставляем дефлтные секьюрные заголовки
var helmet = require('helmet') 
app.use(helmet())
app.disable('x-powered-by')

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger/swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production'

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: 'access.log' },
    access: { type: 'dateFile', filename: './logs/access.log', pattern: '.yyyy-MM-dd-hh', daysToKeep: 30, alwaysIncludePattern: false},   
  },
  categories: {
    access: { appenders: ['access'], level: 'debug' },
    default: { appenders: ['console'], level: 'debug' }
  }
 })

 
app.use(log4js.connectLogger(logger, { level: 'info' }));

require('./routes')(app)
 
// HTTP server
// app.listen(config.port)
// logger.info(`Server started on port ${config.port}`)
// console.log(`Server started on port ${config.port}`)

const fs = require('fs')
const https = require('https');

// стандартный для HTTPS порт 443 
const httpsPort = 3000
var key = fs.readFileSync(__dirname + '/certs/server.key')
var cert = fs.readFileSync(__dirname + '/certs/server.crt')

var credentials = {
  key: key,
  cert: cert
}

async function startAll() {
  try {
    console.log('sequelize.sync')
    // true - очистка базы:
      await sequelize.sync({ force: false })
      var httpsServer = https.createServer(credentials, app);

      httpsServer.listen(httpsPort, () => {
        console.log("HTTPS server started on port : " + httpsPort)
        logger.info("HTTPS server started on port : " + httpsPort)
      });
    } catch(err) {
      console.error('sequelize.sync exeption')
      process.exit()
  }
}
startAll()
