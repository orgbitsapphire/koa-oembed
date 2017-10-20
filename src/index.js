const urlRegExp = require('./url-regexp')
const he = require('he')
const { ValidationError, validateData } = require('./validate')

function makeResponse(type, data) {
  return {
    ...data,
    type,
    version: '1.0'
  }
}

function makeXml(data) {
  let xml = '<?xml version="1.0" encoding="utf-8" standalone="yes"?>'
  xml += '\n<oembed>\n'
  for (let key in data) {
    let value = data[key]
    if (typeof value !== 'undefined') {
      if (typeof value === 'string') {
        value = he.escape(value)
      }

      xml += `  <${key}>${value}</${key}>\n`
    }
  }

  xml += '</oembed>'
  return xml
}

/**
 * Creates an oEmbed middleware for the specified url scheme.
 * @param {string} url - URL scheme. May include wildcards.
 * @param {Object} options - Match options.
 * @param {string} options.format - Indicates a fixed api format.
 * @param {boolean} options.asterisksRequired - Indicates that * patterns are mandatory. Defaults to false.
 * @param {boolean} options.caseSensitive - Indicates that the search should be case sensitive. Defaults to false.
 * @returns {Function} - Koa middleware.
 */
module.exports = function oembed(url, options) {
  if (!options) {
    options = {}
  }

  const regexp = urlRegExp(url, options)

  // Get a copy to prevent future mutation
  const fixedFormat = options.format
  if (fixedFormat) {
    if (fixedFormat !== 'json' && fixedFormat !== 'xml') {
      throw new Error("A fixed format can only be 'json' or 'xml'.")
    }
  }

  return function (ctx, next) {
    console.log('Req')
    const query = ctx.query
    if (!query.url || typeof query.url !== 'string') {
      // url is required
      ctx.throw(400)
    }

    const match = query.url.match(regexp)
    if (!match) {
      ctx.throw(404)
    }

    const format = fixedFormat || query.format || 'json'
    if (format !== 'json' && format !== 'xml') {
      // format must be json or xml
      ctx.throw(400)
    }

    function write(data) {
      if (format === 'xml') {
        ctx.type = 'xml'
        ctx.body = makeXml(data)
      } else {
        ctx.type = 'json'
        ctx.body = data
      }

      return data
    }

    ctx.oembed = {
      match,
      format,
      photo(data) {
        validateData(data, 'url')
        return write(makeResponse('photo', data))
      },
      video(data) {
        validateData(data, 'html')
        return write(makeResponse('video', data))
      },
      link(data) {
        return write(makeResponse('link', data))
      },
      rich(data) {
        validateData(data, 'html')
        return write(makeResponse('rich', data))
      }
    }

    return next().catch(function (error) {
      if (error instanceof ValidationError) {
        ctx.throw(500)
      } else {
        throw error
      }
    })
  }
}
