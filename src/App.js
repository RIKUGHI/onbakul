// libraries  
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// style
import './App.css';

// components
import {
  Akun,
  Cabang,
  Dashboard, Kasir,
  Kategori,
  Landing,
  NotFound,
  Pelanggan,
  Pembelian,
  Produk, RiwayatTransaksi,
  Satuan,
  Sidebar,
  Supplier,
  Tutorial,
  Upgrade
} from './components';

import GlobalProvider from './context';
import PrivateRoute from './PrivateRoute';

function App() {
  const isLanding = window.location.pathname !== '/'  
  let isNotFound = null
  if (parseInt(Cookies.get('level')) === 0) {
    isNotFound = !['/dashboard','/kasir','/produk','/satuan','/kategori','/pelanggan','/supplier','/outlet','/riwayat-transaksi','/pembelian','/akun','/tutorial', '/upgrade'].includes(window.location.pathname)
  } else {
    isNotFound = !['/dashboard','/kasir','/produk','/satuan','/kategori','/pelanggan','/supplier','/outlet','/riwayat-transaksi','/pembelian','/akun','/tutorial'].includes(window.location.pathname)
  }

  return (
    <>
      <Router>
        <div className={`App${isLanding ? '' : ' netral'}`}>
          {/* {isLanding && (
            <Sidebar />
          )} */}
          {
            isLanding ? isNotFound ? null : Cookies.get('login') ? <Sidebar /> : null : null
          }

          <Switch>
            <Route path="/" exact component={Landing} />
            {/* <Route path="/dashboard" component={Dashboard} /> */}
            <PrivateRoute path="/dashboard" component={Dashboard} />
            {/* <Route path="/kasir" component={Kasir} /> */}
            <PrivateRoute path="/kasir" component={Kasir} />
            {/* <Route path="/produk" component={Produk} /> */}
            <PrivateRoute path="/produk" component={Produk} />
            {/* <Route path="/satuan" component={Satuan} /> */}
            <PrivateRoute path="/satuan" component={Satuan} />
            {/* <Route path="/kategori" component={Kategori} /> */}
            <PrivateRoute path="/kategori" component={Kategori} />
            {/* <Route path="/pelanggan" component={Pelanggan} /> */}
            <PrivateRoute path="/pelanggan" component={Pelanggan} />
            {/* <Route path="/outlet" component={Cabang} /> */}
            <PrivateRoute path="/outlet" component={Cabang} />
            {/* <Route path="/supplier" component={Supplier} /> */}
            <PrivateRoute path="/supplier" component={Supplier} />
            {/* <Route path="/riwayat-transaksi" component={RiwayatTransaksi} /> */}
            <PrivateRoute path="/riwayat-transaksi" component={RiwayatTransaksi} />
            {/* <Route path="/pembelian" component={Pembelian} /> */}
            <PrivateRoute path="/pembelian" component={Pembelian} />
            {/* <Route path="/akun" component={Akun} /> */}
            <PrivateRoute path="/akun" component={Akun} />
            {/* <Route path="/tutorial" component={Tutorial} /> */}
            <PrivateRoute path="/tutorial" component={Tutorial} />
            {parseInt(Cookies.get('level')) === 0 && <PrivateRoute path="/upgrade" component={Upgrade} />}
            {isNotFound && (
              <Route path="" component={NotFound} />
            )}
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default GlobalProvider(App);
