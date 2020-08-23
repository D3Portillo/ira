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

Ira is a window.fetch API wrapper with some extra stuff. Debug logs, persistent settings and custom currying to request functions with a set of options.

This little wrapper tries to function using current JS Engine features, no babel or typescript used. It's plain vanilla Javascript.

## Npm Install

```
npm i irajs
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

[> The complete API reference](#Ira-API-Reference)

## Examples

### GET Method

```js
ira.get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`).then(({ data }) => {
  console.log(data.json, data.text, data.blob) // * Automatic response parsing
})
```

### Set Headers to any new request

```js
ira.config({
  headers: {
    "Content-type": "application/json",
  },
})
```

### Parse blob to base64

```js
const blob = new Blob(["something"])
ira.blobToBase64(blob).then((base64) => console.log(base64))
```

### Base URL

```js
const request = ira.extend({
  baseURL: "https://yourendpoint.com/dev/branch",
})
// Now you can do
request.get("/binary") //https://yourendpoint.com/dev/branch/binary
```

### Extend Ira fork

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

### Fetching with params

```js
ira.get("https://anendpoint", {
  params: {
    token: 222,
    "another-token": 354,
  },
})
// https://anendpoint/?token=222&another-token=354
```

## Playground

Observable playground, live examples with the power of reactivity.

https://observablehq.com/@d3portillo/ira-fetch-wrapper

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

---

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
- [ira.\_config](#getConfig)

### HTTP Methods

This interface rules among many props and methods, **`ON_REQUEST_PROPS:` https://github.com/D3Portillo/ira#the-ira-instance**

---

<a href="#default" id="default"># </a><b>ira</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L41 "Source")

```js
URL = "" // Your URL
CONFIG = ON_REQUEST_PROPS
```

<a href="#get" id="get"># </a>ira<b>.get</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L169 "Source")

```js
URL = "" // Your URL
CONFIG = ON_REQUEST_PROPS
```

<a href="#post" id="post"># </a>ira<b>.post</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L178 "Source")

```js
URL = "" // Your URL
CONFIG = ON_REQUEST_PROPS
```

<a href="#put" id="put"># </a>ira<b>.put</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L179 "Source")

```js
URL = "" // Your URL
CONFIG = ON_REQUEST_PROPS
```

<a href="#delete" id="delete"># </a>ira<b>.delete</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L175 "Source")

```js
URL = "" // Your URL
CONFIG = ON_REQUEST_PROPS
```

<a href="#connect" id="connect"># </a>ira<b>.connect</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L180 "Source")

```js
URL = "" // Your URL
CONFIG = ON_REQUEST_PROPS
```

<a href="#options" id="options"># </a>ira<b>.options</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L181 "Source")

```js
URL = "" // Your URL
CONFIG = ON_REQUEST_PROPS
```

<a href="#trace" id="trace"># </a>ira<b>.trace</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L41 "Source")

```js
URL = "" // Your URL
CONFIG = ON_REQUEST_PROPS
```

<a href="#head" id="head"># </a>ira<b>.head</b>([<i>URL, CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L182 "Source")

```js
URL = "" // Your URL
CONFIG = ON_REQUEST_PROPS
```

### Extra methods

<a href="#blobtobase64" id="blobtobase64"># </a>ira<b>.blobToBase64</b>([<i>Blob</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L207 "Source")

```js
Blob = new Blob() // A JS Binary long object
```

<a href="#onevent" id="onevent"># </a>ira<b>.on</b>([<i>Event</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L233 "Source")

```js
Event = "request" | "response"
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

<a href="#config" id="config"># </a>ira<b>.config</b>([<i>CONFIG</i>]) [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L194 "Source")

```js
CONFIG = {
  headers: {},
  debug: Boolean,
  parseBlob: Boolean,
  baseURL: ?String,
} // @see https://github.com/D3Portillo/ira#the-ira-instance
```

### Acces current config

<a href="#getConfig" id="getConfig"># </a>ira<b>.\_config</b><i>\<CONFIG></i> [<>](https://github.com/D3Portillo/ira/blob/master/src/index.js#L188 "Source")

```js
CONFIG = {
  headers: {},
  debug: Boolean,
  parseBlob: Boolean,
  baseURL: ?String,
} // @see https://github.com/D3Portillo/ira#the-ira-instance
```

### Some extra resources

- Source: [/src/index.js](./src/index.js)
- Changelog: [/CHANGELOG.md](./CHANGELOG.md)
- License: [/LICENSE](./LICENSE)

> **Ira** stands for: `Go-to` in spanish `Ir-a`. Can also mean rage or anger, That's all the feelings you have while handling HTTP stuff : )
