ira("/").then((r) => {
  console.log(r)
})
const _fetch = ira.extend({
  parseBlob: false,
  debug: true,
  headers: {
    "Content-type": "application/json",
  },
})
_fetch.get("/").then((r) => {
  console.log(r)
})
_fetch.get("/").then((r) => {
  console.log(r)
})
_fetch
  .post("https://postman-echo.com/post", {
    body: "This is expected to be sent back as part of response body.",
    redirect: "follow",
  })
  .then((r) => {
    console.log(r)
  })
