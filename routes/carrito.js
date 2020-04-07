const router = require("express").Router();
var Cart = require('../modules/cart');

router.get("/", (req, res) => {
    let total = 0;

    if (typeof req.session.cart !== "undefined") {
        for (x = 0; x < req.session.cart.length; x++) {
            total = total + (parseFloat(req.session.cart[x].precio) * parseFloat(req.session.cart[x].cantidad));
        }
    }
    res.render('carrito/views/carrito', {
        cart: req.session.cart,
        total: total.toFixed(2)
    });
});

router.post("/agregar", (req, res) => {
    let {
        id,
        nombre,
        cantidad,
        precio
    } = req.body;
    if (typeof req.session.cart == "undefined") {
        req.session.cart = [];
        req.session.cart.push({
            id,
            nombre,
            cantidad: parseInt(cantidad),
            precio: parseFloat(precio).toFixed(2)
        });
    } else {
        let cart = req.session.cart;
        let newItem = true;
        for (i = 0; i < cart.length; i++) {
            if (cart[i].id == id) {
                cart[i].cantidad = parseInt(cantidad);
                newItem = false;
                break;
            }
        }

        if (newItem) {
            cart.push({
                id,
                nombre,
                cantidad: parseInt(cantidad),
                precio: parseFloat(precio).toFixed(2)
            });
        } else {
            return res.json({
                type: "warning",
                title: "Alerta",
                text: "El producto ya existe en el carrito"
            })
        }
    }

    res.send({
        type: "success",
        title: "Exito",
        text: "Producto Agregado",
        cantidadCarrito: req.session.cart.length
    })
});

module.exports = router;