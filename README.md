[![npm](https://img.shields.io/npm/v/@first-lego-league/ms-correlation.svg)](https://www.npmjs.com/package/@first-lego-league/ms-correlation)
[![David Dependency Status](https://david-dm.org/FirstLegoLeague/ms-correlation.svg)](https://david-dm.org/FirstLegoLeague/ms-correlation)
[![David Dev Dependency Status](https://david-dm.org/FirstLegoLeague/ms-correlation/dev-status.svg)](https://david-dm.org/FirstLegoLeague/ms-correlation#info=devDependencies)
[![Build status](https://ci.appveyor.com/api/projects/status/65scfycp2uyg83ri/branch/master?svg=true)](https://ci.appveyor.com/project/2roy999/ms-correlation/branch/master)
[![GitHub](https://img.shields.io/github/license/FirstLegoLeague/ms-correlation.svg)](https://github.com/FirstLegoLeague/ms-correlation/blob/master/LICENSE)

# ms-correlation
A library with function for supporting MS (Module Standard) correlation
section

## Using with middleware

When having frameworks like [express](https://www.express.com/) that
support middlewares. You can use the middleware
`correlationMiddleware` this middleware will also take care of
authentication.

## Using with domain

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

## Retrieving correlation data

You can use the function `getCorrelationId` and
`getAuthenticationData` to retrive data on the current session.
