const request = require('supertest')
const app = require('../index.js')
const { trivialWasm, truncatedWasm } = require('./helpers/paths')

describe('POST /wat', () => {
  it('converts a valid wasm to wat (200, text/plain)', () =>
    request(app)
      .post('/wat')
      .attach('contract', trivialWasm)
      .expect(200)
      .expect('Content-Type', /text\/plain/)
      .then((res) => {
        expect(res.text).toContain('i32.add')
      }))

  it('returns 500 on malformed wasm without crashing (the log error)', () =>
    request(app).post('/wat').attach('contract', truncatedWasm).expect(500))
})
