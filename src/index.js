/**
 * Ira Fetch - Vanilla JS Fetch API wrapper with goodies 🍒
 * @author Denny Portillo<hello@d3portillo.me>
 * @license MIT
 * @see https://github.com/d3portillo/ira
 * @version 0.0.5
 */

function f(forkConfig = {}) {
  const IRA_CONFIG = {
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
  const deepify = (obj = {}) => {
    const json = {}
    Object.keys(obj).forEach((prop) => {
      const V = obj[prop]
      json[prop] = typeof V != "string" ? JSON.stringify(V) : V
    })
    return json
  }

  /**
   * Ira.get Method
   * @param { String } url
   * @param { IRA_CONFIG } extra
   */
  function ira(url = "string", extra) {
    return makeIraFetch(IRA_METHODS.get, {
      acceptsBody: false,
    })(url, extra)
  }
  function makeIraFetch(method = "POST", opt = { acceptsBody: true }) {
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
     * @param {{ headers: {}, body: ?String, params: {}, debug: Boolean, parseBlob: Boolean }} extra - Your normal fetch opts
     * @return { Promise<IraResponse> }
     */
    const fetchPromise = (url, extra = {}) => {
      const config = {
        ...IRA_CONFIG,
        ...ira._config,
        ...extra,
        ...forkConfig,
      }
      let { headers = {}, body = "", params = {} } = extra
      headers = deepify({ ...config.headers, ...headers })
      const cType = headers["Content-Type"] || headers["Content-type"] || ""
      if (cType.includes("json")) body = deepify(body)
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
          ira.__exec_on.request({
            url,
            statusCode: 200,
            method,
            headers: new Headers(headers),
            config,
          })
          if (config.debug) console.info(`${IRA_LOG} URL='${url}' >>> SENT ⚡`)
          fetch(url, {
            ...extra,
            method,
            headers,
            ...(opt.acceptsBody ? { body } : {}),
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
                  json = JSON.parse(t)
                  if (typeof json == "string") json = {}
                } catch (_) {}
                if (parseBlob) {
                  const BIN_TYPE = /video|image|audio|ogg|pdf|rar|zip|font|7z|flash|x-/g
                  // Posible blob types to binaries - this will be too ugly parsed
                  // to utf-8 string from resposne.text
                  const isBinary = BIN_TYPE.test(b.type)
                  const isUTF8 = /utf8|utf-8/gi.test(b.type)
                  if (isBinary && !isUTF8) t = ""
                }
                const data = { json, text: t, blob: b }
                const statusCode = status
                send({
                  data,
                  ok,
                  status,
                  statusText,
                  statusCode,
                  error: null,
                })
                ira.__exec_on.response({
                  url,
                  statusCode,
                  method,
                  headers: response.headers,
                  config,
                })
                if (config.debug) {
                  console.info(`🍃 ${IRA_LOG} URL='${url}' >>> RESPONSE: `, {
                    config,
                    responseData: { data },
                  })
                }
              })
            })
            .catch((error) => {
              console.error(
                `⛔ ${IRA_LOG} - Got error on request, URL='${url}' >>> ${error}`,
                { config }
              )
              send({
                data: { json: {}, text: "", blob: null },
                ok: false,
                status: 500,
                statusText: error,
                statusCode: 500,
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
   * Acces your current Ira config
   * @type { IRA_CONFIG }
   */
  ira._config = {}

  /**
   * Sets persisten config headers or body for future requests
   * @param { IRA_CONFIG } config
   */
  ira.config = (config = {}) => {
    if (!Object.entries(config).length) {
      // We reset config if *empty { } , is provided
      config = { ...IRA_CONFIG }
    }
    ira._config = { ...IRA_CONFIG, ...config }
  }

  /**
   * Returns a base64 String from a blob
   * @param { Blob } blob
   * @returns { Promise<String> }
   */
  ira.blobToBase64 = (blob) => {
    return new Promise((cb) => {
      try {
        const rdr = new FileReader()
        rdr.onload = () => cb(rdr.result)
        rdr.readAsDataURL(blob)
      } catch (e) {
        console.error(`${IRA_LOG} - Got error on Blob parse >>> ${e}`)
        cb("")
      }
    })
  }

  ira.__exec_on = {
    request: () => null,
    response: () => null,
  }
  /**
   * @callback cbFunction
   * @param {{ url: String, statusCode: ?Number, method: String, headers: {}, config: {} }} callbackObject
   */
  /**
   * Add your custom callbacks on response and request events
   * @param {("request" | "response")} event
   * @param { cbFunction } callback - Request or Response Objects Callback
   */
  ira.on = (event, callback) => {
    if (typeof callback == "function" && ira.__exec_on[event]) {
      ira.__exec_on[event] = callback
    }
  }

  /**
   * Sets config and returns a custom Ira Fork
   * @param { IRA_CONFIG } config
   * @returns { ira }
   */
  ira.extend = (conf = {}) => {
    conf.headers = conf.headers ? conf.headers : {}
    const iH = ira._config.headers
    conf.headers = iH ? { ...iH, ...conf.headers } : conf.headers
    const __ira = f(conf)
    __ira.config({ ...ira._config, ...conf })
    return __ira
  }
  return ira
}

"object" == typeof exports && "object" == typeof module
  ? (module.exports = f())
  : "object" == typeof exports
  ? (exports.ira = f())
  : (this.ira = f())
