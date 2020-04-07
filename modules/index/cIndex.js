const mIndex = require("./mIndex");
var Cart = require('../cart');

exports.getInicio = async (req, res) => {
    if (!req.session.cart) {
        return res.render('index/views/inicio', {
            products: null
        });
    }

    var cart = new Cart(req.session.cart);
    res.render('index/views/inicio', {
        products: cart.getItems(),
    });
}

exports.getInicioAjax = async (req, res) => {
    const productos = await mIndex.getTopProductos();
    res.send(productos);
}

exports.getProductosAjax = async (req, res) => {
    const productos = await mIndex.get100Productos();
    res.send(productos);
}

exports.addItem = async (req, res) => {
    var productId = req.body.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.add(req.body, productId);
    req.session.cart = cart;
    res.redirect("back")
}

exports.deleteItem = (req, res) => {
    var productId = req.body.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.send({
        type: "success",
        title: "Exito",
        text: "Producto eliminado correctamente"
    });
}

exports.updateItem = (req, res) => {
    var productId = req.body.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.update(productId);
    req.session.cart = cart;
    res.send({
        type: "success",
        title: "Exito",
        text: "Producto modificado correctamente"
    });
}

exports.getCarrito = (req, res) => {
    if (!req.session.cart) {
        return res.render('carrito', {
            products: null
        })
    }
    var cart = new Cart(req.session.cart);
    var products = cart.getItems();
    console.log(products.length)
    res.render('carrito', { products });
}

exports.getCarritoAjax = (req, res) => {
    if (!req.session.cart) {
        return res.json({
            products: []
        });
    }
    var cart = new Cart(req.session.cart);
    res.send({
        products: cart.getItems(),
        totalPrice: cart.totalPrice
    })
}

exports.postProductosSearch = async (req, res) => {
    const data = await mIndex.searchProducto(req.body);
    res.send(data);
}