import { useState } from 'react'
import './Outlets.scss'

export default function Outlets(props) {
  const [list, setList] = useState(props.list)
  const [length, setLength] = useState(0)
  const isScroll = props.list.length > 5 ? ' scroll' : ''
  

  const handleListOpen = () => {
    const outletsContainer = document.querySelector('.outlets-container')
    const searchInput = outletsContainer.querySelector('input')

    if (outletsContainer.classList.contains('open')) {
      searchInput.blur()
    } else {
      setTimeout(() => {
        searchInput.focus()
      }, 300);
    }

    outletsContainer.classList.toggle('open')
    
    document.body.onclick = e => {
      if (!e.target.classList.contains('outlet-selected') && !(e.target.placeholder === 'Cari Outlet' && e.target.localName === 'input')) {
        outletsContainer.classList.remove('open')
      }
    }
  }

  const handleOutletActive = e => {
    const outletsContainer = document.querySelector('.outlets-container')
    const outletSelected = outletsContainer.querySelector('.outlet-selected span')
    const outletList = outletsContainer.querySelectorAll('.list-wrapper ul li')

    outletSelected.innerText = e.target.innerText
    outletList.forEach(l => l.classList.remove('active'))
    e.target.classList.add('active')

    outletsContainer.classList.remove('open')
  }

  const handleAutoComplate = e => {
    const val = e.target.value

    setList(props.list.filter(l => l.substr(0,val.length).toLowerCase() === val.toLowerCase()))
    setLength(val.length)
  }

  document.body.onkeyup = e => {
    if (window.location.pathname === '/dashboard') {
      const outletsContainer = document.querySelector('.outlets-container')
      // const searchInput = outletsContainer.querySelector('input')
      const listContainer = outletsContainer.querySelector('.list-wrapper .list-container')
      const outletList = listContainer.querySelectorAll('li')

      if (outletsContainer.classList.contains('open')) {
        if (e.code === 'Enter') {
          outletList.forEach(l => {
            if (l.classList.contains('active')) {
              const outletSelected = outletsContainer.querySelector('.outlet-selected span')

              outletSelected.innerText = l.innerText
              l.classList.add('active')
              outletsContainer.classList.remove('open')
              // searchInput.value = ''
              // setList(props.list)
              // setLength(0)
            }
          })
        } else if (e.code === 'ArrowDown') {
          moveActive('down', outletList, listContainer)
        } else if (e.code === 'ArrowUp') {
          moveActive('up', outletList, listContainer)
        }
      }
    }
  }

  return(
    <div className="outlets-container">
      <div className="outlet-selected skeleton1" onClick={handleListOpen}>
        <span>Semua</span>
        <i className="fas fa-caret-down"></i>
      </div>
      <div className="list-wrapper">
          <input type="text" placeholder="Cari Outlet" onInput={handleAutoComplate} />
        <ul className={`list-container${isScroll}`}>
          {/* <li className="active">Semua</li> */}
          {list.map((l, i) => {
            return(
              <li key={i} onClick={handleOutletActive} className={i === 0 ? 'active' : ''}>
                <strong>{l.substr(0,length)}</strong>
                {l.substr(length)}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

const moveActive = (key, outletList, listContainer) => {
  let index = 0
  let scrollTo = 0

  outletList.forEach((l, i) => {
    if (l.classList.contains('active')) {
      if (key === 'down') {
        index = i + 1 < outletList.length ? i + 1 : outletList.length - 1
      } else {
        index = i - 1 <= 0 ? 0 : i - 1
      }

      for (let idx = 0 ; idx <= index ; idx++) {
        scrollTo += index === 0 ? 0 : outletList[idx].offsetHeight
      }
    }

    l.classList.remove('active')
  })

  listContainer.scrollTo(0, scrollTo / 2)

  outletList[index].classList.add('active')
}