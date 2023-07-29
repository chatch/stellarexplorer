import React from "react";
import Container from "react-bootstrap/Container";
import Panel from "react-bootstrap/Panel";
import Row from "react-bootstrap/Row";
import { injectIntl } from "react-intl";
import LedgerTable from "./LedgerTableContainer";
import { setTitle } from "../lib/utils";

class Ledgers extends React.Component {
  render() {
    setTitle("Ledgers");
    const { formatMessage } = this.props.intl;
    return (
      <Container>
        <Row>
          <Panel header={formatMessage({ id: "ledgers" })}>
            <LedgerTable usePaging compact={false} limit={20} />
          </Panel>
        </Row>
      </Container>
    );
  }
}

export default injectIntl(Ledgers);
