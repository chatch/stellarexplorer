import accounts from '../known_accounts'
import has from 'lodash/has'

const DIST_ACCOUNT_1 =
  'GBK4DFCUAZRNU7TJ4XUOJEADVQBLGVVVFKRTHHXNAXD7MTYUWR7HKCNY'
const DIST_ACCOUNT_2 =
  'GCKX3XVTPVNFXQWLQCIBZX6OOPOIUT7FOAZVNOFCNEIXEZFRFSPNZKZT'

const ISSUER_ACCOUNT_1 =
  'GCLRUZDCWBHS7VIFCT43BARPP63BHR32HMEVKXYQODA5BU6SIGFK4HL2'
const ISSUER_ACCOUNT_2 =
  'GDXTJEK4JZNSTNQAWA53RZNS2GIKTDRPEUWDXELFMKU52XNECNVDVXDI'

const EXCHANGE_ACCOUNT_1 =
  'GCGNWKCJ3KHRLPM3TM6N7D3W5YKDJFL6A2YCXFXNMRTZ4Q66MEMZ6FI2'

it('anchors distribution accounts are included', () => {
  expect(has(accounts, DIST_ACCOUNT_1)).toBe(true)
  expect(accounts[DIST_ACCOUNT_1].name).toBe('RippleFox')
  expect(accounts[DIST_ACCOUNT_1].home).toBe('ripplefox.com')

  expect(has(accounts, DIST_ACCOUNT_2)).toBe(true)
  expect(accounts[DIST_ACCOUNT_2].name).toBe('coins.ph')
  expect(accounts[DIST_ACCOUNT_2].home).toBe('coins.ph')
})

it('anchors issuer accounts are included', () => {
  expect(has(accounts, ISSUER_ACCOUNT_1)).toBe(true)
  expect(accounts[ISSUER_ACCOUNT_1].name).toBe('TONAIRA')
  expect(accounts[ISSUER_ACCOUNT_1].home).toBe('tonaira.com')

  expect(has(accounts, ISSUER_ACCOUNT_2)).toBe(true)
  expect(accounts[ISSUER_ACCOUNT_2].name).toBe('VCBear')
  expect(accounts[ISSUER_ACCOUNT_2].home).toBe('vcbear.net')
})

it('exchange accounts are included', () => {
  expect(has(accounts, EXCHANGE_ACCOUNT_1)).toBe(true)
  expect(accounts[EXCHANGE_ACCOUNT_1].name).toBe('Poloniex')
  expect(accounts[EXCHANGE_ACCOUNT_1].home).toBe('poloniex.com')
})
