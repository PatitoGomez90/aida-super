exports.getCarrito = (req, res) => {
    let total = 0;

    if (typeof req.session.cart !== "undefined") {
        for (x = 0; x < req.session.cart.length; x++) {
            total = total + (parseFloat(req.session.cart[x].precio) * parseFloat(req.session.cart[x].cantidad));
        }
    }
    console.log(req.session.cart);
    res.render('carrito', {
        cart: req.session.cart,
        total: total.toFixed(2)
    });
}

exports.getLista = (req, res) => {
    let total = 0;

    if (typeof req.session.cart !== "undefined") {
        for (x = 0; x < req.session.cart.length; x++) {
            total = total + (parseFloat(req.session.cart[x].precio) * parseFloat(req.session.cart[x].cantidad));
        }
    }

    res.send({
        cart: req.session.cart,
        total: total.toFixed(2)
    });
}

exports.postAdd = (req, res) => {
    let {
        id,
        nombre,
        cantidad,
        precio,
        imagen
    } = req.body;

    if (req.session.cart && req.session.cart.length) {
        let check = req.session.cart.find(function (element) {
            return element.id == id;
        });

        if (check) {
            return res.json({
                type: "error",
                title: "Error",
                text: "El producto ya existe en el carrito"
            });
        }
    }

    req.session.cart.push({
        id,
        nombre,
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio).toFixed(2),
        imagen
    });

    res.send({
        type: "success",
        title: "Exito",
        text: "Producto Agregado",
        cantidadCarrito: req.session.cart.length
    })
}

exports.postModificar = (req, res) => {
    let cart = req.session.cart;
    let { accion, id } = req.body;

    if (accion == "clear") {
        req.session.cart = [];
        return res.json({
            type: "success",
            title: "Exito",
            text: "Se vació el carrito correctamente"
        });
    }

    for (i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            switch (accion) {
                case "add":
                    cart[i].cantidad++;
                    break;
                case "decrease":
                    cart[i].cantidad--;
                    if (cart[i].cantidad < 1) cart.splice(i, 1);
                    break;
                case "remove":
                    cart.splice(i, 1);
                    if (cart.length == 0) req.session.cart = [];
                    break;
                default:
                    break;
            }
        }
    }

    res.send({
        type: "success",
        title: "Exito",
        text: "Carrito modificado correctamente"
    });
}

exports.getComprar = (req, res) => {
    if (!req.session.auth) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Debe ingresar como usuario para realizar la compra"
        });
    }

    res.send({ type: "success" });
}