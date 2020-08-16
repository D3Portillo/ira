/**
 * Ira Fetch - Vanilla JS Fetch API wrapper with goodies 🍒
 * @author Denny Portillo<hello@d3portillo.me>
 * @license MIT
 * @see https://github.com/d3portillo/ira
 * @version 0.0.4-beta0.2
 */

function f() {
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
  const IRA_LOG = "IraFetch >>>"
  let persistentIraConfig = {}

  function makeIraFetch(method = "POST", options = { acceptsBody: true }) {
    /**
     * Ira Response Object
     * @typedef { Object } IraResponse
     * @property {{ json: Object, text: String, blob: ?Blob }} data - Posible parsed response body
     * @property { Boolean } ok - Response status <= 300
     * @property { Number } status
     * @property { String } statusText
     * @property { Number } statusCode
     * @property { ?Error } error - Null if nothing wrong
     */
    /**
     * @param { String } url - URL To fetch from
     * @param {{ headers: {}, body: ?String, params: {} }} extra - Your normal fetch opts
     * @param { INIT_IRA_CONFIG } config - Custom Ira config
     * @return { Promise<IraResponse> }
     */
    const fetchPromise = (url, extra = {}, config = {}) => {
      config = { ...INIT_IRA_CONFIG, ...config, ...persistentIraConfig }
      let { headers = {}, body = "", params = {} } = extra
      const deepify = (obj = {}) => {
        const json = {}
        Object.keys(obj).forEach((prop) => {
          let value = obj[prop]
          json[prop] = typeof value != "string" ? JSON.stringify(value) : value
        })
        return json
      }
      headers = deepify({ ...config.headers, ...headers })
      const contentType =
        headers["Content-Type"] || headers["Content-type"] || ""
      if (contentType.includes("json")) body = deepify(body)
      try {
        let { baseURL, parseBlob } = config
        url = baseURL ? `${baseURL}${url}` : url
        const paramsChain = new URLSearchParams(params).toString()
        if (paramsChain.length) {
          const lastChar = url.charAt(url.length - 1)
          if (lastChar != "/") url = `${url}/`
          url = `${url}?${paramsChain}`
        }
        const { fetch } = window
        if (!fetch) throw new Error("Not inside a browser")
        if (!url) throw new Error("URL not provided")
        return new Promise((send) => {
          if (config.debug) console.info(`${IRA_LOG} URL='${url}' >>> SENT ⚡`)
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
              ]).then(([t, b]) => {
                if (typeof b == "string") {
                  ;[t, b] = [b, t]
                }
                let json = {}
                try {
                  // Tries to parse t content
                  // If parse fails then resul's plain text
                  json = JSON.parse(t)
                  if (typeof json == "string") json = {}
                  else t = ""
                } catch (_) {}
                if (parseBlob) {
                  const TEXT_TYPES = /text/g
                  const blobTypeText = TEXT_TYPES.test(b.type)
                  if (blobTypeText || b.type == "") b = null
                  else t = ""
                }
                send({
                  data: { json, text: t, blob: b },
                  ok,
                  status,
                  statusText,
                  statusCode: status,
                  error: null,
                })
                if (config.debug) {
                  console.info(`${IRA_LOG} URL='${url}' >>> 🍃 REQ_DATA: `, {
                    headers,
                    body,
                    config,
                    extra,
                  })
                }
              })
            })
            .catch((error) => {
              const statusCode = 500
              console.error(
                `${IRA_LOG} - Got error on request ⛔, URL='${url}' >>> REQ_DATA: ${error}`
              )
              send({
                data: { json: {}, text: "", blob: null },
                ok: false,
                status: statusCode,
                statusText: error,
                statusCode,
                error,
              })
            })
        })
      } catch (e) {
        console.error(`${IRA_LOG} >>> ${e}`)
      }
    }
    return fetchPromise
  }
  function ira(url = "string", extra = INIT_IRA_CONFIG) {
    return makeIraFetch(IRA_METHODS.get, {
      acceptsBody: false,
    })(url, extra)
  }
  // * Attach methods to Ira obj
  ira.get = makeIraFetch(IRA_METHODS.get, {
    acceptsBody: false,
  })
  ira.head = makeIraFetch(IRA_METHODS.head, {
    acceptsBody: false,
  })
  ira.delete = makeIraFetch(IRA_METHODS.delete, {
    acceptsBody: false,
  })
  ira.post = makeIraFetch()
  ira.put = makeIraFetch(IRA_METHODS.put)
  ira.connect = makeIraFetch(IRA_METHODS.connect)
  ira.options = makeIraFetch(IRA_METHODS.options)
  ira.trace = makeIraFetch(IRA_METHODS.trace)

  /**
   * Acces Ira persistent config
   * @type { INIT_IRA_CONFIG }
   */
  ira._config = {}

  /**
   * Sets persisten config headers or body for future requests
   * @param { INIT_IRA_CONFIG } config
   */
  ira.config = (config = {}) => {
    if (!Object.entries(config).length) {
      // We reset config if *empty { } , is provided
      config = { ...INIT_IRA_CONFIG }
    }
    persistentIraConfig = { ...config }
    ira._config = persistentIraConfig
  }

  /**
   * Returns a base64 String from a blob
   * @param { Blob } blob
   * @returns { Promise<String> }
   */
  ira.blobToBase64 = (blob) => {
    return new Promise((returns) => {
      try {
        const reader = new FileReader()
        reader.onload = () => returns(reader.result)
        reader.readAsDataURL(blob)
      } catch (e) {
        console.error(`${IRA_LOG} - Got error on Blob parse >>> ${e}`)
        returns("")
      }
    })
  }

  /**
   * Sets config and returns a modded Ira function
   * @param { INIT_IRA_CONFIG } config
   * @returns { ira }
   */
  ira.extend = (config) => {
    const myMethods = {}
    Object.keys(IRA_METHODS).map((name) => {
      myMethods[name] = (url, extra) => ira[name](url, extra, config)
    })
    return {
      ...myMethods,
      _config: config,
      extend: ira.extend,
      blobToBase64: ira.blobToBase64,
      config: ira.config,
    }
  }

  return ira
}

// Trying to export function
"object" == typeof exports && "object" == typeof module
  ? (module.exports = f())
  : "object" == typeof exports
  ? (exports.ira = f())
  : (this.ira = f())
