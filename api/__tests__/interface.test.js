const fs = require('fs')
const request = require('supertest')
const app = require('../index.js')
const {
  trivialWasm,
  truncatedWasm,
  uploadDir,
  stellarFailStub,
} = require('./helpers/paths')

// Load a fresh app instance with a different stellar binary path. Needed
// because the path is read once at module load, and because jest's test-VM
// process.env writes don't reliably reach child_process.
const appWithStellar = (binPath) => {
  const original = process.env.STELLAR_BIN_PATH
  let instance
  jest.isolateModules(() => {
    process.env.STELLAR_BIN_PATH = binPath
    instance = require('../index.js')
  })
  process.env.STELLAR_BIN_PATH = original
  return instance
}

describe('POST /interface', () => {
  it('returns rust bindings as json (200) when the CLI succeeds', () =>
    request(app)
      .post('/interface')
      .attach('contract', trivialWasm)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((res) => {
        expect(res.body.rustInterface).toContain('stub rust bindings')
      }))

  it('returns 500 and cleans up when the CLI fails (the log error)', async () => {
    const failApp = appWithStellar(stellarFailStub)
    const before = fs.readdirSync(uploadDir).length
    await request(failApp)
      .post('/interface')
      .attach('contract', truncatedWasm)
      .expect(500)
    expect(fs.readdirSync(uploadDir).length).toBe(before)
  })

  it('returns 500 when the stellar binary is missing', () =>
    request(appWithStellar('/nonexistent/stellar-xyz'))
      .post('/interface')
      .attach('contract', trivialWasm)
      .expect(500))
})
