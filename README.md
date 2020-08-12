# IRA JS

**Ira Fetch:** Vanilla JS Fetch API wrapper with goodies 🍒

## Examples

### GET

```js
ira.get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`).then(({ data }) => {
  console.log(data.json, data.text, data.blob)
  // Automatic response parsing
})
```

### GET
