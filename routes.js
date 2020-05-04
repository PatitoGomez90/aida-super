const router = require("express").Router();
const cIndex = require("./controllers/cIndex");
const cProductos = require("./controllers/cProductos");
const cCarrito = require("./controllers/cCarrito");

// Inicio
router.get("/", cIndex.getInicio);
router.get("/inicio", cIndex.getInicioAjax);
router.get("/contacto", cIndex.getContacto);
router.post("/contacto", cIndex.postContacto);
router.get("/check-out", cIndex.getCheckout);
router.get("/login", cIndex.getLogin);
router.get("/registrate", cIndex.getRegistro);

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

module.exports = router;