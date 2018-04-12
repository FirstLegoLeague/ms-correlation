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
```

Be aware that both argument of this function are optionals.

## Retrieving correlation data

You can use the function `getCorrelationId` and
`getAuthenticationData` to retrive data on the current session.
