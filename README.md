<p align="center">
  <a href="https://d3portillo.github.io/ira/">
    <img width="420" src="./assets/ira.svg"/>
  </a>
</p>

---

  <strong>
  <a href="https://codepen.io/D3Portillo/pen/poyjxwM">📝 Codepen</a> ・
  <a href="https://observablehq.com/@d3portillo/ira-fetch-wrapper">🔬 Observable</a> ・
  <a href="https://www.npmjs.com/package/irajs">📦 Npm</a>
  </strong>

---

**Ira Fetch:** Vanilla JS Fetch API wrapper with goodies 🍒

Ira is a **small ~ 3kb** function which enhances current Fetch API with more, more goodies. Ira code isn't chopped, replaced with random chars or similar on .min.js version, it's just minified.

Ira goodies include debug logs, persistent settings and custom currying to request functions with a set of options. The little wrapper tries to function using current JS Engine features, no babel or typescript used just plain vanilla Javascript.

![Version](https://img.shields.io/npm/v/irajs/latest)
![Size](https://img.shields.io/bundlephobia/minzip/irajs)
![Downloads](https://img.shields.io/npm/dw/irajs)

## Npm Install

```
npm install irajs
```

## Yarn Install

```
yarn add irajs
```

## CDN Load

```html
<script src="https://d3portillo.github.io/ira/src/index.min.js"></script>
```

## Usage

```js
import ira from "irajs"
// Requires
const ira = require("irajs")
// Start playing around
ira.get("/stuff")
```

[👉 The complete API reference](#Ira-API-Reference)

## Some examples

### Getting data

```js
ira.get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`).then(({ data }) => {
  console.log(data.json, data.text, data.blob) // * Automatic response parsing
})
```

### Adding headers

```js
ira.config({
  headers: {
    "Content-type": "application/json",
  },
})
```

### Parsing blob to base64 string

```js
const blob = new Blob(["something"])
ira.blobToBase64(blob).then((base64) => console.log(base64))
```

### Including a base URL

```js
const request = ira.extend({
  baseURL: "https://yourendpoint.com/dev/branch",
})
// Now you can do
request.get("/binary") //https://yourendpoint.com/dev/branch/binary
```

### Extending a fork

A custom settings fork of main Ira function that's gapped to provided - config

```js
const request = ira.extend({
  headers: {
    "x-api-key": "somsaltedencryptedawesomekey",
  },
  debug: true /* Shows Ira stuff on console */,
  parseBlob: false /* Do not include .blob on data */,
})

// Now you can make requests containing those settings
request
  .get("https://something")
  .then(({ data: { blob } }) => console.info(null == blob))
// The blob response inside data obj is null
```

> This method extends from Ira Object

## The Ira Instance

```js
RESPONSE = {
  data: { json: Object, text: String, blob: ?Blob }
  ok: Boolean,
  status: Number,
  statusText: String,
  statusCode: status<Number>,
  error: ?Error
}
ON_REQUEST_PROPS = {
  headers: {},
  body: ?String,
  debug: ?Boolean,
  parseBlob: ?Boolean,
  params: {},
  ...`https://developer.mozilla.org/en-US/docs/Web/API/Request`
}
IRA_SETTINGS = {
  headers: {},
  debug: Boolean,
  parseBlob: Boolean,
  baseURL: ?String,
}
HTTP_METHODS = {
  get: Function,
  put: Function,
  post: Function,
  head: Function,
  delete: Function,
  connect: Function,
  options: Function,
  trace: Function,
}

// Exported object { Main }
ira = {
  ...HTTP_METHODS,
  default(): HTTP_METHODS.get,
  _settings: Object,
  config: Function,
  extend: Function() => ira /* Fork with provided config */,
  blobToBase64: Function
}
```

Ira will return a void response if an error ocurred and status of 500.

## Ira API Reference

### Table of contents

- [ira()](#default)
- [ira.get()](#get)
- [ira.post()](#post)
- [ira.put()](#post)
- [ira.delete()](#delete)
- [ira.connect()](#connect)
- [ira.options()](#options)
- [ira.trace()](#trace)
- [ira.head()](#head)
- [ira.blobToBase64()](#blobtobase64)
- [ira.on()](#onevent)
- [ira.extend()](#extend)
- [ira.config()](#config)
- [ira.\_config](#getconfig)
- [{ baseURL }](#baseurl)
- [{ params }](#params)
- [{ debug }](#debug)
- [{ parseBlob }](#parseblob)

### HTTP Methods

This interface rules among many props and methods, **`ON_REQUEST_PROPS:` [ira#the-ira-instance](https://github.com/D3Portillo/ira#the-ira-instance)**

---

<a href="#default" id="default"># </a><b>ira</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L41 "Source")

```js
URL = "" // Your endpoint URL
CONFIG = ON_REQUEST_PROPS
```

The GET method, `ira("/something")` is the same as `fetch("/something")`. The difference is ira.get returns a `Promise` which resolves to an Object including .json, .text and .blob methods.

`ira().then(({data}) => { data.json | data.text | data.blob })`

<a href="#get" id="get"># </a>ira<b>.get</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L169 "Source")

```js
URL = "" // That stuff URL
CONFIG = ON_REQUEST_PROPS
```

Same as `ira()` method.

<a href="#post" id="post"># </a>ira<b>.post</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L178 "Source")

```js
URL = "" // An endpoint
CONFIG = ON_REQUEST_PROPS
```

The POST method, `ira.post("/something")` is the same as `fetch("/something", { method: "POST" })`.

You can include a body doing:

```js
ira.post("/something", {
  body: "some-body",
})
```

<a href="#put" id="put"># </a>ira<b>.put</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L179 "Source")

```js
URL = "" // https://something
CONFIG = ON_REQUEST_PROPS
```

The HTTP PUT method, `ira.put("/api")` is the same as `fetch("/api", { method: "PUT" })`.

You can include a body doing:

```js
ira.put("/something", {
  body: "some-body",
})
```

You also can show some debug messages on console by adding `debug: true`.

```js
ira.put("/something", {
  body: "some-body",
  debug: true,
})

// This will log on request start messages and
// When promise is resolved with your data
```

<a href="#delete" id="delete"># </a>ira<b>.delete</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L175 "Source")

```js
URL = "" // Place an URL here
CONFIG = ON_REQUEST_PROPS
```

That DELETE Http Method, `ira.delete("/api")` is the same as `fetch("/api", { method: "DELETE" })`.

<a href="#connect" id="connect"># </a>ira<b>.connect</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L180 "Source")

```js
URL = "" // The place you want data from
CONFIG = ON_REQUEST_PROPS
```

Doin a CONNECT method `ira.connect("/api")` is same as `fetch("/api", { method: "CONNECT" })`.

You can include this config on your request:

```js
{
  headers: {}, // Your request headers
  body: ?String, // Your request body
  debug: ?Boolean, // if true shows some stuff on console
  parseBlob: ?Boolean, // if false .blob event wont execute
  params: {} // Your URL params ?reqid=3&something=data
}
```

<a href="#options" id="options"># </a>ira<b>.options</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L181 "Source")

```js
URL = "" // That URL you want data from
CONFIG = ON_REQUEST_PROPS
```

When doing the OPTIONS Http method `ira.options("/api")` results to be same as doing `fetch("/api", { method: "OPTIONS" })`.

<a href="#trace" id="trace"># </a>ira<b>.trace</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L41 "Source")

```js
URL = "" // Production or dev endpoint
CONFIG = ON_REQUEST_PROPS
```

TRACE method, `ira.trace("/api")` is the same as `fetch("/api", { method: "TRACE" })`.

<a href="#head" id="head"># </a>ira<b>.head</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L182 "Source")

```js
URL = "" // Some resource URL
CONFIG = ON_REQUEST_PROPS
```

The HEAD method, `ira.head("/api")` is the same as `fetch("/api", { method: "HEAD" })`.

### Yes, more cool methods

<a href="#blobtobase64" id="blobtobase64"># </a>ira<b>.blobToBase64</b>([<i>Blob</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L207 "Source")

```js
Blob = new Blob() // A JS Binary long object
```

You can parse any `Blob` into a base64 string by doing `ira.blobToBase64`. This returns a Promise which resolves into a String. This method will always resolve if there's an error check out you console. If Promise fails will resolve to `""`

<a href="#onevent" id="onevent"># </a>ira<b>.on</b>([<i>Event</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L233 "Source")

```js
Event = "request" | "response"
```

You can add a custom listener when ira or it's forks perform a request or when a response is succeded. You can set this triggers like this `ira.on("response", callback)`.

Example:

```js
ira.on("request", (request) => {
  const { url, statusCode, method, headers, config } = request
  if (statusCode == 200) {
    console.log("This will always succeed")
    /*
     This callback is made as soon as request is made
     so statusCode is 200, you can log config, check path and include some magic
    */
  }
})

ira.on("response", (response) => {
  const { url, statusCode, method, headers, config } = request
  // Lets say you want to kick user when it's forbidden
  if (statusCode == 403) killSession()
})
```

<a href="#extend" id="extend"># </a>ira<b>.extend</b>([<i>CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L244 "Source")

```js
CONFIG = {
  headers: {},
  debug: Boolean,
  parseBlob: Boolean,
  baseURL: ?String,
} // @see https://github.com/D3Portillo/ira#the-ira-instance
```

This method returns a new Ira instance, you can replace default Settings with your custom ones. This can be helpfull if making request to API's where headers are somewhat "persistent", for example x-api-key's or that.

Example:

```js
const request = ira.extend({
  headers: {
    "x-api-key": "somethingawesome",
    "Content-type": "application/json",
  },
})

// Then you can avoid rewriting those headers again

request.get("/endpoint", {
  body: {
    user: "D3Portillo",
    base: "Somebass",
  },
})
// This will include those headers added on .extend call
```

<a href="#config" id="config"># </a>ira<b>.config</b>([<i>CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L194 "Source")

```js
CONFIG = {
  headers: {},
  debug: Boolean,
  parseBlob: Boolean,
  baseURL: ?String,
} // @see https://github.com/D3Portillo/ira#the-ira-instance
```

This method is used to replace current ira or fork settings. This replaces .extend method stuff with those new ones you provide.

```js
const req = ira.extend({
  baseURL: "https://google.com",
})

// Now, let's pretend you want to change that baseURL
req.settings({
  baseURL: "https://duckduckgo.com",
})
// This will replace request's baseURL google.com with duckduck.go
```

### Acces current config

<a href="#getconfig" id="getconfig"># </a>ira<b>.\_config</b><i>\<CONFIG></i> [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L188 "Source")

```js
CONFIG = {
  headers: {},
  debug: Boolean,
  parseBlob: Boolean,
  baseURL: ?String,
} // @see https://github.com/D3Portillo/ira#the-ira-instance
```

If you want to check current ira config do `ira._config`. This is supposed to be changed with `ira.config()`, still you can set `ira.\_config.headers = {}`

### Config[`._config`] props

<a href="#baseurl" id="baseurl"># </a>ira<b>.\_config.baseURL</b><i>\<Boolean></i> [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L74 "Source")

You can add a baseURL to make your requests.

```js
ira.settings({
  baseURL: "https://localhost:5000",
})
ira.get("/anurl", {
  params: {
    somelikeparam: "somevalue",
  },
}) // Fetches https://localhost:5000/anurl
```

<a href="#params" id="params"># </a>ira<b>.\_config.params</b><i>\<Object></i> [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L76 "Source")

You can add params on your request like this:

```js
ira.get("/anurl", {
  params: {
    somelikeparam: "somevalue",
  },
}) // Fetches to /anurl?somelikeparam=somevalue
```

<a href="#debug" id="debug"># </a>ira<b>.\_config.debug</b><i>\<Boolean></i> [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L140 "Source")

If `true` will log stuff on console when a request is made and when a response is obtained.

<a href="#parseblob" id="parseblob"># </a>ira<b>.\_config.parseBlob</b><i>\<Boolean></i> [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L105 "Source")

If `false` any request you make wont perform a **response.blob** and your data will resolve with this as `null`

### Some resources

- Source: [/src/index.js](./src/index.js)
- Changelog: [/CHANGELOG.md](./CHANGELOG.md)
- License: [/LICENSE](./LICENSE)

---

**Ira** stands for: `Go-to` in spanish `Ir-a`. Can also mean rage or anger, That's all the feelings you have while handling HTTP stuff : )
