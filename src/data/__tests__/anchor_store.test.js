import AnchorStore from '../anchor_store'

jest.mock('fetch-ponyfill')

const feedUrl = testFile => `https://feed/anchor_store.test.${testFile}.json`

it('pulls anchors list', done => {
  const store = new AnchorStore(feedUrl('1'), 'assets')

  setTimeout(() => {
    const anchors = store.getAnchors()
    expect(Object.keys(anchors).length).toEqual(1)
    expect(anchors['vcbear.net']).toMatchSnapshot()
    done()
  }, 150)
})
