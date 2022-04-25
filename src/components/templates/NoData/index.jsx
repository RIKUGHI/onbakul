import './NoData.scss'

export default function NoData({title}) {
  return(
    <div className="no-data">
      <img src="assets/images/no-data.svg" alt="" />
      <h3>{title} Tidak Tersedia</h3>
    </div> 
  )
}