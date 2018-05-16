'use strict'

// eslint-disable-next-line node/no-deprecated-api
const Domain = require('domain')

const { correlateSession } = require('./session')

const CORRELATION_ID_HEADER = 'Correlation-Id'
const AUTH_TOKEN_HEADER = 'Auth-Token'

exports.correlationMiddleware = (req, res, next) => {
  const domain = Domain.create()

  req.correlationId = res.headers[CORRELATION_ID_HEADER.toLowerCase()]
  req.authToken = res.headers[AUTH_TOKEN_HEADER.toLowerCase()]

  domain.add(req)
  domain.add(res)

  domain.run(() => {
    correlateSession(req.correlationId, req.authToken)

    next()
  })
}
