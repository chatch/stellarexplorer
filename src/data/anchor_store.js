import groupBy from 'lodash/groupBy'
import FeedStore from './feed_store'

const FEED_URL = 'https://api.stellarterm.com/v1/ticker.json'
const FEED_ROOT = 'assets'

class AnchorStore {
  constructor(feedUrl, feedRoot) {
    this.store = new FeedStore(feedUrl, feedRoot)
  }

  getAnchors() {
    return groupBy(
      this.store.getData().filter(asset => asset.domain !== 'native'),
      asset => asset.domain
    )
  }
}

//const anchorStore = new AnchorStore(FEED_URL, FEED_ROOT)
export default AnchorStore
