const request = require('supertest')
const app = require('../index.js')

describe('upload guards', () => {
  it('rejects /decompile with no file (400)', () =>
    request(app).post('/decompile').expect(400, 'No file was uploaded.'))

  it('rejects /wat with no file (400)', () =>
    request(app).post('/wat').expect(400, 'No file was uploaded.'))

  it('rejects /interface with no file (400)', () =>
    request(app).post('/interface').expect(400, 'No file was uploaded.'))

  it('returns 413 when the upload exceeds MAX_FILE_SIZE_BYTES', () => {
    // Load a fresh app instance with a 1KB limit so we can trigger the
    // multer LIMIT_FILE_SIZE path with a small in-memory payload.
    const original = process.env.MAX_FILE_SIZE_BYTES
    let limitedApp
    jest.isolateModules(() => {
      process.env.MAX_FILE_SIZE_BYTES = '1024'
      limitedApp = require('../index.js')
    })
    process.env.MAX_FILE_SIZE_BYTES = original

    const oversized = Buffer.alloc(2048, 0x00)
    return request(limitedApp)
      .post('/decompile')
      .attach('contract', oversized, 'big.wasm')
      .expect(413, 'File too large')
  })
})
