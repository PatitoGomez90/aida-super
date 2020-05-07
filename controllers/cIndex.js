const mIndex = require("../models/mIndex");
const mUsuarios = require("../models/mUsuarios");
const nodemailer = require("nodemailer");
const mw = require("../middlewares");

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "supermercadoaidacontacto@gmail.com",
        pass: "0r4ng3_790!"
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.getInicio = async (req, res) => {
    req.session.cart = req.session.cart || [];
    res.render('inicio');
}

exports.getInicioAjax = async (req, res) => {
    const productos = await mIndex.getTopProductos();
    productos.forEach((producto, index) => {
        let path = `0${producto.st_codigo2}s.jpg`;
        productos[index].imagen = mw.ifFileExist(path) ? path : "logo.jpg";
    });
    res.send(productos);
}

exports.getLogin = (req, res) => {
    res.render("login");
}

exports.postLogin = async (req, res) => {
    console.log(req.body);
    let { email, dni } = req.body;

    if (!email || !dni) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe completar todos los campos"
        });
    }

    if (!validateEmail(email)) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Ingrese un correo electronico valido"
        });
    }

    if (dni.length < 7) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Ingrese un dni valido"
        });
    }

    let usuario = await mIndex.getCliente(email, dni);
    if (!usuario.length) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Datos incorrectos. Pruebe nuevamente"
        });
    }

    let nombreUsuario = usuario[0].cl_apel ? usuario[0].cl_apel.split(" ") : "Usuario";
    req.session.user = usuario;
    req.session.auth = true;
    res.send({
        type: "success",
        title: "Exito",
        text: `Bienvenido ${nombreUsuario[0].toLowerCase()}.`
    });
}

exports.getRegistro = (req, res) => {
    res.render("registro");
}

exports.postRegistro = async (req, res) => {
    console.log(req.body);
    let {
        nombre,
        apellido,
        email,
        dni,
        ciudad,
        calle,
        numero,
        piso,
        depto,
        codigopostal,
        celular,
        telefono
    } = req.body;

    if (!nombre.length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un nombre"
        });
    }

    if (!apellido.length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un apellido"
        });
    }

    if (!email.length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un correo electronico"
        });
    }

    if (!validateEmail(email)) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un correo electronico valido"
        });
    }

    const checkEmail = await mIndex.getClienteByMail(email);
    if (checkEmail.length) {
        return res.json({
            type: "error",
            title: "Error",
            text: "El email ingresado ya corresponde a un usuario registrado"
        });
    }

    if (!dni.length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar su numero de dni"
        });
    }

    if (dni.length < 7) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un numero de dni valido"
        });
    }

    const checkDni = await mIndex.getClienteByDni(dni);
    if (checkDni.length) {
        return res.json({
            type: "error",
            title: "Error",
            text: "El DNI ingresado ya corresponde a un usuario registrado"
        });
    }

    if (!ciudad.length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar una ciudad"
        });
    }

    if (!calle.length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar una calle"
        });
    }

    if (!numero.length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un numero de domicilio"
        });
    }

    if (!codigopostal.length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un codigo postal"
        });
    }

    if (!celular.length && !telefono.length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar al menos un numero de contacto"
        });
    }

    let clientes = await mIndex.getMaxNroCliente();
    if (!clientes.length) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Hubo un error al procesar la solicitud(1)"
        });
    }

    req.body.numero = clientes[0].numero;
    req.body.nombres = nombre.toUpperCase() + " " + apellido.toUpperCase();
    req.body.direccion = calle.toUpperCase() + " " + numero + " " + piso + " " + depto;

    const result = await mIndex.insertCliente(req.body);
    if (!result[0].rows) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Hubo un error al procesar la solicitud (2)"
        });
    }

    res.send({
        type: "success",
        title: "Exito",
        text: "Cliente registrado con exito. Ya puede iniciar sesion"
    });
}

exports.getProductosAjax = async (req, res) => {
    const productos = await mIndex.get100Productos();
    res.send(productos);
}

exports.getContacto = (req, res) => {
    res.render("contacto");
}

exports.postContacto = (req, res) => {
    let { nombre, apellido, email, asunto, mensaje } = req.body;

    if (!nombre || !apellido || !email || !asunto || !mensaje) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe completar todos los campos"
        });
    }

    if (!validateEmail(email)) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Ingrese un correo electronico valido"
        });
    }

    let output = `<div><h1>Mensaje enviado desde la web de aida</h1></div>`;

    let mailOptions = {
        from: `<patitogomez90@gmail.com>`,
        to: '<jeremiasgomez990@gmail.com>',
        subject: "Mail de prueba desde aida",
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        console.log("ERROR ", error);
        console.log("INFO ", info);
        if (error) {
            return res.json({ type: "error", title: "Error", text: `No se ha podido enviar el email` });
        }

        res.send({
            type: "success",
            title: "Exito",
            text: "Se ha enviado el email correctamente. Gracias por comunicarse con nosotros"
        });
    });
}

exports.getCheckout = async (req, res) => {
    const datos = await mUsuarios.getDatosUsuario(req.session.user[0].cl_nume);
    let total = 0;
    req.session.cart.forEach(item => {
        total += parseFloat(item.cantidad) * parseFloat(item.precio);
    });

    total = total.toFixed(2);
    res.render("check-out", { datos, total });
}

exports.postCheckout = async (req, res) => {
    console.log(req.body);
    console.log(req.session.cart);
    console.log(req.session.user);

    let factura = await mIndex.getNroFact();
    if (!factura.length) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Hubo un error al procesar la solicitud (1)"
        });
    }

    let nroFactura = parseFloat(factura[0].nroFactura) + 1;
    nroFactura = pad(nroFactura, 12);

    req.body.nrofact = nroFactura;
    req.body.idusuario = req.session.user[0].cl_nume;
    req.body.usuario = req.session.user[0].cl_apel;

    let numovi = await mIndex.Sp_Sele_Movi();
    if (!numovi.length) {
        return res.jsonn({
            type: "error",
            title: "Error",
            text: "Hubo un error al procesar la solicitud (2)"
        });
    }

    req.body.numovi = numovi[0].numero;
    await mIndex.insertFact(req.body);

    let carrito = req.session.cart;

    for (var x = 0; x < carrito.length; x++) {
        let { nombre, precio, id, cantidad } = carrito[x];
        await mIndex.insertFac2(nroFactura, req.body.idusuario, id, cantidad, nombre, precio, req.body.total);
    }

    req.session.cart = [];
    res.send({
        type: "success",
        title: "Exito",
        text: "La compra fue generada con exito! En tu cuenta podras ver el estado de tu pedido"
    });
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}