const UpgradeCard = ({ isPro, featureList, onShowModal }) => {
  return(
    <div className="wrapper-upgrade-card">
      <div className="upgrade-card">
        <div className="upgrade-logo">
          <i className="fas fa-shopping-basket"></i>
        </div>
        <label>{isPro ? 'Premium' : 'Basic'}</label>
        <span style={{fontWeight: isPro ? 'bold' : 'normal'}}>{isPro ? 'Rp30.000 / bulan' : 'Gratis selamanya'}</span>
        {isPro && <button onClick={onShowModal}>Upgrade</button>}
        <p>{isPro ? 'Untuk usaha rintisan dengan fitur standar' : 'Untuk usaha rintisan yang dikelola sendiri tanpa staff, dengan laporan penjualan sederhana'}</p>
        <ul>
          {featureList.map((d, i) => <li key={i}>
                                        <i className="fas fa-check"></i> 
                                        <span>
                                          {d}
                                        </span> 
                                      </li>)}
          
        </ul>
      </div>
    </div>
  )
}

export default UpgradeCard