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