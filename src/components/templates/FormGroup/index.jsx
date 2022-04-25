import { useState } from 'react'
import './FormGroup.scss'

import NoProductImage from '../../../assets/no-product-image.jpg' 

export default function FormGroup({title, name, defaultValue, warning, onChange, onClick, disable}) {
  return(
    <div className={`form-group${warning ? ' warning' : ''}${disable ? ' disabled' : ''}`} onClick={onClick}>
      <label>{title}</label>
      <input type="text" name={name} defaultValue={defaultValue} onChange={onChange} readOnly={disable ? true : false} /> 
      <span>{title} wajib diisi</span>
    </div>
  )
}

FormGroup.HasValue = function FormGroupHasValue({title, name, defaultValue, warning, onChange, onClick, disable}) {
  return(
    <div className={`form-group${warning ? ' warning' : ''}${disable ? ' disabled' : ''}`} onClick={onClick}>
      <label>{title}</label>
      <input type="text" name={name} value={defaultValue} onChange={onChange} readOnly={disable ? true : false} /> 
      <span>{title} wajib diisi</span>
    </div>
  )
}

FormGroup.WithoutWarning = function WithoutWarning({title, name, defaultValue, onClick, onChange, disable}) {
  return(
    <div className={`form-group${disable ? ' disabled' : ''}`} onClick={onClick}>
      <label>{title}</label>
      <input type="text" name={name} defaultValue={defaultValue} onChange={onChange} readOnly={disable ? true : false} /> 
    </div>
  )
}

FormGroup.WithoutWarning.HasValue = function WithoutWarningHasValue({title, name, defaultValue, onClick, onChange, disable}) {
  return(
    <div className={`form-group${disable ? ' disabled' : ''}`} onClick={onClick}>
      <label>{title}</label>
      <input type="text" name={name} value={defaultValue} onChange={onChange} readOnly={disable ? true : false} /> 
    </div>
  )
}

FormGroup.WithImg = function WithImg({imgSrc, setNotif, handleImg, edit}) {
  const [img, setImg] = useState('')

  const getImg = e => {
    const file = e.target.files[0] 
    const validExtensions = ['image/jpeg','image/jpg','image/png']

    if (validExtensions.includes(file.type)) {
      if (file.size > 5000000) {
        setNotif('warning','Ukuran gambar maks 5 megabytes')
      } else {
        const fileReader = new FileReader()

        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
          setImg(fileReader.result)
          handleImg(file)
        }
      }
    } else {
      setNotif('warning', 'Pastikan file adalah gambar')
    }
  }
  return(
    <div className="form-group">
      <label>Foto</label>
      <div className={`img-container${edit ? ' edit' : ''}`}>
        {(() => {
          if (edit) {
              return  <>
                        <input type="file" accept="image/x-png,image/jpeg,image/jpg,image/svg" id="file-photo" onChange={getImg} />
                        <label htmlFor="file-photo" className='fas fa-pen'></label>
                        <img src={img === '' ? (imgSrc === null ? NoProductImage : imgSrc) : img} alt="" />
                      </>
          } else {
            return img === '' ? (
                                  <>
                                    <input type="file" accept="image/x-png,image/jpeg,image/jpg,image/svg" id="file-photo" onChange={getImg} />
                                    <label htmlFor="file-photo">Pilih Foto</label>
                                  </>
                                ) : 
                                  <img src={img} alt="" />
          }
        })()}
          {/* <img src={imgSrc} alt="" /> */}
      </div>
    </div>
  )
}

FormGroup.DropDown = function DropDown({list, onChange, defaultValue}) {
  return(
    <div className="form-group">
      <label>Kategori</label>
      <select onChange={onChange} defaultValue={defaultValue}>
        {list.map(d => <option 
                        key={d.id_category}
                        value={d.id_category}>{d.category_name}</option>)}
      </select>
    </div>
  )
}

FormGroup.TextArea = function TextArea({title, name, onChange}) {
  return(
    <div className="form-group">
      <label>{title}</label>
      <textarea name={name} onChange={onChange}></textarea> 
    </div>
  )
}

FormGroup.TextArea.HasValue = function TextAreaHasValue({title, name, value, onChange}) {
  return(
    <div className="form-group">
      <label>{title}</label>
      <textarea name={name} defaultValue={value} onChange={onChange}></textarea> 
    </div>
  )
}