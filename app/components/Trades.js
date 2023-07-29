import React from "react";
import Container from "react-bootstrap/Container";
import Panel from "react-bootstrap/Panel";
import Row from "react-bootstrap/Row";
import { injectIntl } from "react-intl";
import TradeTable from "./TradeTable";
import { setTitle } from "../lib/utils";

class Trades extends React.Component {
  render() {
    setTitle("Trades");
    const { formatMessage } = this.props.intl;
    return (
      <Container>
        <Row>
          <Panel header={formatMessage({ id: "trades" })}>
            <TradeTable limit={50} usePaging />
          </Panel>
        </Row>
      </Container>
    );
  }
}

export default injectIntl(Trades);
