const fs = require("fs")
const http = require("http")
const panda = require("./panda")
const mountPoint = "[[IRA]]"
const testPoint = "[[TESTS]]"
const template = fs.readFileSync(`${__dirname}/template.html`, "utf-8")
const { exec } = require("child_process")
/**
 * @typedef {Boolean} - Sets if you are testing index.min.js
 */
const isMinifiedTest = false
const server = http.createServer(({ url }, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  exec(`yarn minify`, (superformatError) => {
    // minify index.min.js file along with main working index
    superformatError && console.log({ superformatError })
  })
  const routes = {
    "/text": () => {
      return {
        content: "TEXT_CONTENT_FROM_TEST",
        type: "text/pain",
      }
    },
    "/json": () => {
      return {
        content: JSON.stringify({
          items: ["HELLO", "WORLD"],
        }),
        type: "application/json",
      }
    },
    "/blob": () => {
      return {
        content: panda,
        type: "image/svg+xml",
      }
    },
    "/js": () => {
      return {
        content: `alert("I was succesfully serverd here")`,
        type: "text/javascript",
      }
    },
  }
  const js = `${__dirname}/../src/index${isMinifiedTest ? ".min" : ""}.js`
  const ira = fs.readFileSync(js, "utf-8")
  const tests = fs.readFileSync(`${__dirname}/index.js`, "utf-8")
  const routeFound = routes[url]
  if (routeFound) {
    const { content, type } = routeFound()
    res.setHeader("Content-Type", type)
    res.end(content, () => {
      console.log("Content types sent 🚀")
    })
  } else {
    console.log(`Built version => ${ira.match(/@version .+/)[0]}`)
    res.setHeader("Content-Type", "text/html")
    const content = template
      .replace(mountPoint, `<script>${ira}</script>`)
      .replace(testPoint, `<script>${tests}</script>`)
    res.end(content, () => {
      console.log("Main content was served 🍟")
    })
  }
})

// Starting serving
server.listen(5000).on("listening", () => {
  console.log(isMinifiedTest ? "Testing .min version" : "Testing main index.js")
  console.log("Serving on: http://localhost:5000")
})
