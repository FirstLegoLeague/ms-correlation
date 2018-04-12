'use strict'

const { correlationMiddleware } = require('./lib/middleware')
const { correlateSession, getCorrelationId, getAuthenticationData } = require('./lib/session')

module.exports = {
  correlationMiddleware,
  correlateSession,
  getCorrelationId,
  getAuthenticationData
}
