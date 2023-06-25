const mongoose = require("mongoose");
require("../data/menu");
// Membuat schema 
const Menu = mongoose.model("menu", {
    menu: [
        {
            title: String,
            harga: String,
            deskripsi: String,
            gambar: String
        }
    ]
})

// Schema db pembelian 
const Buy = mongoose.model("buy", {
    cust: {
        food_id: String,
        nama_penerima: String,
        no_telp: String,
        alamat: String,
        nama_item: String,
        harga: String,
        jumlah_pembelian: String,
        total_harga: String
    }
})

const add = (data) => {
    const menu1 = new Menu({
        menu: [
            {
                title: data.title,
                harga: data.harga,
                deskripsi: data.detail,
                gambar: data.gambar
            }
        ]
    })

    menu1.save().then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    });
}

// Input to db 
const addCust = (data) => {
    const cust = new Buy({
        cust: {
            food_id: data.id,
            nama_penerima: data.nama_penerima,
            no_telp: data.no_telp,
            alamat: data.alamat,
            nama_item: data.nama_item,
            harga: data.harga,
            jumlah_pembelian: data.jumlah_pembelian,
            total_harga: data.total_harga
        }
    })

    cust.save().then(result => { return result }).catch(err => { throw err });
}


const counts = (count) => {
    const kuantity = parseInt(count);
    return kuantity;
}

const setPriceInt = (price, count) => {
    let hargaint = price.split(" ");
    hargaint = hargaint[1];
    hargaint = hargaint.split(".");
    let hargatoint = hargaint.join("");
    const result_harga = parseInt(hargatoint);
    const jumlah = counts(count);
    const sum = result_harga * jumlah;
    return sum;
}

function formatRupiah(angka, prefix) {
    let number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}

function isStreetNameValid(streetName) {
    // Pola regular expression untuk memeriksa penulisan nama jalan
    const streetNameRegex = /^[a-zA-Z0-9\s.,'-]+$/;

    // Mengembalikan true jika sesuai dengan pola regex, dan false jika tidak
    return streetNameRegex.test(streetName);
}

module.exports = { add, Menu, setPriceInt, formatRupiah, addCust, isStreetNameValid };
