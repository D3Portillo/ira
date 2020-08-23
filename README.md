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

## Playground

Observable playground, live examples with the power of reactivity.

> Recommended as start point

https://observablehq.com/@d3portillo/ira-fetch-wrapper

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

- Source: [/src/index.js](./src/index.js)
- Changelog: [/CHANGELOG.md](./CHANGELOG.md)
- License: [/LICENSE](./LICENSE)

> **Ira** stands for: `Go-to` in spanish `Ir-a`. Can also mean rage or anger, That's all the feelings you have while handling HTTP stuff : )
