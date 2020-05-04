const mIndex = require("../models/mIndex");
const nodemailer = require("nodemailer");

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
    res.send(productos);
}

exports.getLogin = (req, res) => {
    res.render("login");
}

exports.getRegistro = (req, res) => {
    res.render("registro");
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

exports.getCheckout = (req, res) => {
    res.render("check-out");
}