import { Col, Container, Row } from 'react-bootstrap'
import { publicAssetUrl } from '~/lib/build-target'

const ghImg = publicAssetUrl('img/gh.svg')
const supportImg = publicAssetUrl('img/support.svg')
const stellarIconImg = publicAssetUrl('stellar.ico')

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
