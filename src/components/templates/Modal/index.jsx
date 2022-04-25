import { useEffect, useState } from 'react'
import FormGroup from '../FormGroup'
import './Modal.scss'
import NoProductImage from '../../../assets/no-product-image.jpg' 
import util from '../../../util'
import axios from 'axios'

export default function Modal({children, title, show, onHide, onSubmit}) {
  const [isShow, setIsShow] = useState(true)
  const [modal, setModal] = useState('')
  const [dialog, setDialog] = useState('')

  useEffect(() => {
    if (show && isShow) {
      setModal(' open')
      setDialog(' open')
    }
  }, [show, isShow])

  const handleCloseModal = e => {
    const target = e.target
    if (target.classList.contains('modal') || target.classList.contains('fa-times') || e.target.innerText === 'Batal') {
      setIsShow(false)
      setModal('')
      setDialog('')
  
      setTimeout(() => {
        onHide()
        setIsShow(true)
      }, 150);
    }
  }

  if (!show) {
    return null
  } else {
    return(
      <div className={`modal${modal}`} onClick={handleCloseModal}>
        <div className={`modal-dialog${dialog}`}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="fas fa-times"></button>
          </div>
          <form onSubmit={onSubmit}>
            {children}
          </form>
        </div>
      </div>
    )
  }
}

Modal.Body = function Body({children}) {
  return <div className="modal-body">{children}</div>
}

Modal.Body.DataGroup = function DataGroup({children}) {
  return <div className="data-group">{children}</div>
}

Modal.Body.DataSwitch = function DataSwitch({children, show, id, onClick}) {
  return(
    <div className="data-switch">
      <div className="switch-wrapper">
        <label>Produk ini punya stok?</label>
        <label className="switch" htmlFor={id}>
          <input type="checkbox" id={id} onClick={onClick} />
          <span className="slider"></span>
        </label>
      </div>
      {show && (
        <div className="data-content">
          <p><strong>Note:</strong> Mengaktifkan fitur stok akan mempengaruhi fitur kasir, jika jumlah pembelian produk ini melebihi batas stok yang dimiliki, secara otomatis produk tidak bisa masuk tagihan dan jika stok mencapai batas minimum, secara otomatis akan muncul notifikasi</p>
          {children}
        </div>
      )}
    </div>
  )
}

Modal.Body.DataSwitch.HasValue = function DataSwitchHasValue({children, show, id, onClick}) {
  return(
    <div className="data-switch">
      <div className="switch-wrapper">
        <label>Produk ini punya stok?</label>
        <label className="switch" htmlFor={id}>
          <input type="checkbox" id={id} onClick={onClick} checked={show} onChange={() => {}} />
          <span className="slider"></span>
        </label>
      </div>
      {show && (
        <div className="data-content">
          <p><strong>Note:</strong> Mengaktifkan fitur stok akan mempengaruhi fitur kasir, jika jumlah pembelian produk ini melebihi batas stok minimum, secara otomatis produk tidak bisa masuk tagihan dan jika stok mencapai batas minimum, secara otomatis akan muncul notifikasi</p>
          {children}
        </div>
      )}
    </div>
  )
}

Modal.Body.TableVariant = function TableVariant({children, newV}) {
  return(
    <div className="container-variant">
      <table className="table-variant">  
        <thead>
          <tr>
            <th>Nama Variasi{newV ? ' Baru' : ''}</th>
            <th>Harga Jual</th>
            <th>Harga Modal</th>
            <th>Stok</th>
            <th>Stok Min</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  )
}

Modal.Body.TableVariant.Item = function Item({index, variantName, sellingPrice, capitalPrice, availableStock, idUnit, stockQuantity, stockMin, edit, onEdit, onClick}) {
  return(
    <tr>
      <td>{variantName}</td>
      <td>{util.formatRupiah(sellingPrice)}</td>
      <td>{util.formatRupiah(capitalPrice)}</td>
      <td>{stockQuantity+(availableStock ? '/'+(idUnit === null ? null : idUnit) : '')}</td>
      <td>{stockMin}</td>
      <td>
        {edit && <button type='button' className="fas fa-pen" onClick={() => onEdit(index)}></button>}
        <button type='button' className="fas fa-trash-alt" onClick={() => onClick(index)}></button>
      </td>
    </tr>
  )
} 

Modal.Body.SimpleData = function SimpleData({name, value}) {
  return(
    <div className="simple-data">
      <strong>{name}</strong>
      <p>{value}</p>
    </div>
  )
}

Modal.Body.SimpleDataWithArea = function SimpleDataWithArea({name, value}) {
  return(
    <div className="simple-data">
      <strong>{name}</strong>
      <textarea defaultValue={value} />
    </div>
  )
}

Modal.Body.DetailProduct = function DetailProduct({children}) {
  return(
    <div className="container-detail-product">
      {children}
      
    </div>
  )
}

Modal.Body.DetailProduct.Head = function DetailProductHead({children, img}) {
  return(
    <div className="cdp-head">
      <img src={img === null ? NoProductImage : img} alt="" />
      <div className="cdp-wrapper">
        {children}
      </div>
    </div>
  )
}

Modal.Body.DetailProduct.Head.ItemData = function DetailProductHeadItemData({name, value}) {
  return(
    <div className="cdp-data">
      <span>{name}</span>
      <span>{value}</span>
    </div>
  )
}

Modal.Body.DetailProduct.Unit = function DetailProductUnit({unit, stock, stockMin}) {
  return(
    <div className="cdp-unit">
      <div className="cdp-unit-data">
        <strong>{unit}</strong>
        <label>Satuan</label>
      </div>
      <div className="cdp-unit-data">
        <strong>{stock}</strong>
        <label>Stok</label>
      </div>
      <div className="cdp-unit-data">
        <strong>{stockMin}</strong>
        <label>Stok Minimum</label>
      </div>
    </div>
  )
}

Modal.Body.Privilege = function Privilege({children}) {
  return(
    <div className="privilege-container">
      <h4>Hak Akses</h4>
      <div className="wrapper-features">{children}</div>
    </div>
  )
}

Modal.Body.Privilege.Group = function PrivilegeGroup({children}) {
  return(
    <div className="group-features">{children}</div>
  )
}

Modal.Body.Privilege.Group.Item = function PrivilegeGroupItem({title, name, checked, onChange}) {
  const id = title.toLowerCase()

  const handleClick = e => e.target.previousElementSibling.click()
  
  return(
    <div className="item-feature">
      <label className="title">{title}</label>
      <div className="select-wrapper">
        <div className="select-privilege">
          <label htmlFor={id}>Readonly</label>
          <input name={name} value={1} checked={checked === 1 ? true : false} type="radio" id={id} onChange={onChange} />
          <i className="fas fa-check" onClick={handleClick}></i>
        </div>
        <div className="select-privilege">
          <label htmlFor={`${id}-2`}>Tambah,Edit, Hapus</label>
          <input name={name} value={0} checked={checked === 0 ? true : false} type="radio" id={`${id}-2`} onChange={onChange} />
          <i className="fas fa-check" onClick={handleClick}></i>
        </div>
      </div>
    </div>
  )
}

Modal.Body.Variant = function Variant({children}) {
  return(
    <div className="choose-variant">
      <h4>Pilih Variasi</h4>
      <div className="wrapper-variant">{children}</div>
    </div>
  )
}

Modal.Body.Variant.Item = function VariantItem({name, price, availableStock, stock, unit, onClick}) {
  return(
    <div className="variant-card" onClick={onClick}>
      <div className="wrapper-name-price">
        <p className="name">{name}</p>
        <p className="price">{util.formatRupiah(price)}</p>
      </div>
      {availableStock && <span>{stock}/{unit}</span>}
    </div>
  )
}

Modal.Body.Act = function Act({children, name, icon, add, onClick}) {
  return(
    <div className="el-wrap">
      {children}
      {add && (
        <button type="button" className="btn-add" onClick={onClick}>
          <span>{name}</span>
          <i className={icon}></i>
        </button>
      )}
    </div>
  )
}

Modal.Body.SelectOption = function SelectOption({children, title}) {
  return(
    <div className="container-select-option">
      <h4>Pilih {title}</h4>
      <div className="wrapper-item">{children}</div>
    </div>
  )
}

Modal.Body.SelectOption.Item = function SelectOptionItem({name, onClick}) {
  return(
    <div className="select-item" onClick={onClick}>{name}</div>
  )
}

Modal.Footer = function Footer({children}) {
  return <div className="modal-footer">{children}</div>
}

Modal.Center = function ModalCenter({children, show, onHide}) {
  const [isShow, setIsShow] = useState(true)
  const [modal, setModal] = useState('')
  const [dialog, setDialog] = useState('')

  useEffect(() => {
    if (show && isShow) {
      setModal(' open')
      setDialog(' open')
    }
  }, [show, isShow])

  const handleCloseModal = e => {
    const target = e.target
    if (target.classList.contains('modal') || e.target.innerText === 'Batal' || e.target.innerText === 'Tutup') {
      setIsShow(false)
      setModal('')
      setDialog('')
  
      setTimeout(() => {
        onHide()
        setIsShow(true)
      }, 150);
    }
  }

  if (!show) return null 

  return(
    <div className={`modal${modal}`} onClick={handleCloseModal}>
      <div className={`modal-dialog-center${dialog}`}>
        {children}
      </div>
    </div>
  )
}

Modal.Center.TitleDelete = function ModalCenterTitleDelete({title}) {
  return(
    <>
      <label>Apakah anda yakin akan menghapus</label>
      <h2>{title} ?</h2>
    </>
  )
}

Modal.Center.Success = function ModalCenterSuccess({date, time, payment, total, paidOff}) {
  const methods = ['Tunai', 'GoPay', 'Ovo', 'ShoppePay']
  const dateToInaFormat = date => {
    const split = date.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
    return split[2]+' '+months[parseInt(split[1]) - 1]+' '+split[0]
  }

  return(
    <div className="container-success">
      <div className="cs-head">
        <strong>Transaksi anda berhasil</strong>
        <span>{dateToInaFormat(date)}, {time}</span>
      </div>
      <div className="cs-content">
        <div className="cs-data">
          <span>Pembayaran</span>
          <span>{methods[payment]}</span>
        </div>
        <div className="cs-data">
          <span>Total</span>
          <span>{util.formatRupiah(total)}</span>
        </div>
        <div className="cs-data">
          <span>Diterima</span>
          <span>{util.formatRupiah(paidOff)}</span>
        </div>
        <div className="cs-data">
          <span>Kembalian</span>
          <span>{util.formatRupiah(parseInt(paidOff) - parseInt(total))}</span>
        </div>
      </div>
    </div>
  )
}

Modal.Center.Payment = function ModalCenterPayment({ isProsessPayment, isLoading, onClickPay , onSuccessfulyPayment }) {
  return(
    <div className="container-payment"> 
      <h3>{isProsessPayment ? 'Total Pembayaran' : 'Paket Premium'}</h3>
        <div className="simple-packge">
          <h4>1 Bulan</h4>
          <h4>Rp30.000</h4>
        </div>
        <span className='select-method-name'>Pilih Metode Pembayaran</span>
        {!isProsessPayment && (
          <div className="item-payment">
            <div className="payment">
              <img src="assets/images/logo/gopay.png" alt="GoPay" />
              <div className="desc">
                <span>GoPay</span>
                <p>Siapkan aplikasi GO-JEK atau Scanner QRIS</p>
              </div>
            </div>
            <div className="dot"></div>
          </div>
        )}
        {isProsessPayment && (
          <>
            <div className="temp-payment">
              <span>GoPay</span>
              <img src="assets/images/gopay.svg" alt="" />
            </div>
            <img src="assets/images/qrcode.svg" alt="" />
          </>
        )}
        <button className={isLoading ? 'disable' : ''} onClick={isProsessPayment ? onSuccessfulyPayment : onClickPay}>{isLoading ? 'Proses...' : (isProsessPayment ? 'Sudah Bayar' : 'Bayar Sekarang')}</button>
    </div>
  )
}

Modal.Center.Warning =  function ModalCenterWarning({messages}){
  return(
    <div className="modal-center-warning">
      <strong>Jika iya:</strong>
      <ul>
        {messages.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
    </div>
  )
}

Modal.Center.DetailTransaction = function ModalCenterDetailTransaction({children, name}) {
  return(
    <div className="container-detail-transaction">
      <h3>Toko {name}</h3>
      {children} 
      <div className="powered">
        <h3>Terima Kasih</h3>
        <p>Powerd by onBakul</p>
      </div>
    </div>
  )
}

Modal.Center.DetailTransaction.Wrap = function Wrap({children}) {
  return(
    <div className="cdt-wrap dashed">{children}</div>
  )
}

Modal.Center.DetailTransaction.Wrap.SimpleData = function SimpleData({label, value}) {
  return(
    <div className="cdt-data">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

Modal.Center.DetailTransaction.Wrap.Product = function Product({name, price, qty}) {
  return(
    <div className="cdt-data">
      <div className="cdt-product">
        <strong>{name}</strong>
        <span>{util.formatRupiah(price)} x {qty}</span>
      </div>
      <span>{util.formatRupiah(price * qty)}</span>
    </div>
  )
}

Modal.Center.DetailTransaction.Wrap.Total = function Total({price}) {
  return(
    <div className="cdt-data">
      <strong>Total</strong>
      <strong>{price}</strong>
    </div>
  )
}

Modal.Center.DetailTransaction.Wrap.Pay = function Pay({pay, cashBack}) {
  return(
    <>
      <div className="cdt-data">
        <span>Bayar</span>
        <strong>{util.formatRupiah(pay)}</strong>
      </div>
      <div className="cdt-data">
        <span>Kembali</span>
        <strong>{util.formatRupiah(cashBack)}</strong>
      </div>
    </>
  )
}

Modal.Center.Footer = function ModalCenterFooter({children}) {
  return(
    <div className="modal-center-footer">{children}</div>
  )
}

Modal.LoginSignUp = function ModalLoginSignUp({children, show, onHide}) {
  const [isShow, setIsShow] = useState(true)
  const [modal, setModal] = useState('')
  const [dialog, setDialog] = useState('')

  useEffect(() => {
    if (show && isShow) {
      setModal(' open')
      setDialog(' open')
    }
  }, [show, isShow])

  const handleCloseModal = e => {
    const target = e.target
    if (target.classList.contains('modal') || e.target.innerText === 'Batal' || e.target.innerText === 'Tutup') {
      setIsShow(false)
      setModal('')
      setDialog('')
  
      setTimeout(() => {
        onHide()
        setIsShow(true)
      }, 150);
    }
  }

  if (!show) return null 

  return(
    <div className={`modal${modal}`} onClick={handleCloseModal}>
      <div className={`modal-dialog-login${dialog}`}>
        {children}
      </div>
    </div>
  )
}

Modal.LoginSignUp.FormItem = function ModalLoginSignUpFormItem({firstIcon, placeholder, onChange, value}) {
  const [warning, setWarning] = useState(false)
  const [message, setMessage] = useState('')
  const [icon, setIcon] = useState('')
  const [timerCheckEmail, setTimerCheckEmail] = useState(null)

  const handleChange = e => {
    if (placeholder.toLowerCase() === 'nama usaha') {
      if (e.target.value.length < 4) {
        setWarning(true)
        setMessage('Nama usaha minimal lebih dari 3 karater')
        setIcon('fas fa-times')
        onChange(true, '')
      } else {
        setWarning(false)
        setMessage('')
        setIcon('fas fa-check')
        onChange(false, e.target.value.trim())
      }
    } else if (placeholder.toLowerCase() === 'nama pemilik') {
      if (e.target.value.length < 4) {
        setWarning(true)
        setMessage('Nama pemilik minimal lebih dari 3 karater')
        setIcon('fas fa-times')
        onChange(true, '')
      } else {
        setWarning(false)
        setMessage('')
        setIcon('fas fa-check')
        onChange(false, e.target.value.trim())
      }
    } else if (placeholder.toLowerCase() === 'kode pemilik') {
      if (e.target.value.length < 4) {
        setWarning(true)
        setMessage('Kode pemilik tidak valid')
        setIcon('fas fa-times')
        onChange(true, '')
      } else {
        setWarning(false)
        setMessage('')
        setIcon('fas fa-check')
        onChange(false, e.target.value.trim())
      }
    } else {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (regex.test(String(e.target.value).toLowerCase())) {
        window.clearTimeout(timerCheckEmail)
        setTimerCheckEmail(setTimeout(() => {
          axios.get(util.server_url+'auth/checkemail', {
            params: {
              email: e.target.value.trim()
            }
          }).then(res => {
            if (res.data.response_code === 200) {
              setWarning(false)
              setMessage('')
              setIcon('fas fa-check')
              onChange(false, e.target.value.trim())
            } else {
              setWarning(true)
              setMessage(res.data.result.message)
              setIcon('fas fa-times')
              onChange(true, '')
            }
          }).catch(err => console.log(err))
        }, 400))
      } else {
        setWarning(true)
        setMessage('Format email salah')
        setIcon('fas fa-times')
        onChange(true, '')
      }
    }
  }
  return(
    <div className="form-auth">
      <div className="wrap-auth">
        <i className={firstIcon}></i>
        <input type="text" placeholder={placeholder} defaultValue={value} onChange={handleChange} />
        {icon && <i className={icon}></i>}
      </div>
      {warning && <span className="warning">{message}</span>}
    </div>
  )
}

Modal.LoginSignUp.FormItem.Email = function ModalLoginSignUpFormItemEmail({firstIcon, placeholder, onChange, value}) {
  const [warning, setWarning] = useState(false)
  const [message, setMessage] = useState('')
  const [icon, setIcon] = useState('')
  const [timerCheckEmail, setTimerCheckEmail] = useState(null)

  const handleChange = e => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regex.test(String(e.target.value).toLowerCase())) {
      setWarning(false)
      setMessage('')
      setIcon('fas fa-check')
      onChange(false, e.target.value.trim())
    } else {
      setWarning(true)
      setMessage('Format email salah')
      setIcon('fas fa-times')
      onChange(true, '')
    }
  }
  return(
    <div className="form-auth">
      <div className="wrap-auth">
        <i className={firstIcon}></i>
        <input type="text" placeholder={placeholder} defaultValue={value} onChange={handleChange} />
        {icon && <i className={icon}></i>}
      </div>
      {warning && <span className="warning">{message}</span>}
    </div>
  )
}


Modal.LoginSignUp.FormItem.Password = function ModalLoginSignUpFormItemPassword({firstIcon, placeholder, onChange}) {
  const [hide, setHide] = useState(true)
  const [icon, setIcon] = useState('fas fa-eye-slash')
  const [warning, setWarning] = useState(false)

  const changeIcon = () => {
    setHide(!hide)
    setIcon(icon === 'fas fa-eye-slash' ? 'fas fa-eye' : 'fas fa-eye-slash')
  }

  const handleChange = e => {
    if (e.target.value.length < 4) {
      setWarning(true)
      onChange(true, '')
    } else {
      setWarning(false)
      onChange(false, e.target.value)
    }
  }

  return(
    <div className="form-auth">
      <div className="wrap-auth">
        <i className={firstIcon}></i>
        <input name="password" type={hide ? 'password' : 'text'} placeholder={placeholder} onChange={handleChange} />
        <i className={icon+' pointer'} onClick={changeIcon}></i>
      </div>
      {warning && <span className="warning">Password minimal lebih dari 3 karakter</span>}
    </div>
  )
}