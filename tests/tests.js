// * DO NOT INCLUDE require("ira") here
window.onload = () => {
  const init = () => {
    document.body.style = `font-family: Roboto, Open sans, Ubuntu, Tahoma; padding: 1rem`
    document.body.innerHTML = `
    <b style="font-size: 2rem">
      Content log...
    </b>
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

  ira
    .get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`)
    .then(({ data }) => {
      log(data)
    })

  log("Post Method")
  ira
    .post(`https://postman-echo.com/post`, {
      body: "This body will be returned",
      params: {
        token: 2,
      },
      debug: true,
    })
    .then(({ data }) => {
      log(data)
    })

  log("Get image")
  ira(`https://animeonegai.com/assets/img/spring4.png`).then(log)

}