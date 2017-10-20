const { URL } = require('url')

function check(url, prop) {
  if (url[prop].includes('*')) {
    throw new Error(`Invalid wildcard in ${prop}.`)
  }
}

module.exports = function validate(urlScheme) {
  if (typeof urlScheme !== 'string' || !urlScheme.length) {
    throw new Error('Url scheme must be specified.')
  }

  const url = new URL(urlScheme)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error("Invalid url protocol. Must be 'http' or 'https'.")
  }

  check(url, 'username')
  check(url, 'password')
  check(url, 'port')
  // Some unallowed patterns like http://*.com/ may slip through...
  if (url.hostname === '*') {
    throw new Error('Invalid hostname.')
  }
}
