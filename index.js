const winston = require('winston')
const namespaces = require('./namespaces')

/**
 * Creates a logger with the given namespace as a label for logging.
 *
 * The debug and the silly mode can be disabled by modules. For example if you create a logger with the namespace
 * 'server' and another with the namespace 'app', in the LOG_NAMESPACES environment variable you can write
 * 'server,app' to log both, only 'server' if you don't want to see debug messages for the 'app' module or only
 * 'app' to see the app's debug messages.
 * It also has wildcards ('*') but that works for sub-namespaces. For example you can write 'app:api,app:logic,app:controller',
 * or only write 'app:*' that will work for all the cases that are subspaces of 'app'. Or in the case that you
 * want to debug all you can write LOG_NAMESPACES = *.
 * The level of the log is the same as winston and you can set it the in LOG_LEVEL env variable. It could be:
 *  - error
 *  - warn
 *  - info
 *  - debug
 *  - silly
 *
 * @param namespace {String} - Namespace to log. Useful to separate the debug messages by modules.
 * @param options {Object} - Options to pass to winston logger.
 */
module.exports = (namespace, options) => {
  if (!options || typeof options !== 'object') options = {}
  const baseOptions = {
    level: process.env.LOG_LEVEL || 'silly',
    transports: [new (winston.transports.Console)({
      timestamp: () => {
        const d = new Date()
        let result = d.toLocaleString().split(' ')
        result[1] = result[1].concat(d.toISOString().slice(-5, -1))
        return result.join(' ')
      },
      formatter: options => {
        return `[${namespace}] ${options.timestamp()} - ${options.level.toUpperCase()}: ${options.message ? options.message : ''}${options.meta && Object.keys(options.meta).length ? '\n' + JSON.stringify(options.meta, null, 2) : ''}`
      }
    })]
  }
  const enabled = namespaces.check(namespace)
  const logger = new (winston.Logger)({...baseOptions, ...options})
  return {
    error: (message, meta) => logger.error(message, meta),
    warn: (message, meta) => logger.warn(message, meta),
    info: (message, meta) => logger.info(message, meta),
    debug: (message, meta) => { if (enabled) logger.debug(message, meta) },
    silly: (message, meta) => { if (enabled) logger.silly(message, meta) }
  }
}
