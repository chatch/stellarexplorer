import accounts from '../known_accounts'
import has from 'lodash/has'

const ISSUER_ACCOUNT_1 =
  'GCLRUZDCWBHS7VIFCT43BARPP63BHR32HMEVKXYQODA5BU6SIGFK4HL2'
const ISSUER_ACCOUNT_2 =
  'GDXTJEK4JZNSTNQAWA53RZNS2GIKTDRPEUWDXELFMKU52XNECNVDVXDI'

const EXCHANGE_ACCOUNT_1 =
  'GCGNWKCJ3KHRLPM3TM6N7D3W5YKDJFL6A2YCXFXNMRTZ4Q66MEMZ6FI2'

it('anchors issuer accounts are included', () => {
  expect(has(accounts, ISSUER_ACCOUNT_1)).toBe(true)
  expect(accounts[ISSUER_ACCOUNT_1].name).toBe('Tonaira')
  expect(accounts[ISSUER_ACCOUNT_1].website).toBe('https://tonaira.com/')
  expect(accounts[ISSUER_ACCOUNT_1].type).toBe('issuer')

  expect(has(accounts, ISSUER_ACCOUNT_2)).toBe(true)
  expect(accounts[ISSUER_ACCOUNT_2].name).toBe('VCBear')
  expect(accounts[ISSUER_ACCOUNT_2].website).toBe('https://vcbear.net/')
})

it('exchange accounts are included', () => {
  expect(has(accounts, EXCHANGE_ACCOUNT_1)).toBe(true)
  expect(accounts[EXCHANGE_ACCOUNT_1].name).toBe('Poloniex')
  expect(accounts[EXCHANGE_ACCOUNT_1].type).toBe('destination')
})
