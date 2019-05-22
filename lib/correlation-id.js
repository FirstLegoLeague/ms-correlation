const randomize = require('randomatic')

exports.generateCorrelationId = () => {
  return randomize('Aa0?', 16, { chars: '+/' })
}
