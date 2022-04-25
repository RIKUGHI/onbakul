import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GlobalConsumer } from '../../context'
import './SideBar.scss'

const path1 = ['/produk','/satuan','/kategori','/pelanggan','/supplier','/outlet']
const isOpen1 = path1.includes(window.location.pathname)
const path2 = ['/riwayat-transaksi','/pembelian']
const isOpen2 = path2.includes(window.location.pathname)
const path3 = ['/akun']
const isOpen3 = path3.includes(window.location.pathname)

const ItemMenu = props => {
  const availableSub = props.menuName === 'Kelola' || props.menuName === 'Transaksi' || props.menuName === 'Pengaturan'

  // if user reload page
  const isActive = window.location.pathname === props.to 

  const handleClick = e => {
    if (props.menuName.toLowerCase() === 'logout') {
      props.p.state.signOut()  
    }

    const sideBar = document.querySelector('.side-bar')

    if (sideBar.classList.contains('active') && window.innerWidth >= 768) {
      e.preventDefault()
    }
  }

  return(
    <li className={`list${isActive ? ' active' : ''}`}>
      <Link to={props.to} className="item-menu" onClick={handleClick}>
        <span className="icon">
          <i className={props.icon}></i>
        </span>
        <span className="title">{props.menuName}</span>
        {availableSub ? (
          <button className="fas fa-caret-down"></button>
        ) : null}
      </Link>

      {(() => {
        switch (props.menuName) {
          case 'Kelola':
            return(
              <ul className={`sub-menu${isOpen1 ? ' open' : ''}`}>
                <ItemSubMenu to="/produk" menuName="Produk" />
                <ItemSubMenu to="/satuan" menuName="Satuan" />
                <ItemSubMenu to="/kategori" menuName="Kategori" />
                <ItemSubMenu to="/pelanggan" menuName="Pelanggan" />
                <ItemSubMenu to="/supplier" menuName="Supplier" />
                <ItemSubMenu to="/outlet" menuName="Outlet" />
              </ul>
            )

          case 'Transaksi':
            return(
              <ul className={`sub-menu${isOpen2 ? ' open' : ''}`}>
                <ItemSubMenu to="/riwayat-transaksi" menuName="Riwayat Transaksi" />
                <ItemSubMenu to="/pembelian" menuName="Pembelian" />
              </ul>
            )

          case 'Pengaturan':
            return(
              <ul className={`sub-menu${isOpen3 ? ' open' : ''}`}>
                <ItemSubMenu to="/akun" menuName="Akun" />
              </ul>
            )
        
          default:
            return null
        }
      })()}
    </li>
  )
}

const ItemSubMenu = props => {
  // if user reload page
  const isActive = window.location.pathname === props.to 

  const handleClick = e => {
    const sideBar = document.querySelector('.side-bar')

    if (sideBar.classList.contains('active') && window.innerWidth >= 768) {
      e.preventDefault()
    }

    if (window.innerWidth <= 768) sideBar.classList.remove('active')
  }

  return(
    <li>
      <Link to={props.to} onClick={handleClick}>
        <span className={`title${isActive ? ' active' : ''}`}>{props.menuName}</span>
      </Link>
    </li>
  )
}

const SideBar = (p) => {
  useEffect(() => {
    const sideBarContainer = document.querySelector('.side-bar')
    const menu = [...document.querySelectorAll('.list .item-menu')]
    const menuWithSub = menu.slice(2, 5)

    // if user click menu
    menu.forEach((m, i) => {
      if (i === 2 || i === 3 || i === 4) {
        m.onclick = () => {
          if ((!sideBarContainer.classList.contains('active') && window.innerWidth >= 768) || (window.innerWidth <= 768 && sideBarContainer.classList.contains('active'))) {
            m.parentElement.classList.toggle('active')
            m.parentElement.querySelector('.sub-menu').classList.toggle('open')
  
            menuWithSub.forEach((mWS, idx) => {
              const subIndex = i === 2 ? 0 : i === 3 ? 1 : 2
              if (!(subIndex === idx)) {
                mWS.parentElement.classList.remove('active')
                mWS.parentElement.querySelector('.sub-menu').classList.remove('open')
              }
            })
  
            const subMenu = m.parentElement.querySelectorAll('.sub-menu li') 
            subMenu.forEach(sM => {
              sM.onclick = () => {
                menu.forEach((m, idx) => {
                  if (idx !== 2 && idx !== 3 && idx !== 4) {
                    m.parentElement.classList.remove('active')
                  }
                })
                
                menuWithSub.forEach(m => {
                  m.parentElement.querySelectorAll('.sub-menu li a span').forEach(s => s.classList.remove('active'))
                })
  
                sM.querySelector('a span').classList.add('active')
              }
            })
          }
        }
      } else {
        m.onclick = () => {
          if ((!sideBarContainer.classList.contains('active') && window.innerWidth >= 768) || (window.innerWidth <= 768 && sideBarContainer.classList.contains('active'))) {
            menu.forEach(m => {
              m.parentElement.classList.remove('active')
              
              if (m.parentElement.querySelector('.sub-menu') !== null) {
                m.parentElement.querySelector('.sub-menu').classList.remove('open')
              }
            })
            
            menuWithSub.forEach(m => m.parentElement.querySelectorAll('.sub-menu li a span').forEach(s => s.classList.remove('active')))
            
            m.parentElement.classList.add('active')

            if (window.innerWidth <= 768) sideBarContainer.classList.remove('active')
          }
        }
      }
    })

    // if reload page
    menuWithSub.forEach((m, i) => {
      if ((isOpen1 && i === 0) || (isOpen2 && i === 1) || (isOpen3 && i === 2)) {
        m.parentElement.classList.add('active')  

        const subMenu = m.parentElement.querySelectorAll('.sub-menu li')
        subMenu.forEach(sM => {
          sM.onclick = () => {
            subMenu.forEach(s => s.querySelector('a span').classList.remove('active'))
            sM.querySelector('a span').classList.add('active')
          }
        })
      }
    })

    // fix UI when user resize screen
    const sideBar = document.querySelector('.side-bar')

    document.body.onresize = e => {
      if (window.innerWidth <= 768) {
        const mainContainer = document.querySelector('main')
        const menuToggle = document.querySelector('.menu-toggle')

        mainContainer.classList.remove('open')
        sideBar.classList.remove('active')
        menuToggle.classList.remove('active')
      }
    }
  }, [])

  let startingX

  const handleTouchStart = e => {
    if (window.innerWidth <= 768) {
      startingX = e.touches[0].clientX
    }
  }

  const handleTouchMove = e => {
    if (window.innerWidth <= 768) {
      if (e.touches[0].clientX <= startingX) {
        const sideBar = document.querySelector('.side-bar')
        sideBar.classList.remove('active')
      }
    }
  }

  const handleTouchEnd = () => {
    if (window.innerWidth <= 768) {
      startingX = 0;
    }
  }

  const handleBackground = () => {
    const sideBar = document.querySelector('.side-bar')
    sideBar.classList.remove('active')
  }

  return(
    <>
      <div className="side-bar" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="head-side">
          <div className="img-wrapper">
            {/* image not available */}
            {/* <div className="empty-img fas fa-user"></div> */}
            {/* image available */}
            <img className="skeleton1" src="https://source.unsplash.com/100x100/?nature" alt="" />
          </div>
          <div className="title">
            <span className="skeleton1">{p.state.display_name}</span>
            <span className="skeleton1">{parseInt(p.state.level) === 0 ? 'Pemilik' : 'Toko'} - {p.state.owner_code}</span>
          </div>
        </div>
        <ul className="menu">
          <ItemMenu to="/dashboard" icon="fas fa-desktop" menuName="Dashboard" />
          <ItemMenu to="/kasir" icon="fas fa-cash-register" menuName="Kasir" />
          <ItemMenu to="#" icon="fas fa-box" menuName="Kelola" />
          <ItemMenu to="#" icon="fas fa-file-invoice-dollar" menuName="Transaksi" />
          <ItemMenu to="#" icon="fas fa-cog" menuName="Pengaturan" />
          <ItemMenu to="/tutorial" icon="far fa-question-circle" menuName="Tutorial" />
          {parseInt(p.state.level) === 0 && <ItemMenu to="/upgrade" icon="fas fa-file-upload" menuName="Upgrade" />}
          <ItemMenu to="#" icon="fas fa-power-off" menuName="Logout" p={p} />
        </ul>
      </div>
      <div className="tmp-bg" onClick={handleBackground}></div>
    </>
  )
}

export default GlobalConsumer(SideBar)