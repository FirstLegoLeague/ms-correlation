const chai = require('chai')
const proxyquire = require('proxyquire')
const spies = require('chai-spies')
const Domain = require('domain') // eslint-disable-line node/no-deprecated-api

chai.use(spies)
const expect = chai.expect

let jwtDecodeSpy
let generateIdSpy

const session = proxyquire('../../lib/session', {
  jsonwebtoken: {
    decode () {
      return jwtDecodeSpy.apply(this, arguments)
    }
  },
  './correlation-id': {
    generateCorrelationId () {
      return generateIdSpy.apply(this, arguments)
    }
  }
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
    let authData

    beforeEach(() => {
      authData = {}
      jwtDecodeSpy = chai.spy(() => authData)
    })

    afterEach(() => {
      jwtDecodeSpy = null
    })

    it('fails when session haven\'t correlated', () => {
      expect(() => session.authenticate('auth-token'))
        .to.throw('Session is not correlated yet')
    })

    it('fails when session already authenticated', () => {
      domain[sessionSymbol] = {}
      domain[sessionSymbol].authData = {}

      expect(() => session.authenticate('auth-token'))
        .to.throw('Authentication already happened in this session')
    })

    it('decode the given token', () => {
      domain[sessionSymbol] = {}
      session.authenticate('auth-token')

      expect(jwtDecodeSpy).to.be.called.with('auth-token')
    })

    it('saves the authentication data on domain', () => {
      domain[sessionSymbol] = {}
      session.authenticate('auth-token')

      expect(domain[sessionSymbol].authData).to.be.equals(authData)
    })
  })

  describe('correlation', () => {
    let correlationId

    beforeEach(() => {
      generateIdSpy = chai.spy(() => correlationId)
    })

    afterEach(() => {
      correlationId = null
      generateIdSpy = null
    })

    it('fails when session already correlated', () => {
      domain[sessionSymbol] = {}

      expect(() => session.correlateSession())
        .to.throw('already correlated')
    })

    it('saves the generated a correlation id on domain', () => {
      correlationId = 'cor-id'
      session.correlateSession()

      expect(domain[sessionSymbol].correlationId).to.be.equal('cor-id')
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
