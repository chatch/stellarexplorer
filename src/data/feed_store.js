import FetchPonyfill from 'fetch-ponyfill'
import has from 'lodash/has'

const fetch = FetchPonyfill().fetch

const CACHE_EXPIRY_MILLIS = 72 * 60 * 60 * 1000

/**
 * Fetches and stores JSON from a given URL.
 *
 * Data is cached. A new copy will be fetched on the first get after cacheExpiry
 * milliseconds has elapsed.
 *
 * Optionally can store data from a given 'root' rather then from the root
 * of the fetched document.
 */
class FeedStore {
  constructor(url, root = null, expiry = CACHE_EXPIRY_MILLIS) {
    this.config = {url: url, root: root, cacheExpiry: expiry}
    this.setNoData()
    this.update()
  }

  update() {
    fetch(this.config.url)
      .then(rsp => rsp.json())
      .then(json => {
        if (this.config.root === null) {
          this.setData(json)
        } else if (has(json, this.config.root)) {
          this.setData(json[this.config.root])
        } else {
          this.setNoData()
          console.error(
            `property ${this.config.root} not found in feed ${this.config.url}`
          )
        }
      })
      .catch(err => {
        this.setNoData()
        console.error(`Failed to fetch feed ${this.config.url}: [${err}]`)
        console.error(`stack: [${err.stack}]`)
      })
  }

  getData() {
    if (this.state.ts + CACHE_EXPIRY_MILLIS > Date.now()) this.update()
    return this.state.data
  }

  cacheExpired() {
    return this.state.ts + this.config.cacheExpiry > Date.now()
  }

  setData(data) {
    this.state = {data: data, ts: Date.now()}
  }

  setNoData() {
    this.state = {data: null, ts: null}
  }
}

export default FeedStore
