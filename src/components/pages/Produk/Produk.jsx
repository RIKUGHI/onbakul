import axios from "axios";
import { useEffect, useState } from "react";
import Util from "../../../util";

import { FormGroup, FormSearch, Loading, ManagementLayout, Modal, NoData, Notification, TripleButtons } from "../..";

import './Produk.scss';

import NoProductImage from '../../../assets/no-product-image.jpg' 
import util from "../../../util";
import { GlobalConsumer } from "../../../context";


function Produk(p) {
  const [form, setForm] = useState({
    product_img: '',
    product_name: '',
    barcode: '',
    id_category: {},
    capital_price: 0,
    selling_price: 0,
    available_stock: 0,
    id_unit: {},
    stock_quantity: 1,
    stock_min: 0,
    variants: []
  })
  const [formVariant, setFormVariant] = useState({
    variant_name: '',
    capital_price: 0,
    selling_price: 0,
    available_stock: 0,
    id_unit: {},
    stock_quantity: 1,
    stock_min: 0
  })
  const [formEdit, setFormEdit] = useState({
    id_product: 0,
    product_img: '',
    product_name: '',
    barcode: '',
    id_category: {},
    capital_price: 0,
    selling_price: 0,
    available_stock: 0,
    id_unit: {},
    stock_quantity: 1,
    stock_min: 0,
    variants: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingModal, setisLoadingModal] = useState(true)
  const [isLoadingModalEdit, setisLoadingModalEdit] = useState(true)
  const [titlePage, setTitlePage] = useState('')

  const [data, setData] = useState(null)
  const [dataDetail, setDataDetail] = useState(null)
  const [categories, setCategories] = useState(null)
  const [units, setUnits] = useState(null)

  useEffect(() => {
    if (parseInt(p.state.level) === 0 || parseInt(p.state.id_category) === 0) {
      getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
    } else {
      getData(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_category='+p.state.id_category : p.location.search+'&id_owner='+p.state.id_owner+'&id_category='+p.state.id_category)
    }
    getDataCategories('')
    getDataUnits('')
  }, [p.location.search])

  const getData = query => {
    setIsLoading(true)
    axios.get(util.server_url+'products'+query)
    .then(result => {
      result.data.result.results !== null ? setData(result.data) : setData(null)
      setTitlePage(result.data.result.key_search)
      setIsLoading(false)
    })
    .catch(err => console.log(err))
  }

  const getDataCategories = query => {
    axios.get(Util.server_url+'categories'+(query === '' ? '?id_owner='+p.state.id_owner : '?q='+query+'&id_owner='+p.state.id_owner))
    .then(res => {
      setCategories(res.data)
    })
    .catch(err => console.log(err))
  }

  const getDataUnits = query => {
    axios.get(Util.server_url+'units'+(query === '' ? '?id_owner='+p.state.id_owner : '?q='+query+'&id_owner='+p.state.id_owner))
    .then(res => {
      setUnits(res.data)
    })
    .catch(err => console.log(err))
  }

  const getDataDetail = id => {
    setisLoadingModal(true)
    axios.get(util.server_url+'products/'+id+'?id_owner='+p.state.id_owner)
    .then(r => {
      setDataDetail(r.data);
      setisLoadingModal(false)
    })
    .catch(err => {
      console.log(err)
      setisLoadingModal(false)
    })
  }

  const submitSearch = e => {
    e.preventDefault()
    p.history.push(`produk${e.target[0].value === '' ? '' : `?q=${e.target[0].value}`}`)
    // getData(`?q=${e.target[0].value}`)
    e.target[0].value = ''
  }

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value})
    if (e.target.name === 'selling_price') {
      setFormVariant({...formVariant, ['selling_price']: e.target.value})
    } else if (e.target.name === 'capital_price') {
      setFormVariant({...formVariant, ['capital_price']: e.target.value})
    }
  }
  const handleChangeVariant = e => setFormVariant({...formVariant, [e.target.name]: e.target.value})
  const handleImg = file => setForm({...form, ['product_img']: file})
  const handleImgEdit = file => setFormEdit({...formEdit, ['product_img']: file})
  
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

  // modal add product =================================================================================================================================
  const [isWarningName, setIsWarningName] = useState(false)
  const [isWarningMainSellingPrice, setIsWarningMainSellingPrice] = useState(false)
  const [isWarningMainUnit, setIsWarningMainUnit] = useState(false)

  const [show, setShow] = useState(false)
  const [isSwitch, setIsSwitch] = useState(false)
  const [isProsess, setIsProsess] = useState(false)

  const handleShow = () => setShow(true)
  const handleClose = () => {
    setShow(false)
    setForm({
      product_img: '',
      product_name: '',
      barcode: '',
      id_category: {},
      capital_price: 0,
      selling_price: 0,
      available_stock: 0,
      id_unit: {},
      stock_quantity: 0,
      stock_min: 0,
      variants: []
    })
    setIsWarningName(false)
    setIsWarningMainSellingPrice(false)
    setIsWarningMainUnit(false)
    setIsSwitch(false)
  }
  const handleChooseCategory = () => {
    handleShowCategory()
  }
  const handleChooseCategoryEdit = () => {
    handleShowCategoryEdit()
  }
  const handleChooseUnit = () => {
    handleShowUnit()
  }
  const handleChooseUnitEdit = () => {
    handleShowUnitEdit()
  }
  const handleChooseUnitVariant = () => {
    handleShowUnitVariant()
  }
  const handleSwitch = () => {
    setIsSwitch(!isSwitch)
    setForm({...form, ['available_stock']: !isSwitch ? 1 : 0})
  }
  const handleRemoveVariant = index => {
    form.variants.splice(index, 1)
    setForm({...form, ['variants']: form.variants})
  }
  const handleSubmit = e => {
    e.preventDefault()

    if (form.product_name === '') {
      setIsWarningName(true)
    } else if ((parseInt(form.selling_price) === 0 || form.selling_price === '') && form.variants.length === 0) {
      setIsWarningMainSellingPrice(true)
    } else if (((parseInt(form.capital_price) !== 0 || form.capital_price !== '') && (parseInt(form.selling_price) <= parseInt(form.capital_price))) && form.variants.length === 0) {
      handleShowNotif('warning', 'Harga jual harus lebih besar dari pada harga modal')
    } else {
      if (form.available_stock && Object.keys(form.id_unit).length === 0) {
        setIsWarningMainUnit(true)
      } else {
        const data = new FormData()
        data.append('id_owner', p.state.id_owner)
        data.append('product_img', form.product_img)
        data.append('product_name', form.product_name.trim())
        data.append('barcode', form.barcode)
        // data.append('id_category', Object.keys(form.id_category).length === 0 ? 0 : form.id_category.id_category)
        data.append('id_category', Object.keys(form.id_category).length === 0 ? p.state.id_category : form.id_category.id_category)
        data.append('capital_price', parseInt(form.capital_price))
        data.append('selling_price', parseInt(form.selling_price))
        data.append('available_stock', form.available_stock)
        data.append('id_unit', Object.keys(form.id_unit).length === 0 ? 0 : form.id_unit.id_unit)
        data.append('stock_quantity', parseInt(form.stock_quantity))
        data.append('stock_min', parseInt(form.stock_min))

        for (const variant of form.variants){
          data.append('variant_name[]', variant.variant_name)
          data.append('capital_price_v[]', variant.capital_price) 
          data.append('selling_price_v[]', variant.selling_price) 
          data.append('available_stock_v[]', variant.available_stock) 
          data.append('id_unit_v[]', Object.keys(variant.id_unit).length === 0 ? 0 : variant.id_unit.id_unit) 
          data.append('stock_quantity_v[]', variant.stock_quantity) 
          data.append('stock_min_v[]', variant.stock_min)
        }

        setIsProsess(true)
        axios.post(util.server_url+'products/create', data, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        .then(res => {
          if (res.data.response_code === 200) {
            handleShowNotif('success', res.data.result.message)
            if (parseInt(p.state.level) === 0 || parseInt(p.state.id_category) === 0) {
              getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
            } else {
              getData(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_category='+p.state.id_category : p.location.search+'&id_owner='+p.state.id_owner+'&id_category='+p.state.id_category)
            }
            document.querySelector('.modal').querySelector('button[type="reset"]').click()
          } else {
            handleShowNotif('warning', res.data.result.message)
          }

          setIsProsess(false)
        })
        .catch(err => {
          console.log(err)          
          setIsProsess(false)
        })
      }
    }
  }
  
  // modal add variant
  const [isWarningVariantName, setIsWarningVariantName] = useState(false)
  const [isWarningSellingPrice, setIsWarningSellingPrice] = useState(false)
  const [isWarningUnit, setIsWarningUnit] = useState(false)

  const [variant, setVariant] = useState(false)
  const [isSwitchVariant, setIsSwitchVariant] = useState(false)

  const handleShowVariant = () => setVariant(true)
  const handleCloseVariant = () => {
    setVariant(false)
    setIsSwitchVariant(false)

    setIsWarningVariantName(false)
    setIsWarningSellingPrice(false)
    setIsWarningUnit(false)
    
    setFormVariant({
      variant_name: '',
      capital_price: 0,
      selling_price: form.selling_price,
      available_stock: formVariant.available_stock === 0 ? 0 : !isSwitchVariant ? 1 : 0,
      id_unit: {},
      stock_quantity: 1,
      stock_min: 0
    })
  }

  const handleSwitchVariant = () => {
    setIsSwitchVariant(!isSwitchVariant)
    setFormVariant({...formVariant, ['available_stock']: !isSwitchVariant ? 1 : 0})
  }

  const handleSubmitVariant = e => {
    e.preventDefault()

    if (formVariant.variant_name === '') {
      setIsWarningVariantName(true)
    } else if (parseInt(formVariant.selling_price) === 0 || formVariant.selling_price === '') {
      setIsWarningSellingPrice(true)
    } else if ((parseInt(formVariant.capital_price) !== 0 || formVariant.capital_price !== '') && (parseInt(formVariant.selling_price) <= parseInt(formVariant.capital_price))) {
      handleShowNotif('warning', 'Harga jual harus lebih besar dari pada harga modal')
    } else {
      if (formVariant.available_stock && Object.keys(formVariant.id_unit).length === 0) {
        setIsWarningUnit(true)
      } else {
        setForm({...form, ['variants']: form.variants.concat(formVariant)})

        setIsWarningVariantName(false)
        setIsWarningSellingPrice(false)
        setIsWarningUnit(false)

        document.querySelectorAll('.modal')[1].querySelector('button[type="reset"]').click()
      }
    }
  }

  // modal detail product
  const [showDetail, setShowDetail] = useState(false)

  const handleShowDetail = e => {
    setShowDetail(true)
    getDataDetail(e)
  }
  const handleCloseDetail = () => setShowDetail(false)

  // modal edit product ===================================================================================================================================
  const [isWarningNameEdit, setIsWarningNameEdit] = useState(false)
  const [isWarningMainSellingPriceEdit, setIsWarningMainSellingPriceEdit] = useState(false)
  const [isWarningMainUnitEdit, setIsWarningMainUnitEdit] = useState(false)
  const [removeVariantMain, setRemoveVariantMain] = useState([])

  const [showEdit, setShowEdit] = useState(false)
  const [variantsOnEdit, setVariantsOnEdit] = useState([])

  const handleShowEdit = id => {
    setShowEdit(true)

    setisLoadingModalEdit(true)
    axios.get(util.server_url+'products/'+id+'?id_owner='+p.state.id_owner)
    .then(r => {
      setFormEdit(r.data.result);
      setisLoadingModalEdit(false)
    })
    .catch(err => {
      console.log(err)
      setisLoadingModalEdit(false)
    })
  }
  const handleCloseEdit = () => {
    setShowEdit(false)
    setIsWarningNameEdit(false)
    setIsWarningMainSellingPriceEdit(false)
    setIsWarningMainUnitEdit(false)
    setVariantsOnEdit([])
    setFormVariant({
      variant_name: '',
      capital_price: parseInt(formEdit.capital_price),
      selling_price: parseInt(formEdit.selling_price),
      available_stock: 0,
      id_unit: {},
      stock_quantity: 1,
      stock_min: 0
    })
  }
  const handleSwitchEdit = () => {
    setFormEdit({...formEdit, ['available_stock']: !formEdit.available_stock})
  } 
  const handleEditVariantMain = index => {
    setVariantSelected(formEdit.variants[index])
    setIndexVariantSelected(index)
    handleShowVariantEdit()
  }
  const handleRemoveVariantMain = index => {
    setRemoveVariantMain(removeVariantMain.concat(formEdit.variants.splice(index, 1)))
    setFormEdit({...formEdit, ['variants']: formEdit.variants})
  }
  const handleRemoveVariantMainAdd = index => {
    // console.log(variantsOnEdit.splice(index, 1));
    variantsOnEdit.splice(index, 1)
    setVariantsOnEdit([...variantsOnEdit])
  }
  const handleChangeEdit = e => {
    setFormEdit({...formEdit, [e.target.name]: e.target.value})
    // if (e.target.name === 'selling_price') {
    //   setFormVariant({...formVariant, ['selling_price']: e.target.value})
    // } else if (e.target.name === 'capital_price') {
    //   setFormVariant({...formVariant, ['capital_price']: e.target.value})
    // }
  }
  const handleSubmitEdit = e => {
    e.preventDefault()

    if (formEdit.product_name === '') {
      setIsWarningNameEdit(true)
    } else if ((parseInt(formEdit.selling_price) === 0 || formEdit.selling_price === '') && ((formEdit.variants === null || formEdit.variants.length === 0) && variantsOnEdit.length === 0)) {
      setIsWarningMainSellingPriceEdit(true)
    } else if (((parseInt(formEdit.capital_price) !== 0 || formEdit.capital_price !== '') && (parseInt(formEdit.selling_price) <= parseInt(formEdit.capital_price))) && ((formEdit.variants === null || formEdit.variants.length === 0) && variantsOnEdit.length === 0)) {
      handleShowNotif('warning', 'Harga jual harus lebih besar dari pada harga modal')
    } else {
      if (formEdit.available_stock && formEdit.id_unit === null) {
        setIsWarningMainUnitEdit(true)
      } else {
        const data = new FormData()
        data.append('id_owner', p.state.id_owner)
        data.append('product_img', formEdit.product_img)
        data.append('product_name', formEdit.product_name.trim())
        data.append('barcode', formEdit.barcode)
        data.append('id_category', formEdit.id_category.id_category)
        data.append('capital_price', parseInt(formEdit.capital_price))
        data.append('selling_price', parseInt(formEdit.selling_price))
        data.append('available_stock', formEdit.available_stock ? 1 : 0)
        data.append('id_unit', formEdit.id_unit === null ? 0 : formEdit.id_unit.id_unit)
        data.append('stock_quantity', parseInt(formEdit.stock_quantity))
        data.append('stock_min', parseInt(formEdit.stock_min))

        // create a new variant
        if (variantsOnEdit.length !== 0) {
          for (const variant of variantsOnEdit){
            data.append('variant_name[]', variant.variant_name)
            data.append('capital_price_n[]', parseInt(variant.capital_price)) 
            data.append('selling_price_n[]', parseInt(variant.selling_price)) 
            data.append('available_stock_n[]', variant.available_stock) 
            data.append('id_unit_n[]', Object.keys(variant.id_unit).length === 0 ? 0 : variant.id_unit.id_unit) 
            data.append('stock_quantity_n[]', parseInt(variant.stock_quantity)) 
            data.append('stock_min_n[]', parseInt(variant.stock_min))
          }
        }

        // edit main variant
        if (formEdit.variants !== null) {
          for (const variant of formEdit.variants){
            data.append('id_variant_e[]', variant.id_variant)
            data.append('variant_name_e[]', variant.variant_name)
            data.append('capital_price_e[]', parseInt(variant.capital_price)) 
            data.append('selling_price_e[]', parseInt(variant.selling_price)) 
            data.append('available_stock_e[]', variant.available_stock ? 1 : 0) 
            data.append('id_unit_e[]', variant.id_unit === null || Object.keys(variant.id_unit).length === 0 ? 0 : variant.id_unit.id_unit) 
            data.append('stock_quantity_e[]', parseInt(variant.stock_quantity)) 
            data.append('stock_min_e[]', parseInt(variant.stock_min))
          }
        }

        // remove main variant
        if (removeVariantMain.length !== 0) {
          for (const variant of removeVariantMain) {
            data.append('id_variant_d[]', variant.id_variant)
          }
        }

        setIsProsess(true)
        axios.post(util.server_url+'products/edit/'+formEdit.id_product, data, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        .then(res => {
          if (res.data.response_code === 200) {
            handleShowNotif('success', res.data.result.message)
            if (parseInt(p.state.level) === 0 || parseInt(p.state.id_category) === 0) {
              getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
            } else {
              getData(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_category='+p.state.id_category : p.location.search+'&id_owner='+p.state.id_owner+'&id_category='+p.state.id_category)
            }
            document.querySelector('.modal').querySelector('button[type="reset"]').click()
          } else {
            handleShowNotif('warning', res.data.result.message)
          }

          setIsProsess(false)
        })
        .catch(err => {
          console.log(err)          
          setIsProsess(false)
        })
      }
    }
  }

  // modal add variant on edit
  const [isWarningVariantNameAdd, setIsWarningVariantNameAdd] = useState(false)
  const [isWarningSellingPriceAdd, setIsWarningSellingPriceAdd] = useState(false)
  const [isWarningUnitAdd, setIsWarningUnitAdd] = useState(false)

  const [variantAdd, setVariantAdd] = useState(false)
  const [isSwitchVariantAdd, setIsSwitchVariantAdd] = useState(false)

  const handleShowVariantAdd = () => {
    setVariantAdd(true)
    setFormVariant({
      variant_name: '',
      capital_price: parseInt(formEdit.capital_price),
      selling_price: parseInt(formEdit.selling_price),
      available_stock: 0,
      id_unit: {},
      stock_quantity: 1,
      stock_min: 0
    })
  }
  const handleCloseVariantAdd = () => {
    setVariantAdd(false)
    setIsSwitchVariantAdd(false)

    setIsWarningVariantNameAdd(false)
    setIsWarningSellingPriceAdd(false)
    setIsWarningUnitAdd(false)
    
    setFormVariant({
      variant_name: '',
      capital_price: 0,
      selling_price: 0,
      available_stock: 0,
      id_unit: {},
      stock_quantity: 1,
      stock_min: 0
    })
  }

  const handleSwitchVariantAdd = () => {
    setIsSwitchVariantAdd(!isSwitchVariantAdd)
    setFormVariant({...formVariant, ['available_stock']: !isSwitchVariantAdd ? 1 : 0})
  }

  const handleSubmitVariantAdd = e => {
    e.preventDefault()

    if (formVariant.variant_name === '') {
      setIsWarningVariantNameAdd(true)
    } else if (parseInt(formVariant.selling_price) === 0 || formVariant.selling_price === '') {
      setIsWarningSellingPriceAdd(true)
    } else if ((parseInt(formVariant.capital_price) !== 0 || formVariant.capital_price !== '') && (parseInt(formVariant.selling_price) <= parseInt(formVariant.capital_price))) {
      handleShowNotif('warning', 'Harga jual harus lebih besar dari pada harga modal')
    } else {
      if (formVariant.available_stock && Object.keys(formVariant.id_unit).length === 0) {
        setIsWarningUnitAdd(true)
      } else {
        setVariantsOnEdit(variantsOnEdit.concat(formVariant))
        document.querySelectorAll('.modal')[1].querySelector('button[type="reset"]').click()
      }
    }
  }

  // modal edit variant
  const [isWarningVariantNameEdit, setIsWarningVariantNameEdit] = useState(false)
  const [isWarningSellingPriceEdit, setIsWarningSellingPriceEdit] = useState(false)
  const [isWarningUnitEdit, setIsWarningUnitEdit] = useState(false)

  const [variantEdit, setVariantEdit] = useState(false)
  const [variantSelected, setVariantSelected] = useState({})
  const [indexVariantSelected, setIndexVariantSelected] = useState(null)

  const handleChangeVariantEdit = e => setVariantSelected({...variantSelected, [e.target.name]: e.target.value})
  const handleShowVariantEdit = () => setVariantEdit(true)
  const handleCloseVariantEdit = () => {
    setVariantEdit(false)

    setIsWarningVariantNameEdit(false)
    setIsWarningSellingPriceEdit(false)
    setIsWarningUnitEdit(false)
  }

  const handleSwitchVariantEdit = () => {
    setVariantSelected({...variantSelected, ['available_stock']: !variantSelected.available_stock})
  }

  const handleSubmitVariantEdit = e => {
    e.preventDefault()

    if (variantSelected.variant_name === '') {
      setIsWarningVariantNameEdit(true)
    } else if (parseInt(variantSelected.selling_price) === 0 || variantSelected.selling_price === '') {
      setIsWarningSellingPriceEdit(true)
    } else if ((parseInt(variantSelected.capital_price) !== 0 || variantSelected.capital_price !== '') && (parseInt(variantSelected.selling_price) <= parseInt(variantSelected.capital_price))) {
      handleShowNotif('warning', 'Harga jual harus lebih besar dari pada harga modal')
    } else {
      if (variantSelected.available_stock && (variantSelected.id_unit === null || Object.keys(variantSelected.id_unit).length === 0)) {
        setIsWarningUnitEdit(true)
      } else {
        const copyVariants = [...formEdit.variants]
        copyVariants[indexVariantSelected] = variantSelected
        setFormEdit({...formEdit, ['variants']: copyVariants})
        document.querySelectorAll('.modal')[1].querySelector('button[type="reset"]').click()
      }
    }
  }
  
  // modal delete product
  const [showDelete, setShowDelete] = useState(false)
  const [showDeleteName, setShowDeleteName] = useState('')
  const [deleteId, setDeleteId] = useState('')

  const handleShowDelete = (id, name) => {
    setShowDelete(true)
    setDeleteId(id)
    setShowDeleteName(name)
  }
  const handleCloseDelete = () => setShowDelete(false)
  const handleSubmitDelete = () => {
    setIsProsess(true)
    axios.delete(util.server_url+'products/delete/'+deleteId+'?id_owner='+p.state.id_owner)
    .then(res => {
      if (res.data.response_code === 200) {
        handleShowNotif('success', res.data.result.message)
        if (parseInt(p.state.level) === 0 || parseInt(p.state.id_category) === 0) {
          getData(p.location.search === '' ? '?id_owner='+p.state.id_owner : p.location.search+'&id_owner='+p.state.id_owner)
        } else {
          getData(p.location.search === '' ? '?id_owner='+p.state.id_owner+'&id_category='+p.state.id_category : p.location.search+'&id_owner='+p.state.id_owner+'&id_category='+p.state.id_category)
        }
        document.querySelector('.modal').querySelector('button[type="reset"]').click()
      } else {
        handleShowNotif('warning', res.data.result.message)
      }

      setIsProsess(false)
    }).catch(err => {
      console.log(err)
      setIsProsess(false)
    })
  }

  // modal category
  const [showCategory, setShowCategory] = useState(false)
  const [newCategory, setNewCategory] = useState(false)
  const [inputCategory, setInputCategory] = useState('')

  const handleShowCategory = () => setShowCategory(true)
  const handleCloseCategory = () => {
    setShowCategory(false)
    setNewCategory(false)
    getDataCategories('')
  }
  const handleNewCategory = () => {
    setNewCategory(true)
  }
  const handleSubmitCategory = () => {
    if (inputCategory === '') {
      handleShowNotif('warning', 'Kategori tidak boleh kosong')
    } else if (inputCategory.toLowerCase() === 'umum'){
      handleShowNotif('warning', 'Kategori umum sudah tersedia')
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('category_name', inputCategory.trim())

      axios.post(util.server_url+'categories/create', data)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getDataCategories('')
          setNewCategory(false)
        } else {
          handleShowNotif('warning', res.data.result.message)
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
  const [timerLiveSearch, setTimerLiveSearch] = useState(null)
  const liveSearchCategory = e => {
    if ('umum'.indexOf(e.target.value.toLowerCase().trim()) > -1) {
      window.clearTimeout(timerLiveSearch)
      setTimerLiveSearch(setTimeout(() => {
        getDataCategories('')
      }, 400))
    } else {
      window.clearTimeout(timerLiveSearch)
      setTimerLiveSearch(setTimeout(() => {
        getDataCategories(e.target.value.trim())
      }, 400))
    }
  }
  const handleSelectedCategory = index => {
    setForm({...form, ['id_category']: categories.result.results[index]})
    document.querySelectorAll('.modal')[1].querySelector('.fa-times').click()
  }
  const defaultForm = e => {
    e.preventDefault()
  }

  // modal edit category
  const [showCategoryEdit, setShowCategoryEdit] = useState(false)
  const [newCategoryEdit, setNewCategoryEdit] = useState(false)
  const [inputCategoryEdit, setInputCategoryEdit] = useState('')

  const handleShowCategoryEdit = () => setShowCategoryEdit(true)
  const handleCloseCategoryEdit = () => {
    setShowCategoryEdit(false)
    setNewCategoryEdit(false)
    getDataCategories('')
  }
  const handleNewCategoryEdit = () => {
    setNewCategoryEdit(true)
  }
  const handleSubmitCategoryEdit = () => {
    if (inputCategoryEdit === '') {
      handleShowNotif('warning', 'Kategori tidak boleh kosong')
    } else if (inputCategoryEdit.toLowerCase() === 'umum'){
      handleShowNotif('warning', 'Kategori umum sudah tersedia')
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('category_name', inputCategoryEdit.trim())

      axios.post(util.server_url+'categories/create', data)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getDataCategories('')
          setNewCategoryEdit(false)
        } else {
          handleShowNotif('warning', res.data.result.message)
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
  const handleSelectedCategoryEdit = index => {
    setFormEdit({...formEdit, ['id_category']: categories.result.results[index]})
    document.querySelectorAll('.modal')[1].querySelector('.fa-times').click()
  }

  // modal unit
  const [showUnit, setShowUnit] = useState(false)
  const [newUnit, setNewUnit] = useState(false)
  const [inputUnit, setInputUnit] = useState('')

  const handleShowUnit = () => setShowUnit(true)
  const handleCloseUnit = () => {
    setShowUnit(false)
    setNewUnit(false)
    getDataUnits('')
  }
  const handleNewUnit = () => {
    setNewUnit(true)
  }
  const handleSubmitUnit= () => {
    if (inputUnit === '') {
      handleShowNotif('warning', 'Satuan tidak boleh kosong')
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('unit_name', inputUnit.trim())

      axios.post(util.server_url+'units/create', data)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getDataUnits('')
          setNewUnit(false)
        } else {
          handleShowNotif('warning', res.data.result.message)
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
  const handleSelectedUnit = index => {
    setForm({...form, ['id_unit']: units.result.results[index]})
    document.querySelectorAll('.modal')[1].querySelector('.fa-times').click()
  }
  const liveSearchUnit = e => {
    window.clearTimeout(timerLiveSearch)
    setTimerLiveSearch(setTimeout(() => {
      getDataUnits(e.target.value.trim())
    }, 400))
  }

  // modal unit edit
  const [showUnitEdit, setShowUnitEdit] = useState(false)
  const [newUnitEdit, setNewUnitEdit] = useState(false)
  const [inputUnitEdit, setInputUnitEdit] = useState('')

  const handleShowUnitEdit = () => setShowUnitEdit(true)
  const handleCloseUnitEdit = () => {
    setShowUnitEdit(false)
    setNewUnitEdit(false)
    getDataUnits('')
  }
  const handleNewUnitEdit = () => {
    setNewUnitEdit(true)
  }
  const handleSubmitUnitEdit = () => {
    if (inputUnitEdit === '') {
      handleShowNotif('warning', 'Satuan tidak boleh kosong')
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('unit_name', inputUnitEdit.trim())

      axios.post(util.server_url+'units/create', data)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getDataUnits('')
          setNewUnitEdit(false)
        } else {
          handleShowNotif('warning', res.data.result.message)
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
  const handleSelectedUnitEdit = index => {
    setFormEdit({...formEdit, ['id_unit']: units.result.results[index]})
    document.querySelectorAll('.modal')[1].querySelector('.fa-times').click()
  }

  // modal unit variant
  const [showUnitVariant, setShowUnitVariant] = useState(false)
  const [newUnitVariant, setNewUnitVariant] = useState(false)
  const [inputUnitVariant, setInputUnitVariant] = useState('')

  const handleShowUnitVariant = () => setShowUnitVariant(true)
  const handleCloseUnitVariant = () => {
    setShowUnitVariant(false)
    setNewUnitVariant(false)
    getDataUnits('')
  }
  const handleNewUnitVariant = () => {
    setNewUnitVariant(true)
  }
  const handleSubmitUnitVariant= () => {
    if (inputUnitVariant === '') {
      handleShowNotif('warning', 'Satuan tidak boleh kosong')
    } else {
      const data = new FormData()
      data.append('id_owner', p.state.id_owner)
      data.append('unit_name', inputUnitVariant.trim())

      axios.post(util.server_url+'units/create', data)
      .then(res => {
        if (res.data.response_code === 200) {
          handleShowNotif('success', res.data.result.message)
          getDataUnits('')
          setNewUnitVariant(false)
        } else {
          handleShowNotif('warning', res.data.result.message)
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

  const handleSelectedUnitVariant = index => {
    setFormVariant({...formVariant, ['id_unit']: units.result.results[index]})
    setVariantSelected({...variantSelected, ['id_unit']: units.result.results[index]})
    document.querySelectorAll('.modal')[2].querySelector('.fa-times').click()
  }

  return(
    <>
      <ManagementLayout 
        title="Produk"
        titlePage={`Daftar ${titlePage === 'Semua' ? 'Produk' : `Pencarian Untuk "${titlePage}"`}`} 
        placeholder="produk/barcode"
        onSubmit={submitSearch} 
        pageUrl="produk?"
        pageOption={data}
        onShowModal={handleShow}
        readOnly={p.state.products_ro}>
        {
          isLoading ? <Loading /> : data === null ? <NoData title="Produk" /> : (
            <table border="0" className="product-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Satuan</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.result.results.map(d =>
                  <ItemData 
                    key={d.id_product}
                    id={d.id_product}
                    img={d.product_img}
                    name={d.product_name}
                    price={d.variants === null ? util.formatRupiah(d.selling_price) : d.variants.length+' Harga'}
                    unit={d.available_stock ? (d.id_unit === null ? '' : d.id_unit.unit_name) : ''}
                    stock={d.stock_quantity}
                    readOnly={p.state.products_ro}
                    handleShowDetail={handleShowDetail}
                    handleShowEdit={handleShowEdit}
                    handleShowDelete={handleShowDelete} />
                )}
              </tbody>
            </table>
          ) 
        }
      </ManagementLayout>

      {/* notification */}
      <Notification 
        show={notification} 
        status={statusNotif} 
        message={statusMessage}
        onHide={handleCloseNotif} />

      {/* modal add product */}
      <Modal title="Tambah Produk" show={show} onHide={handleClose} onSubmit={handleSubmit}>
        <Modal.Body>
          <FormGroup.WithImg
            setNotif={handleShowNotif}
            handleImg={handleImg}
            edit={false} />
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Nama"
              name="product_name"
              warning={isWarningName}
              onChange={handleChange} />
            <FormGroup.WithoutWarning 
              title="barcode"
              name="barcode"
              onChange={handleChange} />
          </Modal.Body.DataGroup>
          <FormGroup.WithoutWarning 
            title="Kategori"
            name="id_category"
            defaultValue={form.id_category.category_name}
            onChange={handleChange}
            onClick={handleChooseCategory}
            disable />
            {form.variants.length === 0 ? (
              <Modal.Body.DataGroup>
              <FormGroup 
                title="Harga Jual"
                name="selling_price"
                warning={isWarningMainSellingPrice}
                onChange={handleChange} />
              <FormGroup.WithoutWarning 
                title="Harga Modal"
                name="capital_price"
                onChange={handleChange} />
            </Modal.Body.DataGroup>
            ) : null}
          <Modal.Body.DataSwitch 
            show={isSwitch} 
            id="main"
            onClick={handleSwitch}>
            <FormGroup 
              title="Satuan"
              name="id_unit"
              defaultValue={form.id_unit.unit_name}
              warning={isWarningMainUnit}
              onChange={handleChange}
              onClick={handleChooseUnit}
              disable />
            <Modal.Body.DataGroup>
              <FormGroup.WithoutWarning 
                title="Jumlah Stok"
                name="stock_quantity"
                onChange={handleChange} />
              <FormGroup.WithoutWarning 
                title="Stok Min"
                name="stock_min"
                onChange={handleChange} />
            </Modal.Body.DataGroup>
          </Modal.Body.DataSwitch>
          {form.variants.length === 0 ? null : 
            <Modal.Body.TableVariant>
              {form.variants.map((d, i) => <Modal.Body.TableVariant.Item 
                                              key={i} 
                                              index={i}
                                              variantName={d.variant_name}
                                              sellingPrice={d.selling_price}
                                              capitalPrice={d.capital_price}
                                              availableStock={d.available_stock }
                                              idUnit={d.id_unit.unit_name}
                                              stockQuantity={d.stock_quantity}
                                              stockMin={d.stock_min}
                                              edit={false}
                                              onClick={handleRemoveVariant} />)}
            </Modal.Body.TableVariant>}
          <button type="button" className="btn-variant" onClick={handleShowVariant}>Tambah Variasi</button>
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit" className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Simpan'}</button>
        </Modal.Footer>
      </Modal>

      {/* modal add variant */}
      <Modal title="Tambah Variasi" show={variant} onHide={handleCloseVariant} onSubmit={handleSubmitVariant}>
        <Modal.Body>
          <FormGroup 
            title="Nama Variasi"
            name="variant_name"
            warning={isWarningVariantName}
            onChange={handleChangeVariant} />
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Harga Jual"
              name="selling_price"
              defaultValue={parseInt(form.selling_price) === 0 ? '' : form.selling_price }
              warning={isWarningSellingPrice}
              onChange={handleChangeVariant} />
            <FormGroup.WithoutWarning 
              title="Harga Modal"
              name="capital_price"
              defaultValue={parseInt(form.capital_price) === 0 ? '' : form.capital_price }
              onChange={handleChangeVariant} />
          </Modal.Body.DataGroup>
          <Modal.Body.DataSwitch 
            show={isSwitchVariant} 
            id="variant"
            onClick={handleSwitchVariant}>
            <FormGroup 
              title="Satuan"
              name="id_unit"
              warning={isWarningUnit}
              defaultValue={formVariant.id_unit.unit_name}
              onChange={handleChangeVariant}
              onClick={handleChooseUnitVariant}
              disable />
            <Modal.Body.DataGroup>
              <FormGroup.WithoutWarning 
                title="Jumlah Stok"
                name="stock_quantity"
                onChange={handleChangeVariant} />
              <FormGroup.WithoutWarning 
                title="Stok Min"
                name="stock_min"
                onChange={handleChangeVariant} />
            </Modal.Body.DataGroup>
          </Modal.Body.DataSwitch>
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit">Simpan</button>
        </Modal.Footer>
      </Modal>

      {/* modal detail product */}
      <Modal title="Detail Produk" show={showDetail} onHide={handleCloseDetail}>
        {
          isLoadingModal ? <Loading /> : (
            <>
              <Modal.Body>
                <Modal.Body.DetailProduct>
                  <Modal.Body.DetailProduct.Head img={dataDetail.result.product_img}>
                    <Modal.Body.DetailProduct.Head.ItemData name="Nama" value={dataDetail.result.product_name} />
                    <Modal.Body.DetailProduct.Head.ItemData name="Barcode" value={dataDetail.result.barcode === '' ? '-' : dataDetail.result.barcode} />
                    <Modal.Body.DetailProduct.Head.ItemData name="Kategori" value={dataDetail.result.id_category.category_name} />
                    {dataDetail.result.variants ? 
                      <Modal.Body.DetailProduct.Head.ItemData name="Harga" value={dataDetail.result.variants.length+' Harga'} />
                      : (
                      <>
                        <Modal.Body.DetailProduct.Head.ItemData name="Harga Jual" value={util.formatRupiah(dataDetail.result.selling_price)} />
                        <Modal.Body.DetailProduct.Head.ItemData name="Harga Modal" value={util.formatRupiah(dataDetail.result.capital_price)} />
                      </>
                    )}
                  </Modal.Body.DetailProduct.Head>
                  {dataDetail.result.available_stock && !dataDetail.result.variants && <Modal.Body.DetailProduct.Unit 
                                                          unit={dataDetail.result.id_unit === null ? '-' : dataDetail.result.id_unit.unit_name}
                                                          stock={dataDetail.result.stock_quantity} 
                                                          stockMin={dataDetail.result.stock_min} />}
                </Modal.Body.DetailProduct>
                {dataDetail.result.variants && (
                  <Modal.Body.TableVariant>
                    {dataDetail.result.variants.map(d => <Modal.Body.TableVariant.Item 
                                                            key={d.id_variant} 
                                                            variantName={d.variant_name}
                                                            sellingPrice={d.selling_price}
                                                            capitalPrice={d.capital_price}
                                                            availableStock={d.available_stock}
                                                            idUnit={d.id_unit === null ? '' : d.id_unit.unit_name}
                                                            stockQuantity={d.stock_quantity}
                                                            stockMin={d.stock_min} />)}
                  </Modal.Body.TableVariant>
                )}
              </Modal.Body>
              <Modal.Footer>
                <button type="reset">Batal</button>
              </Modal.Footer>
            </>
          )
        }
        
      </Modal>

      {/* modal edit product */}
      <Modal title="Edit Produk" show={showEdit} onHide={handleCloseEdit} onSubmit={handleSubmitEdit}>
        {
          isLoadingModalEdit ? <Loading /> : (
            <>
              <Modal.Body>
                <FormGroup.WithImg 
                  imgSrc={formEdit.product_img}
                  setNotif={handleShowNotif}
                  handleImg={handleImgEdit}
                  edit={true} />
                <Modal.Body.DataGroup>
                  <FormGroup 
                      title="Nama"
                      name="product_name"
                      defaultValue={formEdit.product_name}
                      warning={isWarningNameEdit}
                      onChange={handleChangeEdit} />
                  <FormGroup.WithoutWarning 
                    title="barcode"
                    name="barcode"
                    defaultValue={formEdit.barcode}
                    onChange={handleChangeEdit} />
                </Modal.Body.DataGroup>
                <FormGroup.WithoutWarning.HasValue 
                  title="Kategori"
                  name="id_category"
                  defaultValue={formEdit.id_category.category_name}
                  onClick={handleChooseCategoryEdit}
                  onChange={handleChangeEdit}
                  disable />
                {(formEdit.variants === null || formEdit.variants.length === 0) && variantsOnEdit.length === 0 ? (
                  <Modal.Body.DataGroup>
                  <FormGroup 
                    title="Harga Jual"
                    name="selling_price"
                    defaultValue={formEdit.selling_price}
                    warning={isWarningMainSellingPriceEdit}
                    onChange={handleChangeEdit} />
                  <FormGroup.WithoutWarning 
                    title="Harga Modal"
                    name="capital_price"
                    defaultValue={formEdit.capital_price}
                    onChange={handleChangeEdit} />
                </Modal.Body.DataGroup>
                ) : null}
                <Modal.Body.DataSwitch.HasValue 
                  show={formEdit.available_stock} 
                  id="main"
                  onClick={handleSwitchEdit}>
                  <FormGroup.HasValue 
                    title="Satuan"
                    name="id_unit"
                    defaultValue={formEdit.id_unit === null ? '' : formEdit.id_unit.unit_name}
                    warning={isWarningMainUnitEdit}
                    onChange={handleChangeEdit}
                    onClick={handleChooseUnitEdit}
                    disable />
                  <Modal.Body.DataGroup>
                    <FormGroup.WithoutWarning 
                      title="Jumlah Stok"
                      name="stock_quantity"
                      defaultValue={formEdit.stock_quantity}
                      onChange={handleChangeEdit} />
                    <FormGroup.WithoutWarning 
                      title="Stok Min"
                      name="stock_min"
                      defaultValue={formEdit.stock_min}
                      onChange={handleChangeEdit} />
                  </Modal.Body.DataGroup>
                </Modal.Body.DataSwitch.HasValue>
                {(formEdit.variants === null || formEdit.variants.length === 0) && variantsOnEdit.length === 0 ? null : 
                  <Modal.Body.TableVariant>
                    {formEdit.variants && formEdit.variants.map((d, i) => <Modal.Body.TableVariant.Item 
                                                    key={i} 
                                                    index={i}
                                                    variantName={d.variant_name}
                                                    sellingPrice={d.selling_price}
                                                    capitalPrice={d.capital_price}
                                                    availableStock={d.available_stock}
                                                    idUnit={d.id_unit === null ? '' : d.id_unit.unit_name}
                                                    stockQuantity={d.stock_quantity}
                                                    stockMin={d.stock_min}
                                                    edit={true}
                                                    onEdit={handleEditVariantMain}
                                                    onClick={handleRemoveVariantMain} />)}
                      {variantsOnEdit.map((v, i) => <Modal.Body.TableVariant.Item
                                                    key={i}
                                                    index={i}
                                                    variantName={v.variant_name}
                                                    sellingPrice={v.selling_price}
                                                    capitalPrice={v.capital_price}
                                                    availableStock={v.available_stock}
                                                    idUnit={v.id_unit.unit_name}
                                                    stockQuantity={v.stock_quantity}
                                                    stockMin={v.stock_min}
                                                    edit={false}
                                                    onClick={handleRemoveVariantMainAdd} />)}
                  </Modal.Body.TableVariant>}
                {/* {variantsOnEdit.length === 0 ? null : (
                  <Modal.Body.TableVariant newV>
                    {variantsOnEdit.map((v, i) => <Modal.Body.TableVariant.Item
                                                    key={i}
                                                    index={i}
                                                    variantName={v.variant_name}
                                                    sellingPrice={v.selling_price}
                                                    capitalPrice={v.capital_price}
                                                    availableStock={v.available_stock}
                                                    idUnit={v.id_unit.unit_name}
                                                    stockQuantity={v.stock_quantity}
                                                    stockMin={v.stock_min}
                                                    edit={false}
                                                    onClick={handleRemoveVariantMainAdd} />)}
                  </Modal.Body.TableVariant>
                )} */}
                <button type="button" className="btn-variant" onClick={handleShowVariantAdd}>Tambah Variasi</button>
              </Modal.Body>

              <Modal.Footer>
                <button type="reset">Batal</button>
                <button type="submit">Simpan</button>
              </Modal.Footer>
            </>
          ) 
        }
      </Modal>

      {/* modal add variant on edit */}
      <Modal title="Tambah Variasi edit" show={variantAdd} onHide={handleCloseVariantAdd} onSubmit={handleSubmitVariantAdd}>
        <Modal.Body>
          <FormGroup 
            title="Nama Variasi"
            name="variant_name"
            warning={isWarningVariantNameAdd}
            onChange={handleChangeVariant} />
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Harga Jual"
              name="selling_price"
              defaultValue={formVariant.selling_price}
              warning={isWarningSellingPriceAdd}
              onChange={handleChangeVariant} />
            <FormGroup.WithoutWarning 
              title="Harga Modal"
              name="capital_price"
              defaultValue={formVariant.capital_price}
              onChange={handleChangeVariant} />
          </Modal.Body.DataGroup>
          <Modal.Body.DataSwitch 
            show={isSwitchVariantAdd} 
            id="variant"
            onClick={handleSwitchVariantAdd}>
            <FormGroup 
              title="Satuan"
              name="id_unit"
              warning={isWarningUnitAdd}
              defaultValue={formVariant.id_unit.unit_name}
              onChange={handleChangeVariant}
              onClick={handleChooseUnitVariant}
              disable />
            <Modal.Body.DataGroup>
              <FormGroup.WithoutWarning 
                title="Jumlah Stok"
                name="stock_quantity"
                onChange={handleChangeVariant} />
              <FormGroup.WithoutWarning 
                title="Stok Min"
                name="stock_min"
                onChange={handleChangeVariant} />
            </Modal.Body.DataGroup>
          </Modal.Body.DataSwitch>
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit">Simpan</button>
        </Modal.Footer>
      </Modal>

      {/* modal edit variant */}
      <Modal title="Edit Variasi" show={variantEdit} onHide={handleCloseVariantEdit} onSubmit={handleSubmitVariantEdit}>
        <Modal.Body>
          <FormGroup 
            title="Nama Variasi"
            name="variant_name"
            defaultValue={variantSelected.variant_name}
            warning={isWarningVariantNameEdit}
            onChange={handleChangeVariantEdit} />
          <Modal.Body.DataGroup>
            <FormGroup 
              title="Harga Jual"
              name="selling_price"
              defaultValue={variantSelected.selling_price}
              warning={isWarningSellingPriceEdit}
              onChange={handleChangeVariantEdit} />
            <FormGroup.WithoutWarning 
              title="Harga Modal"
              name="capital_price"
              defaultValue={variantSelected.capital_price}
              onChange={handleChangeVariantEdit} />
          </Modal.Body.DataGroup>
          <Modal.Body.DataSwitch.HasValue
            show={variantSelected.available_stock} 
            id="variant"
            onClick={handleSwitchVariantEdit}>
            <FormGroup.HasValue
              title="Satuan"
              name="id_unit"
              warning={isWarningUnitEdit}
              defaultValue={variantSelected.id_unit === null || variantSelected.id_unit === undefined ? '' : variantSelected.id_unit.unit_name}
              onChange={handleChangeVariantEdit}
              onClick={handleChooseUnitVariant}
              disable />
            <Modal.Body.DataGroup>
              <FormGroup.WithoutWarning 
                title="Jumlah Stok"
                name="stock_quantity"
                defaultValue={variantSelected.stock_quantity}
                onChange={handleChangeVariantEdit} />
              <FormGroup.WithoutWarning 
                title="Stok Min"
                name="stock_min"
                defaultValue={variantSelected.stock_min}
                onChange={handleChangeVariantEdit} />
            </Modal.Body.DataGroup>
          </Modal.Body.DataSwitch.HasValue>
        </Modal.Body>

        <Modal.Footer>
          <button type="reset">Batal</button>
          <button type="submit">Simpan</button>
        </Modal.Footer>
      </Modal>

      {/* modal delete product */}
      <Modal.Center show={showDelete} onHide={handleCloseDelete}>
        <img src="assets/images/delete.svg" alt="" />
        <Modal.Center.TitleDelete title={showDeleteName} />

        <Modal.Center.Footer>
          <button type="reset">Batal</button>
          <button onClick={handleSubmitDelete} className={isProsess ? 'disable' : ''}>{isProsess ? 'Proses' : 'Iya'}</button>
        </Modal.Center.Footer>
      </Modal.Center>

      {/* modal category */}
      <Modal title="Kategori" show={showCategory} onHide={handleCloseCategory} onSubmit={defaultForm}>
        <Modal.Body>
          <Modal.Body.Act name="Tambah" icon="fas fa-plus" add={true} onClick={handleNewCategory}>
            <div className="search-box">  
              <input type="text" placeholder="Cari" onChange={liveSearchCategory} />
              <button className="fas fa-search"></button>
            </div>
          </Modal.Body.Act>
          {newCategory && (
            <Modal.Body.Act name="Simpan" icon="fas fa-save" add={true} onClick={handleSubmitCategory}>
              <FormGroup onChange={e => setInputCategory(e.target.value.trim())} />
            </Modal.Body.Act>
          )}
          <Modal.Body.SelectOption>
            {categories === null ? null : (categories.result.results === null ? 'Kategori tidak tersedia' : categories.result.results.map((c, i) => <Modal.Body.SelectOption.Item 
                                                                                                                                                  key={c.id_category}
                                                                                                                                                  name={c.category_name}
                                                                                                                                                  onClick={() => handleSelectedCategory(i)} />))}
          </Modal.Body.SelectOption>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>

      {/* modal edit category */}
      <Modal title="Kategori" show={showCategoryEdit} onHide={handleCloseCategoryEdit} onSubmit={defaultForm}>
        <Modal.Body>
          <Modal.Body.Act name="Tambah" icon="fas fa-plus" add={true} onClick={handleNewCategoryEdit}>
            <div className="search-box">  
              <input type="text" placeholder="Cari" onChange={liveSearchCategory} />
              <button className="fas fa-search"></button>
            </div>
          </Modal.Body.Act>
          {newCategoryEdit && (
            <Modal.Body.Act name="Simpan" icon="fas fa-save" add={true} onClick={handleSubmitCategoryEdit}>
              <FormGroup onChange={e => setInputCategoryEdit(e.target.value.trim())} />
            </Modal.Body.Act>
          )}
          <Modal.Body.SelectOption>
            {categories === null ? null : (categories.result.results === null ? 'Kategori tidak tersedia' : categories.result.results.map((c, i) => <Modal.Body.SelectOption.Item 
                                                                                                                                                  key={c.id_category}
                                                                                                                                                  name={c.category_name}
                                                                                                                                                  onClick={() => handleSelectedCategoryEdit(i)} />))}
          </Modal.Body.SelectOption>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>

      {/* modal unit */}
      <Modal title="Satuan" show={showUnit} onHide={handleCloseUnit} onSubmit={defaultForm}>
        <Modal.Body>
          <Modal.Body.Act name="Tambah" icon="fas fa-plus" add={true} onClick={handleNewUnit}>
            <div className="search-box">  
              <input type="text" placeholder="Cari" onChange={liveSearchUnit} />
              <button className="fas fa-search"></button>
            </div>
          </Modal.Body.Act>
          {newUnit && (
            <Modal.Body.Act name="Simpan" icon="fas fa-save" add={true} onClick={handleSubmitUnit}>
              <FormGroup onChange={e => setInputUnit(e.target.value.trim())} />
            </Modal.Body.Act>
          )}
          <Modal.Body.SelectOption>
            {units === null ? null : (units.result.results === null ? 'Satuan tidak tersedia' : units.result.results.map((c, i) => <Modal.Body.SelectOption.Item 
                                                                                                                                                  key={c.id_unit}
                                                                                                                                                  name={c.unit_name}
                                                                                                                                                  onClick={() => handleSelectedUnit(i)} />))}
          </Modal.Body.SelectOption>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>

      {/* modal unit Edit */}
      <Modal title="Satuan" show={showUnitEdit} onHide={handleCloseUnitEdit} onSubmit={defaultForm}>
        <Modal.Body>
          <Modal.Body.Act name="Tambah" icon="fas fa-plus" add={true} onClick={handleNewUnitEdit}>
            <div className="search-box">  
              <input type="text" placeholder="Cari" onChange={liveSearchUnit} />
              <button className="fas fa-search"></button>
            </div>
          </Modal.Body.Act>
          {newUnitEdit && (
            <Modal.Body.Act name="Simpan" icon="fas fa-save" add={true} onClick={handleSubmitUnitEdit}>
              <FormGroup onChange={e => setInputUnitEdit(e.target.value.trim())} />
            </Modal.Body.Act>
          )}
          <Modal.Body.SelectOption>
            {units === null ? null : (units.result.results === null ? 'Satuan tidak tersedia' : units.result.results.map((c, i) => <Modal.Body.SelectOption.Item 
                                                                                                                                                  key={c.id_unit}
                                                                                                                                                  name={c.unit_name}
                                                                                                                                                  onClick={() => handleSelectedUnitEdit(i)} />))}
          </Modal.Body.SelectOption>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>

      {/* modal unit variant */}
      <Modal title="Satuan" show={showUnitVariant} onHide={handleCloseUnitVariant} onSubmit={defaultForm}>
        <Modal.Body>
          <Modal.Body.Act name="Tambah" icon="fas fa-plus" add={true} onClick={handleNewUnitVariant}>
            <div className="search-box">  
              <input type="text" placeholder="Cari" onChange={liveSearchUnit} />
              <button className="fas fa-search"></button>
            </div>
          </Modal.Body.Act>
          {newUnitVariant && (
            <Modal.Body.Act name="Simpan" icon="fas fa-save" add={true} onClick={handleSubmitUnitVariant}>
              <FormGroup onChange={e => setInputUnitVariant(e.target.value.trim())} />
            </Modal.Body.Act>
          )}
          <Modal.Body.SelectOption>
            {units === null ? null : (units.result.results === null ? 'Satuan tidak tersedia' : units.result.results.map((c, i) => <Modal.Body.SelectOption.Item 
                                                                                                                                                  key={c.id_unit}
                                                                                                                                                  name={c.unit_name}
                                                                                                                                                  onClick={() => handleSelectedUnitVariant(i)} />))}
          </Modal.Body.SelectOption>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const ItemData = (props) => {
  return(
    <tr>
      <td>
        <img src={props.img === null ? NoProductImage : props.img} alt="" />
      </td>
      <td>
        <div className="content">
          <span className="name">{props.name}</span>
          <span className="price">{props.price}</span>
        </div>
      </td>
      <td>{props.price}</td>
      <td>{props.unit}</td>
      <td>{props.stock}</td>
      <td>
        <TripleButtons 
          readOnly={props.readOnly}
          onShowDetail={() => props.handleShowDetail(props.id)}
          onShowEdit={() => props.handleShowEdit(props.id)}
          onShowDelete={() => props.handleShowDelete(props.id, props.name)} 
        />
      </td>
    </tr>
  )
}

export default GlobalConsumer(Produk)