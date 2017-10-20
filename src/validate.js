const { URL } = require('url')

class ValidationError extends Error {

}

function check(url, prop) {
  if (url[prop].includes('*')) {
    throw new Error(`Invalid wildcard in ${prop}.`)
  }
}

function validateProp(data, prop) {
  if (!data[prop]) {
    throw new ValidationError(`Parameter '${prop}' is required.`)
  }
}

function validateNumber(data, prop) {
  const value = data[prop]
  if (value === '' || isNaN(value) || !isFinite(value) || value < 0) {
    throw new ValidationError(`Parameter '${prop}' is required and must be a valid number.`)
  }
}

function validateData(data, prop) {
  validateProp(data, prop)
  validateNumber(data, 'width')
  validateNumber(data, 'height')
}

function validateUrl(urlScheme) {
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

module.exports = {
  ValidationError,
  validateProp,
  validateNumber,
  validateData,
  validateUrl
}
