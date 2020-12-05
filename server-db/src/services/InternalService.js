const logger = require('./logger')

module.exports = {
    
  async ping (req, res) {
    logger.info('ping req.body: ', req.body)
    logger.info('ping send status: OK')
    res.status(200).send({
      status: 'OK'
    })
  }
} // module.exports