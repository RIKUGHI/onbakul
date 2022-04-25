import './NotFound.scss'
import img404 from '../../../assets/Group 180.png'
import { useHistory } from 'react-router';

export default function NotFound(props) {
  const history = useHistory()
  
  return(
    <div className="container-notfound">
      <img src={img404} alt="" />
      <span>Oops!</span>
      <span className="desc">Halaman yang anda cari tidak ditemukan</span>
      <button onClick={() => history.goBack()}>Kembali</button>
    </div>
  )
}