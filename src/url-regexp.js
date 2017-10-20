const escapeStringRegexp = require('escape-string-regexp')
const { validateUrl } = require('./validate')

/**
 * Convert url scheme to a RegExp
 * Example: http://www.flickr.com/photos/*&#47;foo/ -> new RegExp('^http://www\\.flickr\\.com/photos/(.*)/foo/$')
 * @param {string} url - URL scheme
 * @param {Object} options - Match options.
 * @param {boolean} options.asterisksRequired - Indicates that * patterns are mandatory. Defaults to false.
 * @param {boolean} options.caseSensitive - Indicates that the search should be case sensitive. Defaults to false.
 * @returns {RegExp} - Pattern converted to regular expression.
 */
module.exports = function urlRegExp(url, options) {
  if (!options) {
    options = {}
  }
  
  validateUrl(url)
  const pattern = options.asterisksRequired ? '(.+)' : '(.*)'
  const escaped = escapeStringRegexp(url).replace(/\\\*/g, pattern)
  return new RegExp('^' + escaped + '$', options.caseSensitive ? undefined : 'i')
}
