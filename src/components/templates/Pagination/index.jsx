import { Link } from 'react-router-dom'
import util from '../../../util';
import './Pagination.scss'

export default function Pagination({option, url}) {

  if (option === null) return null 

  const queryBefore = option.result.key_search === 'Semua' ? 'page='+(option.result.active_page - 1) : 'q='+option.result.key_search+'&page='+(option.result.active_page - 1)
  const queryNext = option.result.key_search === 'Semua' ? 'page='+(option.result.active_page + 1) : 'q='+option.result.key_search+'&page='+(option.result.active_page + 1)

  const getQuery = i => {
    return option.result.key_search === 'Semua' ? 'page='+i : 'q='+option.result.key_search+'&page='+i
  }
  return(
    <div className="pagination-container">
      {(option !== null) && (option.result.active_page > 1) ? (
          <Link to={url+queryBefore} className="arrow">
            <i className="fas fa-angle-left"></i>
          </Link>
        ) : null}
      {}

      {(() => {
        if (option !== null && option.result.total_pages > 5) {
          if (option !== null && option.result.active_page >= 3 && option.result.active_page < option.result.total_pages - 2) {
            let linkList = []
            for (let i = option.result.active_page - 2; i <= option.result.active_page + 2; i++) {
              linkList[i] = <Link key={i} to={url+getQuery(i)} className={(option !== null) && (option.result.active_page === i) ? 'active' : ''} >{i}</Link>
            }
            return linkList.map(l => l)
          } else if (option !== null && option.result.active_page >=  option.result.total_pages - 2) {
            let linkList = []
            for (let i = option.result.total_pages - 4; i <= option.result.total_pages; i++) {
              linkList[i] = <Link key={i} to={url+getQuery(i)} className={(option !== null) && (option.result.active_page === i) ? 'active' : ''} >{i}</Link>
            }
            return linkList.map(l => l)
          } else {
            let linkList = []
            for (let i = 1; i <= 5; i++) {
              linkList[i] = <Link key={i} to={url+getQuery(i)} className={(option !== null) && (option.result.active_page === i) ? 'active' : ''} >{i}</Link>
            }
            return linkList.map(l => l)
          }
        } else {
          if (option !== null) {
            let linkList = []
            for (let i = 1; i <= option.result.total_pages; i++) {
              linkList[i] = <Link key={i} to={url+getQuery(i)} className={(option !== null) && (option.result.active_page === i) ? 'active' : ''} >{i}</Link>
            }
            return linkList.map(l => l)
          }
        }
      })()}

      {(option !== null) && (option.result.active_page < option.result.total_pages) ? (
          <Link to={url+queryNext} className="arrow">
            <i className="fas fa-angle-right"></i>
          </Link>
        ) : null}
    </div>
  )
}

Pagination.Transactions = function Transactions({option, url}) {
  if (option === null) return null 

  const queryBefore = option.result.key_search === 'Semua' ? (option.result.type === 'periode' ? 'type=periode&start='+option.result.start+'&end='+option.result.end+'&page='+(option.result.active_page - 1) : 'page='+(option.result.active_page - 1)) : 'q='+option.result.key_search+'&page='+(option.result.active_page - 1)
  const queryNext = option.result.key_search === 'Semua' ? (option.result.type === 'periode' ? 'type=periode&start='+option.result.start+'&end='+option.result.end+'&page='+(option.result.active_page + 1) : 'page='+(option.result.active_page + 1)) : 'q='+option.result.key_search+'&page='+(option.result.active_page + 1)

  const getQuery = i => {
    return option.result.key_search === 'Semua' ? (option.result.type === 'periode' ? 'type=periode&start='+option.result.start+'&end='+option.result.end+'&page='+i : 'page='+i) : 'q='+option.result.key_search+'&page='+i
  }
  return(
    <div className="pagination-container">
      {(option !== null) && (option.result.active_page > 1) ? (
          <Link to={url+queryBefore} className="arrow">
            <i className="fas fa-angle-left"></i>
          </Link>
        ) : null}
      {}

      {(() => {
        if (option !== null && option.result.total_pages > 5) {
          if (option !== null && option.result.active_page >= 3 && option.result.active_page < option.result.total_pages - 2) {
            let linkList = []
            for (let i = option.result.active_page - 2; i <= option.result.active_page + 2; i++) {
              linkList[i] = <Link key={i} to={url+getQuery(i)} className={(option !== null) && (option.result.active_page === i) ? 'active' : ''} >{i}</Link>
            }
            return linkList.map(l => l)
          } else if (option !== null && option.result.active_page >=  option.result.total_pages - 2) {
            let linkList = []
            for (let i = option.result.total_pages - 4; i <= option.result.total_pages; i++) {
              linkList[i] = <Link key={i} to={url+getQuery(i)} className={(option !== null) && (option.result.active_page === i) ? 'active' : ''} >{i}</Link>
            }
            return linkList.map(l => l)
          } else {
            let linkList = []
            for (let i = 1; i <= 5; i++) {
              linkList[i] = <Link key={i} to={url+getQuery(i)} className={(option !== null) && (option.result.active_page === i) ? 'active' : ''} >{i}</Link>
            }
            return linkList.map(l => l)
          }
        } else {
          if (option !== null) {
            let linkList = []
            for (let i = 1; i <= option.result.total_pages; i++) {
              linkList[i] = <Link key={i} to={url+getQuery(i)} className={(option !== null) && (option.result.active_page === i) ? 'active' : ''} >{i}</Link>
            }
            return linkList.map(l => l)
          }
        }
      })()}

      {(option !== null) && (option.result.active_page < option.result.total_pages) ? (
          <Link to={url+queryNext} className="arrow">
            <i className="fas fa-angle-right"></i>
          </Link>
        ) : null}
    </div>
  )
}