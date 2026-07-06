const fs = require('fs')
const request = require('supertest')
const app = require('../index.js')
const { trivialWasm, truncatedWasm, uploadDir } = require('./helpers/paths')

describe('POST /decompile', () => {
  it('decompiles a valid wasm (200, text/plain)', () =>
    request(app)
      .post('/decompile')
      .attach('contract', trivialWasm)
      .expect(200)
      .expect('Content-Type', /text\/plain/)
      .then((res) => {
        expect(res.text).toContain('add')
      }))

  it('returns 500 on malformed wasm without crashing (the log error)', () =>
    request(app).post('/decompile').attach('contract', truncatedWasm).expect(500))

  it('deletes the uploaded file after a successful request', async () => {
    const before = fs.readdirSync(uploadDir).length
    await request(app).post('/decompile').attach('contract', trivialWasm)
    expect(fs.readdirSync(uploadDir).length).toBe(before)
  })

  it('deletes the uploaded file after a failed request', async () => {
    const before = fs.readdirSync(uploadDir).length
    await request(app).post('/decompile').attach('contract', truncatedWasm)
    expect(fs.readdirSync(uploadDir).length).toBe(before)
  })
})
