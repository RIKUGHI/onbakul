import { useEffect, useState } from "react";
import { FormSearch, MainLayout, Modal } from "../..";

import './Tutorial.scss'

export default function Tutorial() {
  const listTutorial = ['Menambahkan Produk Tanpa Stok', 'Menambahkan Produk Dengan Stok', 'Menambahkan Produk Dengan Variasi', 'Mengubah Produk', 'Menghapus Produk']
  const listUrl = ['https://www.youtube.com/embed/f7zHYQ-nqXU', 'https://www.youtube.com/embed/_JzdMF_cyRE', 'https://www.youtube.com/embed/wMzgfc5jAMM', 'https://www.youtube.com/embed/gEVlFGPpiWE', 'https://www.youtube.com/embed/4tgPQOd9Y68']
  const [list, setList] = useState(listTutorial)

  useEffect(() => {
    const searchInput = document.querySelector('form input')

    searchInput.oninput = e => {
      const val = e.target.value
      
      setList(listTutorial.filter(l => l.substr(0, val.length).toLowerCase() === val.toLowerCase()))
    }
  })

  // modal detail product
  const [showDetail, setShowDetail] = useState(false)
  const [tutorialName, setTutorialName] = useState('')
  const [indexDetail, setIndexDetail] = useState(0)

  const handleShowDetail = (e, i) => {
    setTutorialName(e.target.innerText)
    setIndexDetail(i)
    setShowDetail(true)
  }
  const handleCloseDetail = () => setShowDetail(false)

  return(
    <>
      <MainLayout title="Tutorial">
        <div className="tutorial-container">
          <FormSearch className="search hide1" icon="fas fa-search" placeholder="Cari" />
          <div className="tutorial-content">
            {
              list.map((l, i) => <TutorialCard key={i} name={l} onClick={e => handleShowDetail(e, i)} />)
            }
          </div>
        </div>
      </MainLayout>
      
      {/* modal detail product */}
      <Modal title={tutorialName} show={showDetail} onHide={handleCloseDetail}>
        <Modal.Body>
          <div className="container-video">
            <iframe width="100%" height="315" src={listUrl[indexDetail]} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="reset">Batal</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const TutorialCard = ({name, onClick}) => <div className="tutorial-card" onClick={onClick}>{name}</div>