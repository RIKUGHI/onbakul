import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import util from '../../../../util'
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

      const {idOwner, idOutlet, isVariant, id} = props

      btnPlus.current.onclick = () => {
        setQty(qty + 1)
        btnMinus.current.classList.remove('disable')
        props.reloadTotal()
        addQuantity(idOwner, idOutlet, isVariant ? 1 : 0, id, qty + 1);
      }
  
      btnMinus.current.onclick = e => {
        if (qty !== 1) {
          setQty(qty - 1)
          addQuantity(idOwner, idOutlet, isVariant ? 1 : 0, id, qty - 1);
        }
        
        if (qty <= 2) {
          setQty(1)
          e.target.classList.add('disable')
          addQuantity(idOwner, idOutlet, isVariant ? 1 : 0, id, 1);
        }
        
        props.reloadTotal()
      }
    }
  })

  const addQuantity = (id_owner, id_outlet, is_variant, id_product, qty) => {
    const form = new FormData()
    form.append('id_owner', id_owner)
    form.append('id_outlet', id_outlet)
    form.append('is_variant', is_variant)
    form.append('id_product', id_product)
    form.append('qty', qty)

    axios.post(util.server_url+'cashier/addQuantity', form)
    .then(res => {
      if (res.data.response_code === 200) {
        // console.log('success', res.data.result.message)
      } else {
        console.log('warning', res.data.result.message)
      }
    })
    .catch(err => console.log(err))
  }
  
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