import axios from "axios";
import { useEffect, useState } from "react";
import { FormGroup, Loading, ManagementLayout, Modal, NoData, Notification } from "../..";
import { GlobalConsumer } from "../../../context";
import util from "../../../util";

function Supplier(p) {
  const [data, setData] = useState(null)
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
  const [titlePage, setTitlePage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProsess, setIsProsess] = useState(false)

  useEffect(() => {
    getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
    
  }, [p.location.search])

  const getData = query => {
    setIsLoading(true)
    axios.get(util.server_url+'suppliers'+query)
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
    p.history.push(`supplier${e.target[0].value === '' ? '' : `?q=${e.target[0].value}`}`)
    // getData(`?q=${e.target[0].value}`)
    e.target[0].value = ''
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

  const [isWarningName, setIsWarningName] = useState(false)
  const [form, setForm] = useState({
    supplier_name: '',
    city: '',
    address: '',
    telp: ''
  })

  // modal add supplier
  const [show, setShow] = useState(false)

  const handleShow = () => {
    setShow(true)

    // reset value
    setIsWarningName(false)
    setForm({
      supplier_name: '',
      city: '',
      address: '',
      telp: ''
    })
  }
  const handleClose = () => setShow(false)
  const handleSubmit = e => {
    e.preventDefault()
    
    if (form.supplier_name === '') {
      setIsWarningName(true)
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('id_outlet', p.state.id_outlet)
      data.append('supplier_name', form.supplier_name.trim())
      data.append('city', form.city.trim())
      data.append('address', form.address.trim())
      data.append('telp', form.telp)

      setIsProsess(true)
      axios.post(util.server_url+'suppliers/create', data)
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

    // modal detail supplier
    const [showDetail, setShowDetail] = useState(false)
    const [indexDetail, setIndexDetail] = useState(0)

    const handleShowDetail = index => {
      setShowDetail(true)
      setIndexDetail(index)
    }
    const handleCloseDetail = () => setShowDetail(false)
  
    // modal edit supplier
    const [showEdit, setShowEdit] = useState(false)
    const [idEdit, setIdEdit] = useState(0)
  
    const handleShowEdit = (index, id) => {
      setShowEdit(true)
      setIsWarningName(false)
      setIdEdit(id)
      setForm({
        supplier_name: data.result.results[index].supplier_name,
        city: data.result.results[index].city,
        address: data.result.results[index].address,
        telp: data.result.results[index].telp
      })
    }
    const handleCloseEdit = () => setShowEdit(false)
    const handleSubmitEdit = e => {
      e.preventDefault()
      if (form.supplier_name === '') {
        setIsWarningName(true)
      } else {
        const data = new FormData()
        data.append('id_owner', p.state.id_owner)
        data.append('supplier_name', form.supplier_name.trim())
        data.append('city', form.city.trim())
        data.append('address', form.address.trim())
        data.append('telp', form.telp)
  
        setIsProsess(true)
        axios.put(util.server_url+'suppliers/edit/'+idEdit, new URLSearchParams(data))
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
  
    // modal delete supplier
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
      axios.delete(util.server_url+'suppliers/delete/'+idDelete+'?id_owner='+p.state.id_owner)
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
        title="Supplier"
        titlePage={`Daftar ${titlePage === 'Semua' ? 'Supplier' : `Pencarian Untuk "${titlePage}"`}`}
        placeholder="supplier"
        onSubmit={submitSearch}
        pageUrl="supplier?"
        pageOption={data} 
        onShowModal={handleShow}
        readOnly={p.state.suppliers_ro}>
        {isLoading ? <Loading /> : data === null ? <NoData title="Supplier" /> : (
          <ManagementLayout.SixFieldsTable>
            {data.result.results.map((d, i) => <ManagementLayout.SixFieldsTable.Item 
                                                key={d.id_supplier}
                                                no={i + 1}
                                                name={d.supplier_name}
                                                city={d.city}
                                                address={d.address}
                                                telp={d.telp}
                                                readOnly={p.state.suppliers_ro}
                                                onShowDetail={() => handleShowDetail(i)}
                                                onShowEdit={() => handleShowEdit(i, d.id_supplier)}
                                                onShowDelete={() => handleShowDelete(d.id_supplier, d.supplier_name)} />)}
          </ManagementLayout.SixFieldsTable>
        )}
      </ManagementLayout>

      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />
      
      {/* modal add suppliers */}
      <Modal title="Tambah Supplier" show={show} onHide={handleClose} onSubmit={handleSubmit}>
        <Modal.Body>
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Nama"
              name="supplier_name"
              warning={isWarningName}
              onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
            <FormGroup.WithoutWarning 
              title="Telp"
              name="telp"
              onChange={e => setForm({...form, [e.target.name]: e.target.value})}/>
          </Modal.Body.DataGroup>
          <FormGroup.WithoutWarning 
            title="kota"
            name="city"
            onChange={e => setForm({...form, [e.target.name]: e.target.value})}/>
          <FormGroup.TextArea 
            title="Alamat"
            name="address"
            onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit" className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Simpan'}</button>
        </Modal.Footer>
      </Modal>

      {/* modal detail supplier */}
      <Modal title="Detail Supplier" show={showDetail} onHide={handleCloseDetail}>
        <Modal.Body>
          <Modal.Body.SimpleData
            name="Nama"
            value={data && data.result.results[indexDetail].supplier_name} />
          <Modal.Body.SimpleData
            name="Kota"
            value={data && data.result.results[indexDetail].city} />
          <Modal.Body.SimpleDataWithArea
            name="Alamat"
            value={data && data.result.results[indexDetail].address} />
          <Modal.Body.SimpleData
            name="Telp"
            value={data && data.result.results[indexDetail].telp} />
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>

      {/* modal edit supplier */}
      <Modal title="Edit Supplier" show={showEdit} onHide={handleCloseEdit} onSubmit={handleSubmitEdit}>
        <Modal.Body>
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Nama"
              name="supplier_name"
              warning={isWarningName}
              defaultValue={form.supplier_name}
              onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
            <FormGroup.WithoutWarning 
              title="Telp"
              name="telp"
              defaultValue={form.telp}
              onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
          </Modal.Body.DataGroup>
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
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit" className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Simpan'}</button>
        </Modal.Footer>
      </Modal>

      {/* modal delete supplier */}
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

export default GlobalConsumer(Supplier)