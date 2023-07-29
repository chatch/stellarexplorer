import React from "react";
import Container from "react-bootstrap/Container";
import Panel from "react-bootstrap/Panel";
import Row from "react-bootstrap/Row";
import { injectIntl } from "react-intl";
import PaymentTable from "./PaymentTable";
import { setTitle } from "../lib/utils";

class Payments extends React.Component {
  render() {
    const { formatMessage } = this.props.intl;
    setTitle("Payments");
    return (
      <Container>
        <Row>
          <Panel header={formatMessage({ id: "payments" })}>
            <PaymentTable compact={false} limit={50} usePaging />
          </Panel>
        </Row>
      </Container>
    );
  }
}

export default injectIntl(Payments);
