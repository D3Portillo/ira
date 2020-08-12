import ira from "./src"

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
