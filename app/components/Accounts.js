import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import AccountTable from "./AccountTable";

class Accounts extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <AccountTable limit={10} />
        </Row>
      </Container>
    );
  }
}

export default Accounts;
