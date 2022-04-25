// all, if the request doesn't match (POST, GET, PUT, DELETE)
error = {
  statusQuery: false,
  resultQuery: {
    message: 'Bad Request'
  }
}

// get data
success = {
  statusQuery: true,
  resultQuery: {
    idOwner: 1,
    idOutlet: 1,
    data: 'produk',
    keySearch: 'All',
    startData: 0,
    activePage: 1,
    numberOfPages: 20,
    result: [
      {
        idProduct: 1,
        type: 1,
        image: 'url',
        name: 'Es dawet',
        barcode: '012983',
        category: 'es',
        priceM: 1000,
        priceJ: 2000
      },
      {
        idProduct: 1,
        type: 2,
        image: 'url',
        name: 'Es dawet',
        barcode: '012983',
        category: 'es',
        priceM: 1000,
        priceJ: 2000,
        unit: 'pcs',
        stock: 100,
        stockMin: 2
      },
      {
        idProduct: 1,
        type: 3,
        image: 'url',
        name: 'Es dawet',
        barcode: '012983',
        category: 'es',
        varations: [
          {
            idVariant: 1,
            type: 1,
            image: 'url',
            name: 'Es dawet',
            barcode: '012983',
            category: 'es',
            priceM: 1000,
            priceJ: 2000
          },
          {
            idProduct: 1,
            type: 2,
            image: 'url',
            name: 'Es dawet',
            barcode: '012983',
            category: 'es',
            priceM: 1000,
            priceJ: 2000,
            unit: 'pcs',
            stock: 100,
            stockMin: 2
          }
        ]
      }
    ]
  }
}