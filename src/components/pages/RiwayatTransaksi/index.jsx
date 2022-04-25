// libraies
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import util from '../../../util';

// components
import { Loading, MainLayout, Modal, NoData, Notification, Pagination } from "../..";

// sub components
import HeadTransaction from './HeadTransaction';
import DataWrapper from './DataWrapper';

// styles
import './RiwayatTransaksi.scss'
import { GlobalConsumer } from '../../../context';


function RiwayatTransaksi(p) {
  const [data, setData] = useState(null)
  const [titlePage, setTitlePage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProsess, setIsProsess] = useState(false)

  useEffect(() => {
    if (parseInt(p.state.level) === 0) {
      getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
    } else {
      getData(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet : p.location.search+'&id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet)
    }
  }, [p.location.search])

  const getData = query => {
    setIsLoading(true)
    axios.get(util.server_url+'transactions'+query)
    .then(res => {
      res.data.result.results !== null ? setData(res.data) : setData(null)
      setTitlePage(res.data.result.key_search)
      setIsLoading(false)
    })
    .catch(err => console.log(err))
  }

  const submitSearch = (e, type) => {
    e.preventDefault()

    if (type === 'Semua') {
      p.history.push(`riwayat-transaksi${e.target[0].value === '' ? '' : `?q=${e.target[0].value}`}`)
      // getData(`?q=${e.target[0].value}`)
      e.target[0].value = ''
    } else {
      const start = e.target[0]
      const end = e.target[1]
      
      if (start.value === '' || end.value === '') {
        handleShowNotif('warning', 'Tanggal awal atau akhir tidak boleh kosong')
      } else {
        p.history.push(`riwayat-transaksi?type=periode&start=${start.value}&end=${end.value}`)
        // getData(`?type=periode&start=${start.value}&end=${end.value}`)
      }
    }
  }

  // notification
  const [notification, setNotification] = useState(false)
  const [statusNotif, setStatusNotif] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const handleShowNotif = (status, message) => {
    setNotification(true)
    setStatusNotif(status)
    setStatusMessage(message)
  }
  const handleCloseNotif = () => setNotification(false)

  // modal detail transaction
  const [showDetail, setShowDetail] = useState(false)
  const [dataDetail, setDataDetail] = useState({
    display_name: '',
    id_transaction: 0,
    invoice: '',
    date: '',
    method: '',
    details: [],
    total: 0,
    paid_off: 0
  })

  const handleShowDetail = (indexGroup, indexData) => {
    setShowDetail(true)
    const methods = ['Tunai', 'GoPay', 'Ovo', 'ShoppePay']

    setDataDetail({
      display_name: data.result.results[indexGroup].results[indexData].id_outlet.outlet_name === 'Pusat' ? p.state.business_name : data.result.results[indexGroup].results[indexData].id_outlet.outlet_name,
      id_transaction: data.result.results[indexGroup].results[indexData].id_transaction,
      invoice: data.result.results[indexGroup].results[indexData].invoice,
      date: data.result.results[indexGroup].results[indexData].date,
      method: methods[data.result.results[indexGroup].results[indexData].method],
      details: data.result.results[indexGroup].results[indexData].details,
      total: data.result.results[indexGroup].results[indexData].grand_total,
      paid_off: data.result.results[indexGroup].results[indexData].paid_off
    })
    // setDataDetail('lol es')
  }
  const handleCloseDetail = () => setShowDetail(false)

  // modal delete transaction
  const [showDelete, setShowDelete] = useState(false)

  const handleShowDelete = () => setShowDelete(true)
  const handleCloseDelete = () => setShowDelete(false) 
  const handleSumbitDelete = () => {
    setIsProsess(true)
    axios.delete(util.server_url+'transactions/delete/'+dataDetail.invoice+'?id_owner='+p.state.id_owner+'&id_transaction='+dataDetail.id_transaction)
    .then(res => {
      if (res.data.response_code === 200) {
        handleShowNotif('success', res.data.result.message)
        getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)

        const modal = document.querySelectorAll('.modal')
        modal[0].querySelector('button[type="button"]').click()
        modal[1].querySelector('button[type="button"]').click()
      } else {
        handleShowNotif('warning', res.data.result.message)
      }
      setIsProsess(false)
    }).catch(err => {
      console.log(err)
      setIsProsess(false)
    })
  } 

  const handleExport = () => {
    // console.log(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner);
    if (parseInt(p.state.level) === 0) {
      window.location.replace(util.server_url+'transactions/export'+(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner))
    } else {
      window.location.replace(util.server_url+'transactions/export'+(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet : p.location.search+'&id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet))
    }
  }

  const handlePrint = (invoice, id) => {
    window.open(util.server_url+'printon?inv='+invoice+'&id_transaction='+id+'&name='+dataDetail.display_name)
  }

  return(
    <>
      <MainLayout 
        title="Riwayat Transaksi">
        <div className="history-transaction-container">
          <HeadTransaction onSubmit={submitSearch} onExport={handleExport} />
          <div className="transaction-container">
            {isLoading ? <Loading /> : data === null ? <NoData title="Transaksi" /> : (
              data.result.results.map((d, i) => <DataWrapper 
                                                  key={i} 
                                                  data={d}
                                                  onClick={indexData => handleShowDetail(i, indexData)} />)
            )}
            
          </div>
          {data !== null && data.result.total_pages > 1 && <Pagination.Transactions 
                                            url="riwayat-transaksi?" 
                                            option={data} />}
        </div>
      </MainLayout>

      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />
      
      {/* modal detail transaction */}
      <Modal.Center show={showDetail} onHide={handleCloseDetail}>
        <Modal.Center.DetailTransaction name={dataDetail.display_name}>
          <Modal.Center.DetailTransaction.Wrap>
            <Modal.Center.DetailTransaction.Wrap.SimpleData label="Inv" value={dataDetail.invoice} />
            <Modal.Center.DetailTransaction.Wrap.SimpleData label="Tanggal" value={dataDetail.date} />
            <Modal.Center.DetailTransaction.Wrap.SimpleData label="Metode Bayar" value={dataDetail.method} />
          </Modal.Center.DetailTransaction.Wrap>

          <Modal.Center.DetailTransaction.Wrap>
            {dataDetail.details && dataDetail.details.map((d, i) => <Modal.Center.DetailTransaction.Wrap.Product 
                                                key={i}
                                                name={d.product_name} 
                                                price={d.selling_price} 
                                                qty={d.quantity} />)}
          </Modal.Center.DetailTransaction.Wrap>

          <Modal.Center.DetailTransaction.Wrap>
            <Modal.Center.DetailTransaction.Wrap.Total price={util.formatRupiah(dataDetail.total)} />
          </Modal.Center.DetailTransaction.Wrap>

          <Modal.Center.DetailTransaction.Wrap>
            <Modal.Center.DetailTransaction.Wrap.Pay pay={dataDetail.paid_off} cashBack={parseInt(dataDetail.paid_off) - parseInt(dataDetail.total)} />
          </Modal.Center.DetailTransaction.Wrap>

        </Modal.Center.DetailTransaction>
        <Modal.Center.Footer>
          <div className="cdt-footer">
            {!p.state.transactions_ro && <button onClick={handleShowDelete}>Hapus</button>}
            <div className="cdt-footer-wrap">
              <button type="button">Tutup</button>
              <button onClick={() => handlePrint(dataDetail.invoice, dataDetail.id_transaction)}>Cetak Struk</button>
            </div>
          </div>
        </Modal.Center.Footer>
      </Modal.Center>

      {/* modal delete transaction */}
      <Modal.Center show={showDelete} onHide={handleCloseDelete}>
        <Modal.Center.TitleDelete title={dataDetail.invoice} />
        <Modal.Center.Warning messages={['Secara otomatis mempengaruhi data grafik']} />
        <Modal.Center.Footer>
          <button type="button">Batal</button>
          <button className={isProsess ? 'disable' : ''} onClick={handleSumbitDelete}>{isProsess ? 'Proses' : 'Iya'}</button>
        </Modal.Center.Footer>
      </Modal.Center>
    </>
  )
}

export default GlobalConsumer(RiwayatTransaksi)