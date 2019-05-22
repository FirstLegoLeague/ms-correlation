const chai = require('chai')
const proxyquire = require('proxyquire')
const spies = require('chai-spies')

chai.use(spies)
const expect = chai.expect

const CORRELATION_ID = 'correlation'
const AUTH_TOKEN = 'authentication'

const mockDomain = {
  add: () => { },
  run: callback => { mockDomain.runCallback = callback }
}
const session = { correlateSession: () => { } }
const domain = { create: () => mockDomain }
const cookie = { parse: () => ({ 'auth-token': AUTH_TOKEN }) }
let next = () => { }
const req = {
  headers: {
    'correlation-id': CORRELATION_ID,
    'auth-token': AUTH_TOKEN,
    cookie: ''
  }
}
const res = { }

session.correlateSession = chai.spy(session.correlateSession)
domain.create = chai.spy(domain.create)
mockDomain.add = chai.spy(mockDomain.add)
next = chai.spy(next)

const { correlationMiddleware } = proxyquire('../../lib/middleware', {
  domain,
  cookie,
  './session': session
})

describe('correlationMiddleware', () => {
  it('creates a domain', () => {
    correlationMiddleware(req, res, next)
    expect(domain.create).to.have.been.called()
  })

  it('adds the request to the domain', () => {
    correlationMiddleware(req, res, next)
    expect(mockDomain.add).to.have.been.called.with(req)
  })

  it('adds the response to the domain', () => {
    correlationMiddleware(req, res, next)
    expect(mockDomain.add).to.have.been.called.with(res)
  })

  it('calls domain.run and runs correlateSession and next in it', () => {
    correlationMiddleware(req, res, next)
    mockDomain.runCallback()
    expect(session.correlateSession).to.have.been.called.with(CORRELATION_ID, AUTH_TOKEN)
    expect(next).to.have.been.called()
  })

  it('extracts the correct authentication from cookies', () => {
    req.headers['auth-token'] = undefined
    correlationMiddleware(req, res, next)
    mockDomain.runCallback()
    expect(session.correlateSession).to.have.been.called.with(CORRELATION_ID, AUTH_TOKEN)
    expect(next).to.have.been.called()
  })
})
