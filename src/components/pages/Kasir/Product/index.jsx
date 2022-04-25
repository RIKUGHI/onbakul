import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { Loading, Modal, NoData, Pagination } from '../../..'
import { GlobalConsumer } from '../../../../context'
import util from '../../../../util'
import Head from '../Head'
import ProductCard from '../ProductCard'
import './Product.scss'
import Quagga from 'quagga'

export default function Product({p, handleShowNotif, reloadCart}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (parseInt(p.state.level) === 0 || parseInt(p.state.id_category) === 0) {
      getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
    } else {
      getData(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_category='+p.state.id_category : p.location.search+'&id_owner='+p.state.id_owner+'&id_category='+p.state.id_category)
    }
  }, [p.location.search])

  const getData = query => {
    setIsLoading(true)
    axios.get(util.server_url+'products'+query)
    .then(res => {
      res.data.result.results !== null ? setData(res.data) : setData(null)
      setIsLoading(false)
    })
    .catch(err => console.log(err))
  }

  const submitSearch = e => {
    e.preventDefault()

    p.history.push(`kasir${e.target[0].value === '' ? '' : `?q=${e.target[0].value}`}`)
    e.target[0].value = ''
  }

  const submitBarcode = e => {
    e.preventDefault()

    const barcode = e.target[0].value.trim()

    if (barcode !== '') {
      const form = new FormData()
      form.append('id_owner', p.state.id_owner)
      form.append('id_outlet', p.state.id_outlet)
      form.append('barcode', barcode)

      axios.post(util.server_url+'cashier/scan', form)
      .then(res => {
        if (res.data.response_code === 200) {
          reloadCart()
          handleShowNotif('success', res.data.result.message)
        } else if (res.data.response_code === 204) {
          setDataDetail(res.data.result.results)
          handleShowVariant()
        } else {
          handleShowNotif('warning', res.data.result.message)
        }
      })
      .catch(err => console.log(err))
    }

    e.target[0].value = ''
    e.target[0].focus()
  }

  const addToCart = (index, variants) => {
    if (variants) {
      setDataDetail(data.result.results[index])
      handleShowVariant()
    } else {
      const form = new FormData()
      form.append('id_owner', p.state.id_owner)
      form.append('id_outlet', p.state.id_outlet)
      form.append('id_product', data.result.results[index].id_product)
      form.append('product_name', data.result.results[index].product_name)
      form.append('quantity', 1)
      form.append('selling_price', data.result.results[index].selling_price)
      form.append('capital_price', data.result.results[index].capital_price)

      // setIsLoading(true)
      axios.post(util.server_url+'cashier/add', form)
      .then(res => {
        if (res.data.response_code === 200) {
          reloadCart()
          handleShowNotif('success', res.data.result.message)
        } else {
          handleShowNotif('warning', res.data.result.message)
        }
        // setIsLoading(false)
      })
      .catch(err => console.log(err))
    }
  }

  // modal webcam scanner
  const [showWebcam, setShowWebcam] = useState(false)
  const [barcode, setBarcode] = useState(0)
  const areaScan = useRef(null)

  const handleShowWebcam = () => {
    setShowWebcam(true)
    startScan()
  }
  const handleCloseWebcam = () => {
    setShowWebcam(false)
    stopScan()
  }

  const startScan = () => {
    setTimeout(() => {
      Quagga.init({
        inputStream : {
          name : "Live",
          type : "LiveStream",
          constraints: {
            width: 540,
            // height: 80,
            // facingMode: "environment",
            // deviceId: "7832475934759384534"
          },
          target: areaScan.current    // Or '#yourElement' (optional)
        },
        decoder : {
          readers : ["ean_reader"],
          multiple: false
        }
      }, function(err) {
          if (err) {
              console.log(err);
              return
          }
          console.log("Initialization finished. Ready to start");
          Quagga.start();
      });
  
      Quagga.onDetected(d => {
        setBarcode(d.codeResult.code);
        Quagga.stop()
        areaScan.current.innerHTML = `<h2>${d.codeResult.code}</h2>`
      })
    }, 0);
  }
  
  const stopScan = () => {
    Quagga.stop()
    setBarcode(0)
  }
  
  const submitBarcodeByWebCam = e => {
    e.preventDefault()

    if (barcode !== 0) {
      const form = new FormData()
      form.append('id_owner', p.state.id_owner)
      form.append('id_outlet', p.state.id_outlet)
      form.append('barcode', barcode)

      axios.post(util.server_url+'cashier/scan', form)
      .then(res => {
        if (res.data.response_code === 200) {
          reloadCart()
          handleShowNotif('success', res.data.result.message)
          document.querySelector('.modal').querySelector('button[type=reset]').click()
        } else if (res.data.response_code === 204) {
          document.querySelector('.modal').querySelector('button[type=reset]').click()
          setDataDetail(res.data.result.results)
          handleShowVariant()
        } else {
          handleShowNotif('warning', res.data.result.message)
        }
      })
      .catch(err => console.log(err))
    }
  }

  // modal product variant
  const [dataDetail, setDataDetail] = useState(null)
  const [showVariant, setShowVariant] = useState(false)

  const handleShowVariant = () => setShowVariant(true)
  const handleCloseVariant = () => setShowVariant(false)

  const variantAddToCart = index => {
    const form = new FormData()
    form.append('id_owner', p.state.id_owner)
    form.append('id_outlet', p.state.id_outlet)
    form.append('id_product', dataDetail.variants[index].id_variant)
    form.append('product_name', dataDetail.product_name+', '+dataDetail.variants[index].variant_name)
    form.append('quantity', 1)
    form.append('selling_price', dataDetail.variants[index].selling_price)
    form.append('capital_price', dataDetail.variants[index].capital_price)

    // setIsLoading(true)
    axios.post(util.server_url+'cashier/addvariant', form)
    .then(res => {
      if (res.data.response_code === 200) {
        reloadCart()
        handleShowNotif('success', res.data.result.message)
        document.querySelector('.modal').querySelector('button[type=reset]').click()
      } else {
        handleShowNotif('warning', res.data.result.message)
      }
      // setIsLoading(false)
    })
    .catch(err => console.log(err))
  }

  return(
    <>
      <div className="product-container">
        <Head onOpenWebcam={handleShowWebcam} onSubmit={submitSearch} onScan={submitBarcode} />
        <div className="product-card-container data">
          {isLoading ? (
            <>
              <ProductCard loading />
              <ProductCard loading />
              <ProductCard loading />
              <ProductCard loading />
            </>
          ) : data === null ? <NoData title="Produk" /> : (
            data.result.results.map((d, i) => <ProductCard
                                                key={d.id_product}
                                                img={d.product_img}
                                                name={d.product_name}
                                                price={d.variants ? d.variants.length+' harga' : util.formatRupiah(d.selling_price)}
                                                onClick={() => addToCart(i, d.variants)} />)
          )}
          
        </div>
        {data !== null && data.result.total_pages > 1 && <Pagination url="kasir?" option={data} />}
      </div>

      {/* webcam scanner */}
      <Modal title="Scan Barcode" show={showWebcam} onHide={handleCloseWebcam} onSubmit={submitBarcodeByWebCam}>
        <Modal.Body>
          <div className="container-video" ref={areaScan}>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
          {barcode === 0 ? null : <button type="submit">Lanjut</button>}
        </Modal.Footer>
      </Modal>
      
      {/* modal product variant */}
      <Modal title="Detail Produk" show={showVariant} onHide={handleCloseVariant}>
        <Modal.Body>
          <Modal.Body.DetailProduct>
            <Modal.Body.DetailProduct.Head img={dataDetail && dataDetail.product_img}>
              <Modal.Body.DetailProduct.Head.ItemData name="Nama" value={dataDetail && dataDetail.product_name} />
              <Modal.Body.DetailProduct.Head.ItemData name="Barcode" value={dataDetail && dataDetail.barcode} />
              <Modal.Body.DetailProduct.Head.ItemData name="Kategori" value={dataDetail && dataDetail.id_category.category_name} />
              <Modal.Body.DetailProduct.Head.ItemData name="Harga" value={dataDetail && dataDetail.variants.length+' harga'} />
            </Modal.Body.DetailProduct.Head>
          </Modal.Body.DetailProduct>
          <Modal.Body.Variant>
            {dataDetail && dataDetail.variants.map((d, i) => <Modal.Body.Variant.Item
                                                              key={d.id_variant}
                                                              name={d.variant_name}
                                                              price={d.selling_price}
                                                              availableStock={d.available_stock}
                                                              stock={d.stock_quantity}
                                                              unit={d.id_unit === null ? '' : d.id_unit.unit_name}
                                                              onClick={() => variantAddToCart(i)} />)}
          </Modal.Body.Variant>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

