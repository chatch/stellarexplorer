import React from 'react'
import {Grid, Row, Col} from 'react-bootstrap'

class Footer extends React.Component {
    render() {
        return (
            <Grid id="footer">
                <Row>
                    <Col>
                        <hr/>
                        <a href="https://github.com/stellargraph">Github</a>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default Footer
