import axios from 'axios'
import { useEffect, useState } from 'react'
import { FormGroup, Modal } from '../../..'
import EmptyCart from '../../../../assets/empty_cart.svg'
import util from '../../../../util'
import ItemProduct from '../ItemProduct'
import SimpleGroup from '../SimpleGroup'
import './Billing.scss'

export default function Billing({p, isLoading, data, handleShowNotif, onItemDelete}) {
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getTotal()
  })
  
  const getTotal = () => {
    let t = 0
    const itemProducts = document.querySelectorAll('.billing-container .product-list .item-product .sub-total')
    itemProducts.forEach(e => {
      t += parseInt(e.textContent)
    });
    setTotal(t)
  }

  const getCustomers = (query = '') => {
    handleShowCustomers()

    axios.get(util.server_url+'customers'+query)
    .then(res => {
      res.data.result.results !== null ? setCustomers([{
        id_owner: 0,
        id_outlet: 0,
        id_customer: 0,
        customer_name: 'Umum',
        city: '',
        address: '',
        telp: ''
        }, ...res.data.result.results]) : setCustomers([
          {
            id_owner: 0,
            id_outlet: 0,
            id_customer: 0,
            customer_name: 'Umum',
            city: '',
            address: '',
            telp: ''
          }
        ])
    })
    .catch(err => console.log(err))
  }

  // modal customers
  const [customers, setCustomers] = useState(null)

  const handleClickCustomers = () => {
    getCustomers('?id_owner='+p.state.id_owner)
  }

  const [showCustomers, setShowCustomers] = useState(false)
  const [timerLiveSearch, setTimerLiveSearch] = useState(null)

  const handleShowCustomers = () => {
    setShowCustomers(true)

    // reset value
    setNewCustomer(false)
  }
  const handleCloseCustomers = () => setShowCustomers(false)
  const liveSearchCustomers = e => {
    window.clearTimeout(timerLiveSearch)
    setTimerLiveSearch(setTimeout(() => {
      getCustomers('?q='+e.target.value.trim()+'&id_owner='+p.state.id_owner)
    }, 400))
  }
  const handleSelectedCustomer = name => {
    setForm({...form, customer_name: name})
    document.querySelector('.modal').querySelector('button[type="reset"]').click()
  }

  const [newCustomer, setNewCustomer] = useState(false)
  const [inputCustomer, setInputCustomer] = useState('')

  const handleSubmitCustomer = () => {
    if (inputCustomer === '') {
      handleShowNotif('warning', 'Input tidak boleh kosong')
    } else if (inputCustomer.toLowerCase() === 'umum') {
      handleShowNotif('warning', 'Pelanggan umum sudah tersedia')
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('id_outlet', p.state.id_outlet)
      data.append('customer_name', inputCustomer.trim())
      data.append('city', '')
      data.append('address', '')
      data.append('telp', '')

      axios.post(util.server_url+'customers/create', data)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          setNewCustomer(false)
          getCustomers('?id_owner='+p.state.id_owner)
        } else {
          handleShowNotif('warning', res.data.result.message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  // form
  const [form, setForm] = useState({
    customer_name: 'Umum',
    method: 0,
    paid_off: 0
  })

  const handlePay = e => {
    if (e.target.value[0]) {
      if (parseInt(e.target.value[0]) === 0) {
        e.target.value = ''
      } else {
        setForm({...form, paid_off: e.target.value === '' ? 0 : parseInt(e.target.value)})
      }
    } else {
      setForm({...form, paid_off: e.target.value === '' ? 0 : parseInt(e.target.value)})
    }
  }

  const [isProsess, setIsProsess] = useState(false)
  const handleSubmit = () => {
    const itemProducts = document.querySelectorAll('.billing-container .product-list .item-product')

    if (itemProducts.length === 0) {
      handleShowNotif('warning', 'Tagihan kosong')
    } else {
      if (parseInt(form.paid_off) === 0 || form.paid_off === '') {
        handleShowNotif('warning', 'Masukan uang bayar terlebih dahulu')
        document.querySelector('.billing-container .result-container input').focus()
      } else {
        const data = new FormData()
        data.append('id_owner', p.state.id_owner)
        data.append('id_outlet', p.state.id_outlet)
        data.append('owner_code', p.state.owner_code)
        data.append('method', form.method)
        data.append('grand_total', total)
        data.append('paid_off', form.paid_off)
        data.append('customer_name', form.customer_name)
        
        for (const i of itemProducts) {
          // console.log(i.querySelector('input').value);
          data.append('is_variant[]', i.dataset.isVariant)
          data.append('id_product[]', i.dataset.id)
          data.append('product_name[]', i.querySelector('.name').textContent)
          data.append('selling_price[]', i.dataset.sellingPrice)
          data.append('capital_price[]', i.dataset.capitalPrice)
          data.append('quantity[]', i.querySelector('input').value)
        }

        setIsProsess(true)
        axios.post(util.server_url+'transactions/create', data)
        .then(res => {
          setIsProsess(false)
          // handleShowNotif('success', res.data.result.message)
          setDataSuccess(res.data.result.details);
          setTimeout(() => {
            handleShowSuccess()
          }, 100);
        })
        .catch(err => {
          console.log(err)
          setIsProsess(false)
        })
      }
    }
  }

  // modal success transaction
  const [showSuccess, setShowSuccess] = useState(false)
  const [dataSuccess, setDataSuccess] = useState(null)

  const handleShowSuccess = () => setShowSuccess(true)
  const handleCloseSuccess = () => {
    setShowSuccess(false)
    window.location.reload()
  }

  const handleBgBill = () => {
    const billingContainer = document.querySelector('.billing-container')
    
    billingContainer.classList.remove('active')
  }


  
  return(
    <>
      <div className="billing-container">
        <div className="wrapper-head-bill">
          <span className="title">Tagihan</span>
          <button className="fas fa-times" onClick={handleBgBill}></button>
        </div>
        <div className="product-list">
          {isLoading ? (
            <>
              <ItemProduct loading />
              <ItemProduct loading />
            </>
          ) : data === null ? <img src={EmptyCart} alt="" /> : (
            data.result.map((d, i) => <ItemProduct
                                        key={d.id_product}
                                        id={d.id_product}
                                        isVariant={d.is_variant}
                                        name={d.product_name}
                                        qty={d.quantity}
                                        qtyMax={d.detail.stock_quantity}
                                        availableStock={d.detail.available_stock}
                                        price={d.selling_price}
                                        capitalPrice={d.capital_price}
                                        reloadTotal={getTotal}
                                        onClick={() => onItemDelete(d.id_owner, d.id_outlet, d.id_product, d.is_variant)} />)
          )}
          
          
        </div>
        <div className="result-container">
          <SimpleGroup title="Total">
            <span className="value">{util.formatRupiah(total)}</span>
          </SimpleGroup>
          <SimpleGroup title="Pembeli">
            <button onClick={handleClickCustomers}>
              <span>{form.customer_name}</span>
              <i className="fas fa-caret-down"></i>
            </button>
          </SimpleGroup>
          <div className="payment-method">
            <span>Cara Bayar</span>
            <div className="methods">
              <div className="card-method active">
                <i className="fas fa-money-bill-wave"></i>
                <span>Cash</span>
              </div>
              <div className="card-method">
                <i className="fas fa-qrcode"></i>
                <span>E-Wallet</span>
              </div>
            </div>
          </div>
          <SimpleGroup title="Bayar">
            <input type="text" placeholder="Masukan Uang Bayar" onKeyPress={util.numericOnly} onChange={handlePay} />
          </SimpleGroup>
          <SimpleGroup title="Kembali">
            <span className={`value ${total !== 0 ? parseInt(form.paid_off) < parseInt(total) ? 'hutang' : 'lunas' : ''}`}>{util.formatRupiah(parseInt(form.paid_off) - parseInt(total))}</span>
          </SimpleGroup>
          <button className={`btn-print${isProsess ? ' disable' : ''}`} onClick={handleSubmit}>{isProsess ? 'Proses' : 'Bayar'}</button>
        </div>
      </div>
      <div className="tmp-bg-bill" onClick={handleBgBill}></div>

      {/* modal customers */}
      <Modal title="Pelanggan" show={showCustomers} onHide={handleCloseCustomers} onSubmit={e => e.preventDefault()}>
        <Modal.Body>
          <Modal.Body.Act name="Tambah" icon="fas fa-plus" add={true} onClick={() => setNewCustomer(true)}>
            <div className="search-box">  
              <input type="text" placeholder="Cari" onChange={liveSearchCustomers} />
              <button className="fas fa-search"></button>
            </div>
          </Modal.Body.Act>
          {newCustomer && 
          <Modal.Body.Act name="Simpan" icon="fas fa-save" add={true} onClick={handleSubmitCustomer}>
              <FormGroup onChange={e => setInputCustomer(e.target.value.trim())} />
          </Modal.Body.Act>
          }
          <Modal.Body.SelectOption title="Pelanggan">
            {customers && customers.map((d, i) => <Modal.Body.SelectOption.Item 
                                        key={d.id_customer}
                                        name={d.customer_name}
                                        onClick={() => handleSelectedCustomer(d.customer_name)} />)}
          </Modal.Body.SelectOption>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>

      {/* modal success transcaction */}
      <Modal.Center show={showSuccess} onHide={handleCloseSuccess}>
        <img src="assets/images/success.svg" alt="" />
        <Modal.Center.Success 
          date={dataSuccess && dataSuccess.date}
          time={dataSuccess && dataSuccess.time}
          payment={dataSuccess && dataSuccess.payment}
          total={dataSuccess && dataSuccess.grand_total}
          paidOff={dataSuccess && dataSuccess.paid_off} />
        <Modal.Center.Footer>
          <button>Tutup</button>
          <button onClick={() => window.open(util.server_url+'printon?inv='+dataSuccess.invoice+'&id_transaction='+dataSuccess.id_transaction+('&name='+(parseInt(p.state.level) === 0 ? p.state.business_name : p.state.display_name)))}>Cetak Struk</button>
        </Modal.Center.Footer>
      </Modal.Center>
    </>
  )
}