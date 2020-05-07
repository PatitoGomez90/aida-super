const router = require("express").Router();
const cIndex = require("./controllers/cIndex");
const cProductos = require("./controllers/cProductos");
const cCarrito = require("./controllers/cCarrito");
const cUsuarios = require("./controllers/cUsuarios");
const mw = require("./middlewares");

const logout = (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/')
        } else {
            console.log(err)
        }
    })
}

// Inicio
router.get("/", cIndex.getInicio);
router.get("/inicio", cIndex.getInicioAjax);
router.get("/contacto", cIndex.getContacto);
router.post("/contacto", cIndex.postContacto);
router.get("/iniciar-sesion", cIndex.getLogin);
router.post("/iniciar-sesion", cIndex.postLogin);
router.get("/registrate", cIndex.getRegistro);
router.post("/registrate", cIndex.postRegistro);
router.get('/logout', logout);

// Usuario
router.get("/mi-cuenta", mw.auth, cUsuarios.getMiCuenta);
router.post("/mi-cuenta/modificar-datos", mw.auth, cUsuarios.postModificarDatos);
router.get("/mi-cuenta/ver-pedido/:numero", mw.auth, cUsuarios.getPedido);

// Productos
router.get("/productos", cProductos.getAll);
router.get("/productos/rubros/:id", cProductos.getByRubro);
router.get("/productos/filtro/:categoria/:rubro", cProductos.getByCategoriaYRubro);
router.post("/productos/filtro/busqueda", cProductos.getByBusqueda);
router.get("/productos/todos", cProductos.getTodos);
router.get("/productos/categoria/:categoria", cProductos.getByCategoria);

// Carrito
router.get("/carrito", cCarrito.getCarrito);
router.get("/carrito/lista", cCarrito.getLista);
router.post("/carrito/agregar", cCarrito.postAdd);
router.post("/carrito/modificar", cCarrito.postModificar);
router.get("/carrito/comprar", cCarrito.getComprar);
router.get("/carrito/check-out", mw.auth, cIndex.getCheckout);
router.post("/carrito/check-out", mw.auth, cIndex.postCheckout);

module.exports = router;