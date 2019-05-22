const chai = require('chai')
const proxyquire = require('proxyquire')
const spies = require('chai-spies')

chai.use(spies)
const expect = chai.expect

const jwt = {
  verify: () => true
}
const correlationId = {
  generateCorrelationId: () => true
}

jwt.verify = chai.spy(jwt.verify)
correlationId.generateCorrelationId = chai.spy(correlationId.generateCorrelationId)

const session = proxyquire('../../lib/session', {
  jsonwebtoken: jwt,
  './correlation-id': correlationId
})

describe('session', () => {
  describe('authenticate', () => {
    const authToken = 'AUTHENTICATION'

    it('throws an error if the domain does not have a correlated session', () => {
      expect(() => session.authenticate(authToken))
        .to.throw('Session is not correlated yet')
    })
  })
})
