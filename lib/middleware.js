// eslint-disable-next-line node/no-deprecated-api
const Domain = require('domain')
const cookie = require('cookie')

const { correlateSession } = require('./session')

const CORRELATION_ID_HEADER = 'Correlation-Id'
const AUTH_TOKEN_HEADER = 'Auth-Token'

exports.correlationMiddleware = (req, res, next) => {
  const domain = Domain.create()

  const correlationId = req.headers[CORRELATION_ID_HEADER.toLowerCase()]
  const authToken = req.headers[AUTH_TOKEN_HEADER.toLowerCase()] ||
    cookie.parse(req.headers.cookie || '')['auth-token']

  domain.add(req)
  domain.add(res)

  domain.run(() => {
    correlateSession(correlationId, authToken)

    next()
  })
}
