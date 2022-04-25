const ItemFeature = ({ name, valueBasic, valuePro, isBasic, isPro, both }) => {
  return(
    <tr className='status-upgrade'>
      <td>{name}</td>
      <td>{valueBasic ? valueBasic : <i className={`fas ${both ? 'fa-check' : (isBasic ? 'fa-check' : 'fa-times') }`}></i>}</td>
      <td>{valuePro ? valuePro : <i className={`fas ${both ? 'fa-check' : (isPro ? 'fa-check' : 'fa-times') }`}></i>}</td>
    </tr>
  )
}

export default ItemFeature