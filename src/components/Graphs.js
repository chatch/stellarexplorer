import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Tab from 'react-bootstrap/lib/Tab'
import Tabs from 'react-bootstrap/lib/Tabs'
import Chart from 'chart.js'

class OpPie extends React.Component {
  config = {
    type: 'pie',
    data: {
      datasets: [
        {
          data: [12, 40, 1, 20, 9],
          backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue'],
          label: 'Op Type',
        },
      ],
      labels: ['Create', 'Offer', 'Set Options', 'Payment', 'Inflation'],
    },
    options: {
      responsive: true,
    },
  }

  componentDidMount() {
    var ctx = document.getElementById('opPieChart').getContext('2d')
    new Chart(ctx, this.config)
  }

  render() {
    return <canvas id="opPieChart" />
  }
}

class RecentActivity extends React.Component {
  activityData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', 8, 9, 10, 11, 12],
    datasets: [
      {
        type: 'bar',
        label: 'Tx Count',
        backgroundColor: 'red',
        data: [4, 1, 0, 20, 5, 3, 2, 1, 9, 1, 0, 3],
      },
      {
        type: 'bar',
        label: 'Op Count',
        backgroundColor: 'blue',
        data: [22, 1, 0, 100, 17, 4, 2, 1, 18, 5, 0, 9],
      },
      {
        type: 'line',
        label: 'Close Times',
        borderColor: 'green',
        data: [10, 7, 9, 2, 3, 5, 7, 1, 7, 8, 6],
        yAxisID: 'y2',
      },
    ],
  }

  config = {
    type: 'bar',
    data: this.activityData,
    options: {
      title: {
        display: true,
        text: 'Recent Ledger Activity',
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      responsive: true,
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            id: 'y1',
            stacked: true,
          },
          {
            id: 'y2',
            stacked: true,
            position: 'right',
          },
        ],
      },
    },
  }

  componentDidMount() {
    var ctx = document.getElementById('recentActivityChart').getContext('2d')
    new Chart(ctx, this.config)
  }

  render() {
    return <canvas id="recentActivityChart" />
  }
}

class RecentTxCounts extends React.Component {
  config = {
    type: 'line',
    data: {
      labels: [
        '12/04',
        '12/05',
        '12/06',
        '12/07',
        '12/08',
        '12/09',
        '12/10',
        '12/11',
        '12/12',
        '12/13',
        '12/14',
        '12/15',
        '12/16',
        '12/17',
      ],
      datasets: [
        {
          label: 'Tx Count',
          backgroundColor: 'blue',
          borderColor: 'blue',
          data: [
            24591,
            26782,
            57697,
            35375,
            28487,
            21839,
            29707,
            89790,
            62123,
            64793,
            27525,
            9501,
            9530,
            43663,
          ],
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Tx Count Chart',
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Date',
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'No. of Transactions',
            },
          },
        ],
      },
    },
  }

  componentDidMount() {
    var ctx = document.getElementById('txCountChart').getContext('2d')
    new Chart(ctx, this.config)
  }

  render() {
    return <canvas id="txCountChart" />
  }
}

class Graphs extends React.Component {
  state = {
    key: undefined, // 'bar-simple',
  }

  constructor(props, context) {
    super(props, context)
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(key) {
    this.setState({key})
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col md={6}>
            <Tabs
              id="graph-tabs"
              activeKey={this.state.key}
              onSelect={this.handleSelect}
              style={{border: '1px solid #ddd', borderRadius: 4}}
            >
              <Tab eventKey="recent-activity" title="Recent Activity">
                <RecentActivity />
              </Tab>
              <Tab eventKey="tx-count" title="TxCount">
                <RecentTxCounts />
              </Tab>
              <Tab eventKey="op-pie" title="Op Pie">
                <OpPie />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default Graphs
