import { useEffect, useState } from 'react'
import './Notification.scss'

export default function Notification({show, status, message, onHide}) {
  const [statusNotif, setStatusNotif] = useState('')

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setStatusNotif(' '+status)
      }, 0);

      setTimeout(() => {
        setStatusNotif('')
        
        setTimeout(() => {
          onHide()
        }, 400);
      }, 2500);
    }
  }, [show, status])

  if (!show) return false

  return(
    <div className={`notification${statusNotif}`}>
      <p>{message}</p>
    </div>
  )
}