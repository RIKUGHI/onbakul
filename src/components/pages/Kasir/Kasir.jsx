// component
import axios from "axios";
import { useEffect, useState } from "react";
import { MainLayout, Notification } from "../..";
import { GlobalConsumer } from "../../../context";
import util from "../../../util";
import Billing from "./Billing";

// style
import './Kasir.scss'
import Product from "./Product";

function Kasir(p) {
  const [dataCart, setDataCart] = useState(null)
  const [isLoadingCart, setIsLoadingCart] = useState(true)

  useEffect(() => {
    getCart()
  }, [p.location.search])
  // notification
  const [notification, setNotification] = useState(false)
  const [statusNotif, setStatusNotif] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  
  const handleShowNotif = (status, message) => {
    setNotification(true)
    setStatusNotif(status)
    setStatusMessage(message) 
  }
  const handleCloseNotif = () => setNotification(false)
  
  // billing
  const getCart = () => {
    setIsLoadingCart(true)
    axios.get(util.server_url+'cashier?id_owner='+p.state.id_owner+'&id_outlet='+p.state.id_outlet)
    .then(res => {
      res.data.result !== null ? setDataCart(res.data) : setDataCart(null)
      setIsLoadingCart(false)
    })
    .catch(err => console.log(err))
  }

  const reloadCart = () => getCart()
  const deleteItemCart = (idOwner, idOutlet, idProduct, isVariant) => {
    axios.delete(util.server_url+`cashier/delete`, {
      params: {
        id_owner: idOwner,
        id_outlet: idOutlet,
        id_product: idProduct,
        is_variant: isVariant ? 1 : 0
      }
    })
    .then(res => {
      if (res.data.response_code === 200) {
        reloadCart()
      } else {
        handleShowNotif('warning', res.data.result.message)
      }
    })
    .catch(err => console.log(err))
  }
  

  return(
    <>
      <MainLayout title="Kasir">
        <div className="cashier-container">
          <Product p={p} handleShowNotif={handleShowNotif} reloadCart={reloadCart} />
          <Billing
            p={p}
            isLoading={isLoadingCart}
            data={dataCart}
            handleShowNotif={handleShowNotif}
            onItemDelete={deleteItemCart} />
        </div>
      </MainLayout>
      
      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />
    </>
  )
}

export default GlobalConsumer(Kasir)