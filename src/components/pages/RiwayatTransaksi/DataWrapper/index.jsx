import './DataWrapper.scss';
import util from '../../../../util'

export default function DataWrapper({data, onClick}) {
  const getDay = date => {
    const days = ['Minggu', 'Sening', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    return days[new Date(date).getDay()]
  }
  const dateToInaFormat = date => {
    const split = date.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
    return split[2]+' '+months[parseInt(split[1]) - 1]+' '+split[0]
  }

  return(
    <div className="data-wrapper">
      <div className="lead-content">
        <h4>{getDay(data.date)+', '+dateToInaFormat(data.date)}</h4>
        <h4>Total: {util.formatRupiah(data.total)}</h4>
      </div>
      <table border="0" className="transaction-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>No Struk</th>
            <th>Metode Pembayaran</th>
            <th>Outlet</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((d, i) => <ItemData 
                                    key={d.id_transaction}
                                    isLunas={parseInt(d.paid_off) - parseInt(d.grand_total) >= 0}
                                    invoice={d.invoice}
                                    method={d.method}
                                    outlet={d.id_outlet === null ? '' : d.id_outlet.outlet_name}
                                    total={d.grand_total}
                                    onClick={() => onClick(i)} />)}
        </tbody>
      </table>
    </div>
  )
}

const ItemData = ({isLunas, invoice, method, outlet, total, onClick}) => {
  console.log(isLunas);
  const methods = ['Tunai', 'GoPay', 'Ovo', 'ShoppePay']
  return( <tr onClick={onClick}>
            <td>
              <span className={isLunas ? 'lunas' : 'hutang'}>{isLunas ? 'Lunas' : 'Hutang'}</span>
            </td>
            <td>{invoice}</td>
            <td>{methods[method]}</td>
            <td>{outlet}</td>
            <td>{util.formatRupiah(total)}</td>
          </tr>
  )
}