import { FormSearch, Locked, MainLayout, Pagination, TripleButtons } from '../..'
import './ManagementLayout.scss'

export default function ManagementLayout(props) {
  return(
    <MainLayout title={props.title}> 
    {props.locked ? (
      <Locked />
    ) : (
      <div className="mng-product-container">
        <div className="head-product">
          <span className="title">{props.titlePage}</span>
          <div className="wrapper-action">
            <FormSearch className="search hide1" icon="fas fa-search" placeholder={`Cari ${props.placeholder}`} onSubmit={props.onSubmit} />
            {!props.readOnly && <button className="btn-add" onClick={props.onShowModal}>
                                  <span>Tambah</span>
                                  <i className="fas fa-plus"></i>
                                </button>}
          </div>
        </div>
        <div className="main-management-container">
          {props.children}
        </div>
        {
          (props.pageOption !== null) && (props.pageOption.result.total_pages === 1) ? null : <Pagination option={props.pageOption} url={props.pageUrl}/>
          
        }
      </div>
    )}
    </MainLayout>
  ) 
}

ManagementLayout.ThreeFieldsTable = ({children, readOnly}) => {
  return(
    <table border="0" className="three-fields-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          {!readOnly && <th>Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}

ManagementLayout.ThreeFieldsTable.Item = ({no, name, showButton, onShowEdit, onShowDelete}) => {
  return(
    <tr>
      <td>{no}</td>
      <td>{name}</td>
      <td>
        {!showButton && <TripleButtons 
                          onShowEdit={onShowEdit}
                          onShowDelete={onShowDelete}/>}
      </td>
    </tr>
  )
}

ManagementLayout.SixFieldsTable = ({children}) => {
  return(
    <table border="0" className="six-fields-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Kota</th>
          <th>Alamat</th>
          <th>Telp</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}

ManagementLayout.SixFieldsTable.Item = ({no, name, city, address, telp, onShowDetail, readOnly, onShowEdit, onShowDelete, disable}) => {
  return(
    <tr>
      <td>{no}</td>
      <td>{name}</td>
      <td>{city}</td>
      <td>{address}</td>
      <td>{telp}</td>
      <td>
        {disable ? null : (
          <TripleButtons
            readOnly={readOnly}
            onShowDetail={onShowDetail}
            onShowEdit={onShowEdit}
            onShowDelete={onShowDelete} 
          />
        )}
      </td>
    </tr>
  )
}