import axios from "axios";
import { useEffect, useState } from "react";
import { FormGroup, Loading, ManagementLayout, Modal, NoData, Notification } from "../..";
import { GlobalConsumer } from "../../../context"
import util from "../../../util";

function Pelanggan(p) {
  const [data, setData] = useState(null)
  const [titlePage, setTitlePage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProsess, setIsProsess] = useState(false)

  useEffect(() => {
    getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
  }, [p.location.search])

  const getData = query => {
    setIsLoading(true)
    axios.get(util.server_url+'customers'+query)
    .then(res => {
      res.data.result.results !== null ? setData(res.data) : setData(null)
      setTitlePage(res.data.result.key_search)
      setIsLoading(false)
    })
    .catch(err => console.log(err))
  }

  const submitSearch = e => {
    e.preventDefault()
    if (!(e.target[0].value.toLowerCase() === 'umum')) {
      p.history.push(`pelanggan${e.target[0].value === '' ? '' : `?q=${e.target[0].value}`}`)
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

  const [isWarningName, setIsWarningName] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    city: '',
    address: '',
    telp: ''
  })

  // modal add customer
  const [show, setShow] = useState(false)

  const handleShow = () => {
    setShow(true)

    setIsWarningName(false)
    setForm({
      customer_name: '',
      city: '',
      address: '',
      telp: ''
    })
  }
  const handleClose = () => setShow(false)
  const handleSubmit = e => {
    e.preventDefault()

    if (form.customer_name === '') {
      setIsWarningName(true)
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('id_outlet', p.state.id_outlet)
      data.append('customer_name', form.customer_name.trim())
      data.append('city', form.city.trim())
      data.append('address', form.address.trim())
      data.append('telp', form.telp)

      setIsProsess(true)
      axios.post(util.server_url+'customers/create', data)
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

  // modal detail customer
  const [showDetail, setShowDetail] = useState(false)
  const [indexDetail, setIndexDetail] = useState(0)

  const handleShowDetail = index => {
    setShowDetail(true)
    setIndexDetail(index)
  }
  const handleCloseDetail = () => setShowDetail(false)

  // modal edit customer
  const [showEdit, setShowEdit] = useState(false)
  const [idEdit, setIdEdit] = useState(0)

  const handleShowEdit = (index, id) => {
    setShowEdit(true)
    setIsWarningName(false)
    setIdEdit(id)
    setForm({
      customer_name: data.result.results[index].customer_name,
      city: data.result.results[index].city,
      address: data.result.results[index].address,
      telp: data.result.results[index].telp
    })
  }
  const handleCloseEdit = () => setShowEdit(false)
  const handleSubmitEdit = e => {
    e.preventDefault()

    if (form.customer_name === '') {
      setIsWarningName(true)
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('customer_name', form.customer_name.trim())
      data.append('city', form.city.trim())
      data.append('address', form.address.trim())
      data.append('telp', form.telp)
  
      setIsProsess(true)
      axios.put(util.server_url+'customers/edit/'+idEdit, new URLSearchParams(data))
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

  // modal delete customer
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
    axios.delete(util.server_url+'customers/delete/'+idDelete+'?id_owner='+p.state.id_owner)
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
        title="Pelanggan" 
        titlePage={`Daftar ${titlePage === 'Semua' ? 'Pelanggan' : `Pencarian Untuk "${titlePage}"`}`}
        placeholder="pelanggan"
        onSubmit={submitSearch}
        pageUrl="pelanggan?"
        pageOption={data}
        onShowModal={handleShow}
        readOnly={p.state.customers_ro}>
        {isLoading ? <Loading /> : data === null ? <NoData title="Pelanggan" /> : (
          <ManagementLayout.SixFieldsTable>
            {data.result.results.map((d, i) => <ManagementLayout.SixFieldsTable.Item 
                                                key={d.id_customer}
                                                no={i + 1}
                                                name={d.customer_name}
                                                city={d.city}
                                                address={d.address}
                                                telp={d.telp}
                                                readOnly={p.state.customers_ro}
                                                onShowDetail={() => handleShowDetail(i)}
                                                onShowEdit={() => handleShowEdit(i, d.id_customer)}
                                                onShowDelete={() => handleShowDelete(d.id_customer, d.customer_name)} />)}
          </ManagementLayout.SixFieldsTable>
        )}
      </ManagementLayout>

      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />
      
      {/* modal add customers */}
      <Modal title="Tambah Pelanggan" show={show} onHide={handleClose} onSubmit={handleSubmit}>
        <Modal.Body>
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Nama"
              name="customer_name"
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

      {/* modal detail customers */}
      <Modal title="Detail Pelanggan" show={showDetail} onHide={handleCloseDetail}>
        <Modal.Body>
          <Modal.Body.SimpleData 
            name="Name"
            value={data && data.result.results[indexDetail].customer_name} />
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

      {/* modal edit customers */}
      <Modal title="Edit Supplier" show={showEdit} onHide={handleCloseEdit} onSubmit={handleSubmitEdit}>
        <Modal.Body>
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Nama"
              name="customer_name"
              warning={isWarningName}
              defaultValue={form.customer_name}
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

      {/* modal delete customers */}
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

export default GlobalConsumer(Pelanggan)