import Cookies from "js-cookie"
import React, { Component, createContext } from "react"

const RootContext = createContext()

// Provider
const Provider = RootContext.Provider
export default function GlobalProvider(Children) {
  return(
    class ParentComp extends Component{
      state = {
        login: Cookies.get('login') === 'true' ? true : false,
        level: Cookies.get('level'),
        display_name: parseInt(Cookies.get('level')) === 0 ? Cookies.get('owner_name') : Cookies.get('outlet_name'),
        business_name: Cookies.get('business_name') ? Cookies.get('business_name') : '',
        id_category: Cookies.get('id_category') ? Cookies.get('id_category') : 0,
        id_owner: Cookies.get('id_owner') ? parseInt(Cookies.get('id_owner')) : 0, 
        id_outlet: Cookies.get('id_outlet') ? parseInt(Cookies.get('id_outlet')) : 0 ,
        owner_code: Cookies.get('owner_code') ? Cookies.get('owner_code') : '-',
        products_ro: parseInt(Cookies.get('products_ro')) ? true : false,
        units_ro: parseInt(Cookies.get('units_ro')) ? true : false,
        categories_ro: parseInt(Cookies.get('categories_ro')) ? true : false,
        customers_ro: parseInt(Cookies.get('customers_ro')) ? true : false,
        suppliers_ro: parseInt(Cookies.get('suppliers_ro')) ? true : false,
        outlets_ro: parseInt(Cookies.get('outlets_ro')) ? true : false,
        transactions_ro: parseInt(Cookies.get('transactions_ro')) ? true : false,
        purchases_ro: parseInt(Cookies.get('purchases_ro')) ? true : false,
        signIn: (a) => {
          Cookies.set('login', true)
          Cookies.set('level', a.level)
          Cookies.set('id_owner', a.id_owner)
          Cookies.set('owner_name', a.owner_name)
          Cookies.set('business_name', a.business_name)
          Cookies.set('id_category', a.id_category)
          Cookies.set('id_outlet', a.id_outlet)
          Cookies.set('outlet_name', a.outlet_name)
          Cookies.set('owner_code', a.owner_code)
          Cookies.set('products_ro', a.products_ro)
          Cookies.set('units_ro', a.units_ro)
          Cookies.set('categories_ro', a.categories_ro)
          Cookies.set('customers_ro', a.customers_ro)
          Cookies.set('suppliers_ro', a.suppliers_ro)
          Cookies.set('outlets_ro', a.outlets_ro)
          Cookies.set('transactions_ro', a.transactions_ro)
          Cookies.set('purchases_ro', a.purchases_ro)
        },
        signOut: () => {
          Cookies.remove('login')
          Cookies.remove('level')
          Cookies.remove('id_owner')
          Cookies.remove('owner_name')
          Cookies.remove('business_name')
          Cookies.remove('id_category')
          Cookies.remove('id_outlet')
          Cookies.remove('outlet_name')
          Cookies.remove('owner_code')
          Cookies.remove('products_ro')
          Cookies.remove('units_ro')
          Cookies.remove('categories_ro')
          Cookies.remove('customers_ro')
          Cookies.remove('suppliers_ro')
          Cookies.remove('outlets_ro')
          Cookies.remove('transactions_ro')
          Cookies.remove('purchases_ro')
          window.location.href = '/'
        }
      }

      render(){
        return(
          <Provider value={
            {
              state: this.state
            }
          }>
            <Children />
          </Provider>
        )
      }
    }
  )
}

// Consumer
const Consumer = RootContext.Consumer
export const GlobalConsumer = (Children) => {
  return(
    class ParentConsumer extends Component{
      render(){
        return(
          <Consumer>
            {
              value => {
                return(
                  <Children {...this.props} {...value} />
                )
              }
            }
          </Consumer>
        )
      }
    }
  )
}
