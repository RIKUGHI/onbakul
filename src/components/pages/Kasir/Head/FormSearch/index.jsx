import { useState } from 'react'
import './FormSearch.scss'

export default function FormSearch(props) {
  const className = props.className === undefined ? '' : props.className

  return(
    <form className={`form-search-cashier ${className}`} onSubmit={props.onSubmit}>  
      <input type="text" name="q" placeholder={props.placeholder} />
      <button className={props.icon}></button>
    </form>
  )
}