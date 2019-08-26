const jwt = require('jsonwebtoken')

const { generateCorrelationId } = require('./correlation-id')

const sessionSymbol = Symbol.for('session')

exports.authenticate = authToken => {
  const activeDomain = process.domain

  if (!activeDomain[sessionSymbol]) {
    throw new Error('Session is not correlated yet')
  }

  if (activeDomain[sessionSymbol].authData) {
    throw new Error('Authentication already happened in this session')
  }

  activeDomain[sessionSymbol].authData = jwt.decode(authToken)
}

exports.correlateSession = (correlationId, authToken) => {
  const activeDomain = process.domain

  if (activeDomain[sessionSymbol]) {
    throw new Error('Session is already correlated')
  }

  activeDomain[sessionSymbol] = {
    correlationId: correlationId || generateCorrelationId()
  }

  if (authToken) {
    exports.authenticate(authToken)
  }
}

exports.getCorrelationId = () => {
  if (process.domain && process.domain[sessionSymbol]) {
    return process.domain[sessionSymbol].correlationId
  } else {
    return null
  }
}

exports.getAuthenticationData = () => {
  if (process.domain && process.domain[sessionSymbol]) {
    return process.domain[sessionSymbol].authData
  } else {
    return null
  }
}
