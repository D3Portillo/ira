# Ira Fetch Wrapper

**Ira Fetch:** Vanilla JS Fetch API wrapper with goodies 🍒

Ira is a window.fetch API wrapper with some extra stuff, debug logs, persistent settings and custom currying for requesting functions with a set of settings.

This intends to be writtend just using current JS engine features, no babel or typescript used. It's plain vanilla Javascript.

## NPM Install

```
npm install --save irajs
```

## CDN

```html
<script src="https://d3portillo.github.io/ira/src/index.js"></script>
```

Long live to Github Pages : )

## Examples

### GET

```js
ira.get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`).then(({ data }) => {
  console.log(data.json, data.text, data.blob)
  // Automatic response parsing
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
const nfetch = ira.extend({
  headers: {
    "Content-type": "application/json",
  },
  debug: true,
  parseBlob: false /* Do not include .blob body response */,
})
```

- You can now fetch data with those settings

```js
nfetch.get("https://something").then(({ blob }) => console.info(null == blob))
```

- Fetching with keys and session that contain same config

```js
const request = ira.extend({
  headers: {
    "x-api-key": "somsaltedencryptedawesomekey",
  },
  debug: true /* Show Ira stuff on console */,
  baseURL: "https://someendpoint"
  parseBlob: false /* Do not include .blob body response */
})

request.get("/stuff").then(({ data })=> console.log({ data }))
request.get("/post", { headers: { "a-header": "a-value" } }).then(({ data })=>{
  console.log({data})
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
IRA_REQUEST_METHOD_PROPS = {
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

| Name/Instance    | Params ?                           | Returns                 | Comments                                                                         |
| ---------------- | ---------------------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| IRA_HTTP_METHODS | (`URL`,`IRA_REQUEST_METHOD_PROPS`) | `Promise<IRA_RESPONSE>` | Fetch API HTTP Methods                                                           |
| default()        | (`URL`,`IRA_REQUEST_METHOD_PROPS`) | `Promise<IRA_RESPONSE>` | When you do Ira("URL")                                                           |
| \_settings       | `NONE`                             | `Void`                  | Acces current Ira global settings                                                |
| reset()          | `NONE`                             | `Void`                  | Resets persistence settings to default                                           |
| config()         | `IRA_SETTINGS`                     | `Void`                  | Set ira settings (This affects all requests on main ira Object, not forked ones) |
| extend()         | `IRA_SETTINGS`                     | `IRA_HTTP_METHODS`      | Returns a fork of Ira with just HTTP Methods and provided Ira Settings           |

> Ira stands for: Go To, rage or anger. That's all the feelings you have while handling HTTP stuff : )

## TODO

- [ ] Unit tests
- [ ] Some custom examples
- [ ] Live examples on Codepen or similar