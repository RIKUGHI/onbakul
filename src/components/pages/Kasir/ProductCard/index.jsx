import './ProductCard.scss'
import NoProductImage from '../../../../assets/no-product-image.jpg'
import util from '../../../../util'

export default function ProductCard({loading, img, name, price, onClick}) {
  if (loading) return <div className="product-card skeleton"></div>

  return(
    <div className="product-card" onClick={onClick}>
      <div className="img-wrapper skeleton1v">
        <img src={img ? img : NoProductImage} alt="" />
      </div>
      <div className="content-wrapper">
        <span className="name">{name}</span>
        <span className="price">{price}</span>
      </div>
    </div>
  )
}