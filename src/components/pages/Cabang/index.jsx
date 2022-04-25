import axios from "axios";
import { useEffect, useState } from "react";
import { FormGroup, Loading, ManagementLayout, Modal, NoData, Notification } from "../..";
import { GlobalConsumer } from "../../../context";
import util from "../../../util";

function Cabang(p) {
  const [data, setData] = useState(null)
  const [dataCategories, setDataCategories] = useState(null)
  const [titlePage, setTitlePage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
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
    getData(p.location.search === ''? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
  }, [p.location.search])

  const getData = query => {
    setIsLoading(true)
    axios.get(util.server_url+'outlets'+query)
    .then(res => {
      res.data.result.results !== null ? setData(res.data) : setData(null)
      setTitlePage(res.data.result.key_search)
      setIsLoading(false)
    })
    .catch(err => console.log(err))

    axios.get(util.server_url+'categories?id_owner='+p.state.id_owner)
    .then(res => {
      res.data.result.results !== null ? setDataCategories(res.data.result.results) : setDataCategories(null)
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
      p.history.push(`outlet${e.target[0].value === '' ? '' : `?q=${e.target[0].value}`}`)
      // getData(`?q=${e.target[0].value}`)
      e.target[0].value = ''
    }
  }

  const [form, setForm] = useState({
    owner_code: p.state.code_owner,
    pin: '',
    outlet_name: '',
    id_category: 0,
    city: '',
    address: '',
    telp: '',
    products_ro: 1,
    units_ro: 1,
    categories_ro: 1,
    customers_ro: 1,
    suppliers_ro: 1,
    outlets_ro: 1,
    transactions_ro: 1,
    purchases_ro: 1
  })
  const [isWarningPin, setIsWarningPin] = useState(false)
  const [isWarningName, setIsWarningName] = useState(false)
  const [isProsess, setIsProsess] = useState(false)

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

  // modal add outlet
  const [show, setShow] = useState(false)

  const handleShow = () => {
    setShow(true)

    // reset value
    setIsWarningPin(false)
    setIsWarningName(false)
    setForm({
      owner_code: p.state.owner_code,
      pin: '',
      outlet_name: '',
      id_category: 0,
      city: '',
      address: '',
      telp: '',
      products_ro: 1,
      units_ro: 1,
      categories_ro: 1,
      customers_ro: 1,
      suppliers_ro: 1,
      outlets_ro: 1,
      transactions_ro: 1,
      purchases_ro: 1
    })
  }
  const handleClose = () => setShow(false)
  const handleSubmit = e => {
    e.preventDefault()

    if (form.pin === '') {
      setIsWarningPin(true)
    } else if (form.pin.length < 4) {
      handleShowNotif('warning', 'Pin minimal 4 digit')
    } else if (form.outlet_name === ''){
      setIsWarningName(true)
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('owner_code', form.owner_code) 
      data.append('pin', form.pin.trim()) 
      data.append('outlet_name', form.outlet_name.trim()) 
      data.append('id_category', form.id_category)
      data.append('city', form.city.trim()) 
      data.append('address', form.address.trim()) 
      data.append('telp', form.telp.trim()) 
      data.append('products_ro', form.products_ro) 
      data.append('units_ro', form.units_ro) 
      data.append('categories_ro', form.categories_ro) 
      data.append('customers_ro', form.customers_ro) 
      data.append('suppliers_ro', form.suppliers_ro) 
      data.append('outlets_ro', form.outlets_ro) 
      data.append('transactions_ro', form.transactions_ro) 
      data.append('purchases_ro', form.purchases_ro) 

      setIsProsess(true)
      axios.post(util.server_url+'outlets/create', data)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getData('?id_owner='+p.state.id_owner)
          document.querySelector('.modal').querySelector('button[type="reset"]').click()
        } else {
          handleShowNotif('warning', res.data.result.message)
        }

        setIsProsess(false)
      }).catch(err => {
        console.log(err)
        setIsProsess(false)
      })
    }
  }

    // modal detail outlet
    const [showDetail, setShowDetail] = useState(false)
    const [indexDetail, setIndexDetail] = useState(0)

    const handleShowDetail = index => {
      setShowDetail(true)
      setIndexDetail(index)
    }
    const handleCloseDetail = () => setShowDetail(false)
  
    // modal edit outlet
    const [showEdit, setShowEdit] = useState(false)
    const [idEdit, setIdEdit] = useState(0)
  
    const handleShowEdit = (index, id) => {
      setShowEdit(true)
      setIsWarningPin(false)
      setIsWarningName(false)
      setIndexDetail(index)
      setIdEdit(id)
      setForm({
        owner_code: data.result.results[index].owner_code,
        pin: data.result.results[index].pin,
        outlet_name: data.result.results[index].outlet_name,
        id_category: data.result.results[index].id_category.id_category,
        city: data.result.results[index].city,
        address: data.result.results[index].address,
        telp: data.result.results[index].telp,
        products_ro: data.result.results[index].products_ro,
        units_ro: data.result.results[index].units_ro,
        categories_ro: data.result.results[index].categories_ro,
        customers_ro: data.result.results[index].customers_ro,
        suppliers_ro: data.result.results[index].suppliers_ro,
        outlets_ro: data.result.results[index].outlets_ro,
        transactions_ro: data.result.results[index].transactions_ro,
        purchases_ro: data.result.results[index].purchases_ro
      })
    }
    const handleCloseEdit = () => setShowEdit(false)
    const handleSubmitEdit = e => {
      e.preventDefault()

      if (form.pin === '') {
        setIsWarningPin(true)
      } else if (form.pin.length < 4) {
        handleShowNotif('warning', 'Pin minimal 4 digit')
      } else if (form.outlet_name === ''){
        setIsWarningName(true)
      } else {
        const data = new FormData()
        data.append('id_owner', p.state.id_owner)
        data.append('owner_code', form.owner_code) 
        data.append('pin', form.pin.trim()) 
        data.append('outlet_name', form.outlet_name.trim()) 
        data.append('id_category', form.id_category)
        data.append('city', form.city.trim()) 
        data.append('address', form.address.trim()) 
        data.append('telp', form.telp.trim()) 
        data.append('products_ro', form.products_ro ? 1 : 0) 
        data.append('units_ro', form.units_ro ? 1 : 0) 
        data.append('categories_ro', form.categories_ro ? 1 : 0) 
        data.append('customers_ro', form.customers_ro ? 1 : 0) 
        data.append('suppliers_ro', form.suppliers_ro ? 1 : 0) 
        data.append('outlets_ro', form.outlets_ro ? 1 : 0) 
        data.append('transactions_ro', form.transactions_ro ? 1 : 0) 
        data.append('purchases_ro', form.purchases_ro ? 1 : 0) 
  
        setIsProsess(true)
        axios.put(util.server_url+'outlets/edit/'+idEdit, new URLSearchParams(data))
        .then(res => {
          if (res.data.response_code === 200) {
            handleShowNotif('success', res.data.result.message)
            getData('?id_owner='+p.state.id_owner)
            document.querySelector('.modal').querySelector('button[type="reset"]').click()
          } else {
            handleShowNotif('warning', res.data.result.message)
          }
  
          setIsProsess(false)
        }).catch(err => {
          console.log(err)
          setIsProsess(false)
        })
      }
    }
  
    // modal delete outlet
    const [showDelete, setShowDelete] = useState(false)
    const [idDelete, setIdDelete] = useState(0)
    const [nameDelete, setNameDelete] = useState('')
  
    const handleShowDelete = (id, name) => {
      setShowDelete(true)
      setIdDelete(id)
      setNameDelete(name)
    }
    const handleCloseDelete = () => setShowDelete(false)
    const handleDelete = () => {
      setIsProsess(true)
      axios.delete(util.server_url+'outlets/delete/'+idDelete+'?id_owner='+p.state.id_owner)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
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
        title="Outlet" 
        titlePage={`Daftar ${titlePage === 'Semua' ? 'Outlet' : `Pencarian Untuk "${titlePage}"`}`}
        placeholder="outlet"
        onSubmit={submitSearch}
        pageUrl="outlet?"
        pageOption={data}
        onShowModal={handleShow}
        readOnly={p.state.outlets_ro}>
        {isLoading ? <Loading /> : data === null ? <NoData title="Outlet" /> : (
          <ManagementLayout.SixFieldsTable>
            {data.result.results.map((d, i) => <ManagementLayout.SixFieldsTable.Item 
                                                key={d.id_outlet}
                                                no={i + 1}
                                                name={d.outlet_name}
                                                city={d.city}
                                                address={d.address}
                                                telp={d.telp}
                                                readOnly={p.state.outlets_ro}
                                                onShowDetail={() => handleShowDetail(i)}
                                                onShowEdit={() => handleShowEdit(i, d.id_outlet)}
                                                onShowDelete={() => handleShowDelete(d.id_outlet, d.outlet_name)}
                                                disable={d.loginable ? false : true} />)}
          </ManagementLayout.SixFieldsTable>
        )}
      </ManagementLayout>

      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />
      
      {/* modal add outlet */}
      <Modal title="Tambah Outlet" show={show} onHide={handleClose} onSubmit={handleSubmit}>
        <Modal.Body>
          <Modal.Body.DataGroup>
              <FormGroup
                title="Kode Pemilik"
                name="owner_code"
                defaultValue={form.owner_code}
                disable={true} />
              <FormGroup
                title="Pin"
                name="pin"
                warning={isWarningPin}
                onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
          </Modal.Body.DataGroup>
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Nama"
              name="outlet_name"
              warning={isWarningName}
              onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
            <FormGroup.WithoutWarning 
              title="Telp"
              name="telp"
              onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
          </Modal.Body.DataGroup>
          <FormGroup.DropDown 
            list={dataCategories}
            onChange={e => setForm({...form, id_category: parseInt(e.target.value)})} />
          <FormGroup.WithoutWarning 
            title="Kota"
            name="city"
            onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
          <FormGroup.TextArea 
            title="Alamat"
            name="address"
            onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
          <Modal.Body.Privilege>
            <Modal.Body.Privilege.Group>
              <Modal.Body.Privilege.Group.Item 
                title="Produk"
                name="products_ro"
                checked={form.products_ro}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
              <Modal.Body.Privilege.Group.Item 
                title="Supplier"
                name="suppliers_ro"
                checked={form.suppliers_ro}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
            </Modal.Body.Privilege.Group>
            <Modal.Body.Privilege.Group>
              <Modal.Body.Privilege.Group.Item 
                title="Satuan"
                name="units_ro"
                checked={form.units_ro}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
              <Modal.Body.Privilege.Group.Item 
                title="Outlet"
                name="outlets_ro"
                checked={form.outlets_ro}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
            </Modal.Body.Privilege.Group>
            <Modal.Body.Privilege.Group>
              <Modal.Body.Privilege.Group.Item 
                title="Kategori"
                name="categories_ro"
                checked={form.categories_ro}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
              <Modal.Body.Privilege.Group.Item 
                title="Riwayat Transaksi"
                name="transactions_ro"
                checked={form.transactions_ro}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
            </Modal.Body.Privilege.Group>
            <Modal.Body.Privilege.Group>
              <Modal.Body.Privilege.Group.Item 
                title="Pelanggan"
                name="customers_ro"
                checked={form.customers_ro}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
              <Modal.Body.Privilege.Group.Item 
                title="Akun"
                name="purchases_ro"
                checked={form.purchases_ro}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
            </Modal.Body.Privilege.Group>
          </Modal.Body.Privilege>
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit" className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Simpan'}</button>
        </Modal.Footer>
      </Modal>
      
      {/* modal detail outlet */}
      <Modal title="Detail Outlet" show={showDetail} onHide={handleCloseDetail}>
        <Modal.Body>
          <Modal.Body.SimpleData
            name="Kode Pemilik"
            value={data && data.result.results[indexDetail].owner_code} />
          <Modal.Body.SimpleData
            name="Pin"
            value={data && data.result.results[indexDetail].pin} />
          <Modal.Body.SimpleData
            name="Kategori"
            value={data && data.result.results[indexDetail].id_category.category_name} />
          <Modal.Body.SimpleData
            name="Nama"
            value={data && data.result.results[indexDetail].outlet_name} />
          <Modal.Body.SimpleData
            name="Kota"
            value={data && data.result.results[indexDetail].city} />
          <Modal.Body.SimpleDataWithArea
            name="Alamat"
            value={data && data.result.results[indexDetail].address} />
          <Modal.Body.SimpleData
            name="Telp"
            value={data && data.result.results[indexDetail].telp} />
          <Modal.Body.SimpleData
            name="Produk"
            value={data && data.result.results[indexDetail].products_ro ? 'Readonly' : 'Tambah, Edit, Hapus'} />
          <Modal.Body.SimpleData
            name="Satuan"
            value={data && data.result.results[indexDetail].units_ro ? 'Readonly' : 'Tambah, Edit, Hapus'} />
          <Modal.Body.SimpleData
            name="Kategori"
            value={data && data.result.results[indexDetail].categories_ro ? 'Readonly' : 'Tambah, Edit, Hapus'} />
          <Modal.Body.SimpleData
            name="Pelanggan"
            value={data && data.result.results[indexDetail].customers_ro ? 'Readonly' : 'Tambah, Edit, Hapus'} />
          <Modal.Body.SimpleData
            name="Supplier"
            value={data && data.result.results[indexDetail].suppliers_ro ? 'Readonly' : 'Tambah, Edit, Hapus'} />
          <Modal.Body.SimpleData
            name="Outlet"
            value={data && data.result.results[indexDetail].outlets_ro ? 'Readonly' : 'Tambah, Edit, Hapus'} />
          <Modal.Body.SimpleData
            name="Riwayat Transaksi"
            value={data && data.result.results[indexDetail].transactions_ro ? 'Readonly' : 'Tambah, Edit, Hapus'} />
          <Modal.Body.SimpleData
            name="Akun"
            value={data && data.result.results[indexDetail].purchases_ro ? 'Readonly' : 'Tambah, Edit, Hapus'} />
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>

      {/* modal edit outlet */}
      <Modal title="Edit Outlet" show={showEdit} onHide={handleCloseEdit} onSubmit={handleSubmitEdit}>
      <Modal.Body>
          <Modal.Body.DataGroup>
              <FormGroup
                title="Kode Pemilik"
                name="owner_code"
                defaultValue={form.owner_code}
                disable={true} />
              <FormGroup
                title="Pin"
                name="pin"
                defaultValue={form.pin}
                warning={isWarningPin}
                onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
          </Modal.Body.DataGroup>
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Nama"
              name="outlet_name"
              defaultValue={form.outlet_name}
              warning={isWarningName}
              onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
            <FormGroup.WithoutWarning 
              title="Telp"
              name="telp"
              defaultValue={form.telp}
              onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
          </Modal.Body.DataGroup>
          <FormGroup.DropDown 
            list={dataCategories}
            defaultValue={form.id_category}
            onChange={e => setForm({...form, id_category: parseInt(e.target.value)})} />
          <FormGroup.WithoutWarning 
            title="Kota"
            name="city"
            defaultValue={form.city}
            onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
          <FormGroup.TextArea.HasValue 
            title="Alamat"
            name="address"
            value={form.address}
            onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
          <Modal.Body.Privilege>
            <Modal.Body.Privilege.Group>
              <Modal.Body.Privilege.Group.Item 
                title="Produk"
                name="products_ro"
                checked={form.products_ro ? 1 : 0}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
              <Modal.Body.Privilege.Group.Item 
                title="Supplier"
                name="suppliers_ro"
                checked={form.suppliers_ro ? 1 : 0}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
            </Modal.Body.Privilege.Group>
            <Modal.Body.Privilege.Group>
              <Modal.Body.Privilege.Group.Item 
                title="Satuan"
                name="units_ro"
                checked={form.units_ro ? 1 : 0}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
              <Modal.Body.Privilege.Group.Item 
                title="Outlet"
                name="outlets_ro"
                checked={form.outlets_ro ? 1 : 0}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
            </Modal.Body.Privilege.Group>
            <Modal.Body.Privilege.Group>
              <Modal.Body.Privilege.Group.Item 
                title="Kategori"
                name="categories_ro"
                checked={form.categories_ro ? 1 : 0}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
              <Modal.Body.Privilege.Group.Item 
                title="Riwayat Transaksi"
                name="transactions_ro"
                checked={form.transactions_ro ? 1 : 0}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
            </Modal.Body.Privilege.Group>
            <Modal.Body.Privilege.Group>
              <Modal.Body.Privilege.Group.Item 
                title="Pelanggan"
                name="customers_ro"
                checked={form.customers_ro ? 1 : 0}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
              <Modal.Body.Privilege.Group.Item 
                title="Akun"
                name="purchases_ro"
                checked={form.purchases_ro ? 1 : 0}
                onChange={e => setForm({...form, [e.target.name]: parseInt(e.target.value)})} />
            </Modal.Body.Privilege.Group>
          </Modal.Body.Privilege>
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit" className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Simpan'}</button>
        </Modal.Footer>
      </Modal>

      {/* modal delete outlet */}
      <Modal.Center show={showDelete} onHide={handleCloseDelete}>
        <Modal.Center.TitleDelete title={nameDelete} />
        <Modal.Center.Footer>
          <button type="button">Batal</button>
          <button onClick={handleDelete} className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Iya'}</button>
        </Modal.Center.Footer>
      </Modal.Center>
    </>
  )
}

export default GlobalConsumer(Cabang)