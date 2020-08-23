// * DO NOT INCLUDE require("ira") here
window.onload = () => {
  const init = () => {
    document.body.style = `font-family: Roboto, Open sans, Ubuntu, Tahoma; padding: 1rem`
    document.body.innerHTML = `
    <b style="font-size: 2rem">
      Content log...
    </b>
    <img src="http://localhost:5000/blob" alt="This will fail if Blob error response"/>
    <br/><br/>
    <i>Open da ~ Dev console</i>
    <hr style="height: 1px; border: none; background: rgba(0,0,0,0.35); margin: 1rem 0"/>
    <pre><code style="white-space: normal" id="logTag"></code></pre>
    `
    /**
     * Log to DOM Function
     * @param {?string} text
     * @param {?Boolean} isError
     */
    return (text = "") => {
      const log = window.logTag
      const t = JSON.stringify(text)
      const content = `<span>${t}</span>`
      log.insertAdjacentHTML("beforeend", `${content}<br/><br/>`)
      console.log(text)
    }
  }
  const log = init()

  //* ///////////////////////////////////////////////////////////////
  /**
   ** Test Playground for Ira - Fetch Wrapper
   */

  // * Response {data,text,blob} test

  ira.get("/text").then(({ data }) => {
    console.log("text", data)
    log(`TEXT_TEST: ${data.text != ""}`)
  })
  ira.get("/json").then(({ data }) => {
    console.log("json", data)
    log(`JSON_TEST: ${typeof data.json == "object"}`)
  })
  ira.get("/blob").then(({ data }) => {
    console.log("blob", data)
    log(`BLOB_TEST: ${data.blob != null}`)
  })

  // Extra stuff
  log("Get image")
  ira(`https://animeonegai.com/assets/img/spring4.png`).then(({ data }) => {
    ira.blobToBase64(data.blob).then((image) => {
      document.body.insertAdjacentHTML(
        "beforeend",
        `<h2>Base 64 Image</h2><img src="${image}"/>`
      )
    })
  })

  ira.config({
    headers: {
      "first-config": true,
    },
    debug: true,
  })
  log(ira._config)

  const second = ira.extend({
    headers: {
      second: true,
    },
  })
  second.on("request", (onCB) => console.error({ onCB }))

  second.get("/")
  second("/second")

  log(second._config)
}
