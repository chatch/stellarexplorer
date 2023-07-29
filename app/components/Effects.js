import React from "react";
import Container from "react-bootstrap/Container";
import Panel from "react-bootstrap/Panel";
import Row from "react-bootstrap/Row";
import { injectIntl } from "react-intl";
import EffectTable from "./EffectTable";
import { setTitle } from "../lib/utils";

class Effects extends React.Component {
  render() {
    setTitle("Effects");
    const { formatMessage } = this.props.intl;
    return (
      <Container>
        <Row>
          <Panel header={formatMessage({ id: "effects" })}>
            <EffectTable limit={50} usePaging showAccount />
          </Panel>
        </Row>
      </Container>
    );
  }
}

export default injectIntl(Effects);
