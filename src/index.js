/**
 * Ira Fetch - Vanilla JS Fetch API wrapper with goodies 🍒
 * @licence MIT
 * @author Denny Portillo<hello@d3portillo.me>
 */

// * Ira settings initial consts
const INIT_IRA_CONFIG = {
  headers: {},
  debug: false,
  parseBlob: true,
  baseURL: undefined,
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
const IRA = "IraFetch >>>"

// * User Ira config object
var persistentIraConfig = { ...INIT_IRA_CONFIG }
const makeIraFetch = (method = "GET", options = { acceptsBody: true }) => {
  /**
   * Ira Response Object
   * @typedef {Object} IraResponse
   * @property {{ json: Object, text: String, blob: ?Blob }} data - Posible parsed response body
   * @property {Boolean} ok - Response status <= 300
   * @property {number} status
   * @property {String} statusText
   * @property {number} statusCode
   * @property {?Error} error - Null if nothing wrong
   */

  /**
   * @param {String} url - URL To fetch from
   * @param {{ headers: {}, body: ?String }} extra - Your normal fetch opts
   * @param {INIT_IRA_CONFIG} config - Custom Ira config
   * @return {Promise<IraResponse>}
   */
  const fetchPromise = (url, extra = {}, config = {}) => {
    config = { ...INIT_IRA_CONFIG, ...config }
    let { headers = {}, body = "" } = extra
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
    // We deepify body and headers
    headers = deepify({ ...config.headers, ...headers })
    const contentType = headers["Content-Type"] || ""
    if (contentType.includes("json")) {
      // Deepify only if json body
      body = deepify(body)
    }
    try {
      const { baseURL, parseBlob } = config
      url = baseURL ? `${baseURL}${url}` : url
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
              parseBlob ? clone.blob() : null,
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
                console.info(`${IRA} REQ_URL='${url}' >>> REQ_DATA: `, {
                  headers,
                  body,
                  config,
                  extra,
                })
              }
            })
          })
          .catch((error) => {
            const statusCode = 500 // Will need to figure out how to get  status
            console.error(
              `${IRA} - Got error on request, REQ_URL='${url}' >>> REQ_DATA: `,
              {
                error,
                headers,
                config,
                extra,
              }
            )
            send({
              data: { json: {}, text: "", blob: null } /* Void data */,
              ok: false,
              status: statusCode,
              statusText: error,
              statusCode: 500,
              error,
            })
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

/**
 * Ira persistent config props
 * @type {INIT_IRA_CONFIG}
 */
ira._config = {}

// * Function helper to update Ira global var and in function settings
ira.setIraConfig = (config = {}) => {
  persistentIraConfig = { ...persistentIraConfig, ...config }
  ira._config = persistentIraConfig
}

/**
 * Sets persisten config headers or body for future requests
 * @param { INIT_IRA_CONFIG } config
 */
ira.config = (config) => ira.setIraConfig(config)

/**
 * Sets config and returns a modded Ira function with new config
 * @param { INIT_IRA_CONFIG } config
 */
ira.extend = (config) => {
  /** Your custom settings Ira fork
   * @param {String} url
   * @param {{ headers: {}, body: ?String }} extra
   */
  const defaultFunction = (url, extra) => null
  const myMethods = {
    get: defaultFunction,
    put: defaultFunction,
    post: defaultFunction,
    head: defaultFunction,
    delete: defaultFunction,
    connect: defaultFunction,
    options: defaultFunction,
    trace: defaultFunction,
  }
  Object.keys(IRA_METHODS).map((name) => {
    const METHOD = name.toUpperCase()
    const acceptsBody = !IRA_METHODS_WITHOUT_BODY.includes(METHOD)
    const f = makeIraFetch(METHOD, {
      acceptsBody,
    })
    myMethods[name] = (u, o) => f(u, o, config)
  })

  // Extend returns methods constrained to user config
  return myMethods
}

// * Reset function sets default INIT Config
ira.reset = () => ira.setIraConfig(INIT_IRA_CONFIG)

// * Exporting function
// This won't succeed if on node env
window.ira = ira
module = "object" == typeof module ? module : {}
module.exports = ira
