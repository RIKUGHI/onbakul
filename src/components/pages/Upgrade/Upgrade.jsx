import axios from 'axios'
import React, { Component } from 'react'
import { GlobalConsumer } from '../../../context'
import util from '../../../util'
import Loading from '../../templates/Loading'
import MainLayout from '../../templates/MainLayout/MainLayout'
import Modal from '../../templates/Modal'
import Notification from '../../templates/Notification'
import ItemFeature from './ItemFeature'
import './Upgrade.scss'
import UpgradeCard from './UpgradeCard'

class Upgrade extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: {
        id_owner: 0,
        created_at: '',
        business_name: '',
        owner_name: '',
        owner_code: '',
        telp: '',
        email: '',
        today: '0000-00-00',
        is_pro: false,
        start: '0000-00-00 00:00:00',
        end: '0000-00-00 00:00:00',
        outlets: [
          {
            id_owner: 0,
            id_outlet: 0,
            owner_code: '',
            outlet_name: '',
            city: '',
            address: '',
            telp: ''
          }
        ]
      },
      countDownDate: '00:00:00:00',
      currentDateTime: '0000-00-00 00:00:00',
      showPaymentModal: false,
      showNotif: false,
      statusNotif: '',
      statusMessage: '',
      isLoading: false,
      isLoadingPage: true,
      isProsessPayment: false
    }
    this._doUpgrade = this._doUpgrade.bind(this)
    this._getCurrentDateTime = this._getCurrentDateTime.bind(this)
  }

  componentDidMount(){
    this._getData()
  }

  componentDidUpdate(){
    // console.log('updated');
  }

  _getData(){
    this.setState({isLoadingPage: true})
    axios.get(util.server_url+'accounts/'+this.props.state.id_owner)
    .then(res => {
      this.setState({
        data: res.data.result,
        currentDateTime: this._getCurrentDateTime(res.data.result.today , new Date()) < res.data.result.end ? this._getCurrentDateTime(res.data.result.today , new Date()) : res.data.result.end,
        isLoadingPage: false
      }, () => {
        let endDate = new Date(res.data.result.end).getTime()
        console.log(endDate);
        let countDownDate = setInterval(() => {
          let now = new Date();
          let miliTime = now.getTime()
          let distance = endDate - miliTime;

          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          this.setState({
            countDownDate: `${days <= 0 ? '00' : this._fixingTime(days)}:${hours <= 0 ? '00' : this._fixingTime(hours)}:${minutes <= 0 ? '00' : this._fixingTime(minutes)}:${seconds <= 0 ? '00' : this._fixingTime(seconds)}`,
            currentDateTime: this._getCurrentDateTime(this.state.data.today, now)
          })
          if (distance < 0) clearInterval(countDownDate)
        }, 1000);
      })
    })
    .catch(err => console.log(err))
  }

  _doUpgrade(){
    const data = new FormData()
    data.append('owner_name', this.state.data.owner_name)

    this.setState({isLoading: true})
    axios.put(util.server_url+'payment/edit/'+this.props.state.id_owner, new URLSearchParams(data))
    .then(res => {
      setTimeout(() => {
        this.setState({
          isLoading: false,
          showPaymentModal: res.data.response_code === 200 ? false : true,
          showNotif: true,
          statusNotif: res.data.response_code === 200 ? 'success' : 'warning',
          statusMessage: res.data.result.message
        })
  
        if (res.data.response_code === 200) this._getData() 
      }, 2000);
    })
    .catch(err => console.log(err))
  }

  _fixingTime(t){
    return t.toString().length === 1 ? '0'+t.toString() : t 
  }

  _getCurrentDateTime(today, now){
    return `${today} ${this._fixingTime(now.getHours())}:${this._fixingTime(now.getMinutes())}:${this._fixingTime(now.getSeconds())}`
  }

  render() {
    return (
      <>
        <MainLayout title='Upgrade'>
          {this.state.isLoadingPage ? <Loading /> : <>
            <span className='upgrade-title'>{this.state.data.is_pro && this.state.currentDateTime < this.state.data.end ? `Fitur Premium Tersisa ${this.state.countDownDate}` : 'Upgrade Toko - '+this.props.state.business_name}</span>
            {this.state.data.is_pro && this.state.currentDateTime < this.state.data.end ? (
              <ul className='unlocked-feature'>
                <li>
                  <i className="fas fa-unlock-alt"></i>
                  <span>Fitur Supplier, Outlet dan Pembelian Terbuka</span>
                </li>
              </ul>
            ) : (
              <>
                <div className="container-card-upgrade">
                  <UpgradeCard 
                    featureList={['POST di Android', 'Fitur Dasar', 'Laporan Sederhana']}
                  />
                  <UpgradeCard 
                    isPro 
                    featureList={['POST di Android', 'Fitur Dasar', 'Fitur Menengah', 'Laporan Sederhana']}
                    onShowModal={() => this.setState({showPaymentModal: true})}
                  />
                </div>
                <div className="container-table-upgrade">
                  <table className='upgrade-table'>
                    <thead>
                      <tr>
                        <th>Fitur</th>
                        <th>Basic</th>
                        <th>Pemium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ItemFeature name='Manajemen Produk' both />
                      <ItemFeature name='Jumlah Produk' valueBasic='Tidak Terbatas' valuePro='Tidak Terbatas' />
                      <ItemFeature name='Manajemen Harga Modal dan Jual' both />
                      <ItemFeature name='Manajemen Stok Produk' both />
                      <ItemFeature name='Peringatan Sisa Stok' both />
                      <ItemFeature name='Produk dengan Varian' both />
                      <ItemFeature name='Jumlah Transaksi' valueBasic='Tidak Terbatas' valuePro='Tidak Terbatas' />
                      <ItemFeature name='Catat Transaksi Tunai dan Non Tunai' both />
                      <ItemFeature name='Jumlah Outlet' valueBasic='Hanya Pemilik' valuePro='Pemilik + Outlet Tidak Terbatas' />
                      <ItemFeature name='Pembelian dan Supplier' isPro />
                      <ItemFeature name='Catat Pendapatan dan Pengeluaran' isPro />
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>}
        </MainLayout>

        {/* notification */}
        <Notification 
          show={this.state.showNotif} 
          status={this.state.statusNotif} 
          message={this.state.statusMessage}
          onHide={() => this.setState({
            showNotif: false,
            statusNotif: '',
            statusMessage: ''
          })} />
        
        {/* ============================================= Modal Payment ============================================= */}
        <Modal.Center show={this.state.showPaymentModal} onHide={() => this.setState({showPaymentModal: false})}>
          <Modal.Center.Payment 
            isProsessPayment={this.state.isProsessPayment}
            isLoading={this.state.isLoading}
            onClickPay={() => this.setState({
              isLoading: true
            }, () => {
              setTimeout(() => {
                this.setState({isProsessPayment: true, isLoading: false})
              }, 3000);
            })}
            onSuccessfulyPayment={this._doUpgrade}
          />
        </Modal.Center>
      </>
    )
  }
}

export default GlobalConsumer(Upgrade)