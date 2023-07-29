import React from "react";
import Container from "react-bootstrap/Container";
import Panel from "react-bootstrap/Panel";
import Row from "react-bootstrap/Row";
import { injectIntl } from "react-intl";
import OperationTable from "./OperationTable";
import { setTitle } from "../lib/utils";

class Operations extends React.Component {
  render() {
    setTitle("Operations");
    const { formatMessage } = this.props.intl;
    return (
      <Container>
        <Row>
          <Panel header={formatMessage({ id: "operations" })}>
            <OperationTable compact={false} limit={50} usePaging />
          </Panel>
        </Row>
      </Container>
    );
  }
}

export default injectIntl(Operations);
