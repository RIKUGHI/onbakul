import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { FormGroup, Loading, ManagementLayout, Modal, NoData, Notification } from "../..";
import { GlobalConsumer } from "../../../context";
import util from "../../../util";

function Satuan(p) {
  const [data, setData] = useState(null)
  const [titlePage, setTitlePage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
  }, [p.location.search])

  const getData = query => {
    setIsLoading(true)
    axios.get(util.server_url+'units'+query)
    .then(res => {
      res.data.result.results !== null ? setData(res.data) : setData(null)
      setTitlePage(res.data.result.key_search)
      setIsLoading(false)
    })
    .catch(err => console.log(err))
  }

  const submitSearch = e => {
    e.preventDefault()
    p.history.push(`satuan${e.target[0].value === '' ? '' : `?q=${e.target[0].value}`}`)
    // getData(`?q=${e.target[0].value}`)
    e.target[0].value = ''
  }

  const [inputUnit, setInputUnit] = useState('')
  const [isWarningInput, setIsWarningInput] = useState(false)
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


  // modal add unit
  const [show, setShow] = useState(false)

  const handleShow = () => {
    setShow(true)

    // reset all value
    setInputUnit('')
    setIsWarningInput(false)
  }
  const handleClose = () => setShow(false)
  const handleSubmit = e => {
    e.preventDefault()

    if (inputUnit === '') {
      setIsWarningInput(true)
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('unit_name', inputUnit.trim())

      setIsProsess(true)
      axios.post(util.server_url+'units/create', data)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getData('?id_owner='+p.state.id_owner)
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

  // modal edit unit
  const [showEdit, setShowEdit] = useState(false)
  const [idEdit, setIdEdit] = useState(0)

  const handleShowEdit = (id, name) => {
    setShowEdit(true)
    setIdEdit(id)

    // reset value
    setInputUnit(name)
    setIsWarningInput(false)
  }
  const handleCloseEdit = () => setShowEdit(false)
  const handleSubmitEdit = e => {
    e.preventDefault()

    if (inputUnit === '') {
      setIsWarningInput(true)
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('unit_name', inputUnit.trim())

      setIsProsess(true)
      axios.put(util.server_url+'units/edit/'+idEdit, new URLSearchParams(data), {
        headers: { 
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        console.log(res);
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

  // modal delete unit
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
    axios.delete(util.server_url+'units/delete/'+idDelete+'?id_owner='+p.state.id_owner)
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

  // if (!p.state.login) return <Redirect to={{pathname: '/'}} />

  return(
    <>
      <ManagementLayout 
        title="Satuan" 
        titlePage={`Daftar ${titlePage === 'Semua' ? 'Satuan' : `Pencarian Untuk "${titlePage}"`}`}
        placeholder="satuan"
        onSubmit={submitSearch}
        pageUrl="satuan?"
        pageOption={data}
        onShowModal={handleShow}
        readOnly={p.state.units_ro}>
        {isLoading ? <Loading /> : data === null ? <NoData title="Satuan" /> : (
          <ManagementLayout.ThreeFieldsTable readOnly={p.state.units_ro}>
            {data.result.results.map((d, i) => <ManagementLayout.ThreeFieldsTable.Item
                                                  key={d.id_unit} 
                                                  no={i + 1}
                                                  name={d.unit_name}
                                                  showButton={p.state.units_ro}
                                                  onShowEdit={() => handleShowEdit(d.id_unit, d.unit_name)}
                                                  onShowDelete={() => handleShowDelete(d.id_unit, d.unit_name)} />)}
          </ManagementLayout.ThreeFieldsTable>
        )}
        
      </ManagementLayout>

      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />
      
      {/* modal add unit */}
      <Modal title="Tambah Satuan" show={show} onHide={handleClose} onSubmit={handleSubmit}>
        <Modal.Body>
          <FormGroup 
            title="Nama"
            name="unit_name"
            warning={isWarningInput}
            onChange={e => setInputUnit(e.target.value)} />
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit" className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Simpan'}</button>
        </Modal.Footer>
      </Modal>

      {/* modal edit unit */}
      <Modal title="Edit Satuan" show={showEdit} onHide={handleCloseEdit} onSubmit={handleSubmitEdit}>
        <Modal.Body>
          <FormGroup 
            title="Nama"
            name="unit_name"
            defaultValue={inputUnit}
            warning={isWarningInput}
            onChange={e => setInputUnit(e.target.value)} />
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit" className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Simpan'}</button>
        </Modal.Footer>
      </Modal>

      {/* modal delete unit */}
      <Modal.Center show={showDelete} onHide={handleCloseDelete}>
        <Modal.Center.TitleDelete title={nameDelete} />
        <Modal.Center.Warning messages={['Data produk dengan satuan ini secara otomatis akan menghilang']} />
        <Modal.Center.Footer>
          <button type="button">Batal</button>
          <button onClick={handleDelete} className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Iya'}</button>
        </Modal.Center.Footer>
      </Modal.Center>
    </>
  )
}

export default GlobalConsumer(Satuan)