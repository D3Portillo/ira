const fs = require("fs")
const http = require("http")
const mountPoint = "[[IRA]]"
const testPoint = "[[TESTS]]"
const template = fs.readFileSync(`${__dirname}/template.html`, "utf-8")
const isMinifiedTest = true
const server = http.createServer((_, res) => {
  const js = `${__dirname}/../src/index${isMinifiedTest ? ".min" : ""}.js`
  const ira = fs.readFileSync(js, "utf-8")
  const tests = fs.readFileSync(`${__dirname}/tests.js`, "utf-8")

  res.writeHead(200, undefined, {
    "Content-type": "text/html",
  })
  const content = template
    .replace(mountPoint, `<script>${ira}</script>`)
    .replace(testPoint, `<script>${tests}</script>`)
  res.end(content, () => {
    console.log("Content Served 🚀")
  })
})

// Starting serving
server
  .listen(5000)
  .on("listening", () => console.log("Serving on: http://localhost:5000"))
