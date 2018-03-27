import React from 'react';
import { Container, Card, Grid, Header, Divider } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setHeaders } from '../actions/headers';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

class Coin extends React.Component {
  state = { coin: {} }

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    axios.get(`/api/coins/${id}`)
    .then( res => { 
      dispatch(setHeaders(res.headers))
      this.setState({ coin: res.data })
    })
  }

  calcPrice = (coin, price, change) => {
    let c = parseFloat(change)
    let p = parseFloat(price) 
    if (c < 0) 
      return p * (Math.abs((c / 100)) + 1)
    else
      return p / ((c / 100) + 1) 
  }

  formatData = (coin) => {
    return [
      { time: '7 days', price: this.calcPrice(coin, coin.price_usd, coin.percent_change_7d) },
      { time: '24 hours', price: this.calcPrice(coin, coin.price_usd, coin.percent_change_24h) },
      { time: '1 hour', price: this.calcPrice(coin, coin.price_usd, coin.percent_change_1h) },
      { time: 'Current', price: parseFloat(coin.price_usd) },
    ]
  }

  render() {
    const { coin } = this.state;
    return (
      <Container>
        <Divider hidden/>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={6}>
              <Header as="h1">{coin.symbol}</Header>
              <Card>
                <Card.Content header={coin.name} />
                <Card.Content description={`$${coin.price_usd}`} />
                <Card.Content description={`${coin.price_btc} BTC`} />
                <Card.Content extra>
                  <p>Rank: {coin.rank}</p>
                  <p>Symbol: {coin.symbol}</p>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={10}>
              <Header as="h1">{coin.name} Historical Data</Header>
              <AreaChart height={400} width={800} data={this.formatData(coin)}>
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884D8"
                  fill="#8884D8"
                />
              </AreaChart>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

export default connect()(Coin);