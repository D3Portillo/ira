<p align="center">
  <a href="https://d3portillo.github.io/ira/">
    <img src="./assets/ira.svg"/>
  </a>
  <br>
  <br>
  <br>
  <strong>
  <a href="https://codepen.io/D3Portillo/pen/poyjxwM">🔬 Codepen</a> ・
  <a href="https://www.npmjs.com/package/irajs">📦 Npm</a>
  </strong>
</p>

---

**Ira Fetch:** Vanilla JS Fetch API wrapper with goodies 🍒

Ira is a window.fetch API wrapper with some extra stuff. Debug logs, persistent settings and custom currying to request functions with a set of options.

This little wrapper tries to function using just current JS Engine features, no babel or typescript used. It's plain vanilla Javascript.

## NPM Install

```
npm install --save irajs
```

## Yarn Install

```
yarn add irajs
```

## CDN

```html
<script src="https://d3portillo.github.io/ira/src/index.js"></script>
```

## Playground

Observable playground, live examples with the power of reactivity.

> Recommended as start point

https://observablehq.com/@d3portillo/ira-fetch-wrapper

## Examples

### GET

```js
ira.get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`).then(({ data }) => {
  console.log(data.json, data.text, data.blob)
  // * Automatic response parsing
  /*
    You can do it also parsing params as
    ira.get(URL, { params: { foo1: "bar1", foo2: "bar2" } })
  */
})
```

### POST

```js
ira
  .post(`https://postman-echo.com/post`, {
    body: "This body will be returned",
  })
  .then(({ data }) => {
    console.log(data.json, data.text, data.blob)
    // Automatic response parsing
  })
```

### Set global headers

Usefull if doing different request with auth stuff

- Set all request to `application/json` Content-Type

```js
ira.config({
  headers: {
    "Content-type": "application/json",
  },
})
```

- Now, all your requests will include those headers

```js
ira.get("https://something").then(console.info)
```

### Extend a Ira fork

A custom settings fork of main Ira function that's gapped to provided - config

- Set _debug_ mode

```js
const request = ira.extend({
  headers: {
    "Content-type": "application/json",
  },
  debug: true,
  parseBlob: false /* Do not include .blob body response */,
})
```

- You can now fetch data with those settings

```js
request
  .get("https://something")
  .then(({ data: { blob } }) => console.info(null == blob))
// The blob response inside data obj is null
```

- Fetching with keys and session that contain same config

```js
const request = ira.extend({
  headers: {
    "x-api-key": "somsaltedencryptedawesomekey",
  },
  debug: true /* Shows Ira stuff on console */,
  baseURL: `https://someendpoint`
  parseBlob: false /* Do not include .blob body response */
})

request.get(`/stuff`).then(({ data })=> console.log({ data }))
request.get(`/put`, { headers: { "a-header": "a-value" } }).then(({ data })=>{
  console.log({ data })
})
// https://someendpoint/put
// https://someendpoint/stuff
```

### Fetching with params

```js
ira.get(`https://anendpoint`, {
  params: {
    token: 222,
    "another-token": 354,
  },
})
// https://anendpoint/?token=222&another-token=354
```

### Sending body

```js
const someBufer = new Buffer()
ira.post(`http://someurl`, {
  headers: {
    "Content-type": "someDataType",
  },
  body: someBufer,
})
```

## Ira Object instances

```js
IRA_RESPONSE = {
  data: { json: Object, text: String, blob: ?Blob }
  ok: Boolean,
  status: Number,
  statusText: String,
  statusCode: status<Number>,
  error:?Error
}
IRA_REQUEST_PROPS = {
  headers: {},
  body: ?String,
  ...({
    Request:`https://developer.mozilla.org/en-US/docs/Web/API/Request`
  })
}
IRA_SETTINGS = {
  headers: {},
  debug: Boolean,
  parseBlob: Boolean,
  baseURL: ?String,
}
IRA_HTTP_METHODS = {
  get: Function,
  put: Function,
  post: Function,
  head: Function,
  delete: Function,
  connect: Function,
  options: Function,
  trace: Function,
}

// Exported object  {Main}
ira = {
  ...IRA_HTTP_METHODS,
  default(): IRA_HTTP_METHODS.get,
  _settings: Object,
  reset: Function,
  config: Function,
  extend: IRA_HTTP_METHODS
}
```

| Name/Instance    | Params ?                    | Returns                 | Comments                                                               |
| ---------------- | --------------------------- | ----------------------- | ---------------------------------------------------------------------- |
| IRA_HTTP_METHODS | (`URL`,`IRA_REQUEST_PROPS`) | `Promise<IRA_RESPONSE>` | Fetch API HTTP Methods                                                 |
| default()        | (`URL`,`IRA_REQUEST_PROPS`) | `Promise<IRA_RESPONSE>` | When you do Ira("URL")                                                 |
| \_settings       | `NONE`                      | `IRA_SETTINGS`          | Acces current Ira global settings                                      |
| reset()          | `NONE`                      | `Void`                  | Resets persistence settings to default                                 |
| config()         | `IRA_SETTINGS`              | `Void`                  | Set ira settings (This affects all requests)                           |
| extend()         | `IRA_SETTINGS`              | `IRA_HTTP_METHODS`      | Returns a fork of Ira with just HTTP Methods and provided Ira Settings |

Ira will return a void response if an error ocurred and status of 500,
I'm currently working on a way of returning status on error

---

- Source: [./src/index.js](./src/index.js)
- Changelog: [./CHANGELOG.md](./CHANGELOG.md)

> **Ira** stands for: Go to, rage or anger. That's all the feelings you have while handling HTTP stuff : )

---

## TODO

- [ ] Some Unit Tests
- [ ] Add custom examples
- [ ] Live examples on Codepen or similar
