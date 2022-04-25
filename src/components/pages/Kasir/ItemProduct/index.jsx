import { useEffect, useRef, useState } from 'react'
import './ItemProduct.scss'

export default function ItemProduct(props) {
  const [qty, setQty] = useState(props.qty)
  const subTotal = parseInt(props.price)
  const btnMinus = useRef(null)
  const btnPlus = useRef(null)

  useEffect(() => {
    if (!props.loading) {   
      if (props.availableStock) {
        if (1 === props.qtyMax) {
          btnPlus.current.classList.add('disable')
          btnMinus.current.classList.add('disable')
        } else if (qty >= props.qtyMax) {
          btnPlus.current.classList.add('disable')
          btnMinus.current.classList.remove('disable')
        } else if (qty <= 1) {
          btnPlus.current.classList.remove('disable')
          btnMinus.current.classList.add('disable')
        } else {
          btnPlus.current.classList.remove('disable')
          btnMinus.current.classList.remove('disable')
        }
      } else {
        if (qty === 1) {
          btnMinus.current.classList.add('disable')
        }
      }

      btnPlus.current.onclick = () => {
        setQty(qty + 1)
        btnMinus.current.classList.remove('disable')
        props.reloadTotal()
      }
  
      btnMinus.current.onclick = e => {
        if (qty !== 1) {
          setQty(qty - 1)
        }
        
        if (qty <= 2) {
          setQty(1)
          e.target.classList.add('disable')
        }
        
        props.reloadTotal()
      }
    }
  })
  
  if (props.loading) return <div className="item-product skeleton"></div>

  return(
    <div 
      className="item-product" 
      data-id={props.id} 
      data-is-variant={props.isVariant ? 1 : 0}
      data-selling-price={props.price}
      data-capital-price={props.capitalPrice}>
      <span className="name">{props.name}</span>
      <div className="wrapper-act">
        <div className="qty">
          <button className="fas fa-minus" ref={btnMinus}></button>
          <input type="text" value={qty} maxLength="4" readOnly />
          <button className="fas fa-plus" ref={btnPlus}></button>
          <button className="fas fa-trash-alt" onClick={props.onClick}></button>
        </div>
        <span className="sub-total">{qty * subTotal}</span>
      </div>
    </div>
  )
}