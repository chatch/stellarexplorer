import {centralized, decentralized} from './exchanges.json'
import directory from '../data/directory'

const apayLogo = directory.anchors['apay.io'].logo
const rippleFoxLogo = directory.anchors['ripplefox.com'].logo

decentralized.PapayaBot.logo = apayLogo
decentralized.PapayaSwap.logo = apayLogo
centralized.Ripplefox.logo = rippleFoxLogo

export {decentralized, centralized}
