import axios from 'axios'
import { useEffect, useState } from 'react'
import { FormGroup, Loading, ManagementLayout, Modal, NoData, Notification } from '../..'
import { GlobalConsumer } from '../../../context'
import util from '../../../util'
import './Pembelian.scss'

function Pembelian(p) {
  const [data, setData] = useState(null)
  const [titlePage, setTitlePage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProsess, setIsProsess] = useState(false)
  const [dataAccount, setDataAccount] = useState({
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
    currentDateTime: '0000-00-00 00:00:00',
  })

  useEffect(() => {
    getData(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet : p.location.search+'&id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet)
    getDataSuppliers('')
    getDataProducts('')
  }, [p.location.search])

  const getData = query => {
    setIsLoading(true)
    axios.get(util.server_url+'purchases'+query)
    .then(res => {
      res.data.result.results !== null ? setData(res.data) : setData(null)
      setTitlePage(res.data.result.key_search)
      setIsLoading(false)
    })
    .catch(err => console.log(err))

    // account
    axios.get(util.server_url+'accounts/'+p.state.id_owner)
    .then(res => {
      setDataAccount({
        data: res.data.result,
        currentDateTime: getCurrentDateTime(res.data.result.today , new Date()) < res.data.result.end ? getCurrentDateTime(res.data.result.today , new Date()) : res.data.result.end
      })
    })
    .catch(err => console.log(err))
  }

  const getCurrentDateTime = (today, now) => {
    return `${today} ${fixingTime(now.getHours())}:${fixingTime(now.getMinutes())}:${fixingTime(now.getSeconds())}`
  }

  const fixingTime = (t) => {
    return t.toString().length === 1 ? '0'+t.toString() : t 
  }

  const submitSearch = e => {
    e.preventDefault()
    if (!(e.target[0].value.toLowerCase() === 'umum')) {
      p.history.push(`pembelian${e.target[0].value === '' ? '' : `?q=${e.target[0].value}`}`)
      // getData(`?q=${e.target[0].value}`)
      e.target[0].value = ''
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

  const [isWarningSupplier, setIsWarningSupllier] = useState(false)
  const [isWarningProduct, setIsWarningProduct] = useState(false)
  const [isWarningPrice, setIsWarningPrice] = useState(false)
  const [isWarningQuantity, setIsWarningQuantity] = useState(false)
  const [form, setForm] = useState({
    supplier: {},
    product: {},
    quantity: 0,
    price: 0,
    note: ''
  })

  // modal add purchase
  const [show, setShow] = useState(false)

  const handleShow = () => {
    setShow(true)

    // reset value
    setIsWarningSupllier(false)
    setIsWarningProduct(false)
    setIsWarningPrice(false)
    setIsWarningQuantity(false)
    setForm({
      supplier: {},
      product: {},
      quantity: 0,
      price: 0,
      note: ''
    })
  }
  const handleClose = () => {
    setShow(false)
  }
  const handleSubmit = e => {
    e.preventDefault()
    
    if (Object.keys(form.supplier).length === 0) {
      setIsWarningSupllier(true)
    } else if (Object.keys(form.product).length === 0) {
      setIsWarningProduct(true)
    } else if (parseInt(form.price) === 0 || form.price === '') {
      setIsWarningPrice(true)
    } else if (parseInt(form.quantity) === 0 || form.quantity === '') {
      setIsWarningQuantity(true)
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('id_outlet', p.state.id_outlet)
      data.append('id_product', form.product.id_product)
      data.append('product_name', form.product.product_name)
      data.append('quantity', form.quantity)
      data.append('price', form.price)
      data.append('id_supplier', form.supplier.id_supplier)
      data.append('note', form.note)

      setIsProsess(true)
      axios.post(util.server_url+'purchases/create', data)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getData(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet : p.location.search+'&id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet)
          document.querySelector('.modal').querySelector('button[type="reset"]').click()
        } else {
          handleShowNotif('warning', res.data.result.message)
        }

        setIsProsess(false)
      })
      .catch(err => {
        console.log(err)
        setIsProsess(false)
      })
    }
  }

  // modal suppliers
  const [dataSuppliers, setDataSuppliers] = useState(null)
  const [showSuppliers, setShowSuppliers] = useState(false)
  const [timerLiveSearch, setTimerLiveSearch] = useState(null)
  
  const handleShowSuppliers = () => setShowSuppliers(true)
  const handleCloseSuppliers = () => {
    setShowSuppliers(false)
    getDataSuppliers('')
  }
  const getDataSuppliers = q => {
    axios.get(util.server_url+'suppliers'+(q === '' ? '?id_owner='+p.state.id_owner :'?q='+q+'&id_owner='+p.state.id_owner))
    .then(res => {
      setDataSuppliers(res.data)
    })
    .catch(err => console.log(err))
  }
  const liveSearchSuppliers = e => {
    window.clearTimeout(timerLiveSearch)
    setTimerLiveSearch(setTimeout(() => {
      getDataSuppliers(e.target.value.trim())
    }, 400))
  }

  const handleSelectedSupplier = index => {
    setForm({...form, supplier: dataSuppliers.result.results[index]})
    document.querySelectorAll('.modal')[1].querySelector('button[type=reset]').click()
  }

    // modal products
    const [dataProducts, setDataProducts] = useState(null)
    const [showProducts, setShowProducts] = useState(false)
    const [timerLiveSearchProducts, setTimerLiveSearchProducts] = useState(null)
    
    const handleShowProducts = () => setShowProducts(true)
    const handleCloseProducts = () => {
      setShowProducts(false)
      getDataProducts('')
    }
    const getDataProducts = q => {
      axios.get(util.server_url+'products'+(q === '' ? '?id_owner='+p.state.id_owner+'&id_category='+p.state.id_category :'?q='+q+'&id_owner='+p.state.id_owner+'&id_category='+p.state.id_category))
      .then(res => {
        setDataProducts(res.data)
      })
      .catch(err => console.log(err))
    }
    const liveSearchProducts = e => {
      window.clearTimeout(timerLiveSearchProducts)
      setTimerLiveSearchProducts(setTimeout(() => {
        getDataProducts(e.target.value.trim())
      }, 400))
    }
  
    const handleSelectedProduct = index => {
      if (dataProducts.result.results[index].available_stock) {
        setForm({...form, product: dataProducts.result.results[index]})
        document.querySelectorAll('.modal')[1].querySelector('button[type=reset]').click()
      } else {
        handleShowNotif('warning', 'Produk ini tidak memiiki stok')
      }
    }

    // modal detail transaction
    const [showDetail, setShowDetail] = useState(false)
    const [indexDetail, setIndexDetail] = useState(0)

    const handleShowDetail = index => {
      setShowDetail(true)
      setIndexDetail(index)
    }
    const handleCloseDetail = () => setShowDetail(false)

  // modal delete transaction
  const [showDelete, setShowDelete] = useState(false)

  const handleShowDelete = () => setShowDelete(true)
  const handleCloseDelete = () => setShowDelete(false) 
  const handleSumbitDelete = () => {
    setIsProsess(true)
    axios.delete(util.server_url+'purchases/delete/'+data.result.results[indexDetail].id_purchase+'?id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet)
    .then(res => {
      if (res.data.response_code === 200) {
        handleShowNotif('success', res.data.result.message)
        // getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
        window.location.reload()
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

  const handleConfirm = () => {
    const form = new FormData()
    form.append('id_owner', p.state.id_owner)
    form.append('id_outlet', p.state.id_outlet)
    form.append('status', 1)

    setIsProsess(true)
    axios.put(util.server_url+'purchases/edit/'+data.result.results[indexDetail].id_purchase, new URLSearchParams(form), {
      headers: { 
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => {
      console.log(res);
      if (res.data.response_code === 200) {
        handleShowNotif('success', res.data.result.message)
        getData(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet : p.location.search+'&id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet)
        document.querySelector('.modal').querySelector('button[type="button"]').click()
      } else {
        handleShowNotif('warning', res.data.result.message)
      }
      setIsProsess(false)
    }).catch(err => {
      console.log(err)  
      setIsProsess(false)
    })
  }

  return(
    <>
      <ManagementLayout 
        locked={dataAccount.data.is_pro && dataAccount.currentDateTime < dataAccount.data.end ? false : true}
        title="Pembelian"
        titlePage={`Daftar ${titlePage === 'Semua' ? 'Pembelian' : `Pencarian Untuk "${titlePage}"`}`}
        placeholder="pembelian"
        onSubmit={submitSearch}
        pageUrl="pembelian?"
        pageOption={data}
        onShowModal={handleShow}>
        {isLoading ? <Loading /> : data === null ? <NoData title="Pembelian" /> : (
          <table border="0" className="pembelian">
            <thead>
              <tr>
                <th>Status</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {data.result.results.map((d, i) => <ItemData 
                                                  key={d.id_purchase}
                                                  status={d.status}
                                                  name={d.product_name}
                                                  qty={d.quantity}
                                                  price={d.price}
                                                  supplier={d.id_supplier && d.id_supplier.supplier_name}
                                                  onClick={() => handleShowDetail(i)} />)}
            </tbody>
          </table>
        )}
      </ManagementLayout>

      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />

      {/* modal add purchase */}
      <Modal title="Tambah Produk" show={show} onHide={handleClose} onSubmit={handleSubmit}>
        <Modal.Body>
          <FormGroup 
            title="Supplier"
            name="id_supplier"
            warning={isWarningSupplier}
            defaultValue={form.supplier.supplier_name}
            onClick={handleShowSuppliers}
            disable />
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Nama"
              name="product_name"
              warning={isWarningProduct}
              defaultValue={form.product.product_name}
              onClick={handleShowProducts}
              disable />
            <FormGroup 
              title="harga"
              name="price"
              warning={isWarningPrice}
              onChange={e => setForm({...form, price: e.target.value})} />
          </Modal.Body.DataGroup>
          <Modal.Body.DataGroup>
            <FormGroup 
              title="jumlah"
              name="quantity"
              warning={isWarningQuantity}
              onChange={e => setForm({...form, quantity: e.target.value})} />
            <FormGroup 
              title="Satuan"
              name="unit"
              defaultValue={Object.keys(form.product).length !== 0 ? form.product.id_unit.unit_name : ''}
              disable />
          </Modal.Body.DataGroup>
          <FormGroup.TextArea
            title="Catatan"
            name="note"
            onChange={e => setForm({...form, note: e.target.value})} />
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit" className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Simpan'}</button>
        </Modal.Footer>
      </Modal>

      {/* modal suppliers */}
      <Modal title="Supplier" show={showSuppliers} onHide={handleCloseSuppliers} onSubmit={e => e.preventDefault()}>
        <Modal.Body>
          <Modal.Body.Act name="Tambah" icon="fas fa-plus" add={false}>
            <div className="search-box no-add">  
              <input type="text" placeholder="Cari" onChange={liveSearchSuppliers} />
              <button className="fas fa-search"></button>
            </div>
          </Modal.Body.Act>
          <Modal.Body.SelectOption title="Supplier">
            {dataSuppliers === null ? null : (dataSuppliers.result.results === null ? 'Supplier tidak tersedia' : dataSuppliers.result.results.map((c, i) => <Modal.Body.SelectOption.Item 
                                                                                                                                                                key={c.id_supplier}
                                                                                                                                                                name={c.supplier_name}
                                                                                                                                                                onClick={() => handleSelectedSupplier(i)} />))}
          </Modal.Body.SelectOption>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>

      {/* modal products */}
      <Modal title="Produk" show={showProducts} onHide={handleCloseProducts} onSubmit={e => e.preventDefault()}>
        <Modal.Body>
          <Modal.Body.Act name="Tambah" icon="fas fa-plus" add={false}>
            <div className="search-box no-add">  
              <input type="text" placeholder="Cari" onChange={liveSearchProducts} />
              <button className="fas fa-search"></button>
            </div>
          </Modal.Body.Act>
          <Modal.Body.SelectOption title="Produk">
            {dataProducts === null ? null : (dataProducts.result.results === null ? 'Produk tidak tersedia' : dataProducts.result.results.map((c, i) => <Modal.Body.SelectOption.Item 
                                                                                                                                                                key={c.id_product}
                                                                                                                                                                name={c.product_name}
                                                                                                                                                                onClick={() => handleSelectedProduct(i)} />))}
          </Modal.Body.SelectOption>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>

      {/* modal detail transaction */}
      <Modal.Center show={showDetail} onHide={handleCloseDetail}>
        <Modal.Center.DetailTransaction name={p.state.business_name}>
          <Modal.Center.DetailTransaction.Wrap>
            <Modal.Center.DetailTransaction.Wrap.SimpleData label="Supplier" value={data && data.result.results[indexDetail].id_supplier.supplier_name} />
            <Modal.Center.DetailTransaction.Wrap.SimpleData label="Nama Barang" value={data && data.result.results[indexDetail].product_name} />
            <Modal.Center.DetailTransaction.Wrap.SimpleData label="Jumlah" value={data && data.result.results[indexDetail].quantity} />
            <Modal.Center.DetailTransaction.Wrap.SimpleData label="Harga" value={data && util.formatRupiah(data.result.results[indexDetail].price)} />
          </Modal.Center.DetailTransaction.Wrap>
        </Modal.Center.DetailTransaction>
        <Modal.Center.Footer>
          <div className="cdt-footer">
          {data && !data.result.results[indexDetail].status && <button onClick={handleConfirm} className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Konfirmasi'}</button>}
            <div className="cdt-footer-wrap">
              <button type="button">Tutup</button>
              <button onClick={handleShowDelete} className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Hapus'}</button>
            </div>
          </div>
        </Modal.Center.Footer>
      </Modal.Center>

      {/* modal delete transaction */}
      <Modal.Center show={showDelete} onHide={handleCloseDelete}>
        <Modal.Center.TitleDelete title={'Pembelian ini'} />
        <Modal.Center.Footer>
          <button type="button">Batal</button>
          <button className={isProsess ? 'disable' : ''} onClick={handleSumbitDelete}>{isProsess ? 'Proses' : 'Iya'}</button>
        </Modal.Center.Footer>
      </Modal.Center>
    </>
  )
}

const ItemData = ({status, name, qty, price, supplier, onClick}) => {  
  return(
    <tr onClick={onClick}>
      <td>
        <span className={status ? 'lunas' : 'hutang'}>{status ? 'Selesai' : 'Diproses'}</span>
      </td>
      <td>{name}</td>
      <td>{qty}</td>
      <td>{util.formatRupiah(price)}</td>
      <td>{supplier}</td>
    </tr>
  )
}

export default GlobalConsumer(Pembelian)