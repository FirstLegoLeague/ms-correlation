const chai = require('chai')
const proxyquire = require('proxyquire')

const expect = chai.expect

const correlationMiddleware = { }
const correlateSession = { }
const getCorrelationId = { }
const getAuthenticationData = { }

const correlation = proxyquire('../', {
  './lib/middleware': { correlationMiddleware },
  './lib/session': { correlateSession, getCorrelationId, getAuthenticationData }
})

describe('ms-correlation index file', () => {
  it('exposes correlationMiddleware', () => {
    expect(correlation.correlationMiddleware).to.equal(correlationMiddleware)
  })

  it('exposes correlateSession', () => {
    expect(correlation.correlateSession).to.equal(correlateSession)
  })

  it('exposes getCorrelationId', () => {
    expect(correlation.getCorrelationId).to.equal(getCorrelationId)
  })

  it('exposes getCorrelationId', () => {
    expect(correlation.getCorrelationId).to.equal(getCorrelationId)
  })
})
