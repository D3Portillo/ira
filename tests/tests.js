window.onload = () => {
  const init = () => {
    document.body.style = `font-family: Roboto, Open sans, Ubuntu, Tahoma; padding: 1rem`
    document.body.innerHTML = `
    <b>
      Content log...
    </b>
    <pre><code style="white-space: normal" id="logTag"></code></pre>
    `
    /**
     * Log to DOM Function
     * @param {?string} text
     * @param {?Boolean} isError
     */
    return (text = "", isError = false) => {
      /**
       * @type {HTMLElement}
       */
      const log = window.logTag
      const t = JSON.stringify(text)
      const content = isError
        ? `<span style="color: red">${t}</span>`
        : `<span>${t}</span>`

      log.insertAdjacentHTML("beforeend", `${content}<br/><br/>`)
    }
  }
  const log = init()
  console.log = log
  console.info = log
  console.error = (...e) => log(e, true)

  //* ///////////////////////////////////////////////////////////////
  /**
   ** Test Playground for Ira - Fetch Wrapper
   */

  ira
    .get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`)
    .then(({ data }) => {
      console.log(data.json, data.text, data.blob)
      // Automatic response parsing
    })

  console.info("POST METHOD")
  ira
    .post(`https://postman-echo.com/post`, {
      body: "This body will be returned",
      params: {
        token: 2,
      },
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
  ira.get("/", { params: { foo1: "bar1", foo2: "bar2" }, debug: true })
}
