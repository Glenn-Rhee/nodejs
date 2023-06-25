// memanggil module 
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { check, validationResult, body } = require("express-validator");
const { add, Menu, setPriceInt, formatRupiah, addCust, isStreetNameValid } = require("./utils/controller_db")

// ambil data api 
const { getAllPizzas } = require("./data/data-api");

// inisiasi express
const app = express();
const port = 3000;

// Inisiasi ejs 
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Halaman utama
app.get("/", (req, res) => {
    res.render("index", {
        layout: "layouts/main-layout",
        title: "Home"
    })
})

// Halaman Menu
app.get("/menu", async (req, res) => {
    const hokbens = await Menu.find();
    res.render("menu", {
        title: "Menu Hokben",
        layout: "layouts/main-layout",
        hokbens
    })
})

// Halaman detail 
app.get("/menu/detail/:id", async (req, res) => {
    const id = req.params.id;
    const data = await Menu.findById(id);
    const result = data.menu[0].title;
    let title = result.split(" ");
    title = title.slice(0, 2);
    title = title.join(" ");
    res.render("detail", {
        layout: "layouts/main-layout",
        title: "Detail Produk",
        data,
        title
    })
})

// Halaman pesan 
app.get("/menu/pesan/:id", async (req, res) => {
    const id = req.params.id;
    const data = await Menu.findById(id);
    res.render("pesan", {
        title: "Form Pesan",
        layout: "layouts/main-layout",
        data
    })
})


// Halaman konfirmasi pesanan 
app.post("/confirm", [check("no_telp", "No HP tidak valid").isMobilePhone("id-ID")], async (req, res) => {
    const id = req.body.id;
    const data = await Menu.findById(id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // res.send(400).json({ errors: errors.array() })
        res.render(`pesan`, {
            layout: "layouts/main-layout",
            title: "Form Pesan",
            data,
            errors: errors.array()
        });
    } else {
        let result = req.body;
        // console.log(result);
        const harga = result.harga;
        const kuantity = result.jumlah_pembelian;
        let priceResult = setPriceInt(harga, kuantity);
        priceResult = priceResult.toString();
        const total_harga = formatRupiah(priceResult, "Rp. ");
        result.total_harga = total_harga;
        res.render("confirm", {
            title: "Konfirmasi Pembayaran",
            layout: "layouts/main-layout",
            result,
            total_harga
        })
    }
})

// masukkan ke database pesanan 
app.post("/confirm-purchase", (req, res) => {
    const data = req.body;
    addCust(data);
    res.redirect("/menu");
})

// app.post("/tambah", (req,res)=>{
//     // console.log(req.body);
//     res.redirect("/");
// })

app.use((req, res, next) => {
    res.status(404).render("404", {
        title: "404 Page not Found",
        layout: "layouts/404-layout"
    });
    next();
})

// Menjalankan web server 
app.listen(port, () => {
    console.log(`Data Api connect | listening on port ${port}`);
})