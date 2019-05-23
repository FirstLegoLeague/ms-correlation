const { correlationMiddleware } = require('./lib/middleware')
const { correlateSession, getCorrelationId, getAuthenticationData } = require('./lib/session')

exports.correlationMiddleware = correlationMiddleware
exports.correlateSession = correlateSession
exports.getCorrelationId = getCorrelationId
exports.getAuthenticationData = getAuthenticationData
