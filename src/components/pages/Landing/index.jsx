import axios from 'axios'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { Modal, Notification } from '../..'
import { GlobalConsumer } from '../../../context'
import util from '../../../util'
import Barcode from './barcode.svg'
import Cam from './cam.svg'
import Devices from './devices.png'
import Easy from './easy.png'
import Grafik from './grafik.png'
import './Landing.scss'
import Print from './print.svg'
import Wallet from './wallet.svg'


function Landing(p) {
  const [show, setShow] = useState(false)
  const [formLogin, setFormLogin] = useState({
    login_as: {
      owner: true,
      outlet: false
    },
    email: {
      error: true,
      value: ''
    },
    owner_code: {
      error: true,
      value: ''
    },
    password: {
      error: true,
      value: ''
    }
  })
  const [formSignUp, setFormSignUp] = useState({
    bussiness_name: {
      error: true,
      value: ''
    },
    owner_name: {
      error: true,
      value: ''
    },
    email: {
      error: true,
      value: ''
    },
    password: {
      error: true,
      value: ''
    }
  })
  const [login, setLogin] = useState(false)
  const [isProsess, setIsProsess] = useState(false)

  const handleShowSuccess = () => setShow(true)
  const handleCloseSuccess = () => setShow(false)
  const handleShow = e => {
    if (p.state.login) {
      window.location.href = '/dashboard'
    } else {
      if (e.target.textContent.toLowerCase() === 'masuk') {
        setShow(true)
        setLogin(true)
  
        // reset value
        setFormLogin({
          login_as: {
            owner: true,
            outlet: false
          },
          email: {
            error: true,
            value: ''
          },    
          owner_code: {
            error: true,
            value: ''
          },
          password: {
            error: true,
            value: ''
          }
        })
      } else {
        setShow(true)
        setLogin(false)
  
        // reset value
        setFormSignUp({
          bussiness_name: {
            error: true,
            value: ''
          },
          owner_name: {
            error: true,
            value: ''
          },
          email: {
            error: true,
            value: ''
          },
          password: {
            error: true,
            value: ''
          }
        })
      }
    }
  }

  const handleMode = () => {
    setLogin(!login)
    setFormLogin({
      login_as: {
        owner: true,
        outlet: false
      },
      email: {
        error: true,
        value: ''
      },
      owner_code: {
        error: true,
        value: ''
      },
      password: {
        error: true,
        value: ''
      }
    })
    setFormSignUp({
      bussiness_name: {
        error: true,
        value: ''
      },
      owner_name: {
        error: true,
        value: ''
      },
      email: {
        error: true,
        value: ''
      },
      password: {
        error: true,
        value: ''
      }
    })
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (login) {
      if ((formLogin.login_as.owner && (formLogin.email.error || formLogin.password.error)) || (formLogin.login_as.outlet && (formLogin.owner_code.error || formLogin.password.error))) {
        handleShowNotif('warning', 'Semua inputan tidak boleh kosong dan icon harus berwarna hijau')
      } else {
        const data = new FormData()
        data.append('level', formLogin.login_as.owner ? 0 : 1)
        data.append('email', formLogin.email.value)
        data.append('owner_code', formLogin.owner_code.value)
        data.append('password', formLogin.password.value)

        setIsProsess(true)
        axios.post(util.server_url+'auth/login', data)
        .then(res => {
          if (res.data.response_code === 200) {
            p.state.signIn({
              level: res.data.result.level,
              id_owner: res.data.result.id_owner,
              owner_name: res.data.result.owner_name,
              business_name: res.data.result.business_name,
              id_category: res.data.result.id_category,
              id_outlet: res.data.result.id_outlet,
              outlet_name: res.data.result.outlet_name,
              owner_code: res.data.result.owner_code,
              products_ro: res.data.result.products_ro,
              units_ro: res.data.result.units_ro,
              categories_ro: res.data.result.categories_ro,
              customers_ro: res.data.result.customers_ro,
              suppliers_ro: res.data.result.suppliers_ro,
              outlets_ro: res.data.result.outlets_ro,
              transactions_ro: res.data.result.transactions_ro,
              purchases_ro: res.data.result.purchases_ro
            })
            window.location.href = '/dashboard'
          } else {
            handleShowNotif('warning', res.data.result.message)
          }

          setIsProsess(false)
        }).catch(err => console.log(err))
      }
    } else {
      if (formSignUp.bussiness_name.error || formSignUp.owner_name.error || formSignUp.email.error || formSignUp.password.error ) {
        handleShowNotif('warning', 'Semua inputan tidak boleh kosong dan icon harus berwarna hijau')
      } else {
        const data = new FormData()
        data.append('business_name', formSignUp.bussiness_name.value)
        data.append('owner_name', formSignUp.owner_name.value)
        data.append('email', formSignUp.email.value)
        data.append('password', formSignUp.password.value)

        setIsProsess(true)
        axios.post(util.server_url+'auth/signup', data)
        .then(res => {
          if (res.data.response_code === 200) {
            handleShowNotif('success', res.data.result.message)
            p.state.signIn({
              level: 0,
              id_owner: res.data.result.id_owner,
              owner_name: res.data.result.owner_name,
              business_name: res.data.result.business_name,
              id_outlet: res.data.result.id_outlet,
              outlet_name: res.data.result.outlet_name,
              owner_code: res.data.result.owner_code
            })
            window.location.href = '/dashboard'
          } else {
            handleShowNotif('warning', res.data.result.message)
          }

          setIsProsess(false)
        }).catch(err => console.log(err))
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

  const handleSelectItem = e => {
    if (parseInt(e.target.value) === 0) {
      setFormLogin({...formLogin, login_as: {owner: true, outlet: false}})
    } else {
      setFormLogin({...formLogin, login_as: {owner: false, outlet: true}})
    }
  }

  const handleFree = () => {
    const btnSignUp = document.querySelectorAll('.header-hero button')[1]
    btnSignUp.click()
  }

  return(
    <>
      <div className="header-hero">
        <img src="assets/images/logo/logo.png" alt="" />
        <div className="wrp-btns">
          <button className="pointer" onClick={handleShow}>Masuk</button>
          <button className="pointer" onClick={handleShow}>Daftar</button>
        </div>
      </div>

      <div className="image-hero">
        <h1>Mudah Digunakan</h1>
        <span>Tinggal daftar dan langsung bisa dipakai tanpa perlu install dulu</span>
        <button onClick={handleFree}>Mulai Gratis Sekarang</button>
      </div>
  
      <section>
        <ProfitItem 
          title="Laporan Grafik" 
          content="Grafik yang terdapat akan berubah seiring dengan transaksi maupun perubahan yang anda lakukan." 
          img={Grafik}/>
        <ProfitItem reverse 
          title="Flexible di Semua Perangkat" 
          content="Bisa dibuka di desktop, tablet, maupun mobile dengan menggunakan browser." 
          img={Devices}/>
        <ProfitItem 
        title="Mudah Digunakan" 
        content="Cocok untuk pelaku usaha UMKM yang sedang menjalankan bisnis." 
        img={Easy}/>
      </section>
      <section className="fitur">
        <div className="f-head">
          <h1>Fitur Yang Kami Tawarkan</h1>
          <p>Berikut ini adalah beberapa fitur yang akan anda peroleh jika</p>
          <p>menggunakan aplikasi onBakul</p>
        </div>
        <div className="f-container">
          <FiturItem 
            title="Scan Barcode" 
            content="Support dengan alat Scan Barcode" 
            img={Barcode}/>
          <FiturItem 
            title="Cam Scanner" 
            content="Bisa Scan Barcode dengan kamera laptop" 
            img={Cam}/>
          <FiturItem 
            title="E-Wallet" 
            content="Lorem ipsum" 
            img={Wallet}/>
          <FiturItem 
            title="Print" 
            content="Bisa cetak struk" 
            img={Print}/>
        </div>
      </section>

      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />

      {/* modal login & sign up */}
      <Modal.LoginSignUp show={show} onHide={handleCloseSuccess}>
        <div className="decoration-bg"></div>
        <div className="container-login">
          <div className="head">
            <h2>{login ? 'Masuk' : 'Daftar'}</h2>
          </div>
          <form className="body" onSubmit={handleSubmit}>
            {login ? (
              <div className="select-one">
                <label className="title">Masuk Sebagai</label>
                <div className="wrap-select">
                  <SelectItem 
                    value={0} 
                    name="Pemilik" 
                    onChange={handleSelectItem}
                    checked={formLogin.login_as.owner} />
                  <SelectItem 
                    value={1} 
                    name="Toko" 
                    onChange={handleSelectItem}
                    checked={formLogin.login_as.outlet} />
                </div>
                {formLogin.login_as.owner ? (
                  <Modal.LoginSignUp.FormItem.Email 
                    firstIcon="fas fa-envelope" 
                    placeholder="Email" 
                    value={formLogin.email.value}
                    onChange={(e, v) => setFormLogin({...formLogin, email: {error: e, value: v}})} />
                ) : (
                  <Modal.LoginSignUp.FormItem 
                    firstIcon="fas fa-user" 
                    placeholder="Kode Pemilik" 
                    value={formLogin.owner_code.value}
                    onChange={(e, v) => setFormLogin({...formLogin, owner_code: {error: e, value: v}})} />
                ) }
                <Modal.LoginSignUp.FormItem.Password 
                  firstIcon="fas fa-lock" 
                  placeholder="Password"
                  onChange={(e, v) => setFormLogin({...formLogin, password: {error: e, value: v}})} />
              </div>
            ) : (
              <>
                <Modal.LoginSignUp.FormItem 
                  firstIcon="fas fa-store" 
                  placeholder="Nama Usaha" 
                  onChange={(e, v) => setFormSignUp({...formSignUp, bussiness_name: {error: e, value: v}})} />
                <Modal.LoginSignUp.FormItem 
                  firstIcon="fas fa-user" 
                  placeholder="Nama Pemilik" 
                  onChange={(e, v) => setFormSignUp({...formSignUp, owner_name: {error: e, value: v}})} />
                <Modal.LoginSignUp.FormItem 
                  firstIcon="fas fa-envelope" 
                  placeholder="Email" 
                  onChange={(e, v) => setFormSignUp({...formSignUp, email: {error: e, value: v}})} />
                <Modal.LoginSignUp.FormItem.Password 
                  firstIcon="fas fa-lock" 
                  placeholder="Password"
                  onChange={(e, v) => setFormSignUp({...formSignUp, password: {error: e, value: v}})} />
              </>
            )}
            <button type='submit' className={`pointer${isProsess ? ' disable' : ''}`}>{isProsess ? 'Proses' : login ? 'Masuk' : 'Daftar'}</button>
            <p>{login ? 'Belum' : 'Sudah'} punya akun?<strong onClick={handleMode}>{login ? 'Daftar' : 'Masuk'}</strong></p>
            <div style={{height: 100}}></div>
          </form>
        </div>
      </Modal.LoginSignUp>
    </>
  )
}

export default GlobalConsumer(Landing)

const ProfitItem = ({reverse, title, content, img}) => {
  return(
    <div className={`profit-card${reverse ? ' reverse' : ''}`}>
      <div className="profit-content">
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
      <div className="img-content">
        <img src={img} alt="" />
      </div>
    </div>
  )
}

const FiturItem = ({title, content, img}) => {
  return(
    <div className="f-card">
      <div className="img-content">
        <img src={img} alt="" />
      </div>
      <div className="f-content">
        <strong>{title}</strong>
        <p>{content}</p>
      </div>
    </div>
  )
}

const SelectItem = ({value, name, onChange, checked}) => {
  const handleClick = e => e.target.previousElementSibling.click()

  return(
    <div className="select-item">
      <label htmlFor={name.toLowerCase()}>{name}</label>
      <input name="login_as" type="radio" value={value} id={name.toLowerCase()} onChange={onChange} checked={checked} />
      <i className="fas fa-check" onClick={handleClick}></i>
    </div>
  )
}