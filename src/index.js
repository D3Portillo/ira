/**
 * Ira Fetch - Vanilla JS Fetch API wrapper with goodies 🍒
 * Developed by: Denny Portillo<hello@d3portillo.me>
 * Licence: MIT
 */

// * Ira settings initial consts
const INIT_IRA_CONFIG = {
  headers: {},
  debug: false,
  parseBlob: true,
}
const IRA_METHODS = {
  get: "GET",
  put: "PUT",
  post: "POST",
  head: "HEAD",
  delete: "DELETE",
  connect: "CONNECT",
  options: "OPTIONS",
  trace: "TRACE",
}
const IRA_METHODS_WITHOUT_BODY = [
  IRA_METHODS.get,
  IRA_METHODS.head,
  IRA_METHODS.delete,
]
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
  /**
   * @typedef IraResponse
   * @property {{ json: ?Object, text: string, blob: ?Blob }} data
   * @property {Boolean} ok
   * @property {number} status
   * @property {string} statusText
   * @property {number} statusCode
   * @property {?Error} error
   */

  /**
   * @param {string} url
   * @param {{ headers: {}, body: ?string }} extra
   * @return {Promise<IraResponse>}
   */
  const fetchPromise = (url, extra = {}, config = {}) => {
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
                This setting is not listed on settings because if Response
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
            console.error(
              `${IRA}, got error on request. REQ_URL='${url}' >>> FULL_REQ_DATA: `,
              {
                error,
                headers,
                config,
                extra,
              }
            )
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
  return fetchPromise
}

// The Ira function, returns get method as default
function ira(url = "string", extra = INIT_IRA_CONFIG) {
  return makeIraFetch(IRA_METHODS.get, {
    acceptsBody: false,
  })(url, extra)
}

// * We attach HTTP methods to Ira function

// Methods without body object
ira.get = makeIraFetch(IRA_METHODS.get, {
  acceptsBody: false,
})
ira.head = makeIraFetch(IRA_METHODS.head, {
  acceptsBody: false,
})
ira.delete = makeIraFetch(IRA_METHODS.delete, {
  acceptsBody: false,
})

// Methods with body object
ira.put = makeIraFetch(IRA_METHODS.put, {
  acceptsBody: true,
})
ira.post = makeIraFetch(IRA_METHODS.post, {
  acceptsBody: true,
})
ira.connect = makeIraFetch(IRA_METHODS.connect, {
  acceptsBody: true,
})
ira.options = makeIraFetch(IRA_METHODS.options, {
  acceptsBody: true,
})
ira.trace = makeIraFetch(IRA_METHODS.trace, {
  acceptsBody: true,
})

// * Exposes Ira persistent config props
ira._config = {}

// * Function helper to update Ira global var and in function settings
const setIraConfig = (config = {}) => {
  persistentIraConfig = { ...persistentIraConfig, ...config }
  ira._config = persistentIraConfig
}

/**
 * Sets persisten config headers or body for future requests
 * @param { INIT_IRA_CONFIG } config
 */
ira.config = () => setIraConfig(config)

/**
 * Sets config and returns a modded Ira function with new config
 * @param { INIT_IRA_CONFIG } config
 */
ira.extend = (config) => {
  /**
   * @param {string} url
   * @param {{ headers: {}, body: ?string }} extra
   */
  const defaultFunction = (url, extra) => null
  const myMethodsInterface = {
    get: defaultFunction,
    put: defaultFunction,
    post: defaultFunction,
    head: defaultFunction,
    delete: defaultFunction,
    connect: defaultFunction,
    options: defaultFunction,
    trace: defaultFunction,
  }
  Object.keys(methods).map((name) => {
    const f = makeIraFetch(name.toUpperCase(), {
      acceptsBody: !IRA_METHODS_WITHOUT_BODY.includes(name),
    })
    myMethodsInterface[name] = (u, o) => f(u, o, config)
  })

  // Extend returns methods constrained to user config
  return myMethodsInterface
}

// * Reset function sets default INIT Config
ira.reset = () => setIraConfig(INIT_IRA_CONFIG)

// * Exporting function
// This won't succeed if on node env
window.ira = ira
module = "object" == typeof module ? module : {}
module.exports = ira
