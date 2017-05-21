import React from 'react'
import {Grid, Row} from 'react-bootstrap'

import CreateAccount from './CreateAccount'
import Payment from './Payment'
import PathPayment from './PathPayment'
import Offer from './Offer'
import SetOptions from './SetOptions'
import ChangeTrust from './ChangeTrust'
import AllowTrust from './AllowTrust'
import AccountMerge from './AccountMerge'
import Inflation from './Inflation'

function SubOperation(props) {
    let subOp
    switch (props.data.type) {
        case 'create_account':
            subOp = <CreateAccount data={props.data}/>
            break
        case 'payment':
            subOp = <Payment data={props.data}/>
            break
        case 'path_payment':
            subOp = <PathPayment data={props.data}/>
            break
        case 'manage_offer':
        case 'create_passive_offer':
            subOp = <Offer data={props.data}/>
            break
        case 'set_options':
            subOp = <SetOptions data={props.data}/>
            break
        case 'change_trust':
            subOp = <ChangeTrust data={props.data}/>
            break
        case 'allow_trust':
            subOp = <AllowTrust data={props.data}/>
            break
        case 'account_merge':
            subOp = <AccountMerge data={props.data}/>
            break
        case 'inflation':
            subOp = <Inflation data={props.data}/>
            break
        default:
            console.error(`Unknown operation type ${props.data.type}`);
            subOp = null
            break
    }
    return subOp
}

class Operation extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <h5>Operation {d.id}</h5>
                    <div>Type {d.type}</div>
                    <div>Type_i {d.type_i}</div>
                    <div>Source {d.source_account}</div>
                    <SubOperation data={d}/>
                </Row>
            </Grid>
        )
    }
}

export default Operation
