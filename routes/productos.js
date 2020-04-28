const router = require("express").Router();
const mProductos = require("../modules/productos/mProductos");
var Cart = require('../modules/cart');
const mw = require("../middlewares");

router.get("/", async (req, res) => {
    const categorias = await mProductos.getCategorias();
    res.render("productos/views/productos", {
        categorias,
        pagename: "/ Mas vendidos"
    });
});

router.get("/rubros/:id", async (req, res) => {
    const rubros = await mProductos.getRubros(req.params.id);
    res.send(rubros);
});

router.post("/buscar", async (req, res) => {
    const { valor } = req.body;
    const productos = await mProductos.getProductosByNombre(valor);
    res.send(productos);
});

router.get("/filtro/:categoria/:rubro", async (req, res) => {
    let { categoria, rubro } = req.params;
    const productos = await mProductos.getProductosByCategoriaYRubro(categoria, rubro);
    console.log(productos.length)
    for (x = 0; x < productos.length; x++) {
        productos[x].imagen = `logo.jpg`;
        let path = `0${productos[x].st_codigo2}s.jpg`;
        if (mw.ifFileExist(path)) {
            productos[x].imagen = `0${productos[x].st_codigo2}s.jpg`;
        }
    }
    res.send(productos);
});

router.post("/filtro/busqueda", async (req, res) => {
    let { busqueda } = req.body;
    if (!busqueda) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Ingrese un nombre de Producto"
        });
    }

    if (busqueda.length < 4) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Ingrese al menos 4 caracteres"
        });
    }

    try {
        const productos = await mProductos.getProductosByNombre(busqueda);
        if (!productos.length) {
            return res.json({
                type: "error",
                title: "Error",
                text: "No se encontraron productos para '" + busqueda + "'"
            });
        }

        for (x = 0; x < productos.length; x++) {
            productos[x].imagen = `logo.jpg`;
            let path = `0${productos[x].st_codigo2}s.jpg`;
            if (mw.ifFileExist(path)) {
                productos[x].imagen = `0${productos[x].st_codigo2}s.jpg`;
            }
        }

        res.send(productos);
    } catch (error) {
        res.send({
            type: "error",
            title: "Error",
            text: "Hubo un error al procesar la solicitud. Intente nuevamente"
        });
    }
})

router.get("/todos", async (req, res) => {
    const idCategoria = req.query.categoria;
    console.log(idCategoria);
    try {
        let productos = [];
        if (idCategoria) {
            productos = await mProductos.getProductosByCategoria(idCategoria);
        } else {
            productos = await mProductos.getProductos();
        }
        for (x = 0; x < productos.length; x++) {
            productos[x].imagen = `logo.jpg`;
            let path = `0${productos[x].st_codigo2}s.jpg`;
            if (mw.ifFileExist(path)) {
                productos[x].imagen = `0${productos[x].st_codigo2}s.jpg`;
            }
        }
        res.send(productos);
    } catch (error) {
        console.log(error)
    }
});

router.get("/categoria/:categoria", async (req, res) => {
    const { categoria } = req.params;
    const productos = await mProductos.getProductosByCategoria(categoria);
    res.send(productos);
});

module.exports = router;