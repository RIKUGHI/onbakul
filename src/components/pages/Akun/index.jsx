import axios from 'axios'
import { useEffect, useState } from 'react'
import { FormGroup, MainLayout, Modal, Notification } from '../..'
import { GlobalConsumer } from '../../../context'
import util from '../../../util'
import './Akun.scss'

function Akun(p) {
  const [data, setData] = useState({
      id_owner: 0,
      created_at: '',
      business_name: '',
      owner_name: '',
      owner_code: '',
      telp: '',
      email: '',
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
    })
  const [dataOutlet, setDataOutlet] = useState({
    id_owner: 0,
    id_outlet: 0,
    owner_code: '',
    outlet_name: "",
    city: "",
    address: "",
    telp: "0"
  })
  const [titlePage, setTitlePage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProsess, setIsProsess] = useState(false)

  useEffect(() => {
    getData()
  }, [p.location.search])

  const getData = query => {
    setIsLoading(true)
    axios.get(util.server_url+'accounts/'+p.state.id_owner)
    .then(res => {
      res.data.result.results !== null ? setData(res.data.result) : setData(null)
      res.data.result.outlets.forEach(d => {
        if (d.id_outlet === p.state.id_outlet) {
          setDataOutlet(d)
        }
      });
      setTitlePage(res.data.result.key_search)
      setIsLoading(false)
    })
    .catch(err => console.log(err))
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

  // modal edit account
  const [form, setForm] = useState({
    owner_name: '',
    business_name: '',
    telp: '',
    email: '',
    password: ''
  })
  const [showEdit, setShowEdit] = useState(false)
  const [isWarningName, setIsWarningName] = useState(false)
  const [isWarningBussinesName, setIsWarningBussinesName] = useState(false)
  const [isWarningEmail, setIsWarningEmail] = useState(false)

  const handleShowEdit = () => {
    setShowEdit(true)

    // reset value
    setIsWarningName(false)
    setIsWarningBussinesName(false)
    setIsWarningEmail(false)
    setForm({
      owner_name: data.owner_name,
      business_name: data.business_name,
      telp: data.telp,
      email: data.email,
      password: ''
    })
  }
  const handleCloseEdit = () => setShowEdit(false)
  const handleSubmitEdit = e => {
    e.preventDefault()
    
    if (form.owner_name === '') {
      setIsWarningName(true)
    } else if (form.business_name === '') {
      setIsWarningBussinesName(true)
    } else if (form.email === '') {
      setIsWarningEmail(true)
    } else if (form.password !== '' && form.password.length < 4) {
      handleShowNotif('warning', 'Password minimal lebih dari 3 karakter')
    } else {
      const data = new FormData()
      data.append('owner_name', form.owner_name)
      data.append('business_name', form.business_name)
      data.append('telp', form.telp)
      data.append('email', form.email)
      data.append('password', form.password)

      setIsProsess(true)
      axios.put(util.server_url+'accounts/edit/'+p.state.id_owner, new URLSearchParams(data))
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getData()        
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
  
  return(
    <>
      <MainLayout title="Akun">
        <div className="account-container">
          <img src="https://source.unsplash.com/100x100/?nature" alt="" />
          <div className="info-container">
            <div className="info">
              <div className="wrp">
                <div className="data-account">
                  <label>Nama Pemilik</label>
                  <p>{data.owner_name}</p>
                </div>
                {parseInt(p.state.level) === 0 ? (
                  <div className="data-account">
                    <label>Nama Usaha</label>
                    <p>{data.business_name}</p>
                  </div>
                ) : (
                  <div className="data-account">
                    <label>Nama Cabang</label>
                    <p>{dataOutlet.outlet_name}</p>
                  </div>
                )}
                {
                  parseInt(p.state.level) === 0 && (
                    <div className="data-account">
                      <label>Total Cabang</label>
                      <p>{data.outlets.length}</p>
                    </div>
                  )
                }
              </div>
            </div>
            <div className="info">
              <div className="wrp">
                {
                  parseInt(p.state.level) === 0 ? (
                    <div className="data-account">
                      <label>Telp</label>
                      <p>{data.telp}</p>
                    </div>
                  ) : (
                    <div className="data-account">
                      <label>Telp Cabang</label>
                      <p>{dataOutlet.telp}</p>
                    </div>
                  )
                }
                {
                  parseInt(p.state.level) === 0 && (
                    <>
                      <div className="data-account">
                        <label>Email</label>
                        <p>{data.email}</p>
                      </div>
                      <div className="data-account">
                        <label>Password</label>
                        <p>************************</p>
                      </div>
                    </>
                  )
                }
              </div>
              {!p.state.purchases_ro && <button onClick={handleShowEdit}>Ubah</button>}
            </div>
          </div>
        </div>
      </MainLayout>

      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />

      {/* modal edit account */}
      <Modal title="Edit Akun" show={showEdit} onHide={handleCloseEdit} onSubmit={handleSubmitEdit}>
        <Modal.Body>
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Nama Pemilik"
              name="owner_name"
              warning={isWarningName}
              defaultValue={form.owner_name}
              onChange={e => setForm({...form, owner_name: e.target.value})} />
            <FormGroup 
              title="Nama Usaha"
              name="business_name"
              warning={isWarningBussinesName}
              defaultValue={form.business_name}
              onChange={e => setForm({...form, business_name: e.target.value})} />
          </Modal.Body.DataGroup>
          <FormGroup 
            title="Telp"
            name="telp"
            defaultValue={form.telp}
            onChange={e => setForm({...form, telp: e.target.value})} />
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Email"
              name="email"
              warning={isWarningEmail}
              defaultValue={form.email}
              onChange={e => setForm({...form, email: e.target.value})} />
            <FormGroup 
              title="Password (tidak wajib)"
              name="password"
              defaultValue={form.password}
              onChange={e => setForm({...form, password: e.target.value})} />
          </Modal.Body.DataGroup>
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit" className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Simpan'}</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default GlobalConsumer(Akun)