import './SimpleGroup.scss'

export default function SimpleGroup(props) {
  const isWarning = props.title === 'Bayar' ? ' warning1' : ''
  return(
    <div className={`simple-group${isWarning}`}>
      <span className="title-result">{props.title}</span>
      {props.children}
    </div>
  )
}