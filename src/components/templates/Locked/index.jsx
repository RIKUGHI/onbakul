import { GlobalConsumer } from '../../../context'
import './index.scss'

const Locked = (p) => {
  return(
    <div className='locked-container'>
      <img src="assets/images/security.svg" alt="Locked" />
      {parseInt(p.state.level) === 0 ? (
        <h3>Upgrade fiturmu <a href='/upgrade'>disini</a>, mulai dari Rp1.000-an/hari</h3>
        ) : (
        <h3>Upgrade akun owner terlebih dahulu</h3>
      )}
    </div>
  )
}

export default GlobalConsumer(Locked)