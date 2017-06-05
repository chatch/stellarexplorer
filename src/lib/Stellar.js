const sdk = require('stellar-sdk')

const TESTNET = 'https://horizon-testnet.stellar.org'
const PUBNET = 'https://horizon.stellar.org'
// const LOCALNET = 'http://localhost:8000'

const isPubNet = true   // TODO: parameterise
const horizonUrl = (isPubNet) ? PUBNET : TESTNET

const server = new sdk.Server(horizonUrl, {allowHttp: true})
if (!isPubNet)
    sdk.Network.useTestNetwork()

const issuers = {
  "GATEMHCCKCY67ZUCKTROYN24ZYT5GK4EQZ65JJLDHKHRUZI3EUEKMTCH": {
     code: "BTC",
     issuer: "NaoBTC"
  },
  "GAP5LETOV6YIE62YAM56STDANPRDO7ZFDBGSNHJQIYGGKSMOZAHOOS2S": {
     code: "EURT",
     issuer: "tempo.eu.com"
  },
  "GCGEQJR3E5BVMQYSNCHPO6NPP3KOT4VVZHIOLSRSNLE2GFY7EWVSLLTN": {
     code: "EQD",
     issuer: "equid.co"
  },
  "GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX": {
     code: "CNY",
     issuer: "ripplefox.com"
  },
  "GBUQWP3BOUZX34TOND2QV7QQ7K7VJTG6VSE7WMLBTMDJLLAW7YKGU6EP": {
     code: "PHP",
     issuer: "coins.asia"
  },
  "GBVAOIACNSB7OVUXJYC5UE2D4YK2F7A24T7EE5YOMN4CE6GCHUTOUQXM": {
     code: "JPY",
     issuer: "vcbear.net"
  },
  "GBAMBOOZDWZPVV52RCLJQYMQNXOBLOXWNQAY2IF2FREV2WL46DBCH3BE": {
     code: "DEMO",
     issuer: "stellarterm.com"
  },
}

export { sdk, server, isPubNet }
