const router = require("express").Router();
const mProductos = require("../modules/productos/mProductos");
var Cart = require('../modules/cart');

router.get("/", async (req, res) => {
    const categorias = await mProductos.getCategorias();
    res.render("productos/views/productos", {
        categorias
    });
});

router.get("/todos", async (req, res) => {
    const productos = await mProductos.getProductos();
    res.send(productos);
});

router.get("/categoria/:categoria", async (req, res) => {
    const { categoria } = req.params;
    const productos = await mProductos.getProductosByCategoria(categoria);
    res.send(productos);
});

module.exports = router;