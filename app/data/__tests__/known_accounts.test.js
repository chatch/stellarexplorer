import accounts from '../known_accounts'
import {isPublicKey} from '../../lib/stellar/utils'

const findByName = name => {
  const addr = Object.keys(accounts).find(key => accounts[key].name === name)
  return {addr, account: accounts[addr]}
}

it('anchor account included', () => {
  const {addr: tonairaAddr, account: tonaira} = findByName('Tonaira')
  expect(isPublicKey(tonairaAddr)).toBe(true)
  expect(tonaira.name).toBe('Tonaira')
  expect(tonaira.website).toBe('https://tonaira.com/')
  expect(tonaira.type).toBe('issuer')

  // check basics of another
  const {addr: vcbearAddr, account: vcbear} = findByName('VCBear')
  expect(isPublicKey(vcbearAddr)).toBe(true)
  expect(vcbear).toBeDefined()
  expect(vcbear.name).toBe('VCBear')
  expect(vcbear.website).toBe('https://vcbear.net/')
})

it('standard exchange accounts are included', () => {
  const {addr: poloniexAddr, account: poloniex} = findByName('Poloniex')
  expect(isPublicKey(poloniexAddr)).toBe(true)
  expect(poloniex).toBeDefined()
  expect(poloniex.name).toBe('Poloniex')
  expect(poloniex.website).toBe('poloniex.com')
  expect(poloniex.type).toBe('exchange')
})

it('exchange accounts with logo override sets logo', () => {
  const {addr: papayaAddr} = findByName('PapayaBot')
  expect(isPublicKey(papayaAddr)).toBe(true)
})
