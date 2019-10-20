import directory from '../data/directory'
const {anchors} = directory

/**
 * Register some known distributer accounts linking to thier issuer accounts.
 *
 * NOTE: where a single distributer/issuer pair is used for multiple
 *  asset types an issuer lookup for just one asset is required to
 *  make the link. (eg. apay.io:ETH)
 */

const issuer = (name, asset) =>
  anchors[name].assets[asset].substring(asset.length + 1)

export default {
  GDSNYE6WMDQQW7JNAIIFEIJ562GS76WGSKXG3K6DPXLRN3COA47JRAJH: issuer(
    'smartlands.io',
    'SLT'
  ),
  GDBWXSZDYO4C3EHYXRLCGU3NP55LUBEQO5K2RWIWWMXWVI57L7VUWSZA: issuer(
    'apay.io',
    'ETH'
  ),
  GCGJVS7JZ7AP54H5GJIDNKGDDCOQ34H6NZBV7VCBLW4VCD4JOWERABA5: issuer(
    'ripplefox.com',
    'CNY'
  ),
  GDW3CNKSP5AOTDQ2YCKNGC6L65CE4JDX3JS5BV427OB54HCF2J4PUEVG: issuer(
    'funtracker.site',
    'FUNT'
  ),
  GBF6JDOF7SKMKMSMXHBHLYBRMLZF5QF6YNGXWM3NMX3H3HDJ7VVPCHQR: issuer(
    'nrvcoin.in',
    'NRV'
  ),
  GBNDDA3CJ6WDRE36TDGDNTTVV3QET7MRDINP3HUMIKBPQBKQGITZ73T5: issuer(
    'nrvcoin.in',
    'NRV'
  ),
}
