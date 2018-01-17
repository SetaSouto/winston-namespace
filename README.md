# Winston namespace

This package is a *wrapper* for the [winston logger](https://www.npmjs.com/package/winston) that has the functionality to create loggers with *namespaces*, that is that you can log information but with labels, the console will look like:
```
[verifyClient] 2018-1-17 15:50:08.909 - INFO: Client verified
[websocket] 2018-1-17 15:50:08.925 - INFO: New connection. ID: f23ab1ff-f925-4360-9a93-6f9d11e70f3b
[websocket] 2018-1-17 15:50:14.222 - INFO: Received message from f23ab1ff-f925-4360-9a93-6f9d11e70f3b.
[applogic:api] 2018-1-17 15:50:14.222 - INFO: Sending message to app logic
[messagesDispatcher] 2018-1-17 15:50:14.784 - INFO: Dispatching data to user 'f23ab1ff-f925-4360-9a93-6f9d11e70f3b'
```
Where in the `[ ]` is the namespace for clarity. But the power of this wrapper is that you can filter your logs by level (like working only with winston) but also **by namespace**, so you can **debug by module/label/namespace**.

# Usage

The usage is very similar to `winston` with the levels but now is more simple to log by modules.
Create the logger:
``` js
const logger = require('winston-namespace')('namespace')
...
logger.error(new Error('This is an error').stack)
logger.info('This is an info message.')
```
The logger came with its own formatter to show the namespace and the timestamp, but if you want to pass your own options to winston you can:
``` js
const logger = require('winston-namespace')('namespace', {level: 'info'})
```
## Filter
The debug and the silly mode can be disabled by modules. For example if you create a logger with the namespace
`'server'` and another with the namespace `'app'`, in the `LOG_NAMESPACES` environment variable you can write
`'server,app'` (separated by comma) to log both, only `'server'` if you don't want to see debug messages for the `'app'` module or only
`'app'` to see the app's debug messages.
It also has wildcards (`'*'`). For example you can write `'app:api,app:logic,app:controller'`,
or only write `'app:*'` that will work for all the cases that are subspaces of `'app'`. Or in the case that you
want to debug all you can write `LOG_NAMESPACES = *`.
The level of the log is the same as winston and you can set it the in `LOG_LEVEL` env variable. It could be:
 - error
 - warn
 - info
 - debug
 - silly

 Example of filtering:
 ``` js
 const logger1 = require('winston-namespace')('app:api')
 const logger2 = require('winston-namespace')('app:controller')
 const logger3 = require('winston-namespace')('view')

 process.env.LOG_NAMESPACES = 'app:*'
 process.env.LOG_LEVEL = 'debug'

 logger1.info('Testing info')
// > [app:api] Date&Time - INFO: Testing info
logger2.info('Testing info for controller.')
// > [app:controller] Date&Time - INFO: Testing info for controller.
logger1.silly('This message won\'t be shown.')
logger3.info('This message won\'t be shown too.')
 ```