[![npm](https://img.shields.io/npm/v/@first-lego-league/ms-correlation.svg)](https://www.npmjs.com/package/@first-lego-league/ms-correlation)
[![codecov](https://codecov.io/gh/FirstLegoLeague/ms-correlation/branch/master/graph/badge.svg)](https://codecov.io/gh/FirstLegoLeague/ms-correlation)
[![Build status](https://ci.appveyor.com/api/projects/status/65scfycp2uyg83ri/branch/master?svg=true)](https://ci.appveyor.com/project/2roy999/ms-correlation/branch/master)
[![GitHub](https://img.shields.io/github/license/FirstLegoLeague/ms-correlation.svg)](https://github.com/FirstLegoLeague/ms-correlation/blob/master/LICENSE)

[![David Dependency Status](https://david-dm.org/FirstLegoLeague/ms-correlation.svg)](https://david-dm.org/FirstLegoLeague/ms-correlation)
[![David Dev Dependency Status](https://david-dm.org/FirstLegoLeague/ms-correlation/dev-status.svg)](https://david-dm.org/FirstLegoLeague/ms-correlation#info=devDependencies)
[![David Peer Dependencies Status](https://david-dm.org/FirstLegoLeague/ms-correlation/peer-status.svg)](https://david-dm.org/FirstLegoLeague/ms-correlation?type=peer)

# FIRST LEGO Legaue Correlation
A package for server correlation, working according to the _FIRST_ LEGO League TMS [Module Standard correlation section](https://github.com/FirstLegoLeague/architecture/blob/master/module-standard/v1.0-SNAPSHOT.md#cross-module-correlations).

## Logic
The package saves the correlation-id and authentication data using the `domain` feature of node.

## Usage
There are two options to use this library: with middleware or with domain.

### Usage with middleware
When having frameworks like [express](https://www.express.com/) that
support middlewares. You can use the middleware
`correlationMiddleware` this middleware will also take care of
authentication.

### Usage with domain
When not using the middleware you should open a new domain in your
code, and use the function `correlateSession`. For example:
```js
const Domain = require('domain')

const { correlateSession } = require('@first-lego-league/ms-correlation')

someEventEmitter.on('someEvent', event => {
  const correlationId = getCorrelationId(event)
  const authToken = getAuthToken(event)

  Domain.create().run(() => {
    correlateSession(correlationId, authToken)

    handleEvent(event)
  })
})
```

Be aware that both argument of this function are optionals.

### Retrieving correlation data
You can use the function `getCorrelationId` and
`getAuthenticationData` to retrive data on the current session.

## Contribution
To contribute to this repository, simply create a PR and set one of the Code Owners to be a reviewer.
Please notice the linting and UT, because they block merge.
Keep the package lightweight and easy to use.
Thank you for contributing!
