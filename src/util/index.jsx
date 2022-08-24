// http://service.onbakul.gallery-umkm.id/
// http://localhost/onbakul-server/
// https://watered-down-anthem.000webhostapp.com/
export default {
  server_url: 'https://watered-down-anthem.000webhostapp.com/',
  months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  numericOnly: e => {
    const ch = String.fromCharCode(e.which)
    if (!(/[0-9]/.test(ch))) {
      e.preventDefault()
    }
  },
  formatRupiah: (bilangan, prefix = true) => {
    let number_string = bilangan.toString()
    let copyIntoArray = [...number_string]

    if (bilangan < 0) copyIntoArray.shift()

    let sisa 	= copyIntoArray.length % 3
    let rupiah 	= copyIntoArray.join('').substr(0, sisa)
    let ribuan 	= copyIntoArray.join('').substr(sisa).match(/\d{3}/g)

    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.')
    }

    return prefix ? 'Rp'+ (bilangan < 0 ? '-'+rupiah : rupiah) : (bilangan < 0 ? '-'+rupiah : rupiah)
  }
}