# koa-oembed

`npm install koa-oembed --save`

Koa middleware for creating [oEmbed](https://oembed.com/) endpoints.

>oEmbed is a format for allowing an embedded representation of a URL on third party sites. The simple API allows a website to display embedded content (such as photos or videos) when a user posts a link to that resource, without having to parse the resource directly.

## Usage

API endpoints and URL schemes are provided in pairs, such that one instance of the middleware serves exactly one URL scheme. You can read more about this in the [specification](https://oembed.com/#section2.1).

```js
import oembed from 'koa-oembed'
import Router from 'koa-router' // or any other router library

const router = new Router();

// This creates the api-url pair http://example.com/oembed -> http://example.com/photos/*
router.get('/oembed', oembed('http://example.com/photos/*'), function (ctx) {
  // We handle oembed requests here through utilities in ctx.oembed
  const photoId = ctx.oembed.match[1] // regex match of first wildcard. 
  // match[0] is the fully matched url; 1, 2, 3... store wildcard matches
  
  // Some generic validation
  if (!checkIfExists(photoId)) {
    ctx.throw(404)
  }

  ctx.oembed.photo({
    // As per spec, these three props are required
    url: `http://example.com/photo/${photoId}.jpg`,
    width: 300,
    height: 200,
    // any additional data below is optional
    provider_url: 'http://example.com'
  })
})

```

## API

### Creating middleware

```js
import oembed from 'koa-oembed'

const middleware = oembed(urlScheme, /* URL scheme. May include wildcards. */
  options: { /* Optional options object */
    format: 'json'|'xml', /* Indicates a fixed api format. */
    asterisksRequired: boolean, /* Indicates that * patterns are mandatory. Defaults to false. */
    caseSensitive: boolean /* Indicates that the search should be case sensitive. Defaults to false. */
  })
```

### ctx.oembed

```js
ctx.oembed = {
  match: [], /* Regex match object. */
  format: 'json'|'xml', / Format of response. */
  photo({ url, width, height, ...data }), /* Send photo response. */
  video({ html, width, height, ...data }), /* Send video response. */
  link({ ...data }), /* Send link response with any data. */
  rich({ html, width, height, ...data }), /* Send rich content response. */
}
```


