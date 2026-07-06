// Verifies that the morgan access-log middleware emits exactly one log line
// per finished request, with the format documented in api/index.js. Skips
// /health (currently no such route; the skip is preemptive for a future
// Fly health probe).
const request = require('supertest')
const app = require('../index.js')
const { trivialWasm } = require('./helpers/paths')

describe('access log', () => {
  let stdoutSpy
  let lines

  beforeEach(() => {
    lines = []
    // morgan writes via console-log → process.stdout.write. Capture chunks
    // and split on newlines so we can inspect individual lines.
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation((chunk) => {
        const text = typeof chunk === 'string' ? chunk : chunk.toString()
        for (const piece of text.split('\n')) {
          if (piece) lines.push(piece)
        }
        return true
      })
  })

  afterEach(() => {
    stdoutSpy.mockRestore()
  })

  // ISO timestamp, METHOD, URL, STATUS, "resLen/reqLen", "-", "<n> ms",
  // contract-id (or "-"), "<ua>", "<referer>"
  const LINE_RE =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z (GET|POST) \/[\w/-]+ \d{3} (-|\d+)(\/(-|\d+))? - \d+(?:\.\d+)? ms (?:-|\S+) "[^"]*" "[^"]*"$/

  it('emits exactly one log line for a successful /wat request', async () => {
    const before = lines.length
    await request(app)
      .post('/wat')
      .set('User-Agent', 'steexp-access-log-test')
      .set('Referer', 'https://steexp.com/contract/CABC')
      .attach('contract', trivialWasm)
      .expect(200)

    const newLines = lines.slice(before).filter((l) =>
      LINE_RE.test(l),
    )
    expect(newLines).toHaveLength(1)
    expect(newLines[0]).toContain('POST /wat 200')
    expect(newLines[0]).toContain('"steexp-access-log-test"')
    expect(newLines[0]).toContain('"https://steexp.com/contract/CABC"')
  })

  it('emits one log line even when the request fails', async () => {
    const before = lines.length
    // Missing file → 400 from the route handler, but morgan still logs.
    await request(app).post('/wat').expect(400)

    const newLines = lines.slice(before).filter((l) => LINE_RE.test(l))
    expect(newLines).toHaveLength(1)
    expect(newLines[0]).toContain('POST /wat 400')
  })

  it('does not log /health requests', async () => {
    // No /health route exists yet, but a 404 still flows through morgan
    // unless the skip predicate matches. This test pins that contract so
    // a future Fly health probe stays out of the log.
    const before = lines.length
    await request(app).get('/health').expect(404)

    const newLines = lines.slice(before).filter((l) => LINE_RE.test(l))
    expect(newLines).toHaveLength(0)
  })

  it('logs the X-Steexp-Contract-Id header when set', async () => {
    const before = lines.length
    await request(app)
      .post('/wat')
      .set('X-Steexp-Contract-Id', 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA')
      .attach('contract', trivialWasm)
      .expect(200)

    const newLines = lines.slice(before).filter((l) => LINE_RE.test(l))
    expect(newLines).toHaveLength(1)
    expect(newLines[0]).toContain(
      'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA',
    )
  })

  it('caps the contract ID at 100 characters', async () => {
    // Node's http module rejects header values with control characters,
    // so we can only test the length cap here. Control-char stripping is
    // a one-line regex and doesn't need a runtime test.
    const longId = 'C' + 'A'.repeat(150)
    const before = lines.length
    await request(app)
      .post('/wat')
      .set('X-Steexp-Contract-Id', longId)
      .attach('contract', trivialWasm)
      .expect(200)

    const newLines = lines.slice(before).filter((l) => LINE_RE.test(l))
    expect(newLines).toHaveLength(1)
    const fields = newLines[0].split(' ')
    // contract-id slot is field 8 (after timestamp, METHOD, URL, STATUS,
    // "resLen/reqLen", "-", "<n> ms")
    expect(fields[8]).toBe('C' + 'A'.repeat(99))
    expect(fields[8]).toHaveLength(100)
  })

  it('emits a dash when X-Steexp-Contract-Id is not set', async () => {
    const before = lines.length
    await request(app)
      .post('/wat')
      .attach('contract', trivialWasm)
      .expect(200)

    const newLines = lines.slice(before).filter((l) => LINE_RE.test(l))
    expect(newLines).toHaveLength(1)
    // contract-id slot is field 8 (after timestamp, METHOD, URL, STATUS,
    // "resLen/reqLen", "-", "<n> ms")
    const fields = newLines[0].split(' ')
    expect(fields[8]).toBe('-')
  })
})