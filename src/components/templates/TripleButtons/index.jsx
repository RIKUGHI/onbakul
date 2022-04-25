import './TripleButtons.scss'

export default function TripleButtons({readOnly, onShowDetail, onShowEdit, onShowDelete}) {
  const isShowDetail = ['/satuan', '/kategori'].includes(window.location.pathname)
  return(
    <div className="action-triple-btns">
      {isShowDetail ? null : (
        <button className="fas fa-eye" onClick={onShowDetail} ></button>
      )}
      {!readOnly && <>
                      <button className="fas fa-pen" onClick={onShowEdit} ></button>
                      <button className="fas fa-trash-alt" onClick={onShowDelete} ></button>
                    </>}
    </div>
  )
}