const chai = require('chai')
const proxyquire = require('proxyquire')
const spies = require('chai-spies')

chai.use(spies)
const expect = chai.expect

const MOCK_RESULT = 'mock'
const randomatic = () => MOCK_RESULT

const { generateCorrelationId } = proxyquire('../../lib/correlation-id', { randomatic })

chai.spy(randomatic)

describe('generateCorrelationId', () => {
  it('returns randomize result', () => {
    expect(generateCorrelationId()).to.equal(MOCK_RESULT)
  })
})
