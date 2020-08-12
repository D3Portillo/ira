# Ira Fetch Wrapper

**Ira Fetch:** Vanilla JS Fetch API wrapper with goodies 🍒

Ira is a window.fetch API wrapper with some extra stuff, debug logs, persistent settings and custom currying for requesting functions with a set of settings.

This intends to be writtend just using current JS engine features, no babel or typescript used. It's plain vanilla Javascript.

# Install

```
npm install --save irajs
```

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

- Set *debug* mode

```js
const nfetch = ira.extend({
  headers: {
    "Content-type": "application/json",
  },
  debug: true,
  parseBlob: false /* Do not include .blob body response */
})
```

- You can now fetch data with those settings

```js
nfetch.get("https://something").then(({ blob })=>console.info(null==blob))
```

> Ira stands for: Go To, rage or anger. That's all the feelings you have while handling HTTP stuff : )
