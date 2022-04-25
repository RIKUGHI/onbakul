// libraries
import { Component, createRef, useEffect } from 'react';
import Chart from 'chart.js/auto'
import { Bar, Line } from 'react-chartjs-2';

// components
import { MainLayout } from '../..'
import OutletsList from './OutletsList/OutletsList';
import InfoCard from './InfoCard/InfoCard';

// styles
import './Dashboard.scss'
import GraphCard from './GraphCard/GraphCard';
import axios from 'axios';
import util from '../../../util';
import Cookies from 'js-cookie';
import { GlobalConsumer } from '../../../context';

class Dashboard extends Component {
  constructor(props){
    super(props)
    this.canvas = createRef()
  }

  state = {
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ],
    isLoading: true,
    result: {
      total_transactions: 0,
      profit: 0,
      expenditure: 0,
      total_order_plan: 0,
      daily_profit: {
        month: 1,
        data: [
          {
            date: '2000-01-01',
            profit: 0
          }
        ]
      },
      top_10_products: {
        month: 1,
        data: [
          {
            product_name: "kosong",
            total: 0
          }
        ]
      },
      last_7_days_trasaction: {
        month: 1,
        data: [
          {
            date: '2000-01-01',
            total: 0
          }
        ]
      },
      monthly_transactions: {
        month: 1,
        data: [
          {
            date: '2000-01-01',
            total: 0
          }
        ]
      },
      yearly_transactions: {
        year: 12,
        data: [
          {
            date: '2000',
            total: 0
          }
        ]
      }
    }
  }

  componentDidMount(){
    let url = ''
    if (parseInt(this.props.state.level) === 0) {
      url = util.server_url+'transactions/dashboard?id_owner='+this.props.state.id_owner
    } else {
      url = util.server_url+'transactions/dashboard?id_owner='+this.props.state.id_owner+'&id_outlet='+this.props.state.id_outlet
    }
    axios.get(url)
    .then(res => {
      this.setState({
        isLoading: false,
        result: res.data.result
      })
    }).catch(err => console.log(err))
  }
  
  dateToInaFormat = date => {
    const split = date.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
    return split[2]+' '+months[parseInt(split[1]) - 1]+' '+split[0]
  }

  render() {
    return (
      <MainLayout title="Dashboard">
      <OutletsList today={this.state.result.today} list={['Semua','Bamban 1', 'Nar 2', 'Cabang 3', 'Cabang 4', 'Es teh Hangat Anjir Mantab Lah wkwkw', '1', '2']} />
      <div className="card-container">
        <InfoCard loading={this.state.isLoading} icon="fas fa-file-invoice-dollar" title="Transaksi" val={util.formatRupiah(this.state.result.total_transactions, false)} />
        <InfoCard loading={this.state.isLoading} icon="fas fa-hand-holding-usd" title="Keuntungan" val={util.formatRupiah(this.state.result.profit)} />
        <InfoCard loading={this.state.isLoading} icon="fas fa-donate" title="Pengeluaran" val={util.formatRupiah(this.state.result.expenditure)} />
        <InfoCard loading={this.state.isLoading} icon="fas fa-file-alt" title="Rencana Order" val={util.formatRupiah(this.state.result.total_order_plan, false)} />
      </div>
      <div className={`graph-container${this.state.isLoading ? ' skeleton' : ''}`}>
        <div className="main-graph-card">
          <h3>Grafik Keuntungan Pada Bulan {util.months[this.state.result.daily_profit.month - 1]}</h3>
          <Line options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: false,
                text: 'Chart.js Line Chart',
              },
            },
          }} data={{
            labels: this.state.result.daily_profit.data.map(d => d.date),
            datasets: [
              {
                label: 'Transaksi Per Hari',
                data: this.state.result.daily_profit.data.map(d => d.profit),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
              }
            ],
          }} />
        </div>
        <div className="wrapper-graph">
          <GraphCard title="Top 10 Barang Terlaris">
            <Bar
              data={{
                labels: ['Top 1', 'Top 2', 'Top 3', 'Top 4', 'Top 5', 'Top 6', 'Top 7', 'Top 8', 'Top 9', 'Top 10'],
                datasets: this.state.result.top_10_products.data.map((d, i) => {
                  let data = []
                  for (let x = 0; x < this.state.result.top_10_products.data.length; x++) {
                    x === i ? data.push(d.total) : data.push(0)
                  }
      
                  return {
                    label: d.product_name,
                    backgroundColor: this.state.backgroundColor[i > 4 ? i - 5 : i],
                    borderColor: this.state.borderColor[i > 4 ? i - 5 : i],
                    borderWidth: 1,
                    data: data
                  }
                })
              }}
              options={{
                title:{
                  display:true,
                  text:'Average Rainfall per month',
                  fontSize:20
                },
                legend:{
                  display:true,
                  position:'right'
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }} />
          </GraphCard>
          <GraphCard type="line" title="Transaksi 7 Hari Terakhir">
            <Line options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: false,
                  text: 'Chart.js Line Chart',
                },
              },
            }} data={{
              labels: this.state.result.last_7_days_trasaction.data.map(d => d.date),
              datasets: [
                {
                  label: 'Transaksi Per Hari',
                  data: this.state.result.last_7_days_trasaction.data.map(d => d.total),
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderWidth: 1
                }
              ],
            }} />
          </GraphCard>
          <GraphCard title={`Transaksi Bulan ${util.months[this.state.result.monthly_transactions.month - 1]}`}>
            <Line options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: false,
                    text: 'Chart.js Line Chart',
                  },
                },
              }} data={{
                labels: this.state.result.monthly_transactions.data.map(d => d.date),
                datasets: [
                  {
                    label: 'Transaksi Per Hari',
                    data: this.state.result.monthly_transactions.data.map(d => d.total),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                  }
                ],
              }} />
          </GraphCard>
          <GraphCard type="line" title={`Transaksi Tahun ${this.state.result.yearly_transactions.year}`}>
            <Line options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                      text: 'Chart.js Line Chart',
                    },
                  },
                }} data={{
                  labels: this.state.result.yearly_transactions.data.map(d => d.date),
                  datasets: [
                    {
                      label: 'Transaksi Per Bulan',
                      data: this.state.result.yearly_transactions.data.map(d => d.total),
                      borderColor: 'rgba(255, 99, 132, 1)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderWidth: 1
                    }
                  ],
                }} />
          </GraphCard>
        </div>
      </div>
    </MainLayout>
    )
  }
}

export default GlobalConsumer(Dashboard)