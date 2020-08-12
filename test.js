console.info("GET METHOD")
ira.get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`).then(({ data }) => {
  console.log(data.json, data.text, data.blob)
  // Automatic response parsing
})

console.info("POST METHOD")
ira
  .post(`https://postman-echo.com/post`, {
    body: "This body will be returned",
  })
  .then(({ data }) => {
    console.log(data.json, data.text, data.blob)
  })

console.info("GET METHOD With custom headers")
const request = ira.extend({
  headers: {
    "x-api-key": "BOg81b54cfD99ufEmd21sxgp696bm7XcT2F2jVOzdw21",
    session: "LsZoeYLx2cAwMsauPsP56nWgMpu3T89Jy",
  },
  debug: true,
  label: "Request with custom headers",
  baseURL: "https://documenter.getpostman.com/view/3632562377",
})

request.get("/something")
