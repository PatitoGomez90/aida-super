const router = require("express").Router();
const mProductos = require("../modules/productos/mProductos");
var Cart = require('../modules/cart');

router.get("/", async (req, res) => {
    const categorias = await mProductos.getCategorias();
    res.render("productos/views/productos", {
        categorias,
        pagename: "/ Mas vendidos"
    });
});

router.post("/buscar", async (req, res) => {
    const { valor } = req.body;
    const productos = await mProductos.getProductosByNombre(valor);
    res.send(productos);
});

router.get("/todos", async (req, res) => {
    const idCategoria = req.query.categoria;
    console.log(idCategoria);
    let productos = [];
    if (idCategoria) {
        productos = await mProductos.getProductosByCategoria(idCategoria);
    } else {
        productos = await mProductos.getProductos();
    }
    console.log(productos)
    res.send(productos);
});

router.get("/categoria/:categoria", async (req, res) => {
    const { categoria } = req.params;
    const productos = await mProductos.getProductosByCategoria(categoria);
    res.send(productos);
});

module.exports = router;