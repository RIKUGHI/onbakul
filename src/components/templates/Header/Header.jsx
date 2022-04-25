import axios from 'axios'
import { useEffect, useState } from 'react'
import { Outlets } from '../..'
import { GlobalConsumer } from '../../../context'
import util from '../../../util'
import './Header.scss'

const Header = (props) => {
  const [cart, setCart] = useState(false)
  const [outlets, setOutlets] = useState(false)
  const [dataNotif, setDataNotif] = useState(null)

  useEffect(() => {
    const currentUrl = window.location.pathname
    const path = ['/produk', '/satuan', '/kategori', '/pelanggan', '/supplier', '/riwayat-transaksi']

    // if user reload kasir page
    currentUrl === '/kasir' && window.innerWidth <= 1000 ? setCart(true) : setCart(false)

    path.includes(currentUrl) ? setOutlets(true) : setOutlets(false) 

    document.body.onresize = e => {
      window.location.pathname === '/kasir' && window.innerWidth <= 1000 ? setCart(true) : setCart(false)
    }

    // notif
    axios.get(util.server_url+'notifications?id_owner='+props.state.id_owner  )
    .then(res => {
      res.data.result.results !== null ? setDataNotif(res.data) : setDataNotif(null)
    }).catch(err => console.log(err))
  }, [])

  const handleToggle = () => {
    const mainContainer = document.querySelector('main')
    const sideBar = document.querySelector('.side-bar')
    const menuToggle = document.querySelector('.menu-toggle')

    if (window.innerWidth > 768){
      mainContainer.classList.toggle('open')
      menuToggle.classList.toggle('active')
    }
    sideBar.classList.toggle('active')
  }

  const handleToogleCart = () => {
    const billingContainer = document.querySelector('.billing-container')
    
    billingContainer.classList.add('active')
  }

  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleFullScreen = e => {
    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullScreen(false)
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
        setIsFullScreen(true)
      }
    }
  }

  const [notif, setNotif] = useState(false)
  const handleNotif = () => setNotif(!notif)

  const handleNotifClick = name => {
    window.location.href = '/produk?q='+name  
  }

  return(
    <header>
      <div className="wrapper-title">
        <MenuToggle handleToggle={handleToggle} />
        <h2 className="title">{props.title}</h2>
      </div>
      <div className="wrapper-icons">
        <button className="fas fa-expand" onClick={handleFullScreen}></button>
        <button className="fas fa-bell" onClick={handleNotif}>
          {dataNotif && dataNotif.result.results && <span>!</span>}
          {notif && 
          <div className="notif-container">
            <h3>Notifikasi</h3>
            {dataNotif && dataNotif.result.results.map(d => 
              <div className="notif-card" key={d.id_product} onClick={() => handleNotifClick(d.product_name)}>
                <p>Produk <strong>{d.product_name}</strong> Tersisa <strong>{d.stock_quantity}</strong> pack</p>
                <p>Silahkan lakukan restock</p>
              </div>)}
          </div>}
        </button>
        {cart && (
          <button className="fas fa-shopping-cart" onClick={handleToogleCart}>
            <span>!</span>
          </button>
        )}
      {/* {outlets && (
        <Outlets list={['Semua']} />
      )} */}
      </div>
    </header>
  )
}

export default GlobalConsumer(Header)

const MenuToggle = (props) => {
  return(
    <div className="menu-toggle" onClick={props.handleToggle}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}