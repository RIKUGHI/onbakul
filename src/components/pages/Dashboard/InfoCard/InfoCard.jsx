import './InfoCard.scss'

export default function InfoCard(props) {
  if (props.loading) return <div className="info-card skeleton"></div>
  
  return(
    <div className="info-card skeleton1">
      <div className="wrapper-content">
        <div className={`icon ${props.icon}`}></div>
        <div className="info">
          <span className="val">{props.val}</span>
          <span className="title">{props.title}</span>
        </div>
      </div>
      {props.onClick && <button onClick={props.onClick}>Lihat Detail</button>} 
    </div>
  )
}