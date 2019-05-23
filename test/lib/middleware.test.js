const chai = require('chai')
const proxyquire = require('proxyquire')
const spies = require('chai-spies')

chai.use(spies)
const expect = chai.expect

const CORRELATION_ID = 'correlation'
const AUTH_TOKEN = 'authentication'

let createDomianSpy
let correlateSessionSpy
let nextSpy
let mockDomain
let runCallback

const mockReq = {
  headers: {
    'correlation-id': CORRELATION_ID,
    'auth-token': AUTH_TOKEN,
    cookie: ''
  }
}
const mockRes = { }

const { correlationMiddleware } = proxyquire('../../lib/middleware', {
  domain: {
    create () {
      return createDomianSpy.apply(this, arguments)
    }
  },
  cookie: {
    parse () {
      return { 'auth-token': AUTH_TOKEN }
    }
  },
  './session': {
    correlateSession () {
      return correlateSessionSpy.apply(this, arguments)
    }
  }
})

describe('Correlation middleware', () => {
  beforeEach(() => {
    mockDomain = {
      add: chai.spy(() => { }),
      run: chai.spy(callback => { runCallback = callback })
    }
    createDomianSpy = chai.spy(() => mockDomain)
    correlateSessionSpy = chai.spy(() => { })
    nextSpy = chai.spy(() => { })
  })

  afterEach(() => {
    mockDomain = null
    createDomianSpy = null
    correlateSessionSpy = null
    nextSpy = null
  })

  it('creates a domain', () => {
    correlationMiddleware(mockReq, mockRes, nextSpy)
    expect(createDomianSpy).to.have.been.called()
  })

  it('adds the mockRequest to the domain', () => {
    correlationMiddleware(mockReq, mockRes, nextSpy)
    expect(mockDomain.add).to.have.been.called.with(mockReq)
  })

  it('adds the mockResponse to the domain', () => {
    correlationMiddleware(mockReq, mockRes, nextSpy)
    expect(mockDomain.add).to.have.been.called.with(mockRes)
  })

  it('calls domain.run', () => {
    correlationMiddleware(mockReq, mockRes, nextSpy)
    expect(mockDomain.run).to.have.been.called()
  })

  it('correlates the session in the domain.run callback', () => {
    correlationMiddleware(mockReq, mockRes, nextSpy)
    runCallback()
    expect(correlateSessionSpy).to.have.been.called()
  })

  it('calls `next` in the domain.run callback', () => {
    correlationMiddleware(mockReq, mockRes, nextSpy)
    runCallback()
    expect(nextSpy).to.have.been.called()
  })

  it('extracts the correct authentication from cookies if it does not exist in headers', () => {
    mockReq.headers['auth-token'] = undefined
    correlationMiddleware(mockReq, mockRes, nextSpy)
    expect(mockDomain.run).to.have.been.called()
  })
})
