const request = require('supertest')
const app = require('../index.js')
const { trivialWasm, truncatedWasm } = require('./helpers/paths')

describe('process health under repeated failures', () => {
  it('stays responsive after many malformed-wasm requests', async () => {
    // Hammer /decompile with malformed wasm - each must 500, none must crash.
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/decompile')
        .attach('contract', truncatedWasm)
        .expect(500)
    }
    // A subsequent healthy request on the same process must still succeed.
    await request(app)
      .post('/wat')
      .attach('contract', trivialWasm)
      .expect(200)
      .then((res) => {
        expect(res.text).toContain('i32.add')
      })
  })
})
