'use strict'

// eslint-disable-next-line node/no-deprecated-api
const Domain = require('domain')

const { correlateSession } = require('./session')

const CORRELATION_ID_HEADER = 'correlation-id'
// const CLIENT_ID_HEADER = 'client-id'

exports.mhubListenerWrapper = listener => {
  return function (message) {
    const domain = Domain.create()

    const correlationId = message.headers[CORRELATION_ID_HEADER]

    domain.run(() => {
      correlateSession(correlationId)

      listener.apply(this, arguments)
    })
  }
}
