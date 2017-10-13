import FeedStore from '../feed_store'

jest.mock('fetch-ponyfill')

const feedUrl = testFile => `https://feed/feed_store.test.${testFile}.json`

it('feed fetched and stored at base root if no root configured', done => {
  const store = new FeedStore(feedUrl('1'))
  setTimeout(() => {
    expect(store.getData()).toEqual({
      prop: 1,
    })
    done()
  }, 50)
})

it('feed fetched and stored at specific root', done => {
  const store = new FeedStore(feedUrl('2'), 'root')
  setTimeout(() => {
    expect(store.getData()).toEqual({
      childprop: 2,
    })
    done()
  }, 50)
})
