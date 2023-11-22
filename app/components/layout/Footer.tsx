import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import ghImg from '../../../public/img/gh.svg'
import supportImg from '../../../public/img/support.svg'
import stellarIconImg from '../../../public/stellar.ico'

export default function Footer() {
  return (
    <Container id="footer">
      <Row>
        <Col md={{ span: 2, offset: 10 }}>
          <a href="https://github.com/chatch/stellarexplorer">
            <img src={ghImg} alt="github" height={20} width={20} />
            Source Code
          </a>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 2, offset: 10 }}>
          <a href="https://github.com/chatch/stellarexplorer/issues">
            <img src={supportImg} alt="support" height={20} width={20} />
            Support
          </a>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 2, offset: 10 }}>
          <a href="https://stellar.org">
            <img src={stellarIconImg} alt="stellar" height={20} width={20} />
            Stellar.org
          </a>
        </Col>
      </Row>
    </Container>
  )
}
