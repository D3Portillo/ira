/**
 * Ira Fetch - Vanilla JS fetch API wrapper with goodies
 * Developed by: Denny Portillo<hello@d3portillo.me>
 * Licence: MIT
 */

// * Ira settings initial consts
const INIT_IRA_CONFIG = {
  headers: {},
  debug: false,
  parseBlob: true,
}
const DEFAULT_METHOD_OPTIONS = { acceptsBody: true }
const IRA = "IraFetch >>>"

// * Helpers
const deepify = (obj = {}) => {
  // Stringify all obj props
  const container = {}
  Object.keys(obj).forEach((prop) => {
    let value = obj[prop]
    if (typeof value != "string") {
      value = JSON.stringify(value)
    }
    container[prop] = value
  })
  return container
}

// * Ira config main settings object
var persistentIraConfig = { ...INIT_IRA_CONFIG }
const makeIraFetch = (method = "GET", options = DEFAULT_METHOD_OPTIONS) => {
  return (url, extra = {}, config = {}) => {
    config = { ...INIT_IRA_CONFIG, ...config }
    let { headers = {}, body = "" } = extra

    // We deepify body and headers
    headers = deepify({ ...config.headers, ...headers })
    const contentType = headers["Content-Type"] || ""
    if (contentType.includes("json")) {
      // Deepify only if json body
      body = deepify(body)
    }
    try {
      const { fetch } = window
      if (!fetch) throw new Error("Not inside a browser")
      if (!url) throw new Error("URL not provided")
      return new Promise((send) => {
        fetch(url, {
          ...extra,
          method,
          headers,
          ...(options.acceptsBody ? { body } : {}),
        })
          .then((response) => {
            const { ok, status, statusText } = response
            const clone = response.clone()
            Promise.all([
              response.text(),
              config.parseBlob ? clone.blob() : null,
            ]).then(([a, b]) => {
              // * [a] must be string
              if (typeof b == "string") {
                ;[a, b] = [b, a]
              }
              let json = {}
              try {
                /*
              * Tries to parse content to JSON.
              This setting is not listed on settings because if response
              is plain text, JSON parse wont succeed
              */
                json = JSON.parse(a)
              } catch (_) {}
              send({
                data: { json, text: a, blob: b },
                ok,
                status,
                statusText,
                statusCode: status,
                error: null,
              })
              if (config.debug) {
                console.info(`${IRA} REQ_URL='${url}' >>> FULL_REQ_DATA: `, {
                  url,
                  headers,
                  body,
                  config,
                  extra,
                  response,
                })
              }
            })
          })
          .catch((error) => {
            console.error(`${IRA}, got error on request. REQ_URL='${url}' >>> FULL_REQ_DATA: `, {
              url,
              error,
              headers,
              config,
              extra,
            })
            send({
              data: null,
              ok: false,
              status,
              statusText: error,
              statusCode: 500,
              error,
            })
            throw error
          })
      })
    } catch (e) {
      console.error(`${IRA} ${e}`)
    }
  }
}

// * Ira Methods
const methods = {
  get: makeIraFetch("GET", { acceptsBody: false }),
  post: makeIraFetch("POST"),
  put: makeIraFetch("PUT"),
  head: makeIraFetch("HEAD"),
}

// * The main ira function object
function ira(url) {
  return methods.get(url)
}

// * Sets methods to ira function
Object.keys(methods).forEach((name) => {
  ira[name] = methods[name]
})

// * Exposes ira persistent config props
ira._config = {}

/**
 * Function helper to update ira global var and in function settings
 * @param { INIT_IRA_CONFIG } settings
 */
const setIraConfig = (config) => {
  persistentIraConfig = config
  ira._config = config
}
/**
 * Sets persisten config headers or body for future requests
 * @param { INIT_IRA_CONFIG } config
 */
ira.config = (config) => {
  const { headers = {} } = config || {}
  setIraConfig({
    headers: { ...persistentIraConfig.headers, ...headers },
  })
  return methods
}
ira.extend = (config) => {
  const myMethods = {}
  Object.keys(methods).map((name) => {
    const f = methods[name]
    myMethods[name] = (url, extra) => f(url, extra, config)
  })
  return myMethods
}
ira.reset = () => setIraConfig(INIT_IRA_CONFIG)

// * Exporting function
// This won't succeed if on node env
window.ira = ira
module = "object" == typeof module ? module : {}
module.exports = ira
