const mProductos = require("../models/mProductos");
const mw = require("../middlewares");

exports.getAll = async (req, res) => {
    const categorias = await mProductos.getCategorias();
    res.render("productos", {
        categorias,
        pagename: "/ Mas vendidos"
    });
}

exports.getByRubro = async (req, res) => {
    const rubros = await mProductos.getRubros(req.params.id);
    res.send(rubros);
}

exports.getByCategoriaYRubro = async (req, res) => {
    let { categoria, rubro } = req.params;
    const productos = await mProductos.getProductosByCategoriaYRubro(categoria, rubro);

    productos.forEach((producto, index) => {
        let path = `0${producto.st_codigo2}s.jpg`;
        productos[index].imagen = mw.ifFileExist(path) ? path : "logo.jpg";
    });
    res.send(productos);
}

exports.getByBusqueda = async (req, res) => {
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

        productos.forEach((producto, index) => {
            let path = `0${producto.st_codigo2}s.jpg`;
            productos[index].imagen = mw.ifFileExist(path) ? path : "logo.jpg";
        });

        res.send(productos);
    } catch (error) {
        res.send({
            type: "error",
            title: "Error",
            text: "Hubo un error al procesar la solicitud. Intente nuevamente"
        });
    }
}

exports.getTodos = async (req, res) => {
    const idCategoria = req.query.categoria;

    try {
        let productos = [];
        if (idCategoria) {
            productos = await mProductos.getProductosByCategoria(idCategoria);
        } else {
            productos = await mProductos.getProductos();
        }
        productos.forEach((producto, index) => {
            let path = `0${producto.st_codigo2}s.jpg`;
            productos[index].imagen = mw.ifFileExist(path) ? path : "logo.jpg";
        });
        res.send(productos);
    } catch (error) {
        console.log(error)
    }
}

exports.getByCategoria = async (req, res) => {
    const { categoria } = req.params;
    const productos = await mProductos.getProductosByCategoria(categoria);
    res.send(productos);
}