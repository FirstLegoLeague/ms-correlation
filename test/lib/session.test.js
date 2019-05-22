const chai = require('chai')
const proxyquire = require('proxyquire')
const spies = require('chai-spies')
const Domain = require('domain') // eslint-disable-line node/no-deprecated-api

chai.use(spies)
const expect = chai.expect

const AUTH_DATA = {}
const CORRELATION_ID = 'abc123456'

const jwt = {
  verify: () => AUTH_DATA
}
const correlationId = {
  generateCorrelationId: () => CORRELATION_ID
}

jwt.verify = chai.spy(jwt.verify)
correlationId.generateCorrelationId = chai.spy(correlationId.generateCorrelationId)

const session = proxyquire('../../lib/session', {
  jsonwebtoken: jwt,
  './correlation-id': correlationId
})

const sessionSymbol = Symbol.for('session')

describe('session', () => {
  let domain

  beforeEach(() => {
    domain = Domain.create()
    domain.enter()
  })

  afterEach(() => {
    domain.exit()
  })

  describe('authentication', () => {
    const authToken = 'AUTHENTICATION'

    it('fails when session haven\'t correlated', () => {
      expect(() => session.authenticate(authToken))
        .to.throw('Session is not correlated yet')
    })

    it('fails when session already authenticated', () => {
      domain[sessionSymbol] = {}
      domain[sessionSymbol].authData = {}

      expect(() => session.authenticate(authToken))
        .to.throw('Authentication already happened in this session')
    })

    it('verify the given token', () => {
      domain[sessionSymbol] = {}
      session.authenticate(authToken)

      expect(jwt.verify).to.be.called.with(authToken)
    })

    it('saves the authentication data on domain', () => {
      domain[sessionSymbol] = {}
      session.authenticate(authToken)

      expect(domain[sessionSymbol].authData).to.be.equals(AUTH_DATA)
    })
  })

  describe('correlation', () => {
    it('fails when session already correlated', () => {
      domain[sessionSymbol] = {}

      expect(() => session.correlateSession())
        .to.throw('already correlated')
    })

    it('saves the generated a correlation id on domain', () => {
      session.correlateSession()

      expect(domain[sessionSymbol].correlationId).to.be.equal(CORRELATION_ID)
    })

    it('saves the given correlation id on domain', () => {
      session.correlateSession('given-id')

      expect(domain[sessionSymbol].correlationId).to.be.equal('given-id')
    })

    it('authenticates when given auth-token', () => {
      const originalAuthenticate = session.authenticate
      session.authenticate = chai.spy(() => {})
      session.correlateSession('given-id', 'auth-token')

      expect(session.authenticate).to.be.called.with('auth-token')
      session.authenticate = originalAuthenticate
    })

    it('authenticates when given auth-token', () => {
      const originalAuthenticate = session.authenticate
      session.authenticate = chai.spy(() => {})
      session.correlateSession('given-id', 'auth-token')

      expect(session.authenticate).to.be.called.with('auth-token')
      session.authenticate = originalAuthenticate
    })
  })

  describe('correlation id', () => {
    it('is taken from domain', () => {
      domain[sessionSymbol] = { correlationId: 'cor-id' }

      expect(session.getCorrelationId()).to.be.equals('cor-id')
    })

    it('is null when session is not correlated', () => {
      expect(session.getCorrelationId()).to.be.equals(null)
    })

    it('is null when when acquired outside of session', () => {
      domain.exit()

      expect(session.getCorrelationId()).to.be.equals(null)
    })
  })

  describe('authentication data', () => {
    it('is taken from domain', () => {
      const authData = {}
      domain[sessionSymbol] = { authData }

      expect(session.getAuthenticationData()).to.be.equals(authData)
    })

    it('is null when session is not correlated', () => {
      expect(session.getAuthenticationData()).to.be.equals(null)
    })

    it('is null when when acquired outside of session', () => {
      domain.exit()

      expect(session.getAuthenticationData()).to.be.equals(null)
    })
  })
})
