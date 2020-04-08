const router = require("express").Router();
const cIndex = require("../modules/index/cIndex");

router.get("/", cIndex.getInicio);
router.get("/inicio", cIndex.getInicioAjax);
router.get("/contacto", (req, res) => {
    res.render("contacto");
});
// router.get("/productos", cIndex.getProductos);
// router.get("/getproductos", cIndex.getProductosAjax);
// router.post("/searchProductos", cIndex.postProductosSearch);
// router.post("/productos/add", cIndex.addItem);
// router.post("/productos/delete", cIndex.deleteItem);
// router.post("/productos/update", cIndex.updateItem);
// router.get("/carrito", cIndex.getCarrito);
// router.get("/getcarrito", cIndex.getCarritoAjax);



// router.get("/product-page", (req, res) => {
//     res.render("product-page")
// })

// router.get("/shopping-cart", (req, res) => {
//     res.render("shopping-cart")
// })

router.get("/check-out", (req, res) => {
    res.render("check-out")
})

module.exports = router;
