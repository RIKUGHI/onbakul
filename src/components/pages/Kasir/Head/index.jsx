import FormSearch from './FormSearch'
import './Head.scss'

export default function Head({onOpenWebcam, onSubmit, onScan}) {
  return(
    <div className="head">
      <span>Daftar Produk</span>
      <div className="action">
        <button className="photo fas fa-camera pointer" onClick={onOpenWebcam}></button>
        <FormSearch className="search hide1" icon="fas fa-search" placeholder="Cari Produk" onSubmit={onSubmit} />
        <FormSearch icon="fas fa-barcode" placeholder="Scan barcode" onSubmit={onScan} />
      </div>
    </div>
  )
}